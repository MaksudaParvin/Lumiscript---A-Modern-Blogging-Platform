document.addEventListener("DOMContentLoaded", () => {

    const profileDropdown =
        document.querySelector(".profile-dropdown");

    const profileTrigger =
        document.getElementById("profileTrigger");

    const profileMenu =
        document.getElementById("profileMenu");


    // If user is logged out, dropdown doesn't exist
    if (
        !profileDropdown ||
        !profileTrigger ||
        !profileMenu
    ) {
        return;
    }


    // ========================================
    // OPEN / CLOSE DROPDOWN
    // ========================================

    profileTrigger.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen =
            profileDropdown.classList.toggle("open");

        profileTrigger.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    // ========================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ========================================

    document.addEventListener("click", (event) => {

        if (
            !profileDropdown.contains(event.target)
        ) {

            profileDropdown.classList.remove("open");

            profileTrigger.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    // ========================================
    // CLOSE WITH ESCAPE
    // ========================================

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            profileDropdown.classList.remove("open");

            profileTrigger.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

});