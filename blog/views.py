from django.db.models import Q, F

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework import serializers

from .models import (
    Category,
    Tag,
    Post,
    PostView,
    PostLike,
    Bookmark,
    Comment
)

from .serializers import (
    CategorySerializer,
    TagSerializer,
    PostSerializer,
    CommentSerializer,
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

        _, created = (
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

        _, created = (
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
        # Public users only see published posts
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


        # Track unique visit

        track_post_view(
            request,
            instance
        )


        # Refresh updated view count

        instance.refresh_from_db()


        serializer = self.get_serializer(
            instance
        )


        return Response(
            serializer.data
        )


    # =========================================
    # LIKE
    # =========================================

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[
            IsAuthenticated
        ]
    )
    def like(
        self,
        request,
        *args,
        **kwargs
    ):

        post = self.get_object()


        like, created = (
            PostLike.objects
            .get_or_create(
                post=post,
                user=request.user
            )
        )


        like_count = (
            PostLike.objects
            .filter(
                post=post
            )
            .count()
        )


        return Response({

            "liked": True,

            "created": created,

            "like_count": like_count,

        })


    # =========================================
    # UNLIKE
    # =========================================

    @action(
        detail=True,
        methods=["delete"],
        permission_classes=[
            IsAuthenticated
        ]
    )
    def unlike(
        self,
        request,
        *args,
        **kwargs
    ):

        post = self.get_object()


        deleted, _ = (
            PostLike.objects
            .filter(
                post=post,
                user=request.user
            )
            .delete()
        )


        like_count = (
            PostLike.objects
            .filter(
                post=post
            )
            .count()
        )


        return Response({

            "liked": False,

            "deleted": bool(deleted),

            "like_count": like_count,

        })

    # =========================================
    # BOOKMARK
    # =========================================

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[
            IsAuthenticated
        ]
    )
    def bookmark(
        self,
        request,
        *args,
        **kwargs
    ):

        post = self.get_object()


        bookmark, created = (
            Bookmark.objects
            .get_or_create(
                post=post,
                user=request.user
            )
        )


        bookmark_count = (
            Bookmark.objects
            .filter(
                post=post
            )
            .count()
        )


        return Response({

            "bookmarked": True,

            "created": created,

            "bookmark_count":
                bookmark_count,

        })


    # =========================================
    # REMOVE BOOKMARK
    # =========================================

    @action(
        detail=True,
        methods=["delete"],
        permission_classes=[
            IsAuthenticated
        ]
    )
    def remove_bookmark(
        self,
        request,
        *args,
        **kwargs
    ):

        post = self.get_object()


        deleted, _ = (
            Bookmark.objects
            .filter(
                post=post,
                user=request.user
            )
            .delete()
        )


        bookmark_count = (
            Bookmark.objects
            .filter(
                post=post
            )
            .count()
        )


        return Response({

            "bookmarked": False,

            "deleted": bool(deleted),

            "bookmark_count":
                bookmark_count,

        })


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



# =========================================
# COMMENT VIEWSET
# =========================================

class CommentViewSet(
    viewsets.ModelViewSet
):

    serializer_class = CommentSerializer

    pagination_class = None


    # =========================================
    # QUERYSET
    # =========================================

    def get_queryset(self):

        queryset = (
            Comment.objects
            .select_related(
                "author",
                "post"
            )
            .filter(
                post__status=Post.Status.PUBLISHED
            )
            .order_by(
                "created_at"
            )
        )


        post_slug = (
            self.request.query_params
            .get(
                "post",
                ""
            )
            .strip()
        )


        if post_slug:

            queryset = queryset.filter(
                post__slug=post_slug
            )


        return queryset


    # =========================================
    # PERMISSIONS
    # =========================================

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:

            return [
                AllowAny()
            ]


        return [
            IsAuthenticated()
        ]


    # =========================================
    # CREATE COMMENT / REPLY
    # =========================================

    def perform_create(
        self,
        serializer
    ):

        post = serializer.validated_data.get(
            "post"
        )

        parent = serializer.validated_data.get(
            "parent"
        )


        # -----------------------------------------
        # Check Post
        # -----------------------------------------

        if (
            not post
            or
            post.status != Post.Status.PUBLISHED
        ):

            raise serializers.ValidationError(
                {
                    "post":
                        "This post is not available."
                }
            )


        # -----------------------------------------
        # Check Parent
        # -----------------------------------------

        if parent:

            if parent.post_id != post.id:

                raise serializers.ValidationError(
                    {
                        "parent":
                            "Reply must belong to the same post."
                    }
                )


        serializer.save(
            author=self.request.user
        )


    # =========================================
    # UPDATE
    # =========================================

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        comment =self.get_object()


        if (
            comment.author_id
            !=
            request.user.id
        ):

            return Response(
                {
                    "detail":
                        "You can only edit your own comments."
                },
                status=403
            )


        return super().update(
            request,
            *args,
            **kwargs
        )


    # =========================================
    # DELETE
    # =========================================

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        comment =self.get_object()


        if (
            comment.author_id
            !=
            request.user.id
        ):

            return Response(
                {
                    "detail":
                        "You can only delete your own comments."
                },
                status=403
            )


        return super().destroy(
            request,
            *args,
            **kwargs
        )