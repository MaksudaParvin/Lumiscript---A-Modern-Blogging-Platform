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


                if (!response.ok) {

                    throw new Error(
                        `API Error: ${response.status}`
                    );

                }


                const post =
                    await response.json();


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
               LIKE
            ----------------------------------------- */

            if (likeCount) {

                likeCount.textContent =
                    post.like_count || 0;

            }


            if (likeButton) {

                updateLikeButton(
                    post.is_liked
                );

            }


            /* -----------------------------------------
               BOOKMARK
            ----------------------------------------- */

            if (bookmarkButton) {

                updateBookmarkButton(
                    post.is_bookmarked
                );

            }


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
               CONTENT
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

            if (!likeButton) {

                return;

            }


            const count =
                likeCount
                    ? likeCount.textContent
                    : "0";


            if (liked) {

                likeButton.classList.add(
                    "liked"
                );


                likeButton.innerHTML = `

                    <i class='bx bxs-heart'></i>

                    <span id="likeCount">
                        ${count}
                    </span>

                `;

            } else {

                likeButton.classList.remove(
                    "liked"
                );


                likeButton.innerHTML = `

                    <i class='bx bx-heart'></i>

                    <span id="likeCount">
                        ${count}
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

            if (!bookmarkButton) {

                return;

            }


            if (bookmarked) {

                bookmarkButton.classList.add(
                    "bookmarked"
                );


                bookmarkButton.innerHTML = `

                    <i class='bx bxs-bookmark'></i>

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

                    <i class='bx bx-bookmark'></i>

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

        if (likeButton) {

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


                        if (likeCount) {

                            likeCount.textContent =
                                data.like_count || 0;

                        }


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

        }


        /* =========================================
           BOOKMARK / REMOVE BOOKMARK
        ========================================= */

        if (bookmarkButton) {

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

        }


        /* =========================================
           LOAD COMMENTS
        ========================================= */

        async function loadComments() {

            if (
                !postId ||
                !commentsList
            ) {

                return;

            }


            try {

                if (commentsLoading) {

                    commentsLoading.style.display =
                        "flex";

                }


                if (commentsEmpty) {

                    commentsEmpty.style.display =
                        "none";

                }


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


                const comments =
                    Array.isArray(data)
                        ? data
                        : (
                            data.results ||
                            []
                        );


                if (commentCount) {

                    commentCount.textContent =
                        comments.length;

                }


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

                if (commentsLoading) {

                    commentsLoading.style.display =
                        "none";

                }

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


                if (commentsEmpty) {

                    commentsEmpty.style.display =
                        "flex";

                }


                return;

            }


            if (commentsEmpty) {

                commentsEmpty.style.display =
                    "none";

            }


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


            /*
            Only owner gets
            Edit + Delete buttons.
            */

            const actions =
                comment.is_owner
                    ? `

                        <div
                            class="comment-actions"
                        >

                            <button
                                type="button"
                                class="
                                    comment-action
                                    edit-comment
                                "
                                data-comment-id="${comment.id}"
                                title="Edit comment"
                            >

                                <i
                                    class='bx bx-edit-alt'
                                ></i>

                                <span>
                                    Edit
                                </span>

                            </button>


                            <button
                                type="button"
                                class="
                                    comment-action
                                    delete-comment
                                    danger
                                "
                                data-comment-id="${comment.id}"
                                title="Delete comment"
                            >

                                <i
                                    class='bx bx-trash'
                                ></i>

                                <span>
                                    Delete
                                </span>

                            </button>

                        </div>

                    `
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


                            ${actions}

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
           COMMENT ACTIONS
        ========================================= */

        if (commentsList) {

            commentsList.addEventListener(
                "click",
                event => {

                    const editButton =
                        event.target.closest(
                            ".edit-comment"
                        );


                    const deleteButton =
                        event.target.closest(
                            ".delete-comment"
                        );


                    if (editButton) {

                        editComment(
                            editButton.dataset.commentId
                        );

                        return;

                    }


                    if (deleteButton) {

                        deleteComment(
                            deleteButton.dataset.commentId
                        );

                    }

                }
            );

        }


        /* =========================================
           EDIT COMMENT
        ========================================= */

        async function editComment(
            commentId
        ) {

            const card =
                document.querySelector(
                    `.comment-card[data-comment-id="${commentId}"]`
                );


            if (!card) {

                return;

            }


            const contentElement =
                card.querySelector(
                    ".comment-content"
                );


            if (!contentElement) {

                return;

            }


            const currentContent =
                contentElement.textContent.trim();


            const newContent =
                window.prompt(
                    "Edit your comment:",
                    currentContent
                );


            if (
                newContent === null
            ) {

                return;

            }


            const content =
                newContent.trim();


            if (!content) {

                return;

            }


            if (
                content ===
                currentContent
            ) {

                return;

            }


            const editButton =
                card.querySelector(
                    ".edit-comment"
                );


            if (editButton) {

                editButton.disabled =
                    true;

            }


            try {

                const response =
                    await fetch(
                        `/api/comments/${commentId}/`,
                        {
                            method:
                                "PATCH",

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
                                    content:
                                        content
                                })

                        }
                    );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    alert(
                        "You can only edit your own comment."
                    );

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        `Edit Error: ${response.status}`
                    );

                }


                const updatedComment =
                    await response.json();


                contentElement.textContent =
                    updatedComment.content;


            } catch (error) {

                console.error(
                    "Edit Comment Error:",
                    error
                );


                alert(
                    "Unable to edit comment. Please try again."
                );

            } finally {

                if (editButton) {

                    editButton.disabled =
                        false;

                }

            }

        }


        /* =========================================
           DELETE COMMENT
        ========================================= */

        async function deleteComment(
            commentId
        ) {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this comment?"
                );


            if (!confirmed) {

                return;

            }


            const card =
                document.querySelector(
                    `.comment-card[data-comment-id="${commentId}"]`
                );


            try {

                const response =
                    await fetch(
                        `/api/comments/${commentId}/`,
                        {
                            method:
                                "DELETE",

                            headers: {

                                "X-CSRFToken":
                                    getCSRFToken()

                            },

                            credentials:
                                "same-origin"

                        }
                    );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    alert(
                        "You can only delete your own comment."
                    );

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        `Delete Error: ${response.status}`
                    );

                }


                if (card) {

                    card.remove();

                }


                const currentCount =
                    Number(
                        commentCount
                            ? commentCount.textContent
                            : 0
                    ) || 0;


                const newCount =
                    Math.max(
                        0,
                        currentCount - 1
                    );


                if (commentCount) {

                    commentCount.textContent =
                        newCount;

                }


                if (
                    newCount === 0 &&
                    commentsEmpty
                ) {

                    commentsEmpty.style.display =
                        "flex";

                }


            } catch (error) {

                console.error(
                    "Delete Comment Error:",
                    error
                );


                alert(
                    "Unable to delete comment. Please try again."
                );

            }

        }


        /* =========================================
           SUBMIT COMMENT
        ========================================= */

        if (
            commentForm &&
            commentInput &&
            commentSubmitButton
        ) {

            commentForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const commentContent =
                        commentInput.value.trim();


                    if (!commentContent) {

                        commentInput.focus();

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


                        if (
                            response.status === 401 ||
                            response.status === 403
                        ) {

                            redirectToLogin();

                            return;

                        }


                        if (!response.ok) {

                            const errorData =
                                await response
                                    .json()
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


                        commentInput.value =
                            "";


                        if (commentsEmpty) {

                            commentsEmpty.style.display =
                                "none";

                        }


                        commentsList.insertAdjacentHTML(
                            "afterbegin",
                            createComment(
                                newComment
                            )
                        );


                        const currentCount =
                            Number(
                                commentCount
                                    ? commentCount.textContent
                                    : 0
                            ) || 0;


                        if (commentCount) {

                            commentCount.textContent =
                                currentCount + 1;

                        }


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
           SHOW ERROR
        ========================================= */

        function showError() {

            if (loading) {

                loading.style.display =
                    "none";

            }


            if (article) {

                article.style.display =
                    "none";

            }


            if (errorBox) {

                errorBox.style.display =
                    "flex";

            }

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