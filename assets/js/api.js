// Adresa e backend-it ASP.NET Core.
// Ndrysho portën vetëm nëse launchSettings.json përdor një port tjetër.
const API_BASE_URL =
    window.FIZCAL_CONFIG?.apiBaseUrl ||
    "https://localhost:7006/api";

/**
 * Dërgon një kërkesë te API-ja dhe trajton JSON, gabimet dhe JWT.
 *
 * @param {string} endpoint - Për shembull: "/Auth/login"
 * @param {RequestInit} options - Opsionet standarde të fetch().
 * @returns {Promise<any>}
 */
async function apiRequest(endpoint, options = {}) {
    const headers = new Headers(options.headers || {});

    // Request-et me body dërgohen si JSON.
    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // Për endpoint-et e mbrojtura shtojmë JWT automatikisht.
    let response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            credentials: "include",
            headers
        });
    } catch {
        throw new Error(
            "Could not connect to the API. Make sure Visual Studio is running on https://localhost:7006."
        );
    }

    // DELETE mund të kthejë 204 pa response body.
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (response.status === 401) {
        localStorage.removeItem("currentUser");

        const currentPage =
            window.location.pathname.split("/").pop();

        if (
            currentPage !== "login.html" &&
            currentPage !== "register.html"
        ) {
            window.location.replace("login.html");
        }

        throw new Error(
            "Your session expired. Please sign in again."
        );
    }

    if (!response.ok) {
        const message =
            typeof data === "object" && data !== null
                ? data.message || data.title || "Request failed."
                : data || "Request failed.";

        throw new Error(message);
    }

    return data;
}

// E bëjmë funksionin të aksesueshëm nga login.js dhe script-et e tjera.
window.apiRequest = apiRequest;
