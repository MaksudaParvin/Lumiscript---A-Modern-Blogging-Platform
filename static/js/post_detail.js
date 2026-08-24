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
           POST STATE
        ========================================= */

        let postId = null;

        let activeReplyParentId = null;


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
               LIKE
            ===================================== */

            if (likeCount) {

                likeCount.textContent =
                    post.like_count || 0;

            }


            if (likeButton) {

                updateLikeButton(
                    post.is_liked
                );

            }


            /* =====================================
               BOOKMARK
            ===================================== */

            if (bookmarkButton) {

                updateBookmarkButton(
                    post.is_bookmarked
                );

            }


            /* =====================================
               FEATURED IMAGE
            ===================================== */

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


            /* =====================================
               CONTENT
            ===================================== */

            content.innerHTML =
                post.content || "";


            /* =====================================
               TAGS
            ===================================== */

            renderTags(
                post.tags_data
            );


            /* =====================================
               SHOW ARTICLE
            ===================================== */

            loading.style.display =
                "none";


            errorBox.style.display =
                "none";


            article.style.display =
                "block";


            /* =====================================
               LOAD COMMENTS
            ===================================== */

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
           LIKE BUTTON
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

                    <i
                        class='bx bxs-heart'
                    ></i>

                    <span id="likeCount">
                        ${count}
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
                        ${count}
                    </span>

                `;

            }

        }


        /* =========================================
           BOOKMARK BUTTON
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

                    <i
                        class='bx bxs-bookmark'
                    ></i>

                `;


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
                        countAllComments(
                            comments
                        );

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
           CREATE COMMENT
           RECURSIVE / NESTED
        ========================================= */

        function createComment(
            comment,
            depth = 0
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


            /* =====================================
               EDIT / DELETE
            ===================================== */

            const ownerActions =
                comment.is_owner
                    ? `

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

                    `
                    : "";


            /* =====================================
               REPLIES
            ===================================== */

            const replies =
                comment.replies &&
                comment.replies.length
                    ? `

                        <div
                            class="comment-replies"
                        >

                            ${comment.replies
                                .map(
                                    reply =>
                                        createComment(
                                            reply,
                                            depth + 1
                                        )
                                )
                                .join("")
                            }

                        </div>

                    `
                    : "";


            return `

                <article
                    class="
                        comment-card
                        ${
                            depth > 0
                                ? "comment-reply-card"
                                : ""
                        }
                    "
                    data-comment-id="${comment.id}"
                    data-comment-depth="${depth}"
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

                        <!-- COMMENT HEADER -->

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


                            <div
                                class="comment-actions"
                            >

                                ${ownerActions}

                            </div>

                        </div>


                        <!-- COMMENT MESSAGE -->

                        <p
                            class="comment-content"
                        >

                            ${escapeHTML(
                                comment.content
                            )}

                        </p>


                        <!-- REPLY BUTTON -->

                        <div
                            class="comment-reply-action"
                        >

                            <button
                                type="button"
                                class="
                                    comment-action
                                    reply-comment
                                "
                                data-comment-id="${comment.id}"
                                title="Reply"
                            >

                                <i
                                    class='bx bx-reply'
                                ></i>

                                <span>
                                    Reply
                                </span>

                            </button>

                        </div>


                        <!-- REPLY FORM -->

                        <div
                            class="reply-form-container"
                            data-reply-parent="${comment.id}"
                        ></div>


                        <!-- NESTED REPLIES -->

                        ${replies}

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

                    const replyButton =
                        event.target.closest(
                            ".reply-comment"
                        );


                    const editButton =
                        event.target.closest(
                            ".edit-comment"
                        );


                    const deleteButton =
                        event.target.closest(
                            ".delete-comment"
                        );


                    if (replyButton) {

                        toggleReplyForm(
                            replyButton.dataset.commentId
                        );

                        return;

                    }


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
           TOGGLE REPLY FORM
        ========================================= */

        function toggleReplyForm(
            parentId
        ) {

            const container =
                document.querySelector(
                    `[data-reply-parent="${parentId}"]`
                );


            if (!container) {

                return;

            }


            /* -------------------------------------
               Close Current Reply Form
            ------------------------------------- */

            if (
                container.innerHTML.trim()
            ) {

                container.innerHTML =
                    "";

                activeReplyParentId =
                    null;

                return;

            }


            /* -------------------------------------
               Close Other Reply Forms
            ------------------------------------- */

            document
                .querySelectorAll(
                    ".reply-form-container"
                )
                .forEach(
                    element => {

                        element.innerHTML =
                            "";

                    }
                );


            activeReplyParentId =
                parentId;


            /* -------------------------------------
               Reply Form
            ------------------------------------- */

            container.innerHTML = `

                <form
                    class="reply-form"
                    data-parent-id="${parentId}"
                >

                    <textarea
                        class="reply-input"
                        rows="3"
                        maxlength="5000"
                        placeholder="Write a reply..."
                        required
                    ></textarea>


                    <div
                        class="reply-form-actions"
                    >

                        <button
                            type="button"
                            class="
                                reply-cancel-button
                                comment-action
                            "
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="reply-submit-button"
                        >

                            <i
                                class='bx bx-reply'
                            ></i>

                            Reply

                        </button>

                    </div>

                </form>

            `;


            const form =
                container.querySelector(
                    ".reply-form"
                );


            const input =
                container.querySelector(
                    ".reply-input"
                );


            const cancelButton =
                container.querySelector(
                    ".reply-cancel-button"
                );


            input.focus();


            /* -------------------------------------
               Cancel Reply
            ------------------------------------- */

            cancelButton.addEventListener(
                "click",
                () => {

                    container.innerHTML =
                        "";

                    activeReplyParentId =
                        null;

                }
            );


            /* -------------------------------------
               Submit Reply
            ------------------------------------- */

            form.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const replyContent =
                        input.value.trim();


                    if (!replyContent) {

                        input.focus();

                        return;

                    }


                    const submitButton =
                        form.querySelector(
                            ".reply-submit-button"
                        );


                    submitButton.disabled =
                        true;


                    submitButton.innerHTML = `

                        <i
                            class='bx bx-loader-alt bx-spin'
                        ></i>

                        Replying...

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

                                            parent:
                                                Number(
                                                    parentId
                                                ),

                                            content:
                                                replyContent

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
                                "Reply validation error:",
                                errorData
                            );


                            throw new Error(
                                "Unable to post reply."
                            );

                        }


                        container.innerHTML =
                            "";


                        activeReplyParentId =
                            null;


                        await loadComments();


                    } catch (error) {

                        console.error(
                            "Reply Error:",
                            error
                        );


                        alert(
                            "Unable to post your reply. Please try again."
                        );


                    } finally {

                        if (
                            document.body.contains(
                                submitButton
                            )
                        ) {

                            submitButton.disabled =
                                false;

                        }

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


            const contentValue =
                newContent.trim();


            if (!contentValue) {

                return;

            }


            if (
                contentValue ===
                currentContent
            ) {

                return;

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
                                        contentValue

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


                await loadComments();


            } catch (error) {

                console.error(
                    "Edit Comment Error:",
                    error
                );


                alert(
                    "Unable to edit comment. Please try again."
                );

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


                await loadComments();


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
           SUBMIT TOP-LEVEL COMMENT
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


                        await response.json();


                        commentInput.value =
                            "";


                        await loadComments();


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
           COUNT ALL COMMENTS
        ========================================= */

        function countAllComments(
            comments
        ) {

            if (
                !comments ||
                !comments.length
            ) {

                return 0;

            }


            return comments.reduce(
                (
                    total,
                    comment
                ) => {

                    return (
                        total +
                        1 +
                        countAllComments(
                            comment.replies || []
                        )
                    );

                },
                0
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
           POST DATE
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
           COMMENT DATE
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