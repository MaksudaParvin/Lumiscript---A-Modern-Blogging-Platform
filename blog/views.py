from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Category, Tag, Post
from .serializers import (CategorySerializer, TagSerializer, PostSerializer,)
from .permissions import IsAuthorOrReadOnly

from .pagination import PostPagination

from django.db.models import Q


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


        if self.action in ["list", "retrieve"]:

            queryset = queryset.filter(
                status=Post.Status.PUBLISHED
            )


        search_query = (
            self.request.query_params
            .get("search", "")
            .strip()
        )


        if search_query:

            queryset = queryset.filter(

                Q(title__icontains=search_query)

                | Q(excerpt__icontains=search_query)

                | Q(content__icontains=search_query)

            )


        return queryset


    def perform_create(self, serializer):

        serializer.save(
            author=self.request.user
        )