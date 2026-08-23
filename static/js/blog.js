let currentPage = 1;

let currentSearch = "";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================
           ELEMENTS
        ========================================= */

        const postGrid =
            document.getElementById(
                "postGrid"
            );

        const loading =
            document.getElementById(
                "blogLoading"
            );

        const empty =
            document.getElementById(
                "blogEmpty"
            );

        const searchForm =
            document.getElementById(
                "searchForm"
            );

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        const clearSearch =
            document.getElementById(
                "clearSearch"
            );


        /* =========================================
           INITIAL SEARCH FROM URL
        ========================================= */

        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        currentSearch =
            urlParams.get("search") || "";


        if (currentSearch) {

            searchInput.value =
                currentSearch;

            clearSearch.style.display =
                "inline-flex";

        }


        /* =========================================
           LOAD POSTS
        ========================================= */

        async function loadPosts(
            page = 1
        ) {

            loading.style.display =
                "block";

            empty.style.display =
                "none";


            try {

                /* -------------------------------
                   BUILD API QUERY
                -------------------------------- */

                const params =
                    new URLSearchParams();


                params.set(
                    "page",
                    page
                );


                if (currentSearch) {

                    params.set(
                        "search",
                        currentSearch
                    );

                }


                /* -------------------------------
                   API REQUEST
                -------------------------------- */

                const response =
                    await fetch(
                        `/api/posts/?${params.toString()}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load posts."
                    );

                }


                const data =
                    await response.json();


                /* -------------------------------
                   UPDATE CURRENT PAGE
                -------------------------------- */

                currentPage =
                    page;


                /* -------------------------------
                   RENDER POSTS
                -------------------------------- */

                renderPosts(
                    data.results
                );


                /* -------------------------------
                   RENDER PAGINATION
                -------------------------------- */

                renderPagination(
                    data
                );


                /* -------------------------------
                   UPDATE BROWSER URL
                -------------------------------- */

                updateBrowserURL();


            } catch (error) {

                console.error(
                    "Blog API Error:",
                    error
                );


                postGrid.innerHTML = `

                    <div class="blog-error">

                        <i class='bx bx-error-circle'></i>

                        <p>
                            Unable to load stories.
                        </p>

                    </div>

                `;


            } finally {

                loading.style.display =
                    "none";

            }

        }


        /* =========================================
           RENDER POSTS
        ========================================= */

        function renderPosts(
            posts
        ) {

            if (
                !posts ||
                !posts.length
            ) {

                postGrid.innerHTML =
                    "";

                empty.style.display =
                    "flex";

                return;

            }


            empty.style.display =
                "none";


            postGrid.innerHTML =
                posts
                    .map(
                        post =>
                            createPostCard(
                                post
                            )
                    )
                    .join("");

        }


        /* =========================================
           RENDER PAGINATION
        ========================================= */

        function renderPagination(
            data
        ) {

            const existingPagination =
                document.getElementById(
                    "blogPagination"
                );


            /* -------------------------------
               Remove old pagination
            -------------------------------- */

            if (
                existingPagination
            ) {

                existingPagination.remove();

            }


            /* -------------------------------
               No pagination needed
            -------------------------------- */

            if (
                !data.next &&
                !data.previous
            ) {

                return;

            }


            /* -------------------------------
               Create pagination
            -------------------------------- */

            const pagination =
                document.createElement(
                    "div"
                );


            pagination.id =
                "blogPagination";


            pagination.className =
                "blog-pagination";


            /* -------------------------------
               Total pages
            -------------------------------- */

            const totalPages =
                Math.ceil(
                    data.count / 6
                );


            pagination.innerHTML = `

                <button
                    type="button"
                    class="pagination-button"
                    data-page="${currentPage - 1}"
                    ${!data.previous ? "disabled" : ""}
                >

                    <i class='bx bx-left-arrow-alt'></i>

                    Previous

                </button>


                <div class="pagination-pages">

                    ${createPageButtons(
                        totalPages
                    )}

                </div>


                <button
                    type="button"
                    class="pagination-button"
                    data-page="${currentPage + 1}"
                    ${!data.next ? "disabled" : ""}
                >

                    Next

                    <i class='bx bx-right-arrow-alt'></i>

                </button>

            `;


            /* -------------------------------
               Insert pagination
            -------------------------------- */

            postGrid.after(
                pagination
            );


            /* -------------------------------
               Pagination events
            -------------------------------- */

            pagination
                .querySelectorAll(
                    "[data-page]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                const page =
                                    Number(
                                        button.dataset.page
                                    );


                                if (
                                    page < 1
                                ) {

                                    return;

                                }


                                loadPosts(
                                    page
                                );


                                window.scrollTo(
                                    {
                                        top: 0,
                                        behavior: "smooth"
                                    }
                                );

                            }
                        );

                    }
                );

        }


        /* =========================================
           CREATE PAGE BUTTONS
        ========================================= */

        function createPageButtons(
            totalPages
        ) {

            let html = "";


            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {

                html += `

                    <button
                        type="button"
                        class="
                            pagination-page
                            ${
                                page === currentPage
                                    ? "active"
                                    : ""
                            }
                        "
                        data-page="${page}"
                    >

                        ${page}

                    </button>

                `;

            }


            return html;

        }


        /* =========================================
           CREATE POST CARD
        ========================================= */

        function createPostCard(
            post
        ) {

            /* -------------------------------
               Featured Image
            -------------------------------- */

            const image =
                post.featured_image

                    ? `

                        <img
                            src="${post.featured_image}"
                            alt="${post.title}"
                            class="post-card-image"
                        >

                    `

                    : `

                        <div
                            class="post-card-placeholder"
                        >

                            <i
                                class='bx bx-book-open'
                            ></i>

                        </div>

                    `;


            /* -------------------------------
               Category
            -------------------------------- */

            const category =
                post.category_name

                    ? `

                        <span
                            class="post-category"
                        >

                            ${post.category_name}

                        </span>

                    `

                    : "";


            /* -------------------------------
               Author
            -------------------------------- */

            const author =
                post.author_name ||
                "Anonymous";


            /* -------------------------------
               Date
            -------------------------------- */

            const date =
                post.published_at

                    ? formatDate(
                        post.published_at
                    )

                    : "";


            /* -------------------------------
               Card
            -------------------------------- */

            return `

                <article
                    class="post-card"
                >


                    <!-- IMAGE -->

                    <a
                        href="/blog/${post.slug}/"
                        class="post-card-image-link"
                    >

                        ${image}

                    </a>


                    <!-- BODY -->

                    <div
                        class="post-card-body"
                    >


                        <!-- META -->

                        <div
                            class="post-card-meta"
                        >

                            ${category}


                            <span>
                                ${date}
                            </span>

                        </div>


                        <!-- TITLE -->

                        <h2
                            class="post-card-title"
                        >

                            <a
                                href="/blog/${post.slug}/"
                            >

                                ${post.title}

                            </a>

                        </h2>


                        <!-- EXCERPT -->

                        <p
                            class="post-card-excerpt"
                        >

                            ${post.excerpt || ""}

                        </p>


                        <!-- FOOTER -->

                        <div
                            class="post-card-footer"
                        >

                            <span
                                class="post-author"
                            >

                                ${author}

                            </span>


                            <span
                                class="post-views"
                            >

                                <i
                                    class='bx bx-show'
                                ></i>

                                ${post.views || 0}

                            </span>

                        </div>


                    </div>


                </article>

            `;

        }


        /* =========================================
           FORMAT DATE
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
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );

        }


        /* =========================================
           SEARCH SUBMIT
        ========================================= */

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                currentSearch =
                    searchInput.value.trim();


                currentPage =
                    1;


                if (currentSearch) {

                    clearSearch.style.display =
                        "inline-flex";

                } else {

                    clearSearch.style.display =
                        "none";

                }


                loadPosts(
                    1
                );

            }
        );


        /* =========================================
           CLEAR SEARCH
        ========================================= */

        clearSearch.addEventListener(
            "click",
            () => {

                searchInput.value =
                    "";

                currentSearch =
                    "";

                currentPage =
                    1;


                clearSearch.style.display =
                    "none";


                loadPosts(
                    1
                );

            }
        );


        /* =========================================
           UPDATE BROWSER URL
        ========================================= */

        function updateBrowserURL() {

            const url =
                new URL(
                    window.location.href
                );


            if (currentSearch) {

                url.searchParams.set(
                    "search",
                    currentSearch
                );

            } else {

                url.searchParams.delete(
                    "search"
                );

            }


            /*
             * Page URL will keep search,
             * but page number is handled
             * through API state.
             */

            window.history.replaceState(
                {},
                "",
                url
            );

        }


        /* =========================================
           INITIAL LOAD
        ========================================= */

        loadPosts(
            1
        );

    }
);