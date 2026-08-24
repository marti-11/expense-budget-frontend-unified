const isLocalFrontend =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

window.FIZCAL_CONFIG = {
    apiBaseUrl: isLocalFrontend
        ? "http://127.0.0.1:5287/api"
        : "https://expensebudget-api.onrender.com/api"
};

// Add verified business partners here. Never list a business as a partner
// without permission. Every configured offer is labelled Sponsored.
window.FIZCAL_PARTNERS = [];
