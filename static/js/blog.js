let currentPage = 1;

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const postGrid =
            document.getElementById("postGrid");

        const loading =
            document.getElementById("blogLoading");

        const empty =
            document.getElementById("blogEmpty");


        async function loadPosts(page = 1) {

            loading.style.display = "block";

            empty.style.display = "none";

            try {

                const response = await fetch(
                    `/api/posts/?page=${page}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to load posts."
                    );

                }

                const data = await response.json();

                currentPage = page;

                renderPosts(data.results);

                renderPagination(data);

            } catch (error) {

                console.error(error);

                postGrid.innerHTML = `
                    <div class="blog-error">

                        <i class='bx bx-error-circle'></i>

                        <p>
                            Unable to load stories.
                        </p>

                    </div>
                `;

            } finally {

                loading.style.display = "none";

            }

        }


        function renderPosts(posts) {

            if (!posts.length) {

                postGrid.innerHTML = "";

                empty.style.display = "flex";

                return;

            }

            empty.style.display = "none";

            postGrid.innerHTML =
                posts
                    .map(
                        post => createPostCard(post)
                    )
                    .join("");

        }

        function renderPagination(data) {

            const existingPagination =
                document.getElementById(
                    "blogPagination"
                );


            if (existingPagination) {

                existingPagination.remove();

            }


            if (
                !data.next &&
                !data.previous
            ) {

                return;

            }


            const pagination =
                document.createElement("div");


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
                    class="pagination-button"
                    data-page="${currentPage + 1}"
                    ${!data.next ? "disabled" : ""}
                >
                    Next
                    <i class='bx bx-right-arrow-alt'></i>
                </button>

            `;


            postGrid.after(pagination);


            pagination
                .querySelectorAll(
                    "[data-page]"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const page =
                                Number(
                                    button.dataset.page
                                );


                            if (page < 1) {
                                return;
                            }


                            loadPosts(page);


                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });

                        }
                    );

                });

        }

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


        function createPostCard(post) {

            const image = post.featured_image
                ? `
                    <img
                        src="${post.featured_image}"
                        alt="${post.title}"
                        class="post-card-image"
                    >
                `
                : `
                    <div class="post-card-placeholder">
                        <i class='bx bx-book-open'></i>
                    </div>
                `;


            const category =
                post.category_name
                    ? `
                        <span class="post-category">
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
                <article class="post-card">

                    <a
                        href="/blog/${post.slug}/"
                        class="post-card-image-link"
                    >
                        ${image}
                    </a>


                    <div class="post-card-body">

                        <div class="post-card-meta">

                            ${category}

                            <span>
                                ${date}
                            </span>

                        </div>


                        <h2 class="post-card-title">

                            <a
                                href="/blog/${post.slug}/"
                            >
                                ${post.title}
                            </a>

                        </h2>


                        <p class="post-card-excerpt">
                            ${post.excerpt || ""}
                        </p>


                        <div class="post-card-footer">

                            <span class="post-author">
                                ${author}
                            </span>

                            <span class="post-views">

                                <i class='bx bx-show'></i>

                                ${post.views}

                            </span>

                        </div>

                    </div>

                </article>
            `;
        }


        function formatDate(dateString) {

            const date =
                new Date(dateString);


            return date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );

        }


        loadPosts();

    }
);