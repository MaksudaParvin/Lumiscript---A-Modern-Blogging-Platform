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


        async function loadPosts() {

            try {

                const response =
                    await fetch(
                        "/api/posts/"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to load posts."
                    );

                }


                const posts =
                    await response.json();


                renderFeatured(
                    posts
                );

                renderLatest(
                    posts
                );


            } catch (error) {

                console.error(error);

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

                loading.style.display =
                    "none";

            }

        }


        /* =================================
           FEATURED
        ================================= */

        function renderFeatured(posts) {

            if (!posts.length) {

                featuredPost.innerHTML = `
                    <div class="home-empty">
                        No published stories yet.
                    </div>
                `;

                return;

            }


            const post =
                posts[0];


            const image =
                post.featured_image
                    ? `
                        <img
                            src="${post.featured_image}"
                            alt="${post.title}"
                        >
                    `
                    : `
                        <div class="featured-placeholder">
                            <i class='bx bx-book-open'></i>
                        </div>
                    `;


            featuredPost.innerHTML = `

                <article class="featured-card">

                    <a
                        href="/blog/${post.slug}/"
                        class="featured-image"
                    >
                        ${image}
                    </a>


                    <div class="featured-content">

                        <div class="post-card-meta">

                            ${
                                post.category_name
                                    ? `
                                        <span class="post-category">
                                            ${post.category_name}
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


                        <h3>

                            <a
                                href="/blog/${post.slug}/"
                            >
                                ${post.title}
                            </a>

                        </h3>


                        <p>
                            ${post.excerpt || ""}
                        </p>


                        <div class="featured-footer">

                            <span>
                                ${post.author_name}
                            </span>

                            <span>
                                <i class='bx bx-show'></i>
                                ${post.views}
                            </span>

                        </div>

                    </div>

                </article>
            `;

        }


        /* =================================
           LATEST
        ================================= */

        function renderLatest(posts) {

            const latest =
                posts.slice(1, 4);


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
                            createPostCard(post)
                    )
                    .join("");

        }


        /* =================================
           POST CARD
        ================================= */

        function createPostCard(post) {

            const image =
                post.featured_image
                    ? `
                        <img
                            src="${post.featured_image}"
                            alt="${post.title}"
                        >
                    `
                    : `
                        <div class="home-card-placeholder">
                            <i class='bx bx-book-open'></i>
                        </div>
                    `;


            return `

                <article class="home-post-card">

                    <a
                        href="/blog/${post.slug}/"
                        class="home-post-image"
                    >

                        ${image}

                    </a>


                    <div class="home-post-body">

                        <div class="post-card-meta">

                            ${
                                post.category_name
                                    ? `
                                        <span class="post-category">
                                            ${post.category_name}
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


                        <h3>

                            <a
                                href="/blog/${post.slug}/"
                            >
                                ${post.title}
                            </a>

                        </h3>


                        <p>
                            ${post.excerpt || ""}
                        </p>


                        <div class="home-post-footer">

                            <span>
                                ${post.author_name}
                            </span>

                            <span>
                                <i class='bx bx-show'></i>
                                ${post.views}
                            </span>

                        </div>

                    </div>

                </article>

            `;

        }


        /* =================================
           DATE
        ================================= */

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


        loadPosts();

    }
);