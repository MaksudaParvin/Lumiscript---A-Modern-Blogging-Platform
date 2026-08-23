from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from .forms import ProfileForm, RegisterForm
from django.contrib.auth.decorators import login_required


def register_view(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":

        form = RegisterForm(request.POST)

        if form.is_valid():

            form.save()

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
    return redirect("login")


@login_required
def profile_view(request):

    return render(request, "accounts/profile.html")

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