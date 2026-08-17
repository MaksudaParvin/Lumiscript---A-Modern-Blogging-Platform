from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from .forms import RegisterForm


def register_view(request):

    if request.method == "POST":

        form = RegisterForm(request.POST)

        if form.is_valid():

            form.save()

            return redirect("login")

    else:
        form = RegisterForm()

    return render(request,"accounts/register.html",{"form": form})


def login_view(request):

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

            return redirect("home")

        return render(request,"accounts/login.html",
            {
                "error": "Invalid email or password."
            }
        )

    return render(request,"accounts/login.html")


def logout_view(request):

    logout(request)
    return redirect("home")

def home_view(request):
    return render(request,"home.html")