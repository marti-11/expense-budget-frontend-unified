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
        const successElement = document.getElementById("profile-success");

        const editButton = document.getElementById("profile-edit");
        const editPanel = document.getElementById("profile-edit-panel");
        const editForm = document.getElementById("profile-edit-form");
        const closeEditButton = document.getElementById("profile-edit-close");
        const cancelButton = document.getElementById("profile-cancel");
        const saveButton = document.getElementById("profile-save");
        const firstNameInput = document.getElementById("profile-edit-first-name");
        const lastNameInput = document.getElementById("profile-edit-last-name");
        const phoneInput = document.getElementById("profile-edit-phone");
        const currencyInput = document.getElementById("profile-edit-currency");
        const imageFileInput = document.getElementById("profile-edit-image-file");
        let currentProfile = null;

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

        editButton?.addEventListener("click", openEditor);
        closeEditButton?.addEventListener("click", closeEditor);
        cancelButton?.addEventListener("click", closeEditor);
        editForm?.addEventListener("submit", saveProfile);
        imageFileInput?.addEventListener("change", previewProfileImage);

        async function loadProfile() {
            hideError();
            setLoadingState(true);

            try {
                const profile =
                    await apiRequest("/Auth/me");

                renderProfile(profile);

                currentProfile = profile;

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

        function openEditor() {
            if (!currentProfile || !editPanel) return;

            firstNameInput.value = cleanValue(currentProfile.firstName);
            lastNameInput.value = cleanValue(currentProfile.lastName);
            phoneInput.value = cleanValue(currentProfile.phoneNumber);
            currencyInput.value = cleanValue(currentProfile.currency) || "EUR";
            imageFileInput.value = "";
            editPanel.classList.remove("hidden");
            editPanel.scrollIntoView({ behavior: "smooth", block: "center" });
            firstNameInput.focus();
            hideSuccess();
        }

        function closeEditor() {
            editPanel?.classList.add("hidden");
            hideError();

            if (currentProfile) {
                renderProfile(currentProfile);
            }
        }

        function previewProfileImage() {
            const file = imageFileInput.files?.[0];
            if (!file) {
                renderProfile(currentProfile);
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                showError("Photo must be smaller than 2 MB.");
                imageFileInput.value = "";
                return;
            }

            renderProfileImage(
                URL.createObjectURL(file),
                firstNameInput.value.trim(),
                lastNameInput.value.trim()
            );
        }

        async function saveProfile(event) {
            event.preventDefault();
            hideError();

            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();

            if (!firstName || !lastName) {
                showError("First name and last name are required.");
                return;
            }

            if (!editForm.checkValidity()) {
                editForm.reportValidity();
                return;
            }

            saveButton.disabled = true;
            saveButton.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Saving...';

            try {
                let updatedProfile = await apiRequest("/Auth/me", {
                    method: "PUT",
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        phoneNumber: phoneInput.value.trim() || null,
                        currency: currencyInput.value,
                        profileImageUrl: currentProfile.profileImageUrl || null
                    })
                });

                const photo = imageFileInput.files?.[0];
                if (photo) {
                    const formData = new FormData();
                    formData.append("photo", photo);
                    updatedProfile = await apiRequest("/Auth/profile-photo", {
                        method: "POST",
                        body: formData
                    });
                }

                currentProfile = updatedProfile;
                renderProfile(updatedProfile);
                saveCurrentUser(updatedProfile);
                closeEditor();
                showSuccess("✨ Profile updated — your new vibe is live!");
            } catch (error) {
                showError(error.message);
            } finally {
                saveButton.disabled = false;
                saveButton.innerHTML = '<span class="material-symbols-outlined">save</span> Save Changes';
            }
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
            if (!editButton) return;
            editButton.disabled = isLoading;
            editButton.setAttribute("aria-busy", String(isLoading));
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

        function showSuccess(message) {
            if (!successElement) return;
            successElement.textContent = message;
            successElement.classList.remove("hidden");
            window.setTimeout(hideSuccess, 5000);
        }

        function hideSuccess() {
            if (!successElement) return;
            successElement.textContent = "";
            successElement.classList.add("hidden");
        }
    }
);
