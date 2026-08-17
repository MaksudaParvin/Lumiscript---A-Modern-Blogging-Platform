from rest_framework import serializers

from .models import Category, Tag, Post


class CategorySerializer(serializers.ModelSerializer):

    class Meta:

        model = Category

        fields = [
            "id",
            "name",
            "slug",
            "description",
        ]


class TagSerializer(serializers.ModelSerializer):

    class Meta:

        model = Tag

        fields = [
            "id",
            "name",
            "slug",
        ]


class PostSerializer(serializers.ModelSerializer):

    author_name = serializers.SerializerMethodField()

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    tags_data = TagSerializer(
        source="tags",
        many=True,
        read_only=True
    )

    class Meta:

        model = Post

        fields = [
            "id",
            "title",
            "slug",

            "author",
            "author_name",

            "category",
            "category_name",

            "tags",
            "tags_data",

            "excerpt",
            "content",

            "featured_image",

            "status",
            "views",
            "published_at",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "author",
            "author_name",
            "views",
            "published_at",
            "created_at",
            "updated_at",
            "slug",
        ]


    def get_author_name(self, obj):

        full_name = (
            f"{obj.author.first_name} "
            f"{obj.author.last_name}"
        ).strip()

        return full_name or obj.author.email