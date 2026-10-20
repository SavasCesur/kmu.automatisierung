# KMU-Prozessoptimierung · Projekt Dashboard

Interaktiver V1-Prototyp einer zentralen Projekt- und Managementübersicht. React 19, TypeScript, Vite und Lucide; Schriftdateien werden lokal ausgeliefert.

## Starten

Voraussetzung: Node.js 22 oder neuer und npm.

```bash
npm ci --cache /workspace/.npm-cache
npm run dev
```

Der Entwicklungsserver läuft auf Port 5173. Für einen Produktionsbuild:

```bash
npm run build
npm run preview
```

## Funktionsumfang

- Responsive Übersicht mit einklappbarer Sidebar und mobilem Menü
- Status- und Prioritätsfilter, globale Suche (Strg/⌘ K), Detail-Drawer
- Pilotübersicht, Aufgaben, Risiken, Roadmap und Entscheidungsregister
- Lokales Anlegen von Aufgaben und offenen Entscheidungen
- Dark Mode mit gespeicherter Einstellung
- Lade-, Leer- und Fehlerzustände

Die Projektdaten stammen aus der bereitgestellten Beschreibung. Fehlende Kennzahlen, Abhängigkeiten und Bewertungen werden nicht erfunden. Zusätzliche Aufgaben und Entscheidungen bleiben im `localStorage` dieses Browsers; sie werden nicht mit anderen Geräten synchronisiert. Es gibt keine Anmeldung, externen Integrationen oder Backend-Dienste.

## Struktur

- `src/types.ts`: gemeinsame Datentypen
- `src/data.ts`: zentrale Ausgangsdaten
- `src/services/dashboard.ts`: austauschbarer Datenadapter; Ansatzpunkt für eine spätere Directus-API
- `src/components/`: wiederverwendbare UI- und Dialogkomponenten
- `src/App.tsx`: Dashboard und Interaktionszustand
- `src/styles.css`: Designsystem, responsive Layouts und Dark Mode

## Browserprüfungen

```bash
npm test
```

Die Tests verwenden das in dieser Cloud-Umgebung vorhandene Chromium unter `/usr/bin/chromium`. Für andere Systeme den `executablePath` in `playwright.config.ts` anpassen oder Playwrights Chromium verwenden.

Geprüft werden Darstellung, Projektfilter, Suche und Detailnavigation, lokale Persistenz von Aufgaben und Entscheidungen, Aufgabenfilter, mobiles Menü, Dark Mode und Fehlerbehandlung. Build und Tests benötigen keine echten Integrationen oder Zugangsdaten.
