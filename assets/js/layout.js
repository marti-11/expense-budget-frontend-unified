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

                            '<button class="ff-icon-link notifications-link" ' +
                                'type="button" data-notifications ' +
                                'aria-expanded="false" aria-label="Notifications">' +
                                '<span class="material-symbols-outlined">' +
                                    "notifications" +
                                "</span><span class=\"ff-notification-badge\">5</span>" +
                            "</button>" +

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

            // Keep the floating panel outside the header stacking context so
            // page cards can never paint over it.
            document.querySelector("[data-notification-panel]")?.remove();
            document.body.insertAdjacentHTML(
                "beforeend",
                notificationPanel()
            );
            loadDatabaseNotifications();

            if (localStorage.getItem("notificationsRead") === "true") {
                headerTarget.querySelector(".ff-notification-badge")?.remove();
            }
        }

        if (navbarTarget) {
            navbarTarget.innerHTML =
                '<nav class="ff-mobile-nav" ' +
                    'aria-label="Mobile navigation">' +
                    navLinks(true) +
                "</nav>";
        }
    }

    function notificationPanel(databaseMessages) {
        const allMessages = Array.isArray(databaseMessages)
            ? databaseMessages
            : (window.FIZCAL_NOTIFICATIONS || []);
        const daySeed = Math.floor(Date.now() / 86400000);
        const messages = Array.isArray(databaseMessages)
            ? allMessages.slice(0, 20)
            : Array.from({ length: 5 }, function (_, position) {
                return allMessages[(daySeed * 7 + position * 97) % allMessages.length];
            }).filter(Boolean);

        const items = messages.length
            ? messages.map(function (item, index) {
                const url = safeNotificationUrl(item.url);
                return '<div class="ff-notification-item' +
                    (index >= 3 ? ' ff-notification-extra' : '') +
                    '"><span aria-hidden="true">' +
                    escapeHtml(item.emoji) +
                    '</span><div><strong>' + escapeHtml(item.title) + '</strong>' +
                    (item.sponsored ? '<small class="ff-sponsored">Sponsored</small>' : '') +
                    '<p>' + escapeHtml(item.message) + '</p>' +
                    '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' +
                    escapeHtml(item.actionLabel) + ' &nearr;</a></div></div>';
            }).join("")
            : '<p class="ff-notification-empty">No money mischief today — check back tomorrow ✨</p>';

        return '<aside class="ff-notification-panel" data-notification-panel hidden ' +
            'role="dialog" aria-label="Notifications" tabindex="-1">' +
            '<div class="ff-notification-heading"><div class="ff-notification-title-row"><div><strong>Money smiles</strong></div>' +
            '<button class="ff-notification-close" type="button" data-close-notifications aria-label="Close notifications">' +
            '<span class="material-symbols-outlined">close</span></button></div>' +
            '<div class="ff-notification-sub-row"><small>Easy tips with a cheeky twist</small>' +
            '<button type="button" data-mark-read>Mark all read</button></div></div>' +
            items + '<button class="ff-notification-see-all" type="button" data-see-all-notifications>' +
            'See all notifications</button></aside>';
    }

    async function loadDatabaseNotifications() {
        if (typeof apiRequest !== "function") return;
        try {
            const messages = await apiRequest("/Notifications");
            const currentPanel = document.querySelector("[data-notification-panel]");
            if (!currentPanel || !Array.isArray(messages)) return;
            currentPanel.outerHTML = notificationPanel(messages);
            const unreadCount = messages.filter(item => !item.isRead).length;
            document.querySelectorAll(".ff-notification-badge").forEach(badge => {
                if (unreadCount === 0) badge.remove();
                else badge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
            });
        } catch {
            // The local curated notifications remain available while offline.
        }
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function safeNotificationUrl(value) {
        try {
            const url = new URL(String(value || "#"), window.location.href);
            return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
        } catch {
            return "#";
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
    document.addEventListener("click", async function (event) {
        const notificationButton = event.target.closest("[data-notifications]");
        const notificationPanelElement = document.querySelector("[data-notification-panel]");

        if (notificationButton && notificationPanelElement) {
            const willOpen = notificationPanelElement.hidden;
            notificationPanelElement.hidden = !willOpen;
            notificationButton.setAttribute("aria-expanded", String(willOpen));
            if (willOpen) notificationPanelElement.focus();
            return;
        }

        if (event.target.closest("[data-mark-read]")) {
            document.querySelectorAll(".ff-notification-badge")
                .forEach(badge => badge.remove());
            localStorage.setItem("notificationsRead", "true");
            try {
                await apiRequest("/Notifications/read-all", { method: "PUT" });
            } catch {
                // The local read state still works while offline.
            }
            return;
        }

        if (event.target.closest("[data-close-notifications]") && notificationPanelElement) {
            closeNotifications(notificationPanelElement);
            return;
        }

        if (event.target.closest("[data-see-all-notifications]") && notificationPanelElement) {
            notificationPanelElement.classList.add("is-expanded");
            event.target.closest("[data-see-all-notifications]").hidden = true;
            return;
        }

        if (notificationPanelElement && !notificationPanelElement.hidden &&
            !event.target.closest("[data-notification-panel]")) {
            closeNotifications(notificationPanelElement);
        }

        const logoutButton =
            event.target.closest("[data-logout]");

        if (!logoutButton) {
            return;
        }

        // Ndalon hapjen normale të linkut.
        event.preventDefault();

        // Fshin JWT dhe informacionin e përdoruesit.
        localStorage.removeItem("currentUser");

        try {
            await apiRequest("/Auth/logout", { method: "POST" });
        } catch {
            // Continue logout even if the API is unavailable.
        }

        // Kthen përdoruesin te faqja e login-it.
        window.location.replace("login.html");
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        const panel = document.querySelector("[data-notification-panel]");
        if (panel && !panel.hidden) closeNotifications(panel);
    });

    function closeNotifications(panel) {
        panel.hidden = true;
        panel.classList.remove("is-expanded");
        const seeAll = panel.querySelector("[data-see-all-notifications]");
        if (seeAll) seeAll.hidden = false;
        const button = document.querySelector("[data-notifications]");
        button?.setAttribute("aria-expanded", "false");
        button?.focus();
    }
})();
