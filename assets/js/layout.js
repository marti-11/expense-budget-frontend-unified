(function () {
    // Faqet që shfaqen në navbar.
    const pages = [
    {
        file: "home-base.html",
        label: "Home Base",
        shortLabel: "Home",
        icon: "home"
    },
    {
        file: "money-jails.html",
        label: "Money Jails",
        shortLabel: "Budgets",
        icon: "lock"
    },
    {
        file: "spending-spree.html",
        label: "Spending Spree",
        shortLabel: "Spending",
        icon: "receipt_long"
    },
    {
        file: "my-face.html",
        label: "My Face",
        shortLabel: "My Face",
        icon: "face"
    }
];
    // Merr emrin e faqes aktuale.
    function currentFile() {
        const file = window.location.pathname.split("/").pop();

        return file || "index.html";
    }

    // Kontrollon nëse linku i navbar-it është faqja aktuale.
    function isActive(file) {
        return currentFile() === file;
    }

    // Krijon linket e navbar-it për desktop dhe mobile.
    function navLinks(mobile) {
        return pages
            .map(function (page) {
                const active = isActive(page.file)
                    ? " is-active"
                    : "";

                if (mobile) {
                    return (
                        '<a class="ff-mobile-link' +
                        active +
                        '" href="' +
                        page.file +
                        '">' +
                        '<span class="material-symbols-outlined">' +
                        page.icon +
                        "</span>" +
                        "<span>" +
                        page.shortLabel +
                        "</span>" +
                        "</a>"
                    );
                }

                return (
                    '<a class="ff-nav-link' +
                    active +
                    '" href="' +
                    page.file +
                    '">' +
                    page.label +
                    "</a>"
                );
            })
            .join("");
    }

    // Krijon header-in dhe navbar-in.
    function renderLayout() {
        const headerTarget =
            document.getElementById("app-header");

        const navbarTarget =
            document.getElementById("app-navbar");

        if (headerTarget) {
            headerTarget.innerHTML =
                '<header class="ff-app-header">' +
                    '<div class="ff-header-inner">' +

                        // Logo dhe emri i aplikacionit.
                        '<a class="ff-brand" ' +
                            'href="home-base.html" ' +
                            'aria-label="Fizcal Funhouse home">' +
                            '<span class="material-symbols-outlined">' +
                                "account_balance" +
                            "</span>" +
                            "<span>Fizcal Funhouse</span>" +
                        "</a>" +

                        // Navbar për desktop.
                        '<nav class="ff-desktop-nav" ' +
                            'aria-label="Main navigation">' +
                            navLinks(false) +
                        "</nav>" +

                        // Butonat në anën e djathtë të header-it.
                        '<div class="ff-header-actions">' +

                            '<a class="ff-icon-link notifications-link" ' +
                                'href="#" ' +
                                'aria-label="Notifications">' +
                                '<span class="material-symbols-outlined">' +
                                    "notifications" +
                                "</span>" +
                            "</a>" +

                            '<a class="ff-icon-link profile-link' +
                                (isActive("my-face.html")
                                    ? " is-active"
                                    : "") +
                                '" href="my-face.html" ' +
                                'aria-label="Open My Face profile">' +
                                '<span class="material-symbols-outlined">' +
                                    "face" +
                                "</span>" +
                            "</a>" +

                            // data-logout përdoret nga eventi i logout-it.
                            '<a class="ff-icon-link logout-link" ' +
                                'href="login.html" ' +
                                'data-logout ' +
                                'aria-label="Sign out">' +
                                '<span class="material-symbols-outlined">' +
                                    "logout" +
                                "</span>" +
                            "</a>" +

                        "</div>" +
                    "</div>" +
                "</header>";
        }

        if (navbarTarget) {
            navbarTarget.innerHTML =
                '<nav class="ff-mobile-nav" ' +
                    'aria-label="Mobile navigation">' +
                    navLinks(true) +
                "</nav>";
        }
    }

    // Krijon layout-in pasi HTML-ja është ngarkuar.
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            renderLayout
        );
    } else {
        renderLayout();
    }

    // Logout-i funksionon edhe pse butoni krijohet dinamikisht.
    document.addEventListener("click", function (event) {
        const logoutButton =
            event.target.closest("[data-logout]");

        if (!logoutButton) {
            return;
        }

        // Ndalon hapjen normale të linkut.
        event.preventDefault();

        // Fshin JWT dhe informacionin e përdoruesit.
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");

        // Kthen përdoruesin te faqja e login-it.
        window.location.replace("login.html");
    });
})();