import { test, expect } from "@playwright/test";
test("practice: connection, door lifecycle, stock edit, collection, ledger and reload", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your machine, connected." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Test door 1, unknown", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Try a simulation" }).click();
  await page.getByRole("button", { name: "Start practice session" }).click();
  await expect(page.getByText("✓ Handshake confirmed")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Test door 1, closed", exact: true }),
  ).toBeEnabled();
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-machine.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Test door 1, closed", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Open door 1 once", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Test door 1, open", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close simulated doors" }).click();
  await expect(
    page.getByRole("button", { name: "Test door 1, closed", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Inventory", exact: true }).click();
  await page.getByRole("button", { name: "Edit stock" }).first().click();
  await page.getByLabel("Product name", { exact: true }).fill("Care kit");
  await page.getByLabel("Quantity inside").fill("4");
  await page.getByLabel("Reference price (USD)").fill("2.50");
  await page.getByRole("button", { name: "Save compartment" }).click();
  await expect(
    page.getByRole("heading", { name: "Care kit", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Collect", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Open door 1 once", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Inspect door 1" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "I took one item" }).click();
  await expect(page.getByText("4 recorded inside")).toBeVisible();
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-inventory.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Activity", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Care kit", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("collected", { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export session" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("mutual-vend-session");
  await page.getByRole("button", { name: "Field guide", exact: true }).click();
  await page.getByRole("checkbox").first().check();
  await expect(
    page.getByText("1 of 9 checks recorded for practice"),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Inventory", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Care kit", exact: true }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
});
test("timeout stays uncertain and controls recover without duplicate open", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try a simulation" }).click();
  await page.getByRole("button", { name: "Start practice session" }).click();
  await expect(page.getByText("✓ Handshake confirmed")).toBeVisible();
  await page.getByText("Device tools", { exact: false }).first().click();
  await page.getByLabel("Simulated failure").selectOption("timeout");
  await page.getByRole("button", { name: "Refresh status" }).click();
  await expect(page.getByRole("alert")).toContainText("result is unknown", {
    timeout: 10000,
  });
  await page.getByLabel("Simulated failure").selectOption("none");
  await page.getByRole("button", { name: "Refresh status" }).click();
  await expect(
    page.getByRole("button", { name: "Test door 1, closed", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Disconnect machine" }).click();
  await expect(
    page.getByRole("button", { name: "Test door 1, unknown", exact: true }),
  ).toBeDisabled();
});
test("settings reject wrong inputs and keep hardware changes disconnected", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Machine settings" }).click();
  await page.getByLabel("Machine name", { exact: true }).fill("Hotel bench");
  await page.getByLabel("Door command profile").selectOption("apk");
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByText("APK command profile")).toBeVisible();
  await page.getByRole("button", { name: "Inventory", exact: true }).click();
  await page.getByRole("button", { name: "Edit stock" }).first().click();
  await page.getByLabel("Quantity inside").fill("-1");
  await page.getByRole("button", { name: "Save compartment" }).click();
  await expect(page.getByRole("alert")).toContainText("whole stock count");
});
