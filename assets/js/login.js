// Merr elementet pasi HTML-ja është ngarkuar.
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorElement = document.getElementById("login-error");
    const submitButton = document.getElementById("login-submit");

    // Nëse ndonjë element mungon, ndalemi që të shmangim gabime JavaScript.
    if (!form || !emailInput || !passwordInput || !errorElement || !submitButton) {
        console.error("Login form elements were not found.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        // Ndalon rifreskimin normal të faqes.
        event.preventDefault();

        // Pastron mesazhin e mëparshëm.
        errorElement.textContent = "";
        errorElement.classList.add("hidden");

        // Parandalon klikimet e shumëfishta gjatë kërkesës.
        submitButton.disabled = true;
        submitButton.textContent = "Checking your keys...";

        try {
            // Dërgon email-in dhe password-in te ASP.NET Core API.
            const response = await apiRequest("/Auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                })
            });

            // JWT përdoret më vonë për Categories, Transactions dhe Budgets.
            localStorage.setItem("accessToken", response.token);

            // Ruajmë vetëm të dhënat publike të përdoruesit, jo password-in.
            localStorage.setItem(
                "currentUser",
                JSON.stringify({
                    id: response.id,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    phoneNumber: response.phoneNumber,
                    profileImageUrl: response.profileImageUrl,
                    currency: response.currency
                })
            );

            // Redirect vetëm pasi login-i ka dalë me sukses.
            window.location.href = "home-base.html";
        } catch (error) {
            // Shfaq mesazhin e kthyer nga API-ja.
            errorElement.textContent =
                error instanceof Error
                    ? error.message
                    : "Login failed. Please try again.";

            errorElement.classList.remove("hidden");
        } finally {
            // Riaktivizon butonin edhe kur kërkesa dështon.
            submitButton.disabled = false;
            submitButton.innerHTML =
                'Let Me In! 🎢 <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>';
        }
    });
});
