let currentPage = 1;

let currentSearch = "";

let currentCategory = "";

let currentTag = "";


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

        const categoryFilters =
            document.getElementById(
                "categoryFilters"
            );

        const tagFilters =
            document.getElementById(
                "tagFilters"
            );


        /* =========================================
           READ FILTERS FROM URL
        ========================================= */

        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        currentSearch =
            urlParams.get("search") || "";


        currentCategory =
            urlParams.get("category") || "";


        currentTag =
            urlParams.get("tag") || "";


        /* =========================================
           RESTORE SEARCH UI
        ========================================= */

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
                   BUILD QUERY PARAMETERS
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


                if (currentCategory) {

                    params.set(
                        "category",
                        currentCategory
                    );

                }


                if (currentTag) {

                    params.set(
                        "tag",
                        currentTag
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
                   CURRENT PAGE
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
                   UPDATE URL
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


            if (
                existingPagination
            ) {

                existingPagination.remove();

            }


            if (
                !data.next &&
                !data.previous
            ) {

                return;

            }


            const pagination =
                document.createElement(
                    "div"
                );


            pagination.id =
                "blogPagination";


            pagination.className =
                "blog-pagination";


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


            postGrid.after(
                pagination
            );


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


            const author =
                post.author_name ||
                "Anonymous";


            const date =
                post.published_at

                    ? formatDate(
                        post.published_at
                    )

                    : "";


            return `

                <article
                    class="post-card"
                >

                    <a
                        href="/blog/${post.slug}/"
                        class="post-card-image-link"
                    >

                        ${image}

                    </a>


                    <div
                        class="post-card-body"
                    >

                        <div
                            class="post-card-meta"
                        >

                            ${category}

                            <span>
                                ${date}
                            </span>

                        </div>


                        <h2
                            class="post-card-title"
                        >

                            <a
                                href="/blog/${post.slug}/"
                            >

                                ${post.title}

                            </a>

                        </h2>


                        <p
                            class="post-card-excerpt"
                        >

                            ${post.excerpt || ""}

                        </p>


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
           SEARCH
        ========================================= */

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                currentSearch =
                    searchInput.value.trim();


                currentPage =
                    1;


                clearSearch.style.display =
                    currentSearch
                        ? "inline-flex"
                        : "none";


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
           LOAD CATEGORIES
        ========================================= */

        async function loadCategories() {

            try {

                const response =
                    await fetch(
                        "/api/categories/"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load categories."
                    );

                }


                const data =
                    await response.json();


                renderCategories(
                    data
                );


            } catch (error) {

                console.error(
                    "Category API Error:",
                    error
                );

            }

        }


        /* =========================================
           RENDER CATEGORIES
        ========================================= */

        function renderCategories(
            categories
        ) {

            categoryFilters.innerHTML = `

                <button
                    type="button"
                    class="
                        filter-option
                        ${
                            !currentCategory
                                ? "active"
                                : ""
                        }
                    "
                    data-category=""
                >

                    All

                </button>

            `;


            categories.forEach(
                category => {

                    categoryFilters.innerHTML += `

                        <button
                            type="button"
                            class="
                                filter-option
                                ${
                                    currentCategory ===
                                    category.slug
                                        ? "active"
                                        : ""
                                }
                            "
                            data-category="${category.slug}"
                        >

                            ${category.name}

                        </button>

                    `;

                }
            );


            categoryFilters
                .querySelectorAll(
                    "[data-category]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                currentCategory =
                                    button.dataset.category;


                                currentPage =
                                    1;


                                updateFilterButtons(
                                    categoryFilters,
                                    "category",
                                    currentCategory
                                );


                                loadPosts(
                                    1
                                );

                            }
                        );

                    }
                );

        }


        /* =========================================
           LOAD TAGS
        ========================================= */

        async function loadTags() {

            try {

                const response =
                    await fetch(
                        "/api/tags/"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load tags."
                    );

                }


                const data =
                    await response.json();


                renderTags(
                    data
                );


            } catch (error) {

                console.error(
                    "Tag API Error:",
                    error
                );

            }

        }


        /* =========================================
           RENDER TAGS
        ========================================= */

        function renderTags(
            tags
        ) {

            tagFilters.innerHTML = `

                <button
                    type="button"
                    class="
                        filter-option
                        ${
                            !currentTag
                                ? "active"
                                : ""
                        }
                    "
                    data-tag=""
                >

                    All

                </button>

            `;


            tags.forEach(
                tag => {

                    tagFilters.innerHTML += `

                        <button
                            type="button"
                            class="
                                filter-option
                                ${
                                    currentTag ===
                                    tag.slug
                                        ? "active"
                                        : ""
                                }
                            "
                            data-tag="${tag.slug}"
                        >

                            #${tag.name}

                        </button>

                    `;

                }
            );


            tagFilters
                .querySelectorAll(
                    "[data-tag]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                currentTag =
                                    button.dataset.tag;


                                currentPage =
                                    1;


                                updateFilterButtons(
                                    tagFilters,
                                    "tag",
                                    currentTag
                                );


                                loadPosts(
                                    1
                                );

                            }
                        );

                    }
                );

        }


        /* =========================================
           UPDATE ACTIVE FILTER BUTTONS
        ========================================= */

        function updateFilterButtons(
            container,
            attribute,
            value
        ) {

            container
                .querySelectorAll(
                    `[data-${attribute}]`
                )
                .forEach(
                    button => {

                        button.classList.toggle(
                            "active",
                            button.dataset[
                                attribute
                            ] === value
                        );

                    }
                );

        }


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


            if (currentCategory) {

                url.searchParams.set(
                    "category",
                    currentCategory
                );

            } else {

                url.searchParams.delete(
                    "category"
                );

            }


            if (currentTag) {

                url.searchParams.set(
                    "tag",
                    currentTag
                );

            } else {

                url.searchParams.delete(
                    "tag"
                );

            }


            window.history.replaceState(
                {},
                "",
                url
            );

        }


        /* =========================================
           INITIAL LOAD
        ========================================= */

        loadCategories();

        loadTags();

        loadPosts(
            1
        );

    }
);