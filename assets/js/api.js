// Adresa e backend-it ASP.NET Core.
// Ndrysho portën vetëm nëse launchSettings.json përdor një port tjetër.
const API_BASE_URL = "https://localhost:7006/api";

/**
 * Dërgon një kërkesë te API-ja dhe trajton JSON, gabimet dhe JWT.
 *
 * @param {string} endpoint - Për shembull: "/Auth/login"
 * @param {RequestInit} options - Opsionet standarde të fetch().
 * @returns {Promise<any>}
 */
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("accessToken");
    const headers = new Headers(options.headers || {});

    // Request-et me body dërgohen si JSON.
    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // Për endpoint-et e mbrojtura shtojmë JWT automatikisht.
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
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
