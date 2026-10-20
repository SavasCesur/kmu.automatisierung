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
  await expect(page.locator(".summary-card")).toHaveCount(3);
  await expect(page.locator(".task-row")).toHaveCount(3);
  await expect(page.locator(".risk-row")).toHaveCount(2);
  await expect(page.locator(".project-card")).toHaveCount(0);
  await expect(page.locator(".roadmap-phase")).toHaveCount(0);
  await page
    .locator(".page-tabs")
    .getByRole("button", { name: "Roadmap", exact: true })
    .click();
  await expect(page.locator(".roadmap-phase")).toHaveCount(6);
  expect(errors).toEqual([]);
});
test("project filters and empty state reset work", async ({ page }) => {
  await page.goto("/");
  await page
    .locator(".page-tabs")
    .getByRole("button", { name: "Projektbereiche", exact: true })
    .click();
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
  await page
    .locator(".page-tabs")
    .getByRole("button", { name: "Entscheidungen", exact: true })
    .click();
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
  await page.getByRole("button", { name: "Alle Aufgaben ansehen" }).click();
  await page
    .locator(".task-tabs")
    .getByRole("button", { name: "In Arbeit", exact: true })
    .click();
  await expect(page.locator(".task-row")).toHaveCount(2);
  await page
    .locator(".page-tabs")
    .getByRole("button", { name: "Projektbereiche", exact: true })
    .click();
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
    .getByRole("button", { name: "Pilot – Zaunbetrieb", exact: true })
    .click();
  await expect(page.locator(".pilot-section")).toContainText(
    "Vorbereitung / Entwicklung",
  );
  await expect(page.locator(".sidebar")).not.toHaveClass(/mobile-open/);
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".sidebar")).not.toHaveClass(/mobile-open/);
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
  await expect(page.locator(".summary-card")).toHaveCount(3);
});

test("navigation switches views and reveals secondary context on demand", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".context-links")).not.toBeVisible();
  await page.locator(".context-details summary").click();
  await page
    .locator(".context-links")
    .getByRole("button", { name: "Architektur", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Externe Dienste");
  await page.getByRole("button", { name: "Schließen", exact: true }).click();
  await page
    .locator(".context-links")
    .getByRole("button", { name: "Projektbereiche", exact: true })
    .click();
  await expect(page.locator(".project-grid")).toBeVisible();
  await expect(page.locator(".priority-card")).toHaveCount(0);
  await expect(
    page
      .locator(".page-tabs")
      .getByRole("button", { name: "Projektbereiche", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Sidebar einklappen" }).click();
  await expect(page.locator(".app-shell")).toHaveClass(/sidebar-collapsed/);
  await page.getByRole("button", { name: "Sidebar ausklappen" }).click();
  await expect(page.locator(".app-shell")).not.toHaveClass(/sidebar-collapsed/);
});
test("all views fit narrow mobile, tablet and desktop screens", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const view of [
      "Übersicht",
      "Aufgaben",
      "Projektbereiche",
      "Pilot",
      "Risiken",
      "Entscheidungen",
      "Roadmap",
    ]) {
      await page
        .locator(".page-tabs")
        .getByRole("button", { name: view })
        .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${view} at ${width}px`,
      ).toBe(true);
      const overlaps = await page.locator(".task-row").evaluateAll((rows) =>
        rows.some((row) => {
          const title = row
            .querySelector(".task-main")
            ?.getBoundingClientRect();
          const badge = row.querySelector(".badge")?.getBoundingClientRect();
          return title && badge && title.right > badge.left + 1;
        }),
      );
      expect(overlaps).toBe(false);
    }
  }
});
test("long local task titles wrap and forms remain usable on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.getByRole("button", { name: "Neue Aufgabe", exact: true }).click();
  await page
    .getByLabel("Aufgabentitel")
    .fill("SehrLangerAufgabentitelOhneLeerzeichen".repeat(4));
  await page.getByRole("button", { name: "Lokal speichern" }).click();
  await expect(
    page.locator(".task-row").filter({ hasText: "SehrLangerAufgabentitel" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator(".task-row")
    .filter({ hasText: "SehrLangerAufgabentitel" })
    .click();
  await expect(
    page.getByRole("button", { name: "Schließen", exact: true }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("dialog")
      .evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true);
});
