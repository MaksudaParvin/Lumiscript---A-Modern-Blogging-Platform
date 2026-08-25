from django import forms

from .models import Post


class PostForm(forms.ModelForm):

    class Meta:

        model = Post

        fields = [
            "title",
            "excerpt",
            "content",
            "featured_image",
            "category",
            "tags",
        ]

        widgets = {

            "title": forms.TextInput(
                attrs={
                    "placeholder": "Enter your article title",
                    "autocomplete": "off",
                }
            ),

            "excerpt": forms.Textarea(
                attrs={
                    "placeholder": (
                        "Write a short description "
                        "of your article..."
                    ),
                    "rows": 3,
                }
            ),

            "content": forms.Textarea(
                attrs={
                    "placeholder": (
                        "Start writing your article..."
                    ),
                    "rows": 16,
                }
            ),

            "category": forms.Select(
                attrs={
                    "class": "form-select",
                }
            ),

            "tags": forms.SelectMultiple(
                attrs={
                    "class": "form-select",
                }
            ),

        }


    def __init__(
        self,
        *args,
        **kwargs
    ):

        super().__init__(
            *args,
            **kwargs
        )

        self.fields["category"].required = False

        self.fields["tags"].required = False