document.addEventListener(
    "DOMContentLoaded",
    () => {

        const featuredPost =
            document.getElementById(
                "featuredPost"
            );


        const latestPosts =
            document.getElementById(
                "latestPosts"
            );


        const loading =
            document.getElementById(
                "homeLoading"
            );



        // =========================================
        // LOAD POSTS
        // =========================================

        async function loadPosts() {

            try {

                const response =
                    await fetch(
                        "/api/posts/?page=1"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to load posts."
                    );

                }


                const data =
                    await response.json();


                /*
                 * DRF pagination:
                 *
                 * {
                 *     count: ...,
                 *     next: ...,
                 *     previous: ...,
                 *     results: [...]
                 * }
                 */


                const posts =
                    data.results;


                renderFeatured(
                    posts
                );


                renderLatest(
                    posts
                );


            } catch (error) {

                console.error(
                    "Home API Error:",
                    error
                );


                featuredPost.innerHTML = `
                    <p class="home-error">
                        Unable to load featured story.
                    </p>
                `;


                latestPosts.innerHTML = `
                    <p class="home-error">
                        Unable to load stories.
                    </p>
                `;

            } finally {

                if (loading) {

                    loading.style.display =
                        "none";

                }

            }

        }



        // =========================================
        // RENDER FEATURED
        // =========================================

        function renderFeatured(
            posts
        ) {

            if (
                !posts ||
                !posts.length
            ) {

                featuredPost.innerHTML = `
                    <div class="home-empty">
                        No published stories yet.
                    </div>
                `;

                return;

            }


            const post =
                posts[0];


            // -------------------------------------
            // IMAGE
            // -------------------------------------

            const image =
                post.featured_image

                    ? `

                        <img
                            src="${escapeHTML(
                                post.featured_image
                            )}"

                            alt="${escapeHTML(
                                post.title
                            )}"

                            class="featured-post-image"
                        >

                    `

                    : `

                        <div
                            class="featured-placeholder"
                        >

                            <i
                                class='bx bx-book-open'
                            ></i>

                        </div>

                    `;



            // -------------------------------------
            // BOOKMARK
            // -------------------------------------

            const bookmarkClass =
                post.is_bookmarked
                    ? "post-bookmark bookmarked"
                    : "post-bookmark";


            const bookmarkIcon =
                post.is_bookmarked
                    ? "bxs-bookmark"
                    : "bx-bookmark";


            const bookmarkLabel =
                post.is_bookmarked
                    ? "Remove bookmark"
                    : "Save post";



            featuredPost.innerHTML = `

                <article
                    class="featured-card"
                >


                    <!-- IMAGE AREA -->

                    <div
                        class="
                            featured-image-wrapper
                        "
                    >

                        <a
                            href="/blog/${encodeURIComponent(
                                post.slug
                            )}/"

                            class="featured-image"
                        >

                            ${image}

                        </a>


                        <!-- BOOKMARK -->

                        <button
                            type="button"

                            class="${bookmarkClass}"

                            data-slug="${escapeHTML(
                                post.slug
                            )}"

                            aria-label="${bookmarkLabel}"

                            title="${bookmarkLabel}"
                        >

                            <i
                                class='bx ${bookmarkIcon}'
                            ></i>

                        </button>

                    </div>



                    <!-- CONTENT -->

                    <div
                        class="featured-content"
                    >


                        <!-- META -->

                        <div
                            class="post-card-meta"
                        >

                            ${
                                post.category_name

                                    ? `

                                        <span
                                            class="
                                                post-category
                                            "
                                        >

                                            ${escapeHTML(
                                                post.category_name
                                            )}

                                        </span>

                                    `

                                    : ""
                            }


                            <span>

                                ${formatDate(
                                    post.published_at
                                )}

                            </span>

                        </div>



                        <!-- TITLE -->

                        <h3>

                            <a
                                href="/blog/${encodeURIComponent(
                                    post.slug
                                )}/"
                            >

                                ${escapeHTML(
                                    post.title
                                )}

                            </a>

                        </h3>



                        <!-- EXCERPT -->

                        <p>

                            ${escapeHTML(
                                post.excerpt || ""
                            )}

                        </p>



                        <!-- FOOTER -->

                        <div
                            class="featured-footer"
                        >

                            <span>

                                ${escapeHTML(
                                    post.author_name ||
                                    "Anonymous"
                                )}

                            </span>


                            <div
                                class="post-engagement"
                            >

                                <!-- VIEWS -->

                                <span>

                                    <i
                                        class='bx bx-show'
                                    ></i>

                                    ${post.views || 0}

                                </span>


                                <!-- LIKES -->

                                <span
                                    class="
                                        ${
                                            post.is_liked
                                                ? "liked"
                                                : ""
                                        }
                                    "
                                >

                                    <i
                                        class='${
                                            post.is_liked
                                                ? "bx bxs-heart"
                                                : "bx bx-heart"
                                        }'
                                    ></i>

                                    ${post.like_count || 0}

                                </span>

                            </div>

                        </div>


                    </div>


                </article>

            `;


            /*
             * Featured card was newly created.
             * Attach bookmark event.
             */

            setupBookmarkButtons();

        }



        // =========================================
        // RENDER LATEST
        // =========================================

        function renderLatest(
            posts
        ) {

            const latest =
                posts.slice(
                    1,
                    4
                );


            if (!latest.length) {

                latestPosts.innerHTML = `
                    <div class="home-empty">
                        More stories coming soon.
                    </div>
                `;

                return;

            }


            latestPosts.innerHTML =
                latest
                    .map(
                        post =>
                            createPostCard(
                                post
                            )
                    )
                    .join("");


            /*
             * New cards were created.
             * Attach bookmark events.
             */

            setupBookmarkButtons();

        }



        // =========================================
        // CREATE POST CARD
        // =========================================

        function createPostCard(
            post
        ) {


            // -------------------------------------
            // IMAGE
            // -------------------------------------

            const image =
                post.featured_image

                    ? `

                        <img
                            src="${escapeHTML(
                                post.featured_image
                            )}"

                            alt="${escapeHTML(
                                post.title
                            )}"

                            class="home-post-card-image"
                        >

                    `

                    : `

                        <div
                            class="
                                home-card-placeholder
                            "
                        >

                            <i
                                class='bx bx-book-open'
                            ></i>

                        </div>

                    `;



            // -------------------------------------
            // BOOKMARK STATE
            // -------------------------------------

            const bookmarkClass =
                post.is_bookmarked
                    ? "post-bookmark bookmarked"
                    : "post-bookmark";


            const bookmarkIcon =
                post.is_bookmarked
                    ? "bxs-bookmark"
                    : "bx-bookmark";


            const bookmarkLabel =
                post.is_bookmarked
                    ? "Remove bookmark"
                    : "Save post";



            return `

                <article
                    class="home-post-card"
                >


                    <!-- IMAGE AREA -->

                    <div
                        class="
                            home-post-image-wrapper
                        "
                    >

                        <a
                            href="/blog/${encodeURIComponent(
                                post.slug
                            )}/"

                            class="home-post-image"
                        >

                            ${image}

                        </a>


                        <!-- BOOKMARK -->

                        <button
                            type="button"

                            class="${bookmarkClass}"

                            data-slug="${escapeHTML(
                                post.slug
                            )}"

                            aria-label="${bookmarkLabel}"

                            title="${bookmarkLabel}"
                        >

                            <i
                                class='bx ${bookmarkIcon}'
                            ></i>

                        </button>

                    </div>



                    <!-- BODY -->

                    <div
                        class="home-post-body"
                    >


                        <!-- META -->

                        <div
                            class="post-card-meta"
                        >

                            ${
                                post.category_name

                                    ? `

                                        <span
                                            class="
                                                post-category
                                            "
                                        >

                                            ${escapeHTML(
                                                post.category_name
                                            )}

                                        </span>

                                    `

                                    : ""
                            }


                            <span>

                                ${formatDate(
                                    post.published_at
                                )}

                            </span>

                        </div>



                        <!-- TITLE -->

                        <h3>

                            <a
                                href="/blog/${encodeURIComponent(
                                    post.slug
                                )}/"
                            >

                                ${escapeHTML(
                                    post.title
                                )}

                            </a>

                        </h3>



                        <!-- EXCERPT -->

                        <p>

                            ${escapeHTML(
                                post.excerpt || ""
                            )}

                        </p>



                        <!-- FOOTER -->

                        <div
                            class="
                                home-post-footer
                            "
                        >

                            <span>

                                ${escapeHTML(
                                    post.author_name ||
                                    "Anonymous"
                                )}

                            </span>


                            <div
                                class="
                                    post-engagement
                                "
                            >

                                <!-- VIEWS -->

                                <span>

                                    <i
                                        class='bx bx-show'
                                    ></i>

                                    ${post.views || 0}

                                </span>


                                <!-- LIKES -->

                                <span
                                    class="${
                                        post.is_liked
                                            ? "liked"
                                            : ""
                                    }"
                                >

                                    <i
                                        class='${
                                            post.is_liked
                                                ? "bx bxs-heart"
                                                : "bx bx-heart"
                                        }'
                                    ></i>

                                    ${post.like_count || 0}

                                </span>

                            </div>

                        </div>


                    </div>


                </article>

            `;

        }



        // =========================================
        // BOOKMARK BUTTONS
        // =========================================

        function setupBookmarkButtons() {

            const bookmarkButtons =
                document.querySelectorAll(
                    ".post-bookmark"
                );


            bookmarkButtons.forEach(
                button => {

                    /*
                     * Prevent duplicate event listeners.
                     */

                    if (
                        button.dataset.bookmarkReady ===
                        "true"
                    ) {

                        return;

                    }


                    button.dataset.bookmarkReady =
                        "true";


                    button.addEventListener(
                        "click",
                        async event => {

                            /*
                             * Prevent opening article.
                             */

                            event.preventDefault();

                            event.stopPropagation();


                            const slug =
                                button.dataset.slug;


                            if (!slug) {

                                console.error(
                                    "Bookmark slug missing."
                                );

                                return;

                            }


                            /*
                             * Current state
                             */

                            const isBookmarked =
                                button.classList.contains(
                                    "bookmarked"
                                );


                            /*
                             * EXACT SAME LOGIC
                             * AS EXPLORE PAGE
                             *
                             * Save:
                             * POST /bookmark/
                             *
                             * Unsave:
                             * DELETE /remove_bookmark/
                             */

                            const method =
                                isBookmarked
                                    ? "DELETE"
                                    : "POST";


                            const endpoint =
                                isBookmarked

                                    ? `/api/posts/${encodeURIComponent(
                                        slug
                                    )}/remove_bookmark/`

                                    : `/api/posts/${encodeURIComponent(
                                        slug
                                    )}/bookmark/`;


                            /*
                             * Disable button
                             * during request.
                             */

                            button.disabled =
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


                                /*
                                 * LOGIN REQUIRED
                                 */

                                if (
                                    response.status ===
                                        401 ||
                                    response.status ===
                                        403
                                ) {

                                    window.location.href =
                                        `/login/?next=${encodeURIComponent(
                                            window.location.pathname +
                                            window.location.search
                                        )}`;

                                    return;

                                }


                                /*
                                 * API ERROR
                                 */

                                if (
                                    !response.ok
                                ) {

                                    throw new Error(
                                        `Bookmark API Error: ${response.status}`
                                    );

                                }


                                /*
                                 * API RESPONSE
                                 */

                                const data =
                                    await response.json();


                                /*
                                 * IMPORTANT:
                                 *
                                 * Explore uses:
                                 *
                                 * data.bookmarked
                                 */

                                updateBookmarkButton(
                                    button,
                                    data.bookmarked
                                );


                            } catch (
                                error
                            ) {

                                console.error(
                                    "Bookmark Error:",
                                    error
                                );

                            } finally {

                                button.disabled =
                                    false;

                            }

                        }
                    );

                }
            );

        }



        // =========================================
        // UPDATE BOOKMARK BUTTON
        // =========================================

        function updateBookmarkButton(
            button,
            bookmarked
        ) {

            if (
                bookmarked
            ) {

                button.classList.add(
                    "bookmarked"
                );


                button.innerHTML = `

                    <i
                        class='bx bxs-bookmark'
                    ></i>

                `;


                button.setAttribute(
                    "aria-label",
                    "Remove bookmark"
                );


                button.setAttribute(
                    "title",
                    "Remove bookmark"
                );


            } else {

                button.classList.remove(
                    "bookmarked"
                );


                button.innerHTML = `

                    <i
                        class='bx bx-bookmark'
                    ></i>

                `;


                button.setAttribute(
                    "aria-label",
                    "Save post"
                );


                button.setAttribute(
                    "title",
                    "Save post"
                );

            }

        }



        // =========================================
        // CSRF TOKEN
        // =========================================

        function getCSRFToken() {

            const cookies =
                document.cookie.split(
                    ";"
                );


            for (
                const cookie of cookies
            ) {

                const parts =
                    cookie.trim().split(
                        "="
                    );


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



        // =========================================
        // ESCAPE HTML
        // =========================================

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



        // =========================================
        // FORMAT DATE
        // =========================================

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
                        "short",

                    day:
                        "numeric",

                    year:
                        "numeric"
                }
            );

        }



        // =========================================
        // INITIAL LOAD
        // =========================================

        loadPosts();

    }
);