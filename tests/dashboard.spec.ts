import { test, expect } from "@playwright/test";
test("overview renders all requested content without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "KMU-Prozessoptimierung." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Projektbereiche", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Letzte wichtige Entscheidungen" }),
  ).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(6);
  await expect(page.locator(".roadmap-phase")).toHaveCount(6);
  expect(errors).toEqual([]);
});
test("project filters and empty state reset work", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Priorität filtern").selectOption("Sehr hoch");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.getByLabel("Projektstatus filtern").selectOption("Laufend");
  await expect(page.getByText("Keine Einträge gefunden.")).toBeVisible();
  await page.getByRole("button", { name: "Filter zurücksetzen" }).click();
  await expect(page.locator(".project-card")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Alle Projektbereiche anzeigen" })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(10);
});
test("global search opens risk details and closes by keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Globale Suche", exact: true })
    .click();
  await page.getByLabel("Suchbegriff").fill("Lexware");
  await page
    .locator(".search-results button")
    .filter({ hasText: "Risiko" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Früh praktisch prüfen.",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("new task is saved locally and survives reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Neue Aufgabe", exact: true }).click();
  await page.getByLabel("Aufgabentitel").fill("Testanfrage gemeinsam prüfen");
  await page.getByLabel("Abhängigkeit").fill("Datenmodell V1");
  await page.getByRole("button", { name: "Lokal speichern" }).click();
  await expect(
    page
      .locator(".task-row")
      .filter({ hasText: "Testanfrage gemeinsam prüfen" }),
  ).toBeVisible();
  await page.reload();
  await page
    .locator(".task-row")
    .filter({ hasText: "Testanfrage gemeinsam prüfen" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Datenmodell V1");
  await expect(page.getByRole("dialog")).toContainText("Offen");
});
test("new decision stays open and is persisted", async ({ page }) => {
  await page.goto("/");
  await page
    .locator(".heading-actions")
    .getByRole("button", { name: "Entscheidung hinzufügen" })
    .click();
  await page.getByLabel("Thema", { exact: true }).fill("Eingangskanal");
  await page
    .getByLabel("Entscheidung / offener Vorschlag")
    .fill("Zunächst E-Mail prüfen.");
  await page.getByRole("button", { name: "Lokal speichern" }).click();
  await page.reload();
  const row = page
    .getByRole("row")
    .filter({ hasText: "Zunächst E-Mail prüfen." });
  await expect(row).toContainText("Offen");
  await row.getByRole("button", { name: "Eingangskanal", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Noch zu bewerten");
});
test("task status filter and project drawer show real data", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".task-tabs")
    .getByRole("button", { name: "In Arbeit", exact: true })
    .click();
  await expect(page.locator(".task-row")).toHaveCount(2);
  await page
    .locator(".project-card")
    .filter({ hasText: "Technik & Architektur" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "PostgreSQL · Directus · n8n",
  );
});
test("dark mode persists and mobile navigation works without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  await expect(page.locator(".sidebar")).toHaveClass(/mobile-open/);
  await page.getByRole("button", { name: "Dark Mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "03 Pilot – Zaunbetrieb", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Pflichtfelder");
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("invalid persisted data produces a visible recoverable error state", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("kmu-dashboard-v1", "invalid"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("Daten nicht verfügbar");
  await page.evaluate(() => localStorage.removeItem("kmu-dashboard-v1"));
  await page.getByRole("button", { name: "Erneut versuchen" }).click();
  await expect(page.locator(".project-card")).toHaveCount(6);
});
