from django.shortcuts import render


def home(request):
    return render(request, "core/home.html")


def blog_list(request):
    return render(
        request,
        "blog/blog_list.html"
    )

def blog_detail(request, slug):
    return render(
        request,
        "blog/blog_detail.html",
        {
            "slug": slug
        }
    )