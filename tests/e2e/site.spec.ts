import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  "/", "/properties", "/developments", "/communities", "/communities/palm-jumeirah", "/services", "/services/buy", "/services/sell",
  "/services/rent", "/services/off-plan", "/about", "/team", "/team/wael-naeem", "/team/mostafa-zanaty", "/insights",
  "/insights/dubai-property-buying-costs", "/contact", "/privacy-policy", "/terms", "/credits",
];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440, 1920];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return errors;
}

test("every public route renders with one h1, a title and no console errors", async ({ page }) => {
  const errors = collectErrors(page);
  for (const r of ROUTES) {
    const res = await page.goto(r);
    expect(res?.status(), r).toBe(200);
    await expect(page.locator("h1"), r).toHaveCount(1);
    expect(await page.title(), r).toMatch(/Lumen Realty/);
    expect(await page.locator('link[rel="canonical"]').getAttribute("href"), r).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test("no horizontal overflow at any test width", async ({ page }) => {
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const r of ["/", "/contact", "/communities/dubai-marina", "/services/buy"]) {
      await page.goto(r);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${r} @ ${w}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("hero copy and contact details are correct", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Exceptional places.");
  await expect(page.locator("h1")).toContainText("A clearer perspective.");
  const wa = await page.locator('a[href^="https://wa.me/"]').first().getAttribute("href");
  expect(wa).toMatch(/^https:\/\/wa\.me\/971506355365/);
  await expect(page.locator("footer")).toContainText("RERA ORN 64951");
  await expect(page.locator("footer")).toContainText("1652672");
  await expect(page.locator("footer")).toContainText("Office 3001A, Al Saqr Business Tower");
});

test("all seven team members are listed with exact titles", async ({ page }) => {
  await page.goto("/team");
  for (const [name, title] of [
    ["Wael Naeem", "CEO & Managing Director"], ["Bassel Elhewety", "Chief Operating Officer"], ["Angélica Troya", "Chief People Officer"],
    ["Abdallah Emam", "Chief Technology Officer"], ["Mostafa Zanaty", "Senior Sales Consultant"], ["Mohamad Sabiq", "Property Advisor"], ["Sharon Paulson", "Office Administrator"],
  ]) {
    const card = page.locator("a", { hasText: name });
    await expect(card).toContainText(title);
  }
});

test("mobile menu opens, traps focus and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("contact form validates before sending and shows field errors", async ({ page }) => {
  let posted = 0;
  page.on("request", (r) => { if (r.url().endsWith("/api/leads")) posted++; });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Arrange a Private Consultation" }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await expect(page.getByText("Please agree so we can contact you")).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeFocused();
  expect(posted).toBe(0);
});

test("hero search without inventory becomes an advisory request that is stored", async ({ page, browser }) => {
  await page.goto("/");
  const search = page.getByRole("region", { name: "Property search" });
  await search.getByLabel("Location").selectOption({ label: "Palm Jumeirah" });
  await search.getByLabel("Property category").selectOption("Villa");
  await search.getByRole("button", { name: "Search Properties" }).click();
  await expect(search.getByText("We'll prepare a shortlist for you.")).toBeVisible();
  await expect(search.getByText("Palm Jumeirah")).toBeVisible();
  await page.waitForTimeout(1600); // human-like fill time
  await search.getByLabel("Full name").fill("E2E Search Lead");
  await search.getByLabel("Mobile number").fill("+971501112233");
  await search.getByText("I agree that Lumen Realty may contact me").click();
  await search.getByRole("button", { name: "Send my search" }).click();
  const status = search.getByRole("status");
  await expect(status).toContainText("Your enquiry is with our team");
  const ref = (await status.locator("strong").textContent())!.trim();
  expect(ref).toMatch(/^LR-/);

  // Verify persistence through the protected admin view.
  const ctx = await browser.newContext({ httpCredentials: { username: "admin", password: "e2e-password-123" } });
  const admin = await ctx.newPage();
  await admin.goto("http://localhost:3200/admin/leads");
  const row = admin.locator("tr", { hasText: ref });
  await expect(row).toContainText("E2E Search Lead");
  await expect(row).toContainText("Palm Jumeirah");
  await expect(row).toContainText("Category Villa");
  await ctx.close();
});

test("double-clicking submit creates only one lead", async ({ page, browser }) => {
  await page.goto("/contact?type=callback");
  await page.waitForTimeout(1600);
  await page.getByLabel("Full name").fill("E2E Double Click");
  await page.getByLabel("Mobile number").fill("+971502223344");
  await page.getByText("I agree that Lumen Realty may contact me").click();
  const btn = page.getByRole("button", { name: "Send enquiry" });
  await btn.dblclick();
  await expect(page.getByRole("status")).toContainText("Your enquiry is with our team");
  const ctx = await browser.newContext({ httpCredentials: { username: "admin", password: "e2e-password-123" } });
  const admin = await ctx.newPage();
  await admin.goto("http://localhost:3200/admin/leads");
  await expect(admin.locator("tr", { hasText: "E2E Double Click" })).toHaveCount(1);
  await ctx.close();
});

test("admin area requires credentials", async ({ request }) => {
  const res = await request.get("/admin/leads");
  expect(res.status()).toBe(401);
});

test("cost calculator updates for a mortgage", async ({ page }) => {
  await page.goto("/");
  const cash = await page.locator("tfoot td").first().textContent();
  await page.getByText("Mortgage", { exact: true }).click();
  await expect(page.getByRole("rowheader", { name: "Mortgage registration" })).toBeVisible();
  const mortgage = await page.locator("tfoot td").first().textContent();
  expect(mortgage).not.toBe(cash);
});

test("SEO endpoints and structured data", async ({ page, request }) => {
  for (const p of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/favicon.ico", "/favicon.svg", "/og-image.jpg"]) {
    expect((await request.get(p)).status(), p).toBe(200);
  }
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/communities/palm-jumeirah");
  await page.goto("/");
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join(" ")).toContain('"RealEstateAgent"');
});

test("unknown pages return the branded 404", async ({ page }) => {
  const res = await page.goto("/properties/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("doesn't");
});
