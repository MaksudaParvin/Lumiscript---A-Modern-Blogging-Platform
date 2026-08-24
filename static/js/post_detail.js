document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================
           ELEMENTS
        ========================================= */

        const loading =
            document.getElementById(
                "detailLoading"
            );

        const errorBox =
            document.getElementById(
                "detailError"
            );

        const article =
            document.getElementById(
                "blogDetail"
            );

        const category =
            document.getElementById(
                "articleCategory"
            );

        const title =
            document.getElementById(
                "articleTitle"
            );

        const excerpt =
            document.getElementById(
                "articleExcerpt"
            );

        const author =
            document.getElementById(
                "articleAuthor"
            );

        const date =
            document.getElementById(
                "articleDate"
            );

        const views =
            document.getElementById(
                "articleViews"
            );

        const imageWrapper =
            document.getElementById(
                "articleImageWrapper"
            );

        const content =
            document.getElementById(
                "articleContent"
            );

        const tags =
            document.getElementById(
                "articleTags"
            );


        /* =========================================
           GET SLUG
        ========================================= */

        const pathParts =
            window.location.pathname
                .split("/")
                .filter(Boolean);


        const slug =
            pathParts[pathParts.length - 1];


        console.log(
            "Blog slug:",
            slug
        );


        if (!slug) {

            showError();

            return;

        }


        /* =========================================
           LOAD POST
        ========================================= */

        async function loadPost() {

            try {

                const response =
                    await fetch(
                        `/api/posts/${slug}/`
                    );


                console.log(
                    "API status:",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        `API Error: ${response.status}`
                    );

                }


                const post =
                    await response.json();


                console.log(
                    "Post:",
                    post
                );


                renderPost(
                    post
                );


            } catch (err) {

                console.error(
                    "Blog Detail Error:",
                    err
                );


                showError();

            }

        }


        /* =========================================
           RENDER POST
        ========================================= */

        function renderPost(
            post
        ) {

            category.textContent =
                post.category_name || "";


            title.textContent =
                post.title || "";


            excerpt.textContent =
                post.excerpt || "";


            author.textContent =
                post.author_name ||
                "Anonymous";


            date.textContent =
                post.published_at
                    ? formatDate(
                        post.published_at
                    )
                    : "";


            views.textContent =
                post.views || 0;


            /* =====================================
               FEATURED IMAGE
            ===================================== */

            if (
                post.featured_image
            ) {

                imageWrapper.innerHTML = `

                    <img
                        src="${post.featured_image}"
                        alt="${escapeHTML(post.title)}"
                        class="article-image"
                    >

                `;

            } else {

                imageWrapper.innerHTML = `

                    <div
                        class="article-image-placeholder"
                    >

                        <i class='bx bx-book-open'></i>

                    </div>

                `;

            }


            /* =====================================
               CONTENT
            ===================================== */

            content.innerHTML =
                post.content || "";


            /* =====================================
               TAGS
            ===================================== */

            if (
                post.tags &&
                post.tags.length
            ) {

                tags.innerHTML = `

                    <span class="tags-label">
                        Tags
                    </span>

                    <div class="tag-list">

                        ${post.tags
                            .map(
                                tag => `
                                    <span
                                        class="article-tag"
                                    >
                                        #${escapeHTML(
                                            tag.name
                                        )}
                                    </span>
                                `
                            )
                            .join("")
                        }

                    </div>

                `;

            } else {

                tags.innerHTML =
                    "";

            }


            /* =====================================
               SHOW ARTICLE
            ===================================== */

            loading.style.display =
                "none";


            errorBox.style.display =
                "none";


            article.style.display =
                "block";

        }


        /* =========================================
           ERROR
        ========================================= */

        function showError() {

            loading.style.display =
                "none";


            article.style.display =
                "none";


            errorBox.style.display =
                "flex";

        }


        /* =========================================
           DATE FORMAT
        ========================================= */

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


        /* =========================================
           ESCAPE HTML
        ========================================= */

        function escapeHTML(
            value
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                value || "";


            return div.innerHTML;

        }


        /* =========================================
           START
        ========================================= */

        loadPost();

    }
);