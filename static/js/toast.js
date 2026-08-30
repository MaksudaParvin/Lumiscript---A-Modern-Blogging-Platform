document.addEventListener(
    "DOMContentLoaded",
    function () {

        const toasts =
            document.querySelectorAll(
                ".toast"
            );


        toasts.forEach(
            function (toast) {

                const closeButton =
                    toast.querySelector(
                        ".toast-close"
                    );


                function removeToast() {

                    if (
                        !toast.classList.contains(
                            "hide"
                        )
                    ) {

                        toast.classList.add(
                            "hide"
                        );


                        setTimeout(
                            function () {

                                toast.remove();

                            },
                            300
                        );

                    }

                }


                /* =========================
                   CLOSE BUTTON
                ========================= */

                if (closeButton) {

                    closeButton.addEventListener(
                        "click",
                        removeToast
                    );

                }


                /* =========================
                   AUTO DISMISS
                ========================= */

                setTimeout(
                    removeToast,
                    4000
                );

            }
        );

    }
);