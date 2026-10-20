import { test, expect } from "@playwright/test";

test("test-mode banner is visible when fixtures are loaded", async ({ page }) => {
  await page.goto("/properties");
  await expect(page.getByRole("note")).toContainText("Test mode");
});

test("property filters run against structured records and produce shareable URLs", async ({ page }) => {
  await page.goto("/properties");
  await expect(page.getByRole("status")).toHaveText("3 properties");
  await expect(page.getByText("Unpublished sample")).toHaveCount(0);
  const form = page.getByRole("form", { name: "Filter properties" });
  await form.getByLabel("For").selectOption("rent");
  await form.getByRole("button", { name: "Apply" }).click();
  await expect(page).toHaveURL(/transaction=rent/);
  await expect(page.getByRole("status")).toHaveText("1 property");
  await page.goto("/properties?transaction=sale&maxPrice=3000000&sort=price-asc");
  await expect(page.getByRole("status")).toHaveText("1 property");
  await expect(page.getByText("Sample two-bedroom apartment")).toBeVisible();
});

test("property detail page renders specs, agent and a prefilled viewing request", async ({ page }) => {
  await page.goto("/properties/sample-two-bedroom-marina");
  await expect(page.locator("h1")).toHaveText("Sample two-bedroom apartment");
  await expect(page.getByText("AED 2,400,000")).toBeVisible();
  await expect(page.getByText("TEST-S-0001")).toBeVisible();
  await expect(page.getByText("Mostafa Zanaty")).toBeVisible();
  const wa = await page.getByRole("link", { name: "Ask on WhatsApp" }).getAttribute("href");
  expect(decodeURIComponent(wa!)).toContain("ref TEST-S-0001");
});

test("unpublished properties and unauthorised developments are not reachable", async ({ page }) => {
  expect((await page.goto("/properties/sample-unpublished"))?.status()).toBe(404);
  expect((await page.goto("/developments/sample-unauthorized"))?.status()).toBe(404);
});

test("development catalogue filters and detail page sections", async ({ page }) => {
  await page.goto("/developments?year=2028");
  await expect(page.getByRole("status")).toHaveText("1 development");
  await page.goto("/developments?maxPrice=1000000");
  await expect(page.getByRole("status")).toHaveText("No developments match these filters.");
  await page.goto("/developments/sample-creek-residences");
  await expect(page.locator("h1")).toHaveText("Sample Creek Residences");
  for (const h of ["Overview", "Project facts", "Unit types", "Payment plan", "Location", "Before you invest"]) {
    await expect(page.getByRole("heading", { name: h })).toBeVisible();
  }
  const wa = await page.getByRole("link", { name: /Speak to an Advisor on WhatsApp/ }).getAttribute("href");
  expect(decodeURIComponent(wa!)).toContain("I am interested in Sample Creek Residences");
});
