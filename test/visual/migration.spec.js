const { test, expect } = require("@playwright/test");

// Keep analytics and unrelated third-party services out of deterministic UI checks.
test.beforeEach(async ({ page }) => {
  await page.route("https://**/*", (route) => route.abort());
});

for (const width of [390, 700, 1280]) {
  test(`navigation and branding at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".logo-utn")).toBeVisible();
    await expect(page.locator(".logo-new")).toBeVisible();
    await expect(page.locator(".people .card-title").first()).toHaveCSS("font-size", "14px");
    await expect(page.locator(".people .card-body").first()).toHaveCSS("padding", "0px");
    const toggle = page.getByRole("button", { name: "Toggle navigation" });
    if (width < 768) {
      await expect(page.locator("#navbarNav")).toBeHidden();
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    } else {
      await expect(toggle).toBeHidden();
    }
    const teaching = page.locator("#navbarDropdown-teaching");
    await teaching.click();
    await expect(teaching).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("link", { name: "Data Engineering", exact: true }).click();
    await expect(page).toHaveURL(/\/teaching\/data-engineering\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("consent defaults, decline, accept, and saved preference", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByRole("dialog", { name: "Cookie consent" });
  await expect(banner).toBeVisible();
  const calls = () => page.evaluate(() => window.dataLayer.map((args) => Array.from(args)));
  let data = await calls();
  expect(data.find((call) => call[0] === "consent" && call[1] === "default")[2].analytics_storage).toBe("denied");
  expect(data.find((call) => call[0] === "config")[1]).toBe("G-01T0SBSGBC");
  await banner.getByRole("button", { name: "Decline" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(banner).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("ga-consent-choice"))).toBe("denied");
  await page.evaluate(() => localStorage.removeItem("ga-consent-choice"));
  await page.reload();
  await banner.getByRole("button", { name: "Accept" }).click();
  data = await calls();
  expect(data.filter((call) => call[0] === "consent" && call[1] === "update").at(-1)[2].analytics_storage).toBe("granted");
  await page.reload();
  await expect(banner).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("ga-consent-choice"))).toBe("granted");
});

test("publication links, author prefixes, and Bib buttons survive migration", async ({ page }) => {
  await page.goto("/publications/");
  await expect(page.locator(".publications .title a").first()).toHaveAttribute("href", /\S+/);
  await expect(page.locator(".publications")).toContainText("van Renen");
  const entry = page
    .locator(".publications ol.bibliography > li")
    .filter({ has: page.locator("a.bibtex") })
    .first();
  await entry.locator("a.bibtex").click();
  await expect(entry.locator("div.bibtex")).toHaveClass(/open/);
  await entry.locator("a.bibtex").click();
  await expect(entry.locator("div.bibtex")).not.toHaveClass(/open/);
});

test("search opens and finds local pages", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => customElements.whenDefined("ninja-keys"));
  await page.getByRole("button", { name: "Open search" }).click();
  const search = page.locator("ninja-keys");
  const input = search.locator("input");
  await expect(input).toBeVisible();
  await input.fill("Cloud Databases");
  await expect(search.locator("ninja-action").filter({ hasText: "Cloud Databases" }).first()).toBeVisible();
});
