document.addEventListener(
    "DOMContentLoaded",
    async () => {
        const fullNameElement =
            document.getElementById(
                "profile-full-name"
            );

        const mainEmailElement =
            document.getElementById(
                "profile-email"
            );

        const firstNameElement =
            document.getElementById(
                "profile-first-name"
            );

        const lastNameElement =
            document.getElementById(
                "profile-last-name"
            );

        const emailDetailElement =
            document.getElementById(
                "profile-email-detail"
            );

        const phoneElement =
            document.getElementById(
                "profile-phone"
            );

        const currencyElement =
            document.getElementById(
                "profile-currency"
            );

        const userIdElement =
            document.getElementById(
                "profile-user-id"
            );

        const profileImageElement =
            document.getElementById(
                "profile-image"
            );

        const initialsElement =
            document.getElementById(
                "profile-initials"
            );

        const errorElement =
            document.getElementById(
                "profile-error"
            );

        const refreshButton =
            document.getElementById(
                "profile-refresh"
            );

        if (
            !fullNameElement ||
            !firstNameElement ||
            !lastNameElement ||
            !emailDetailElement
        ) {
            console.error(
                "Profile HTML elements are missing."
            );

            return;
        }

        await loadProfile();

        refreshButton?.addEventListener(
            "click",
            loadProfile
        );

        async function loadProfile() {
            hideError();
            setLoadingState(true);

            try {
                const profile =
                    await apiRequest("/Auth/me");

                renderProfile(profile);

                saveCurrentUser(profile);
            } catch (error) {
                showError(error.message);
            } finally {
                setLoadingState(false);
            }
        }

        function renderProfile(profile) {
            const firstName =
                cleanValue(
                    profile.firstName ??
                    profile.name
                );

            const lastName =
                cleanValue(
                    profile.lastName
                );

            const email =
                cleanValue(
                    profile.email
                );

            const phoneNumber =
                cleanValue(
                    profile.phoneNumber ??
                    profile.phone
                );

            const currency =
                cleanValue(
                    profile.currency
                ) || "EUR";

            const userId =
                cleanValue(
                    profile.id ??
                    profile.userId
                );

            const profileImageUrl =
                cleanValue(
                    profile.profileImageUrl ??
                    profile.imageUrl
                );

            const fullName =
                [firstName, lastName]
                    .filter(Boolean)
                    .join(" ") ||
                "User";

            fullNameElement.textContent =
                fullName;

            mainEmailElement.textContent =
                email || "No email available";

            firstNameElement.textContent =
                firstName || "Not provided";

            lastNameElement.textContent =
                lastName || "Not provided";

            emailDetailElement.textContent =
                email || "Not provided";

            phoneElement.textContent =
                phoneNumber || "Not provided";

            currencyElement.textContent =
                currency;

            userIdElement.textContent =
                userId || "Not available";

            renderProfileImage(
                profileImageUrl,
                firstName,
                lastName
            );
        }

        function renderProfileImage(
            imageUrl,
            firstName,
            lastName
        ) {
            const initials =
                createInitials(
                    firstName,
                    lastName
                );

            initialsElement.textContent =
                initials;

            if (!imageUrl) {
                profileImageElement.classList.add(
                    "hidden"
                );

                initialsElement.classList.remove(
                    "hidden"
                );

                profileImageElement.removeAttribute(
                    "src"
                );

                return;
            }

            profileImageElement.onload =
                function () {
                    profileImageElement.classList.remove(
                        "hidden"
                    );

                    initialsElement.classList.add(
                        "hidden"
                    );
                };

            profileImageElement.onerror =
                function () {
                    profileImageElement.classList.add(
                        "hidden"
                    );

                    initialsElement.classList.remove(
                        "hidden"
                    );

                    profileImageElement.removeAttribute(
                        "src"
                    );
                };

            profileImageElement.src =
                imageUrl;
        }

        function createInitials(
            firstName,
            lastName
        ) {
            const firstInitial =
                firstName
                    ? firstName.charAt(0)
                    : "";

            const lastInitial =
                lastName
                    ? lastName.charAt(0)
                    : "";

            const initials =
                (
                    firstInitial +
                    lastInitial
                ).toUpperCase();

            return initials || "?";
        }

        function saveCurrentUser(profile) {
            try {
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(profile)
                );
            } catch (error) {
                console.error(
                    "Could not update currentUser:",
                    error
                );
            }
        }

        function cleanValue(value) {
            if (
                value === null ||
                value === undefined
            ) {
                return "";
            }

            const stringValue =
                String(value).trim();

            if (
                stringValue === "" ||
                stringValue.toLowerCase() ===
                    "null" ||
                stringValue.toLowerCase() ===
                    "undefined"
            ) {
                return "";
            }

            return stringValue;
        }

        function setLoadingState(isLoading) {
            if (!refreshButton) {
                return;
            }

            refreshButton.disabled =
                isLoading;

            refreshButton.innerHTML =
                isLoading
                    ? `
                        <span
                            class="material-symbols-outlined
                                   animate-spin"
                        >
                            progress_activity
                        </span>

                        Loading...
                    `
                    : `
                        <span
                            class="material-symbols-outlined"
                        >
                            refresh
                        </span>

                        Refresh Profile
                    `;
        }

        function showError(message) {
            console.error(
                "Profile error:",
                message
            );

            if (!errorElement) {
                return;
            }

            errorElement.textContent =
                message ||
                "Profile data could not be loaded.";

            errorElement.classList.remove(
                "hidden"
            );
        }

        function hideError() {
            if (!errorElement) {
                return;
            }

            errorElement.textContent = "";

            errorElement.classList.add(
                "hidden"
            );
        }
    }
);