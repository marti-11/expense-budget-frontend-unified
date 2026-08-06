const { test, expect } = require("@playwright/test");

const profile = {
  id: 1,
  firstName: "Martina",
  lastName: "Nezha",
  email: "martina@example.com",
  phoneNumber: "0683931485",
  currency: "EUR",
  profileImageUrl: null
};

async function mockProfileApi(page) {
  await page.route("**/api/Auth/me", async route => {
    if (route.request().method() === "PUT") {
      const update = route.request().postDataJSON();
      await route.fulfill({ json: { ...profile, ...update } });
      return;
    }
    await route.fulfill({ json: profile });
  });
}

test("login submits credentials and opens the dashboard", async ({ page }) => {
  await page.route("**/api/Auth/login", route => route.fulfill({ json: profile }));
  await mockProfileApi(page);
  await page.route("**/api/Dashboard**", route => route.fulfill({ json: {
    totalIncome: 0, totalExpenses: 0, balance: 0, budgetRemaining: 0,
    categorySpending: [], recentTransactions: []
  }}));

  await page.goto("/login.html");
  await page.getByLabel("Electronic Mail Address").fill("martina@example.com");
  await page.getByLabel("The Secret Code").fill("StrongPass123!");
  await page.locator("#login-submit").click();
  await expect(page).toHaveURL(/home-base\.html/);

  const mobileFabClearance = await page.evaluate(() => {
    const fab = document.querySelector(".ff-fab");
    const nav = document.querySelector(".ff-mobile-nav");
    if (!fab || !nav || nav.offsetParent === null) return null;
    return Math.round(nav.getBoundingClientRect().top - fab.getBoundingClientRect().bottom);
  });
  if (mobileFabClearance !== null) expect(mobileFabClearance).toBeGreaterThanOrEqual(16);
});

test("profile can be edited with clear success feedback", async ({ page }) => {
  await mockProfileApi(page);
  await page.goto("/my-face.html");

  await page.getByRole("button", { name: "Edit my vibe ✨" }).click();
  await page.getByLabel("First name").fill("Martina Updated");
  await page.getByLabel("Phone number").fill("+355 68 123 4567");
  await page.getByLabel("Currency").selectOption("ALL");
  await page.getByRole("button", { name: "Save Changes" }).click();

  await expect(page.getByRole("status")).toContainText("Profile updated");
  await expect(page.locator("#profile-first-name")).toHaveText("Martina Updated");
  await expect(page.locator("#profile-currency")).toHaveText("ALL");
});

test("notifications open above content and close with Escape", async ({ page }) => {
  await mockProfileApi(page);
  await page.goto("/my-face.html");

  const button = page.getByRole("button", { name: "Notifications" });
  await button.click();
  const panel = page.getByRole("dialog", { name: "Notifications" });
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS("position", "fixed");
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});

test("key pages do not overflow horizontally", async ({ page }) => {
  await mockProfileApi(page);
  for (const path of ["/login.html", "/forgot-password.html", "/my-face.html"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow, `${path} has horizontal overflow`).toBeFalsy();
  }
});
