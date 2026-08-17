from django import forms
from .models import User
from django.contrib.auth.forms import UserCreationForm

class RegisterForm(UserCreationForm):

    class Meta:
        model = User
        fields = (
            "email",
            "first_name",
            "last_name",
            "password1",
            "password2",
        )


class ProfileForm(forms.ModelForm):

    class Meta:
        model = User

        fields = (
            "first_name",
            "last_name",
            "profile_image",
            "bio",
            "website",
        )

        widgets = {
            "first_name": forms.TextInput(
                attrs={
                    "placeholder": "Your first name"
                }
            ),

            "last_name": forms.TextInput(
                attrs={
                    "placeholder": "Your last name"
                }
            ),

            "bio": forms.Textarea(
                attrs={
                    "placeholder": "Tell readers a little about yourself...",
                    "rows": 5
                }
            ),

            "website": forms.URLInput(
                attrs={
                    "placeholder": "https://yourwebsite.com"
                }
            ),
        }