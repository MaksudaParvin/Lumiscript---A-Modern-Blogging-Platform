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


        const likeButton =
            document.getElementById(
                "likeButton"
            );


        const likeCount =
            document.getElementById(
                "likeCount"
            );


        const bookmarkButton =
            document.getElementById(
                "bookmarkButton"
            );


        const bookmarkText =
            document.getElementById(
                "bookmarkText"
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
            pathParts[
                pathParts.length - 1
            ];


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


            } catch (error) {

                console.error(
                    "Blog Detail Error:",
                    error
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

            /* -----------------------------------------
               CATEGORY
            ----------------------------------------- */

            category.textContent =
                post.category_name || "";


            /* -----------------------------------------
               TITLE
            ----------------------------------------- */

            title.textContent =
                post.title || "";


            /* -----------------------------------------
               EXCERPT
            ----------------------------------------- */

            excerpt.textContent =
                post.excerpt || "";


            /* -----------------------------------------
               AUTHOR
            ----------------------------------------- */

            author.textContent =
                post.author_name ||
                "Anonymous";


            /* -----------------------------------------
               DATE
            ----------------------------------------- */

            date.textContent =
                post.published_at
                    ? formatDate(
                        post.published_at
                    )
                    : "";


            /* -----------------------------------------
               VIEWS
            ----------------------------------------- */

            views.textContent =
                post.views || 0;


            /* -----------------------------------------
               LIKE COUNT
            ----------------------------------------- */

            likeCount.textContent =
                post.like_count || 0;


            /* -----------------------------------------
               LIKE STATUS
            ----------------------------------------- */

            updateLikeButton(
                post.is_liked
            );


            /* -----------------------------------------
               BOOKMARK STATUS
            ----------------------------------------- */

            updateBookmarkButton(
                post.is_bookmarked
            );


            /* =========================================
               FEATURED IMAGE
            ========================================= */

            if (
                post.featured_image
            ) {

                imageWrapper.innerHTML = `

                    <img
                        src="${post.featured_image}"
                        alt="${escapeHTML(
                            post.title
                        )}"
                        class="article-image"
                    >

                `;

            } else {

                imageWrapper.innerHTML = `

                    <div
                        class="article-image-placeholder"
                    >

                        <i
                            class='bx bx-book-open'
                        ></i>

                    </div>

                `;

            }


            /* =========================================
               ARTICLE CONTENT
            ========================================= */

            content.innerHTML =
                post.content || "";


            /* =========================================
               TAGS
            ========================================= */

            renderTags(
                post.tags_data
            );


            /* =========================================
               SHOW ARTICLE
            ========================================= */

            loading.style.display =
                "none";


            errorBox.style.display =
                "none";


            article.style.display =
                "block";

        }


        /* =========================================
           RENDER TAGS
        ========================================= */

        function renderTags(
            tagData
        ) {

            if (
                !tagData ||
                !tagData.length
            ) {

                tags.innerHTML =
                    "";

                return;

            }


            tags.innerHTML = `

                <span class="tags-label">
                    Tags
                </span>


                <div class="tag-list">

                    ${tagData
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

        }


        /* =========================================
           UPDATE LIKE BUTTON
        ========================================= */

        function updateLikeButton(
            liked
        ) {

            if (liked) {

                likeButton.classList.add(
                    "liked"
                );


                likeButton.innerHTML = `

                    <i
                        class='bx bxs-heart'
                    ></i>

                    <span id="likeCount">
                        ${likeCount.textContent}
                    </span>

                `;

            } else {

                likeButton.classList.remove(
                    "liked"
                );


                likeButton.innerHTML = `

                    <i
                        class='bx bx-heart'
                    ></i>

                    <span id="likeCount">
                        ${likeCount.textContent}
                    </span>

                `;

            }

        }


        /* =========================================
           UPDATE BOOKMARK BUTTON
        ========================================= */

        function updateBookmarkButton(
            bookmarked
        ) {

            if (bookmarked) {

                bookmarkButton.classList.add(
                    "bookmarked"
                );


                bookmarkButton.innerHTML = `

                    <i
                        class='bx bxs-bookmark'
                    ></i>

                    <span id="bookmarkText">
                        Saved
                    </span>

                `;

            } else {

                bookmarkButton.classList.remove(
                    "bookmarked"
                );


                bookmarkButton.innerHTML = `

                    <i
                        class='bx bx-bookmark'
                    ></i>

                    <span id="bookmarkText">
                        Save
                    </span>

                `;

            }

        }


        /* =========================================
           LIKE / UNLIKE
        ========================================= */

        likeButton.addEventListener(
            "click",
            async () => {

                const isLiked =
                    likeButton.classList.contains(
                        "liked"
                    );


                const method =
                    isLiked
                        ? "DELETE"
                        : "POST";


                const endpoint =
                    isLiked
                        ? `/api/posts/${slug}/unlike/`
                        : `/api/posts/${slug}/like/`;


                likeButton.disabled =
                    true;


                try {

                    const response =
                        await fetch(
                            endpoint,
                            {
                                method:
                                    method,

                                headers: {

                                    "X-CSRFToken":
                                        getCSRFToken(),

                                    "Content-Type":
                                        "application/json"

                                },

                                credentials:
                                    "same-origin"

                            }
                        );


                    /* ---------------------------------
                       AUTHENTICATION
                    --------------------------------- */

                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {

                        redirectToLogin();

                        return;

                    }


                    if (!response.ok) {

                        throw new Error(
                            `Like API Error: ${response.status}`
                        );

                    }


                    const data =
                        await response.json();


                    /* ---------------------------------
                       UPDATE LIKE COUNT
                    --------------------------------- */

                    likeCount.textContent =
                        data.like_count || 0;


                    /* ---------------------------------
                       UPDATE LIKE STATE
                    --------------------------------- */

                    updateLikeButton(
                        data.liked
                    );


                } catch (error) {

                    console.error(
                        "Like Error:",
                        error
                    );

                } finally {

                    likeButton.disabled =
                        false;

                }

            }
        );


        /* =========================================
           BOOKMARK / REMOVE BOOKMARK
        ========================================= */

        bookmarkButton.addEventListener(
            "click",
            async () => {

                const isBookmarked =
                    bookmarkButton.classList.contains(
                        "bookmarked"
                    );


                const method =
                    isBookmarked
                        ? "DELETE"
                        : "POST";


                const endpoint =
                    isBookmarked
                        ? `/api/posts/${slug}/remove_bookmark/`
                        : `/api/posts/${slug}/bookmark/`;


                bookmarkButton.disabled =
                    true;


                try {

                    const response =
                        await fetch(
                            endpoint,
                            {
                                method:
                                    method,

                                headers: {

                                    "X-CSRFToken":
                                        getCSRFToken(),

                                    "Content-Type":
                                        "application/json"

                                },

                                credentials:
                                    "same-origin"

                            }
                        );


                    /* ---------------------------------
                       AUTHENTICATION
                    --------------------------------- */

                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {

                        redirectToLogin();

                        return;

                    }


                    if (!response.ok) {

                        throw new Error(
                            `Bookmark API Error: ${response.status}`
                        );

                    }


                    const data =
                        await response.json();


                    /* ---------------------------------
                       UPDATE BOOKMARK STATE
                    --------------------------------- */

                    updateBookmarkButton(
                        data.bookmarked
                    );


                } catch (error) {

                    console.error(
                        "Bookmark Error:",
                        error
                    );

                } finally {

                    bookmarkButton.disabled =
                        false;

                }

            }
        );


        /* =========================================
           REDIRECT TO LOGIN
        ========================================= */

        function redirectToLogin() {

            window.location.href =
                `/login/?next=${encodeURIComponent(
                    window.location.pathname
                )}`;

        }


        /* =========================================
           CSRF TOKEN
        ========================================= */

        function getCSRFToken() {

            const cookies =
                document.cookie.split(
                    ";"
                );


            for (
                const cookie of cookies
            ) {

                const [
                    name,
                    value
                ] =
                    cookie.trim().split(
                        "="
                    );


                if (
                    name === "csrftoken"
                ) {

                    return decodeURIComponent(
                        value
                    );

                }

            }


            return "";

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

            if (!dateString) {

                return "";

            }


            return new Date(
                dateString
            ).toLocaleDateString(
                "en-US",
                {
                    month:
                        "long",

                    day:
                        "numeric",

                    year:
                        "numeric"
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