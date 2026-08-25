document.addEventListener(
    "DOMContentLoaded",
    () => {

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

    }
);