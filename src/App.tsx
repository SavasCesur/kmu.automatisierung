import { FocusWork } from "./components/FocusWork";
import { DecisionsSection } from "./components/DecisionsSection";
import { RoadmapSection } from "./components/RoadmapSection";
import { PilotSection } from "./components/PilotSection";
import { ProjectAreas } from "./components/ProjectAreas";
import { DashboardOverview } from "./components/DashboardOverview";
import { useCallback, useEffect, useState } from "react";
import { architecture, navigation } from "./data";
import type {
  DashboardData,
  Decision,
  Task,
  ProjectArea,
  Risk,
  Panel,
} from "./types";
import { dashboardService } from "./services/dashboard";
import { Badge, EmptyState, Icon } from "./components/UI";
import { Dialog } from "./components/Dialog";

const tabs = [
  ["overview", "Übersicht"],
  ["tasks", "Aufgaben"],
  ["projects", "Projektbereiche"],
  ["pilot", "Pilot"],
  ["risks", "Risiken"],
  ["decisions", "Entscheidungen"],
  ["roadmap", "Roadmap"],
];
function App() {
  const [data, setData] = useState<DashboardData | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("kmu-theme") === "dark",
    );
  const [panel, setPanel] = useState<Panel | null>(null),
    [activeTab, setActiveTab] = useState("overview"),
    [showAll, setShowAll] = useState(false),
    [status, setStatus] = useState("Alle Status"),
    [priority, setPriority] = useState("Alle Prioritäten"),
    [taskTab, setTaskTab] = useState("Alle"),
    [query, setQuery] = useState(""),
    [toast, setToast] = useState("");
  const close = useCallback(() => setPanel(null), []);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await dashboardService.load());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Daten konnten nicht geladen werden.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("kmu-theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobile(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPanel({ kind: "search" });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const jump = (id: string) => {
    setActiveTab(id);
    document
      .getElementById("overview")
      ?.scrollIntoView({ behavior: "instant", block: "start" });
    setMobile(false);
  };
  const openNav = (number: string) => {
    setMobile(false);
    if (number === "00") {
      jump("overview");
      return;
    }
    if (number === "03") {
      jump("pilot");
      return;
    }
    if (number === "10") {
      jump("decisions");
      return;
    }
    if (number === "11") {
      jump("roadmap");
      return;
    }
    const item = data?.projects.find((p) => p.number === number);
    if (item) setPanel({ kind: "project", item });
  };
  const date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date());
  const projects =
    data?.projects.filter(
      (p) =>
        (showAll || ["03", "04", "05", "02", "08", "06"].includes(p.number)) &&
        (status === "Alle Status" || p.status === status) &&
        (priority === "Alle Prioritäten" || p.priority === priority),
    ) || [];
  const tasks =
    data?.tasks.filter(
      (t) =>
        taskTab === "Alle" ||
        (taskTab === "In Arbeit"
          ? t.status === "In Arbeit"
          : ["Offen", "Geplant"].includes(t.status)),
    ) || [];
  const saveForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = new FormData(e.currentTarget);
    try {
      if (panel?.kind === "newTask") {
        const task: Task = {
          id: crypto.randomUUID(),
          title: String(fields.get("title")).trim(),
          area: String(fields.get("area")),
          priority: fields.get("priority") as Task["priority"],
          status: "Offen",
          dependency:
            String(fields.get("dependency")).trim() || "Noch nicht festgelegt",
        };
        if (!task.title) return;
        dashboardService.addTask(task);
        setData((d) => (d ? { ...d, tasks: [task, ...d.tasks] } : d));
        setToast("Aufgabe lokal gespeichert.");
      } else {
        const decision: Decision = {
          id: crypto.randomUUID(),
          topic: String(fields.get("topic")).trim(),
          decision: String(fields.get("decision")).trim(),
          status: "Offen",
          impact: String(fields.get("impact")).trim() || "Noch zu bewerten",
        };
        if (!decision.topic || !decision.decision) return;
        dashboardService.addDecision(decision);
        setData((d) =>
          d ? { ...d, decisions: [decision, ...d.decisions] } : d,
        );
        setToast("Entscheidung lokal gespeichert.");
      }
      close();
    } catch {
      setToast(
        "Speichern nicht möglich. Prüfe die Browser-Speichereinstellungen.",
      );
    }
  };
  const renderTask = (task: Task) => (
    <button
      className="task-row"
      key={task.id}
      onClick={() => setPanel({ kind: "task", item: task })}
    >
      <span className="task-checkbox">
        <Icon name="tasks" size={17} />
      </span>
      <span className="task-main">
        <strong>{task.title}</strong>
        <small>
          {task.area}
          <span>·</span>
          <span
            className={task.priority === "Sehr hoch" ? "priority-high" : ""}
          >
            {task.priority === "Sehr hoch" && <Icon name="flag" size={11} />}{" "}
            {task.priority}
          </span>
        </small>
      </span>
      <Badge status={task.status} />
      <Icon name="chevron" size={16} />
    </button>
  );
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      {mobile && (
        <button
          className="mobile-backdrop"
          aria-label="Navigation schließen"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <a className="brand" href="#overview" onClick={() => jump("overview")}>
          <span className="brand-symbol">
            <i />
            <i />
            <i />
          </span>
          <span className="brand-label">
            prozess<span>blick</span>
            <small>PROJEKT WORKSPACE</small>
          </span>
        </a>
        <div className="workspace">
          <span className="workspace-avatar">K</span>
          <div>
            <strong>KMU-Prozessoptimierung</strong>
            <small>Projekt-Workspace</small>
          </div>
          <Icon name="down" size={14} />
        </div>
        <div className="nav-label">
          WORKSPACE{" "}
          <button
            className="collapse-button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
          >
            <Icon name="collapse" size={15} />
          </button>
        </div>
        <nav aria-label="Hauptnavigation">
          {[
            ["00", "Übersicht", "dashboard", "overview"],
            ["tasks", "Aufgaben", "tasks", "tasks"],
            ["projects", "Projektbereiche", "layers", "projects"],
            ["03", "Pilot – Zaunbetrieb", "fence", "pilot"],
            ["risks", "Risiken & Blocker", "warning", "risks"],
            ["10", "Entscheidungen", "book", "decisions"],
            ["11", "Roadmap", "route", "roadmap"],
          ].map(([num, title, icon, view]) => (
            <button
              key={num}
              className={`nav-item ${activeTab === view ? "active" : ""}`}
              aria-current={activeTab === view ? "page" : undefined}
              title={title}
              onClick={() => jump(view)}
            >
              <Icon name={icon} />
              <span className="nav-text">{title}</span>
            </button>
          ))}
          <details className="nav-more">
            <summary>
              <Icon name="more" />
              <span>Weitere Bereiche</span>
              <Icon name="down" size={14} />
            </summary>
            {navigation
              .filter(([num]) => !["00", "03", "10", "11"].includes(num))
              .map(([num, title, icon]) => (
                <button
                  key={num}
                  className="nav-item"
                  title={title}
                  onClick={() => openNav(num)}
                >
                  <Icon name={icon} />
                  <span className="nav-text">{title}</span>
                </button>
              ))}
          </details>
        </nav>
        <div className="sidebar-bottom">
          <button
            className="utility-item"
            onClick={() => setPanel({ kind: "settings" })}
          >
            <Icon name="settings" />
            <span>Einstellungen</span>
          </button>
          <button
            className="utility-item"
            onClick={() => setPanel({ kind: "search" })}
          >
            <Icon name="search" />
            <span>Suche</span>
            <kbd>⌘ K</kbd>
          </button>
          <button className="utility-item" onClick={() => setDark(!dark)}>
            <Icon name={dark ? "sun" : "moon"} />
            <span>{dark ? "Light Mode" : "Dark Mode"}</span>
            <span className={`switch ${dark ? "on" : ""}`} aria-hidden="true" />
          </button>
          <button
            className="profile"
            onClick={() => setPanel({ kind: "profile" })}
          >
            <span className="avatar">SC</span>
            <span>
              <strong>Projektteam</strong>
              <small>Lokaler Workspace</small>
            </span>
            <Icon name="down" size={15} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Menü öffnen"
              onClick={() => setMobile(true)}
            >
              <Icon name="menu" />
            </button>
            {collapsed && (
              <button
                className="desktop-expand icon-button"
                aria-label="Sidebar ausklappen"
                onClick={() => setCollapsed(false)}
              >
                <Icon name="menu" />
              </button>
            )}
            <Icon name="dashboard" size={16} />
            <span>Workspace</span>
            <Icon name="chevron" size={13} />
            <strong>Projekt Dashboard</strong>
          </div>
          <div className="topbar-right">
            <span className="top-date">
              <Icon name="calendar" size={15} />
              {date}
            </span>
            <span className="top-divider" />
            <button
              className="icon-button"
              aria-label="Globale Suche"
              onClick={() => setPanel({ kind: "search" })}
            >
              <Icon name="search" size={19} />
            </button>
            <button
              className="icon-button"
              aria-label="Benachrichtigungen"
              onClick={() => setPanel({ kind: "notifications" })}
            >
              <Icon name="bell" size={19} />
            </button>
            <button
              className="avatar top-avatar"
              aria-label="Profil öffnen"
              onClick={() => setPanel({ kind: "profile" })}
            >
              SC
            </button>
          </div>
        </header>
        <main id="overview">
          <div className="page-heading">
            <div>
              <div className="title-eyebrow">
                <span className="tiny-line" /> DER ÜBERBLICK FÜRS WESENTLICHE
              </div>
              <h1>
                KMU-Prozessoptimierung<span className="heading-dot">.</span>
              </h1>
              <p>Dein Projekt. Klarer Fokus. Der nächste Schritt im Blick.</p>
            </div>
            <div className="heading-actions">
              <button
                className="button secondary"
                onClick={() => setPanel({ kind: "newDecision" })}
              >
                <Icon name="plus" size={16} />
                Entscheidung hinzufügen
              </button>
              <button
                className="button primary"
                onClick={() => setPanel({ kind: "newTask" })}
              >
                <Icon name="plus" size={17} />
                Neue Aufgabe
              </button>
            </div>
          </div>
          <div className="page-tabs">
            <div role="navigation" aria-label="Dashboard-Bereiche">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  className={activeTab === id ? "selected" : ""}
                  aria-current={activeTab === id ? "page" : undefined}
                  onClick={() => jump(id)}
                >
                  {label}
                  {id === "tasks" && data && <span>{data.tasks.length}</span>}
                </button>
              ))}
            </div>
            <span className="phase-label">
              <span className="status-dot" />
              Pilotentwicklung
            </span>
          </div>
          {loading ? (
            <div className="loading-state" role="status">
              <span className="loading-spinner" />
              Projektübersicht wird geladen …
            </div>
          ) : error ? (
            <div className="error-state" role="alert">
              <Icon name="warning" size={28} />
              <h2>Daten nicht verfügbar</h2>
              <p>{error}</p>
              <button className="button primary" onClick={() => void load()}>
                Erneut versuchen
              </button>
            </div>
          ) : (
            data && (
              <>
                {activeTab === "overview" && (
                  <DashboardOverview
                    data={data}
                    setPanel={setPanel}
                    jump={jump}
                  />
                )}
                {["overview", "tasks", "risks"].includes(activeTab) && (
                  <FocusWork
                    data={data}
                    view={activeTab}
                    tasks={tasks}
                    taskTab={taskTab}
                    setTaskTab={setTaskTab}
                    renderTask={renderTask}
                    setPanel={setPanel}
                    jump={jump}
                  />
                )}
                {activeTab === "projects" && (
                  <ProjectAreas
                    projects={projects}
                    status={status}
                    setStatus={setStatus}
                    priority={priority}
                    setPriority={setPriority}
                    setPanel={setPanel}
                    showAll={showAll}
                    setShowAll={setShowAll}
                  />
                )}
                {activeTab === "pilot" && <PilotSection data={data} />}
                {activeTab === "decisions" && (
                  <DecisionsSection data={data} setPanel={setPanel} />
                )}
                {activeTab === "roadmap" && (
                  <>
                    <RoadmapSection data={data} setPanel={setPanel} />
                    <details className="context-details card">
                      <summary>
                        Langfristige Vision <Icon name="down" size={16} />
                      </summary>
                      <div className="context-body">
                        <p>
                          Anfrageautomation → Kundenfreigabe → Kundenübersicht →
                          Betriebs-Cockpit → standardisierte Module
                        </p>
                        <span className="vision-note">
                          Nicht Teil der aktuellen V1
                        </span>
                      </div>
                    </details>
                  </>
                )}
                {activeTab === "overview" && (
                  <details className="context-details card">
                    <summary>
                      Projektwissen & Planung <span>Details bei Bedarf</span>
                      <Icon name="down" size={16} />
                    </summary>
                    <div className="context-links">
                      <button onClick={() => jump("projects")}>
                        <Icon name="layers" />
                        Projektbereiche
                        <Icon name="arrow" size={16} />
                      </button>
                      <button onClick={() => jump("roadmap")}>
                        <Icon name="route" />
                        Roadmap
                        <Icon name="arrow" size={16} />
                      </button>
                      <button
                        onClick={() => setPanel({ kind: "architecture" })}
                      >
                        <Icon name="workflow" />
                        Architektur
                        <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </details>
                )}
                <footer className="page-footer">
                  <span>
                    <span className="footer-mark" />
                    Mit klarem Fokus zu besseren Prozessen.
                  </span>
                  <span>
                    V1-Prototyp · Statische Projektdaten · Ergänzungen lokal
                    gespeichert
                  </span>
                </footer>
              </>
            )
          )}
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {toast}
          <button
            className="icon-button"
            aria-label="Hinweis schließen"
            onClick={() => setToast("")}
          >
            <Icon name="x" size={15} />
          </button>
        </div>
      )}
      {panel && (
        <Dialog
          title={
            panel.kind === "project"
              ? panel.item.title
              : panel.kind === "task"
                ? panel.item.title
                : panel.kind === "risk"
                  ? panel.item.title
                  : panel.kind === "decision"
                    ? panel.item.topic
                    : {
                        search: "Workspace durchsuchen",
                        settings: "Einstellungen",
                        notifications: "Benachrichtigungen",
                        architecture: "Technik & Architektur",
                        newTask: "Neue Aufgabe",
                        newDecision: "Entscheidung hinzufügen",
                        profile: "Projekt-Workspace",
                      }[panel.kind]
          }
          kicker={
            "item" in panel
              ? panel.kind === "project"
                ? `PROJEKTBEREICH ${panel.item.number}`
                : panel.kind === "risk"
                  ? "RISIKO & BLOCKER"
                  : panel.kind === "decision"
                    ? "ENTSCHEIDUNGSREGISTER"
                    : "AUFGABENDETAILS"
              : undefined
          }
          onClose={close}
          drawer={[
            "project",
            "task",
            "risk",
            "decision",
            "architecture",
          ].includes(panel.kind)}
          wide={panel.kind === "search"}
        >
          {panel.kind === "project" && (
            <>
              <div className="detail-badges">
                <Badge status={panel.item.status} />
                {panel.item.priority && (
                  <span className="subtle-tag">
                    Priorität: {panel.item.priority}
                  </span>
                )}
              </div>
              <div className="detail-block">
                <h3>Aktuelles Ziel</h3>
                <p>{panel.item.currentGoal}</p>
              </div>
              <div className="detail-callout">
                <Icon name="arrow" />
                <div>
                  <h3>Nächster Schritt</h3>
                  <p>{panel.item.nextStep}</p>
                </div>
              </div>
              {panel.item.details && (
                <div className="detail-block">
                  <h3>Hintergrund</h3>
                  <p>{panel.item.details}</p>
                </div>
              )}
              <div className="detail-block">
                <h3>Zugehörige Aufgaben</h3>
                {data?.tasks.filter((t) => t.area.includes(panel.item.number))
                  .length ? (
                  data.tasks
                    .filter((t) => t.area.includes(panel.item.number))
                    .map(renderTask)
                ) : (
                  <p className="muted-label">
                    Für diesen Bereich sind noch keine Aufgaben hinterlegt.
                  </p>
                )}
              </div>
            </>
          )}
          {panel.kind === "task" && (
            <>
              <div className="detail-badges">
                <Badge status={panel.item.status} />
                <span className="subtle-tag">
                  Priorität: {panel.item.priority}
                </span>
              </div>
              <div className="detail-block">
                <h3>Projektbereich</h3>
                <p>{panel.item.area}</p>
              </div>
              <div className="detail-callout">
                <Icon name="workflow" />
                <div>
                  <h3>Abhängigkeit</h3>
                  <p>{panel.item.dependency}</p>
                </div>
              </div>
              <p className="detail-disclaimer">
                Die Aufgabe ist Bestandteil der Projektübersicht. Eine
                weiterführende Aufgabenverwaltung ist für diese V1 noch nicht
                angebunden.
              </p>
            </>
          )}
          {panel.kind === "risk" && (
            <>
              <div className="detail-badges">
                <Badge status={panel.item.status} />
                <span className="subtle-tag">
                  Auswirkung: {panel.item.impact}
                </span>
              </div>
              <div className="detail-block">
                <h3>Was beobachtet werden muss</h3>
                <p>{panel.item.description}</p>
              </div>
              <div className="detail-callout">
                <Icon name="shield" />
                <div>
                  <h3>Gegenmaßnahme</h3>
                  <p>{panel.item.mitigation}</p>
                </div>
              </div>
            </>
          )}
          {panel.kind === "decision" && (
            <>
              <Badge status={panel.item.status} />
              <div className="detail-block">
                <h3>Entscheidung</h3>
                <p>{panel.item.decision}</p>
              </div>
              <div className="detail-callout">
                <Icon name="book" />
                <div>
                  <h3>Auswirkung</h3>
                  <p>{panel.item.impact}</p>
                </div>
              </div>
            </>
          )}
          {panel.kind === "search" && (
            <>
              <label className="search-field">
                <Icon name="search" size={20} />
                <input
                  autoFocus
                  placeholder="Bereiche, Aufgaben, Risiken, Entscheidungen …"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Suchbegriff"
                />
                <kbd>ESC</kbd>
              </label>
              {query.trim() ? (
                <div className="search-results">
                  {(() => {
                    const q = query.toLocaleLowerCase("de");
                    const results: (
                      | { kind: "project"; item: ProjectArea }
                      | { kind: "task"; item: Task }
                      | { kind: "risk"; item: Risk }
                      | { kind: "decision"; item: Decision }
                    )[] = [
                      ...(data?.projects || [])
                        .filter((i) =>
                          `${i.title} ${i.currentGoal} ${i.nextStep}`
                            .toLowerCase()
                            .includes(q),
                        )
                        .map((item) => ({ kind: "project" as const, item })),
                      ...(data?.tasks || [])
                        .filter((i) =>
                          `${i.title} ${i.area}`.toLowerCase().includes(q),
                        )
                        .map((item) => ({ kind: "task" as const, item })),
                      ...(data?.risks || [])
                        .filter((i) =>
                          `${i.title} ${i.description}`
                            .toLowerCase()
                            .includes(q),
                        )
                        .map((item) => ({ kind: "risk" as const, item })),
                      ...(data?.decisions || [])
                        .filter((i) =>
                          `${i.topic} ${i.decision}`.toLowerCase().includes(q),
                        )
                        .map((item) => ({ kind: "decision" as const, item })),
                    ];
                    return results.length ? (
                      results.map((r) => (
                        <button
                          key={`${r.kind}-${r.item.id}`}
                          onClick={() => setPanel(r)}
                        >
                          <span>
                            <small>
                              {
                                {
                                  project: "Projektbereich",
                                  task: "Aufgabe",
                                  risk: "Risiko",
                                  decision: "Entscheidung",
                                }[r.kind]
                              }
                            </small>
                            <strong>
                              {"title" in r.item ? r.item.title : r.item.topic}
                            </strong>
                          </span>
                          <Icon name="arrow" size={17} />
                        </button>
                      ))
                    ) : (
                      <EmptyState text="Keine passenden Ergebnisse." />
                    );
                  })()}
                </div>
              ) : (
                <div className="search-hint">
                  <Icon name="search" size={28} />
                  <p>Suche im gesamten Projekt-Workspace.</p>
                  <span>
                    Zum Beispiel „Pilot“, „Lexware“ oder „Datenbasis“.
                  </span>
                </div>
              )}
            </>
          )}
          {(panel.kind === "newTask" || panel.kind === "newDecision") && (
            <form className="entry-form" onSubmit={saveForm}>
              <div className="local-note">
                <Icon name="database" size={16} />
                <span>
                  Wird nur in diesem Browser gespeichert. Keine
                  Server-Synchronisierung.
                </span>
              </div>
              {panel.kind === "newTask" ? (
                <>
                  <label>
                    Aufgabentitel
                    <input
                      name="title"
                      required
                      maxLength={180}
                      placeholder="Was ist der nächste konkrete Schritt?"
                      autoFocus
                    />
                  </label>
                  <div className="form-grid">
                    <label>
                      Projektbereich
                      <select name="area">
                        {data?.projects.map((p) => (
                          <option key={p.id} value={`${p.number} ${p.title}`}>
                            {p.number} – {p.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Priorität
                      <select name="priority">
                        <option>Hoch</option>
                        <option>Sehr hoch</option>
                        <option>Mittel</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    <span className="field-label">
                      Abhängigkeit <small>(optional)</small>
                    </span>
                    <textarea
                      name="dependency"
                      placeholder="Was muss vorher geklärt werden?"
                      rows={3}
                    />
                  </label>
                  <p className="form-status">
                    Neue Aufgaben beginnen mit dem Status{" "}
                    <Badge status="Offen" />.
                  </p>
                </>
              ) : (
                <>
                  <label>
                    Thema
                    <input
                      name="topic"
                      required
                      maxLength={120}
                      placeholder="Worum geht es?"
                      autoFocus
                    />
                  </label>
                  <label>
                    Entscheidung / offener Vorschlag
                    <textarea
                      name="decision"
                      required
                      rows={4}
                      placeholder="Was soll festgehalten werden?"
                    />
                  </label>
                  <label>
                    <span className="field-label">
                      Auswirkung <small>(optional)</small>
                    </span>
                    <textarea
                      name="impact"
                      rows={2}
                      placeholder="Was bedeutet das für das Projekt?"
                    />
                  </label>
                  <p className="form-status">
                    Neue Einträge sind zunächst <Badge status="Offen" />.
                  </p>
                </>
              )}
              <div className="form-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={close}
                >
                  Abbrechen
                </button>
                <button type="submit" className="button primary">
                  <Icon name="plus" size={16} />
                  Lokal speichern
                </button>
              </div>
            </form>
          )}
          {panel.kind === "architecture" && (
            <>
              <p className="dialog-intro">
                Die geplante Verarbeitungskette für den Pilot V1. Externe
                Dienste sind in diesem Prototyp nicht angebunden.
              </p>
              <div className="architecture-detail">
                {architecture.map((a, i) => (
                  <div key={a.title}>
                    <span className="architecture-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{a.title}</strong>
                      <p>{a.description}</p>
                    </span>
                  </div>
                ))}
              </div>
              <div className="detail-callout">
                <Icon name="shield" />
                <p>
                  Preis und Angebot bleiben zunächst in menschlicher Freigabe.
                  Die Datenschicht ist für eine spätere Directus-API
                  vorbereitet.
                </p>
              </div>
            </>
          )}
          {panel.kind === "settings" && (
            <>
              <div className="settings-row">
                <div>
                  <h3>Dunkles Erscheinungsbild</h3>
                  <p>Wird für diesen Browser gespeichert.</p>
                </div>
                <button
                  className={`switch large ${dark ? "on" : ""}`}
                  role="switch"
                  aria-checked={dark}
                  aria-label="Dunkles Erscheinungsbild"
                  onClick={() => setDark(!dark)}
                />
              </div>
              <div className="settings-row">
                <div>
                  <h3>Kompakte Sidebar</h3>
                  <p>Mehr Raum für die Projektübersicht.</p>
                </div>
                <button
                  className={`switch large ${collapsed ? "on" : ""}`}
                  role="switch"
                  aria-checked={collapsed}
                  aria-label="Kompakte Sidebar"
                  onClick={() => setCollapsed(!collapsed)}
                />
              </div>
              <div className="detail-block">
                <h3>Datenquelle</h3>
                <p>
                  Statische Projektdaten mit lokalen Ergänzungen. Es ist keine
                  externe API verbunden.
                </p>
              </div>
            </>
          )}
          {panel.kind === "notifications" && (
            <div className="search-hint">
              <Icon name="bell" size={30} />
              <h3>Keine Benachrichtigungen vorhanden</h3>
              <p>
                Dieser V1-Prototyp ist noch mit keinem Benachrichtigungsdienst
                verbunden.
              </p>
            </div>
          )}
          {panel.kind === "profile" && (
            <>
              <div className="profile-detail">
                <span className="avatar">SC</span>
                <h3>Projektteam</h3>
                <p>KMU-Prozessoptimierung</p>
              </div>
              <div className="detail-callout">
                <Icon name="building" />
                <p>
                  Lokaler Projekt-Workspace ohne Anmeldung. Aufgaben und
                  Entscheidungen werden ausschließlich in diesem Browser
                  gespeichert.
                </p>
              </div>
              <p className="detail-disclaimer">
                „Prozessblick“ ist ein vorläufiger Namenskandidat und noch nicht
                abschließend geprüft.
              </p>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
export default App;
