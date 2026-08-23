from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Category, Tag, Post
from .serializers import (CategorySerializer, TagSerializer, PostSerializer,)
from .permissions import IsAuthorOrReadOnly


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

        return queryset


    def perform_create(self, serializer):

        serializer.save(
            author=self.request.user
        )