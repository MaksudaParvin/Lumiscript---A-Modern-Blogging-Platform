from rest_framework.permissions import BasePermission


class IsAuthorOrReadOnly(BasePermission):

    """
    Anyone can read published posts.

    Authenticated users can create posts.

    Only the post author can update/delete
    their own post.
    """

    def has_permission(self, request, view):

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return request.user.is_authenticated


    def has_object_permission(
        self,
        request,
        view,
        obj
    ):

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return obj.author == request.user