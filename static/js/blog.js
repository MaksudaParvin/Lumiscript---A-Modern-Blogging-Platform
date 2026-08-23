document.addEventListener(
    "DOMContentLoaded",
    () => {

        const postGrid =
            document.getElementById("postGrid");

        const loading =
            document.getElementById("blogLoading");

        const empty =
            document.getElementById("blogEmpty");


        async function loadPosts() {

            try {

                const response =
                    await fetch("/api/posts/");


                if (!response.ok) {

                    throw new Error(
                        "Failed to load posts."
                    );

                }


                const data =
                    await response.json();


                renderPosts(data);


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

                loading.style.display =
                    "none";

            }

        }


        function renderPosts(posts) {

            if (!posts.length) {

                empty.style.display =
                    "flex";

                return;

            }


            postGrid.innerHTML =
                posts
                    .map(
                        post => createPostCard(post)
                    )
                    .join("");

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