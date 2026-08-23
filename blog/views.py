from django.db.models import Q

from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Category, Tag, Post
from .serializers import (
    CategorySerializer,
    TagSerializer,
    PostSerializer,
)
from .permissions import IsAuthorOrReadOnly
from .pagination import PostPagination


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [
        AllowAny
    ]


class TagViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Tag.objects.all()

    serializer_class = TagSerializer

    permission_classes = [
        AllowAny
    ]


class PostViewSet(viewsets.ModelViewSet):

    serializer_class = PostSerializer

    permission_classes = [
        IsAuthorOrReadOnly
    ]

    pagination_class = PostPagination

    lookup_field = "slug"


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


        # Only published posts for public list/detail
        if self.action in [
            "list",
            "retrieve"
        ]:

            queryset = queryset.filter(
                status=Post.Status.PUBLISHED
            )


        # Search
        search_query = (
            self.request.query_params
            .get("search", "")
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


        # Category filter
        category = (
            self.request.query_params
            .get("category", "")
            .strip()
        )


        if category:

            queryset = queryset.filter(
                category__slug=category
            )


        # Tag filter
        tag = (
            self.request.query_params
            .get("tag", "")
            .strip()
        )


        if tag:

            queryset = queryset.filter(
                tags__slug=tag
            )


        return queryset.distinct()


    def perform_create(
        self,
        serializer
    ):

        serializer.save(
            author=self.request.user
        )