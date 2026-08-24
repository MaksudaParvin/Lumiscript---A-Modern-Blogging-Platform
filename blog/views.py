from django.db.models import Q, F

from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Category,
    Tag,
    Post,
    PostView,
)

from .serializers import (
    CategorySerializer,
    TagSerializer,
    PostSerializer,
)

from .permissions import IsAuthorOrReadOnly

from .pagination import PostPagination


# =========================================
# POST VIEW TRACKING
# =========================================

def track_post_view(
    request,
    post
):

    # -----------------------------------------
    # Authenticated User
    # -----------------------------------------

    if request.user.is_authenticated:

        view, created = (
            PostView.objects
            .get_or_create(
                post=post,
                user=request.user
            )
        )

    # -----------------------------------------
    # Anonymous User
    # -----------------------------------------

    else:

        if not request.session.session_key:

            request.session.create()


        session_key = (
            request.session.session_key
        )


        view, created = (
            PostView.objects
            .get_or_create(
                post=post,
                session_key=session_key
            )
        )


    # -----------------------------------------
    # Increment View Count
    # -----------------------------------------

    if created:

        Post.objects.filter(
            pk=post.pk
        ).update(
            views=F("views") + 1
        )


    return created


# =========================================
# CATEGORY
# =========================================

class CategoryViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [
        AllowAny
    ]


# =========================================
# TAG
# =========================================

class TagViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = Tag.objects.all()

    serializer_class = TagSerializer

    permission_classes = [
        AllowAny
    ]


# =========================================
# POST
# =========================================

class PostViewSet(
    viewsets.ModelViewSet
):

    serializer_class = PostSerializer

    permission_classes = [
        IsAuthorOrReadOnly
    ]

    pagination_class = PostPagination

    lookup_field = "slug"


    # =========================================
    # QUERYSET
    # =========================================

    def get_queryset(self):

        queryset = (
            Post.objects
            .select_related(
                "author",
                "category"
            )
            .prefetch_related(
                "tags"
            )
            .order_by(
                "-published_at",
                "-created_at"
            )
        )


        # -----------------------------------------
        # Only Published Posts
        # -----------------------------------------

        if self.action in [
            "list",
            "retrieve"
        ]:

            queryset = queryset.filter(
                status=Post.Status.PUBLISHED
            )


        # -----------------------------------------
        # Search
        # -----------------------------------------

        search_query = (
            self.request.query_params
            .get(
                "search",
                ""
            )
            .strip()
        )


        if search_query:

            queryset = queryset.filter(

                Q(
                    title__icontains=search_query
                )
                |
                Q(
                    excerpt__icontains=search_query
                )
                |
                Q(
                    content__icontains=search_query
                )

            )


        # -----------------------------------------
        # Category Filter
        # -----------------------------------------

        category = (
            self.request.query_params
            .get(
                "category",
                ""
            )
            .strip()
        )


        if category:

            queryset = queryset.filter(
                category__slug=category
            )


        # -----------------------------------------
        # Tag Filter
        # -----------------------------------------

        tag = (
            self.request.query_params
            .get(
                "tag",
                ""
            )
            .strip()
        )


        if tag:

            queryset = queryset.filter(
                tags__slug=tag
            )


        return queryset.distinct()


    # =========================================
    # RETRIEVE POST
    # =========================================

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        instance = self.get_object()


        # Track this visit

        track_post_view(
            request,
            instance
        )


        # Get updated view count

        instance.refresh_from_db()


        serializer = self.get_serializer(
            instance
        )


        return Response(
            serializer.data
        )


    # =========================================
    # CREATE POST
    # =========================================

    def perform_create(
        self,
        serializer
    ):

        serializer.save(
            author=self.request.user
        )