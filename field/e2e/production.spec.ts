import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("production app is accessible, and app + guide work offline", async ({
  page,
  context,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your machine, connected." }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-production.png`,
    fullPage: true,
  });
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your machine, connected." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try a simulation" }).click();
  await page.getByRole("button", { name: "Start practice session" }).click();
  await expect(page.getByText("✓ Handshake confirmed")).toBeVisible();
  await page.goto("/setup-guide.html");
  await expect(
    page.getByRole("heading", {
      name: "A little setup. A real-world first test.",
    }),
  ).toBeVisible();
  const guideResult = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(guideResult.violations).toEqual([]);
  await page.getByRole("checkbox").first().check();
  await page.getByPlaceholder("e.g. KSJ…").fill("KSJ-test");
  await page.reload();
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  await expect(page.getByPlaceholder("e.g. KSJ…")).toHaveValue("KSJ-test");
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-guide.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});
