from django.db import models
from accounts.models import User
from django.utils.text import slugify
from django.conf import settings


class Category(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):

    name = models.CharField(
        max_length=50,
        unique=True
    )

    slug = models.SlugField(
        max_length=60,
        unique=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):

    class Status(models.TextChoices):

        DRAFT = "draft", "Draft"

        PUBLISHED = "published", "Published"


    title = models.CharField(
        max_length=200
    )

    slug = models.SlugField(
        max_length=220,
        unique=True,
        blank=True
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posts"
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts"
    )

    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="posts"
    )

    excerpt = models.TextField(
        max_length=500,
        blank=True
    )

    content = models.TextField()

    featured_image = models.ImageField(
        upload_to="post_images/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    views = models.PositiveIntegerField(
        default=0
    )

    published_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    class Meta:

        ordering = [
            "-published_at",
            "-created_at"
        ]

        indexes = [

            models.Index(
                fields=["status"]
            ),

            models.Index(
                fields=["created_at"]
            ),

            models.Index(
                fields=["published_at"]
            ),
        ]


    def save(self, *args, **kwargs):

        if not self.slug:

            self.slug = slugify(
                self.title
            )

        super().save(*args, **kwargs)


    def __str__(self):

        return self.title



class PostView(models.Model):

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="post_views"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="post_views"
    )

    session_key = models.CharField(
        max_length=40,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    class Meta:

        ordering = [
            "-created_at"
        ]

        constraints = [

            models.UniqueConstraint(
                fields=[
                    "post",
                    "user"
                ],
                name="unique_post_user_view"
            ),

            models.UniqueConstraint(
                fields=[
                    "post",
                    "session_key"
                ],
                name="unique_post_session_view"
            ),

        ]


    def __str__(self):

        if self.user:

            return (
                f"{self.user} viewed "
                f"{self.post.title}"
            )

        return (
            f"Anonymous viewed "
            f"{self.post.title}"
        )




class PostLike(models.Model):

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="post_likes"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    class Meta:

        ordering = [
            "-created_at"
        ]

        constraints = [

            models.UniqueConstraint(
                fields=[
                    "post",
                    "user"
                ],
                name="unique_post_user_like"
            )

        ]


    def __str__(self):

        return (
            f"{self.user} liked "
            f"{self.post.title}"
        )