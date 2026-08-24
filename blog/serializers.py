from rest_framework import serializers

from .models import (
    Category,
    Tag,
    Post,
    Comment
)


# =========================================
# CATEGORY
# =========================================

class CategorySerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Category

        fields = [
            "id",
            "name",
            "slug",
        ]


# =========================================
# TAG
# =========================================

class TagSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Tag

        fields = [
            "id",
            "name",
            "slug",
        ]



# =========================================
# COMMENT
# =========================================

class CommentSerializer(
    serializers.ModelSerializer
):

    author_name = (
        serializers.SerializerMethodField()
    )

    is_owner = (
        serializers.SerializerMethodField()
    )


    class Meta:

        model = Comment

        fields = [

            "id",

            "post",

            "author",
            "author_name",

            "content",

            "is_owner",

            "created_at",
            "updated_at",

        ]

        read_only_fields = [

            "id",

            "author",
            "author_name",

            "is_owner",

            "created_at",
            "updated_at",

        ]


    # =========================================
    # AUTHOR NAME
    # =========================================

    def get_author_name(
        self,
        obj
    ):

        full_name = (
            f"{obj.author.first_name} "
            f"{obj.author.last_name}"
        ).strip()


        return (
            full_name
            or obj.author.email
        )


    # =========================================
    # OWNER
    # =========================================

    def get_is_owner(
        self,
        obj
    ):

        request = (
            self.context.get(
                "request"
            )
        )


        if not request:

            return False


        if not request.user.is_authenticated:

            return False


        return (
            obj.author_id ==
            request.user.id
        )

# =========================================
# POST
# =========================================

class PostSerializer(
    serializers.ModelSerializer
):

    author_name = (
        serializers.SerializerMethodField()
    )

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    tags_data = TagSerializer(
        source="tags",
        many=True,
        read_only=True
    )

    like_count = (
        serializers.SerializerMethodField()
    )

    is_liked = (
        serializers.SerializerMethodField()
    )

    bookmark_count = (
        serializers.SerializerMethodField()
    )

    is_bookmarked = (
        serializers.SerializerMethodField()
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

            "like_count",
            "is_liked",

            "bookmark_count",
            "is_bookmarked",

            "published_at",

            "created_at",
            "updated_at",

        ]

        read_only_fields = [

            "author",

            "author_name",

            "views",

            "like_count",
            "is_liked",

            "bookmark_count",
            "is_bookmarked",

            "published_at",

            "created_at",
            "updated_at",

            "slug",

        ]


    # =========================================
    # AUTHOR NAME
    # =========================================

    def get_author_name(
        self,
        obj
    ):

        full_name = (
            f"{obj.author.first_name} "
            f"{obj.author.last_name}"
        ).strip()


        return (
            full_name
            or obj.author.email
        )


    # =========================================
    # LIKE COUNT
    # =========================================

    def get_like_count(
        self,
        obj
    ):

        return obj.likes.count()


    # =========================================
    # CURRENT USER LIKE STATUS
    # =========================================

    def get_is_liked(
        self,
        obj
    ):

        request = (
            self.context.get(
                "request"
            )
        )


        if not request:

            return False


        if not request.user.is_authenticated:

            return False


        return obj.likes.filter(
            user=request.user
        ).exists()


    # =========================================
    # BOOKMARK COUNT
    # =========================================

    def get_bookmark_count(
        self,
        obj
    ):

        return obj.bookmarks.count()


    # =========================================
    # CURRENT USER BOOKMARK STATUS
    # =========================================

    def get_is_bookmarked(
        self,
        obj
    ):

        request = (
            self.context.get(
                "request"
            )
        )


        if not request:

            return False


        if not request.user.is_authenticated:

            return False


        return obj.bookmarks.filter(
            user=request.user
        ).exists()