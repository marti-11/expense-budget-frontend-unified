document.addEventListener("DOMContentLoaded", () => {
    const form =
        document.getElementById("register-form");

    const firstNameInput =
        document.getElementById(
            "register-first-name"
        );

    const lastNameInput =
        document.getElementById(
            "register-last-name"
        );

    const emailInput =
        document.getElementById(
            "register-email"
        );

    const phoneInput =
        document.getElementById(
            "register-phone"
        );

    const imageUrlInput =
        document.getElementById(
            "register-image-url"
        );

    const passwordInput =
        document.getElementById(
            "register-password"
        );

    const confirmPasswordInput =
        document.getElementById(
            "register-confirm-password"
        );

    const errorElement =
        document.getElementById(
            "register-error"
        );

    const successElement =
        document.getElementById(
            "register-success"
        );

    const submitButton =
        document.getElementById(
            "register-submit"
        );

    if (!form) {
        return;
    }

    redirectAuthenticatedUser();

    form.addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            hideMessages();

            const firstName =
                firstNameInput.value.trim();

            const lastName =
                lastNameInput.value.trim();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const phoneNumber =
                cleanOptionalValue(
                    phoneInput.value
                );

            const imageUrl =
                cleanOptionalValue(
                    imageUrlInput.value
                );

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;

            if (
                !firstName ||
                !lastName ||
                !email ||
                !password
            ) {
                showError(
                    "Please complete all required fields."
                );

                return;
            }

            if (password.length < 6) {
                showError(
                    "Password must contain at least 6 characters."
                );

                return;
            }

            if (
                password !==
                confirmPassword
            ) {
                showError(
                    "Passwords do not match."
                );

                return;
            }

            setLoading(true);

            try {
                const registerResponse =
                    await apiRequest(
                        "/Auth/register",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                firstName:
                                    firstName,

                                lastName:
                                    lastName,

                                email:
                                    email,

                                password:
                                    password,

                                phoneNumber:
                                    phoneNumber,
                                profileImageUrl:
                                    imageUrl
                            })
                        }
                    );

                /*
                 * Nëse endpoint-i register
                 * kthen direkt token.
                 */
                if (registerResponse?.token) {
                    saveAuthentication(
                        registerResponse
                    );

                    showSuccess(
                        "Account created successfully. Opening dashboard..."
                    );

                    redirectToDashboard();

                    return;
                }

                /*
                 * Nëse register nuk kthen token,
                 * bëjmë login automatikisht.
                 */
                const loginResponse =
                    await apiRequest(
                        "/Auth/login",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                email:
                                    email,

                                password:
                                    password
                            })
                        }
                    );

                if (!loginResponse?.token) {
                    throw new Error(
                        "Account was created, but automatic login failed."
                    );
                }

                saveAuthentication(
                    loginResponse
                );

                showSuccess(
                    "Account created successfully. Opening dashboard..."
                );

                redirectToDashboard();
            } catch (error) {
                showError(
                    error.message ||
                    "Registration failed."
                );
            } finally {
                setLoading(false);
            }
        }
    );

    document.addEventListener(
        "click",
        event => {
            const toggleButton =
                event.target.closest(
                    "[data-toggle-password]"
                );

            if (!toggleButton) {
                return;
            }

            const inputId =
                toggleButton.dataset
                    .togglePassword;

            const passwordField =
                document.getElementById(
                    inputId
                );

            if (!passwordField) {
                return;
            }

            const showPassword =
                passwordField.type ===
                "password";

            passwordField.type =
                showPassword
                    ? "text"
                    : "password";

            const icon =
                toggleButton.querySelector(
                    ".material-symbols-outlined"
                );

            if (icon) {
                icon.textContent =
                    showPassword
                        ? "visibility_off"
                        : "visibility";
            }
        }
    );

    function saveAuthentication(
        response
    ) {
        localStorage.setItem(
            "accessToken",
            response.token
        );

        const user =
            response.user || {
                id:
                    response.id ??
                    response.userId,

                firstName:
                    response.firstName,

                lastName:
                    response.lastName,

                email:
                    response.email,

                phoneNumber:
                    response.phoneNumber,

                profileImageUrl:
                    response.profileImageUrl ??
                    response.imageUrl,

                currency:
                    response.currency ??
                    "EUR"
            };

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );
    }

    function redirectToDashboard() {
        window.setTimeout(() => {
            window.location.replace(
                "home-base.html"
            );
        }, 700);
    }

    function redirectAuthenticatedUser() {
        const token =
            localStorage.getItem(
                "accessToken"
            );

        if (token) {
            window.location.replace(
                "home-base.html"
            );
        }
    }

    function cleanOptionalValue(value) {
        const cleanedValue =
            String(value || "").trim();

        return cleanedValue || null;
    }

    function setLoading(isLoading) {
        submitButton.disabled =
            isLoading;

        submitButton.textContent =
            isLoading
                ? "Creating Account..."
                : "Create Account";
    }

    function showError(message) {
        errorElement.textContent =
            message;

        errorElement.classList.remove(
            "hidden"
        );

        successElement.classList.add(
            "hidden"
        );
    }

    function showSuccess(message) {
        successElement.textContent =
            message;

        successElement.classList.remove(
            "hidden"
        );

        errorElement.classList.add(
            "hidden"
        );
    }

    function hideMessages() {
        errorElement.textContent = "";
        successElement.textContent = "";

        errorElement.classList.add(
            "hidden"
        );

        successElement.classList.add(
            "hidden"
        );
    }
});