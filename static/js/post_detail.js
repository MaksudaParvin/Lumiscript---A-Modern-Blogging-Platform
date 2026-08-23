document.addEventListener(
    "DOMContentLoaded",
    () => {

        const page =
            document.querySelector(
                ".post-detail-page"
            );

        const loading =
            document.getElementById(
                "postLoading"
            );

        const error =
            document.getElementById(
                "postError"
            );

        const content =
            document.getElementById(
                "postContent"
            );


        const slug =
            page.dataset.postSlug;


        async function loadPost() {

            try {

                const response =
                    await fetch(
                        `/api/posts/${slug}/`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Post not found."
                    );

                }


                const post =
                    await response.json();


                renderPost(post);


            } catch (err) {

                console.error(err);

                loading.style.display =
                    "none";

                error.style.display =
                    "flex";

                return;

            }


            loading.style.display =
                "none";

            content.style.display =
                "block";

        }


        function renderPost(post) {

            /*
             * Title
             */

            document.getElementById(
                "postTitle"
            ).textContent =
                post.title;


            /*
             * Excerpt
             */

            const excerpt =
                document.getElementById(
                    "postExcerpt"
                );

            if (post.excerpt) {

                excerpt.textContent =
                    post.excerpt;

            } else {

                excerpt.style.display =
                    "none";

            }


            /*
             * Category
             */

            const category =
                document.getElementById(
                    "postCategory"
                );

            if (post.category_name) {

                category.textContent =
                    post.category_name;

            } else {

                category.style.display =
                    "none";

            }


            /*
             * Date
             */

            if (post.published_at) {

                document.getElementById(
                    "postDate"
                ).textContent =
                    formatDate(
                        post.published_at
                    );

            }


            /*
             * Author
             */

            const author =
                post.author_name ||
                "Anonymous";


            document.getElementById(
                "postAuthor"
            ).textContent =
                author;


            /*
             * Author Avatar
             */

            const avatar =
                document.getElementById(
                    "postAuthorAvatar"
                );


            avatar.textContent =
                author
                    .charAt(0)
                    .toUpperCase();


            /*
             * Featured Image
             */

            const imageWrapper =
                document.getElementById(
                    "postImageWrapper"
                );

            const image =
                document.getElementById(
                    "postImage"
                );


            if (post.featured_image) {

                image.src =
                    post.featured_image;

                image.alt =
                    post.title;

            } else {

                imageWrapper.style.display =
                    "none";

            }


            /*
             * Content
             */

            document.getElementById(
                "postBody"
            ).textContent =
                post.content;


            /*
             * Views
             */

            document.getElementById(
                "postViews"
            ).textContent =
                post.views;


            /*
             * Tags
             */

            const tagsContainer =
                document.getElementById(
                    "postTags"
                );


            if (
                post.tags_data &&
                post.tags_data.length
            ) {

                tagsContainer.innerHTML =
                    post.tags_data
                        .map(
                            tag => `
                                <span class="post-tag">
                                    #${tag.name}
                                </span>
                            `
                        )
                        .join("");

            }

        }


        function formatDate(
            dateString
        ) {

            return new Date(
                dateString
            ).toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );

        }


        loadPost();

    }
);