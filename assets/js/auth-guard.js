document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        window.location.replace("index.html");
    }
});