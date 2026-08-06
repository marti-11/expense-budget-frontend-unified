const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const profile = {
  id: 1,
  firstName: "Martina",
  lastName: "Nezha",
  email: "martina@example.com",
  phoneNumber: "0683931485",
  currency: "EUR",
  profileImageUrl: null
};

for (const path of ["/login.html", "/register.html", "/forgot-password.html"]) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(item =>
      ["serious", "critical"].includes(item.impact)
    );
    expect(serious).toEqual([]);
  });
}

test("profile has no serious accessibility violations", async ({ page }) => {
  await page.route("**/api/Auth/me", route => route.fulfill({ json: profile }));
  await page.goto("/my-face.html");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const serious = results.violations.filter(item =>
    ["serious", "critical"].includes(item.impact)
  );
  expect(serious).toEqual([]);
});
