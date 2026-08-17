from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import UserManager

class User(AbstractUser):
    username = None

    email = models.EmailField(
        unique=True
    )

    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True
    )

    bio = models.TextField(
        blank=True
    )

    website = models.URLField(
        blank=True
    )

    ROLE_CHOICES = (
        ("reader", "Reader"),
        ("author", "Author"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="reader"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email