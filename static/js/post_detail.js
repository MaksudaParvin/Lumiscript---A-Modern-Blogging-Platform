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
           COMMENT ELEMENTS
        ========================================= */

        const commentCount =
            document.getElementById(
                "commentCount"
            );


        const commentForm =
            document.getElementById(
                "commentForm"
            );


        const commentInput =
            document.getElementById(
                "commentInput"
            );


        const commentSubmitButton =
            document.getElementById(
                "commentSubmitButton"
            );


        const commentsLoading =
            document.getElementById(
                "commentsLoading"
            );


        const commentsList =
            document.getElementById(
                "commentsList"
            );


        const commentsEmpty =
            document.getElementById(
                "commentsEmpty"
            );


        /* =========================================
           POST DATA
        ========================================= */

        let postId = null;


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


                /*
                Save post ID for comments.
                */

                postId =
                    post.id;


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
                        src="${escapeHTML(
                            post.featured_image
                        )}"
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


            /* =========================================
               LOAD COMMENTS
            ========================================= */

            loadComments();

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

                <span
                    class="tags-label"
                >
                    Tags
                </span>


                <div
                    class="tag-list"
                >

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

                `;


                bookmarkButton.setAttribute(
                    "aria-label",
                    "Remove bookmark"
                );


                bookmarkButton.setAttribute(
                    "title",
                    "Remove bookmark"
                );

            } else {

                bookmarkButton.classList.remove(
                    "bookmarked"
                );


                bookmarkButton.innerHTML = `

                    <i
                        class='bx bx-bookmark'
                    ></i>

                `;


                bookmarkButton.setAttribute(
                    "aria-label",
                    "Save post"
                );


                bookmarkButton.setAttribute(
                    "title",
                    "Save post"
                );

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


                    likeCount.textContent =
                        data.like_count || 0;


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
           LOAD COMMENTS
        ========================================= */

        async function loadComments() {

            if (!postId) {

                return;

            }


            try {

                commentsLoading.style.display =
                    "flex";


                commentsEmpty.style.display =
                    "none";


                commentsList.innerHTML =
                    "";


                const response =
                    await fetch(
                        `/api/comments/?post=${encodeURIComponent(
                            slug
                        )}`
                    );


                if (!response.ok) {

                    throw new Error(
                        `Comments API Error: ${response.status}`
                    );

                }


                const data =
                    await response.json();


                /*
                Pagination নেই।
                তাই normally array আসবে।

                তবুও safety-এর জন্য
                results support করছি।
                */

                const comments =
                    Array.isArray(data)
                        ? data
                        : (
                            data.results ||
                            []
                        );


                commentCount.textContent =
                    comments.length;


                renderComments(
                    comments
                );


            } catch (error) {

                console.error(
                    "Comments Error:",
                    error
                );


                commentsList.innerHTML = `

                    <div
                        class="comments-error"
                    >

                        <i
                            class='bx bx-error-circle'
                        ></i>

                        <p>
                            Unable to load comments.
                        </p>

                    </div>

                `;

            } finally {

                commentsLoading.style.display =
                    "none";

            }

        }


        /* =========================================
           RENDER COMMENTS
        ========================================= */

        function renderComments(
            comments
        ) {

            if (
                !comments ||
                !comments.length
            ) {

                commentsList.innerHTML =
                    "";


                commentsEmpty.style.display =
                    "flex";


                return;

            }


            commentsEmpty.style.display =
                "none";


            commentsList.innerHTML =
                comments
                    .map(
                        comment =>
                            createComment(
                                comment
                            )
                    )
                    .join("");

        }


        /* =========================================
           CREATE COMMENT CARD
        ========================================= */

        function createComment(
            comment
        ) {

            const author =
                comment.author_name ||
                "Anonymous";


            const initial =
                author
                    .charAt(0)
                    .toUpperCase();


            const commentDate =
                comment.created_at
                    ? formatCommentDate(
                        comment.created_at
                    )
                    : "";


            return `

                <article
                    class="comment-card"
                    data-comment-id="${comment.id}"
                >

                    <div
                        class="comment-avatar"
                    >

                        ${escapeHTML(
                            initial
                        )}

                    </div>


                    <div
                        class="comment-body"
                    >

                        <div
                            class="comment-top"
                        >

                            <div>

                                <strong
                                    class="comment-author"
                                >

                                    ${escapeHTML(
                                        author
                                    )}

                                </strong>


                                <span
                                    class="comment-date"
                                >

                                    ${commentDate}

                                </span>

                            </div>

                        </div>


                        <p
                            class="comment-content"
                        >

                            ${escapeHTML(
                                comment.content
                            )}

                        </p>

                    </div>

                </article>

            `;

        }


        /* =========================================
           SUBMIT COMMENT
        ========================================= */

        if (commentForm) {

            commentForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const commentContent =
                        commentInput.value.trim();


                    if (!commentContent) {

                        return;

                    }


                    commentSubmitButton.disabled =
                        true;


                    commentSubmitButton.innerHTML = `

                        <i
                            class='bx bx-loader-alt bx-spin'
                        ></i>

                        Posting...

                    `;


                    try {

                        const response =
                            await fetch(
                                "/api/comments/",
                                {
                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "X-CSRFToken":
                                            getCSRFToken()

                                    },

                                    credentials:
                                        "same-origin",

                                    body:
                                        JSON.stringify({

                                            post:
                                                postId,

                                            content:
                                                commentContent

                                        })

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


                        /* ---------------------------------
                           VALIDATION ERROR
                        --------------------------------- */

                        if (!response.ok) {

                            const errorData =
                                await response.json()
                                    .catch(
                                        () => null
                                    );


                            console.error(
                                "Comment validation error:",
                                errorData
                            );


                            throw new Error(
                                "Unable to post comment."
                            );

                        }


                        const newComment =
                            await response.json();


                        /* ---------------------------------
                           CLEAR INPUT
                        --------------------------------- */

                        commentInput.value =
                            "";


                        /* ---------------------------------
                           HIDE EMPTY STATE
                        --------------------------------- */

                        commentsEmpty.style.display =
                            "none";


                        /* ---------------------------------
                           ADD NEW COMMENT
                        --------------------------------- */

                        commentsList.insertAdjacentHTML(
                            "afterbegin",
                            createComment(
                                newComment
                            )
                        );


                        /* ---------------------------------
                           UPDATE COUNT
                        --------------------------------- */

                        const currentCount =
                            Number(
                                commentCount.textContent
                            ) || 0;


                        commentCount.textContent =
                            currentCount + 1;


                    } catch (error) {

                        console.error(
                            "Comment Error:",
                            error
                        );


                        alert(
                            "Unable to post your comment. Please try again."
                        );

                    } finally {

                        commentSubmitButton.disabled =
                            false;


                        commentSubmitButton.innerHTML = `

                            <i
                                class='bx bx-send'
                            ></i>

                            Post comment

                        `;

                    }

                }
            );

        }


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

                const parts =
                    cookie
                        .trim()
                        .split("=");


                const name =
                    parts.shift();


                const value =
                    parts.join("=");


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
           POST DATE FORMAT
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
           COMMENT DATE FORMAT
        ========================================= */

        function formatCommentDate(
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
                        "short",

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