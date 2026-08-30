from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from .forms import ProfileForm, RegisterForm
from django.contrib.auth.decorators import login_required
from blog.models import (
    Post,
    PostLike,
    Bookmark,
    Comment,
)

from django.contrib import messages


def register_view(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":

        form = RegisterForm(request.POST)

        if form.is_valid():

            form.save()

            messages.success(
                request,
                "Account created successfully."
            )


            return redirect("login")

    else:
        form = RegisterForm()

    return render(request,"accounts/register.html",{"form": form})


def login_view(request):

    if request.user.is_authenticated:
        return redirect("home")
    

    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(
            request,
            email=email,
            password=password
        )

        if user is not None:

            login(request, user)

            messages.success(
                request,
                "Logged in successfully. Welcome back!"
            )

            return redirect("home")

        return render(request,"accounts/login.html",
            {
                "error": "Invalid email or password."
            }
        )

    return render(request,"accounts/login.html")

@login_required
def logout_view(request):

    logout(request)

    messages.success(
        request,
        "Logged out successfully."
    )

    return redirect("login")


@login_required
def profile_view(request):

    user = request.user


    # =========================================
    # MY ARTICLES
    # =========================================

    my_articles = (
        Post.objects
        .filter(
            author=user
        )
        .select_related(
            "category"
        )
        .prefetch_related(
            "tags"
        )
        .order_by(
            "-updated_at"
        )
    )


    published_posts = (
        my_articles
        .filter(
            status=Post.Status.PUBLISHED
        )
        .order_by(
            "-published_at",
            "-created_at"
        )
    )


    draft_posts = (
        my_articles
        .filter(
            status=Post.Status.DRAFT
        )
        .order_by(
            "-updated_at"
        )
    )


    # =========================================
    # BOOKMARKS
    # =========================================

    bookmarks = (
        Bookmark.objects
        .filter(
            user=user
        )
        .select_related(
            "post",
            "post__author",
            "post__category"
        )
        .prefetch_related(
            "post__tags"
        )
        .order_by(
            "-created_at"
        )
    )


    # =========================================
    # COMMENTS
    # =========================================

    comments = (
        Comment.objects
        .filter(
            author=user
        )
        .select_related(
            "post",
            "post__author"
        )
        .order_by(
            "-created_at"
        )
    )


    # =========================================
    # COUNTS
    # =========================================

    published_count = (
        published_posts.count()
    )


    draft_count = (
        draft_posts.count()
    )


    bookmark_count = (
        bookmarks.count()
    )


    comment_count = (
        comments.count()
    )


    likes_received_count = (
        PostLike.objects
        .filter(
            post__author=user
        )
        .count()
    )


    # =========================================
    # CONTEXT
    # =========================================

    context = {

        "published_posts":
            published_posts,

        "draft_posts":
            draft_posts,

        "bookmarks":
            bookmarks,

        "comments":
            comments,

        "published_count":
            published_count,

        "draft_count":
            draft_count,

        "bookmark_count":
            bookmark_count,

        "comment_count":
            comment_count,

        "likes_received_count":
            likes_received_count,

    }


    return render(
        request,
        "accounts/profile.html",
        context
    )

@login_required
def edit_profile_view(request):

    if request.method == "POST":

        form = ProfileForm(
            request.POST,
            request.FILES,
            instance=request.user
        )

        if form.is_valid():

            form.save()

            messages.success(
                request,
                "Profile updated successfully."
            )

            return redirect("profile")

    else:

        form = ProfileForm(
            instance=request.user
        )

    return render(request, "accounts/edit_profile.html",
        {
            "form": form
        }
    )