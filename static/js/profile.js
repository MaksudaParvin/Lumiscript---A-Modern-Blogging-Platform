document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           ARTICLE TABS
        ===================================================== */

        const tabs =
            document.querySelectorAll(
                ".article-tab"
            );

        const contents =
            document.querySelectorAll(
                ".article-tab-content"
            );


        function activateTab(
            selectedTab
        ) {

            if (!selectedTab) {
                return;
            }


            /*
             * Remove active from all tabs
             */

            tabs.forEach(
                function (tab) {

                    tab.classList.remove(
                        "active"
                    );

                }
            );


            /*
             * Hide all article sections
             */

            contents.forEach(
                function (content) {

                    content.classList.remove(
                        "active"
                    );

                }
            );


            /*
             * Activate selected tab
             */

            const selectedButton =
                document.querySelector(
                    `.article-tab[data-tab="${selectedTab}"]`
                );


            if (selectedButton) {

                selectedButton.classList.add(
                    "active"
                );

            }


            /*
             * Find corresponding article section
             *
             * all      -> allArticles
             * published -> publishedArticles
             * drafts    -> draftsArticles
             */

            const targetContent =
                document.getElementById(
                    `${selectedTab}Articles`
                );


            if (targetContent) {

                targetContent.classList.add(
                    "active"
                );

            }


            /*
             * Remember selected tab
             */

            try {

                sessionStorage.setItem(
                    "profileArticleTab",
                    selectedTab
                );

            } catch (error) {

                console.warn(
                    "Unable to save profile tab:",
                    error
                );

            }

        }



        /*
         * Tab click
         */

        tabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        const selectedTab =
                            this.dataset.tab;


                        activateTab(
                            selectedTab
                        );

                    }
                );

            }
        );



        /*
         * Restore selected tab after reload
         */

        let savedTab = null;


        try {

            savedTab =
                sessionStorage.getItem(
                    "profileArticleTab"
                );

        } catch (error) {

            savedTab = null;

        }



        /*
         * Only restore if the section actually exists.
         */

        if (
            savedTab &&
            document.getElementById(
                `${savedTab}Articles`
            )
        ) {

            activateTab(
                savedTab
            );

        } else if (
            document.getElementById(
                "allArticles"
            )
        ) {

            activateTab(
                "all"
            );

        } else if (
            tabs.length > 0
        ) {

            activateTab(
                tabs[0].dataset.tab
            );

        }



        /* =====================================================
           DELETE MODAL
        ===================================================== */

        const deleteModal =
            document.getElementById(
                "deleteModal"
            );


        const deleteModalCancel =
            document.getElementById(
                "deleteModalCancel"
            );


        const deleteModalConfirm =
            document.getElementById(
                "deleteModalConfirm"
            );


        const deleteModalOverlay =
            deleteModal
                ? deleteModal.querySelector(
                    ".delete-modal-overlay"
                )
                : null;


        let currentDeleteForm =
            null;



        /* =====================================================
           OPEN DELETE MODAL
        ===================================================== */

        function openDeleteModal(
            form
        ) {

            if (
                !deleteModal ||
                !form
            ) {

                return;

            }


            currentDeleteForm =
                form;


            /*
             * Use BOTH classes so existing CSS
             * using either .show or .active
             * will not break.
             */

            deleteModal.classList.add(
                "show"
            );

            deleteModal.classList.add(
                "active"
            );


            deleteModal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "delete-modal-open"
            );

        }



        /* =====================================================
           CLOSE DELETE MODAL
        ===================================================== */

        function closeDeleteModal() {

            if (!deleteModal) {
                return;
            }


            deleteModal.classList.remove(
                "show"
            );

            deleteModal.classList.remove(
                "active"
            );


            deleteModal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.classList.remove(
                "delete-modal-open"
            );


            currentDeleteForm =
                null;

        }



        /* =====================================================
           DELETE BUTTON
        ===================================================== */

        document.addEventListener(
            "click",
            function (event) {

                const deleteButton =
                    event.target.closest(
                        ".delete-trigger"
                    );


                if (!deleteButton) {
                    return;
                }


                const form =
                    deleteButton.closest(
                        ".delete-post-form"
                    );


                if (!form) {
                    return;
                }


                /*
                 * Do not open the article
                 * when delete is clicked.
                 */

                event.preventDefault();

                event.stopPropagation();


                openDeleteModal(
                    form
                );

            }
        );



        /* =====================================================
           CANCEL DELETE
        ===================================================== */

        if (deleteModalCancel) {

            deleteModalCancel.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closeDeleteModal();

                }
            );

        }



        /* =====================================================
           CLICK OUTSIDE MODAL
        ===================================================== */

        if (deleteModalOverlay) {

            deleteModalOverlay.addEventListener(
                "click",
                function () {

                    closeDeleteModal();

                }
            );

        }



        /* =====================================================
           CONFIRM DELETE
        ===================================================== */

        if (deleteModalConfirm) {

            deleteModalConfirm.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    if (
                        !currentDeleteForm
                    ) {

                        return;

                    }


                    /*
                     * Keep the original Django
                     * POST form.
                     */

                    currentDeleteForm.submit();

                }
            );

        }



        /* =====================================================
           ESCAPE KEY
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    deleteModal &&
                    (
                        deleteModal.classList.contains(
                            "show"
                        ) ||
                        deleteModal.classList.contains(
                            "active"
                        )
                    )
                ) {

                    closeDeleteModal();

                }

            }
        );



        /* =====================================================
           DELETE MODAL - ENTER KEY
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    deleteModal &&
                    (
                        deleteModal.classList.contains(
                            "show"
                        ) ||
                        deleteModal.classList.contains(
                            "active"
                        )
                    ) &&
                    currentDeleteForm
                ) {

                    /*
                     * Prevent accidental form submission
                     * when focus is somewhere else.
                     */

                    if (
                        document.activeElement ===
                        deleteModalConfirm
                    ) {

                        return;

                    }

                }

            }
        );



        /* =====================================================
           ARTICLE ACTION BUTTONS
        ===================================================== */

        /*
         * Prevent View/Edit/Delete buttons from
         * triggering parent card links.
         */

        document.addEventListener(
            "click",
            function (event) {

                const action =
                    event.target.closest(
                        ".article-action"
                    );


                if (!action) {
                    return;
                }


                event.stopPropagation();

            }
        );



        /* =====================================================
           IMAGE ERROR HANDLING
        ===================================================== */

        const profileImages =
            document.querySelectorAll(
                ".profile-article-image img, .article-card-image img, .bookmark-image img"
            );


        profileImages.forEach(
            function (image) {

                image.addEventListener(
                    "error",
                    function () {

                        this.style.display =
                            "none";

                    }
                );

            }
        );

    }
);