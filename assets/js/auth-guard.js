document.addEventListener("DOMContentLoaded", async () => {
    try {
        const user = await apiRequest("/Auth/me");
        localStorage.setItem("currentUser", JSON.stringify(user));
    } catch {
        localStorage.removeItem("currentUser");
        window.location.replace("login.html");
    }
});
