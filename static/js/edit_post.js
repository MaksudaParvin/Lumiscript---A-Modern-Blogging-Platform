// <!-- =============================================
//      IMAGE PREVIEW JAVASCRIPT
// ================================================ -->

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const imageInput =
            document.getElementById(
                "{{ form.featured_image.id_for_label }}"
            );


        const preview =
            document.getElementById(
                "featuredImagePreview"
            );


        const selectedImageName =
            document.getElementById(
                "selectedImageName"
            );


        if (
            !imageInput ||
            !preview ||
            !selectedImageName
        ) {

            return;

        }



        imageInput.addEventListener(
            "change",
            function () {


                const file =
                    this.files &&
                    this.files[0];


                /*
                 * No new image selected
                 */

                if (!file) {

                    selectedImageName.innerHTML = `

                        <i class='bx bx-image-alt'></i>

                        <span>
                            {% if post.featured_image %}
                                Current image will be kept unless you choose a new one.
                            {% else %}
                                No image selected.
                            {% endif %}
                        </span>

                    `;

                    return;

                }



                /*
                 * Show selected filename
                 */

                selectedImageName.innerHTML = `

                    <i class='bx bx-check-circle'></i>

                    <span>
                        Selected: ${file.name}
                    </span>

                `;



                /*
                 * FileReader for preview
                 */

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {


                        preview.innerHTML = `

                            <img
                                src="${event.target.result}"
                                alt="Selected featured image"
                                id="featuredImagePreviewImg"
                            >

                            <div class="featured-image-status">

                                <i class='bx bx-check-circle'></i>

                                <span>
                                    New image selected
                                </span>

                            </div>

                        `;

                    };


                reader.readAsDataURL(
                    file
                );


            }
        );


    }
);
