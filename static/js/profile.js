document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================
           ARTICLE TABS
        ========================================= */

        const tabs =
            document.querySelectorAll(
                ".article-tab"
            );

        const contents =
            document.querySelectorAll(
                ".article-tab-content"
            );


        tabs.forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        const target =
                            tab.dataset.tab;


                        tabs.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        contents.forEach(
                            content => {

                                content.classList.remove(
                                    "active"
                                );

                            }
                        );


                        tab.classList.add(
                            "active"
                        );


                        const targetContent =
                            document.getElementById(
                                `${target}Articles`
                            );


                        if (targetContent) {

                            targetContent.classList.add(
                                "active"
                            );

                        }

                    }
                );

            }
        );


        /* =========================================
           DELETE MODAL
        ========================================= */

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
            document.querySelector(
                ".delete-modal-overlay"
            );


        let deleteForm = null;


        /* OPEN */

        document.querySelectorAll(
            ".delete-trigger"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteForm =
                            button.closest(
                                ".delete-post-form"
                            );


                        if (!deleteModal) {
                            return;
                        }


                        deleteModal.classList.add(
                            "active"
                        );


                        deleteModal.setAttribute(
                            "aria-hidden",
                            "false"
                        );

                    }
                );

            }
        );


        /* CLOSE */

        function closeDeleteModal() {

            if (!deleteModal) {
                return;
            }


            deleteModal.classList.remove(
                "active"
            );


            deleteModal.setAttribute(
                "aria-hidden",
                "true"
            );


            deleteForm = null;

        }


        /* CANCEL */

        if (deleteModalCancel) {

            deleteModalCancel.addEventListener(
                "click",
                closeDeleteModal
            );

        }


        /* OVERLAY */

        if (deleteModalOverlay) {

            deleteModalOverlay.addEventListener(
                "click",
                closeDeleteModal
            );

        }


        /* CONFIRM */

        if (deleteModalConfirm) {

            deleteModalConfirm.addEventListener(
                "click",
                () => {

                    if (deleteForm) {

                        deleteForm.submit();

                    }

                }
            );

        }


        /* ESC */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    deleteModal &&
                    deleteModal.classList.contains(
                        "active"
                    )
                ) {

                    closeDeleteModal();

                }

            }
        );

    }
);