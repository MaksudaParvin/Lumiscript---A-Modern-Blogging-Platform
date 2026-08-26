"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from accounts.views import (register_view, login_view, logout_view, profile_view, edit_profile_view)
from blog.views import topics_view, about_view, create_post_view, edit_post_view, delete_post_view

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    path("admin/", admin.site.urls),

    path("register/", register_view, name="register"),

    path("login/",login_view,name="login"),

    path("logout/",logout_view,name="logout"),

    path("profile/", profile_view, name="profile"),

    path("profile/edit/", edit_profile_view, name="edit_profile"),

    path("topics/", topics_view, name="topics"),

    path("about/", about_view, name="about"),

    path("create-post/", create_post_view, name="create_post"),

    path("edit-post/<int:post_id>/", edit_post_view, name="edit_post"),

    path("delete-post/<int:post_id>/", delete_post_view, name="delete_post"),

    path("api/", include("blog.urls")),

    path("", include("core.urls")),

]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )