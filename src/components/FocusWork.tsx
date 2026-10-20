import type { DashboardData, Panel, Task } from "../types";
import { Badge, EmptyState, Icon } from "./UI";
export function FocusWork({
  data,
  view,
  tasks,
  taskTab,
  setTaskTab,
  renderTask,
  setPanel,
  jump,
}: {
  data: DashboardData;
  view: string;
  tasks: Task[];
  taskTab: string;
  setTaskTab: (tab: string) => void;
  renderTask: (task: Task) => React.ReactNode;
  setPanel: (panel: Panel) => void;
  jump: (id: string) => void;
}) {
  const overview = view === "overview";
  const priorities = { "Sehr hoch": 2, Hoch: 1, Mittel: 0 };
  const visibleTasks = overview
    ? data.tasks
        .filter((task) => task.status !== "Erledigt")
        .sort((a, b) => priorities[b.priority] - priorities[a.priority])
        .slice(0, 3)
    : tasks;
  return (
    <div className={`work-grid ${overview ? "" : "single-view"}`}>
      {(overview || view === "tasks") && (
        <section className="tasks-section card" id="tasks">
          <div className="inner-section-heading">
            <div>
              <h2>{overview ? "Die nächsten Schritte" : "Aufgaben"}</h2>
              <p>
                {overview
                  ? "Die wichtigsten offenen Aufgaben im Fokus."
                  : "Alle Aufgaben mit Status und Priorität."}
              </p>
            </div>
            <button
              className="icon-button"
              aria-label="Neue Aufgabe erstellen"
              onClick={() => setPanel({ kind: "newTask" })}
            >
              <Icon name="plus" />
            </button>
          </div>
          {!overview && (
            <div className="task-tabs">
              {["Alle", "In Arbeit", "Offen & geplant"].map((tab) => (
                <button
                  key={tab}
                  className={taskTab === tab ? "active" : ""}
                  aria-pressed={taskTab === tab}
                  onClick={() => setTaskTab(tab)}
                >
                  {tab}
                  {tab === "Alle" && <span>{data.tasks.length}</span>}
                </button>
              ))}
            </div>
          )}
          <div className="task-list">
            {visibleTasks.length ? (
              visibleTasks.map(renderTask)
            ) : (
              <EmptyState
                text="Keine Aufgaben in diesem Status."
                onReset={() => setTaskTab("Alle")}
              />
            )}
          </div>
          {overview && (
            <button
              className="card-bottom-action"
              onClick={() => jump("tasks")}
            >
              Alle Aufgaben ansehen <Icon name="arrow" size={15} />
            </button>
          )}
        </section>
      )}
      {(overview || view === "risks") && (
        <section
          className={`risks-section card ${overview ? "compact-risks" : ""}`}
          id="risks"
        >
          <div className="inner-section-heading">
            <div>
              <h2>Risiken & Blocker</h2>
              <p>
                {overview
                  ? "Diese Themen brauchen Aufmerksamkeit."
                  : "Risiken, Auswirkungen und Gegenmaßnahmen."}
              </p>
            </div>
            <span className="risk-heading-icon">
              <Icon name="warning" size={19} />
            </span>
          </div>
          <div className="risk-list">
            {(overview ? data.risks.slice(0, 2) : data.risks).map((risk) => (
              <button
                className="risk-row"
                key={risk.id}
                onClick={() => setPanel({ kind: "risk", item: risk })}
              >
                <span
                  className={`risk-marker ${risk.status === "Aktiv" ? "red-marker" : ""}`}
                />
                <span>
                  <strong>{risk.title}</strong>
                  {!overview && <small>{risk.description}</small>}
                  <span className="risk-meta">
                    <Badge status={risk.status} />
                    <span>Auswirkung: {risk.impact}</span>
                  </span>
                </span>
                <Icon name="chevron" size={15} />
              </button>
            ))}
          </div>
          <button
            className="card-bottom-action"
            onClick={() =>
              overview
                ? jump("risks")
                : setPanel({ kind: "risk", item: data.risks[0] })
            }
          >
            {overview ? "Alle Risiken ansehen" : "Lexware-Prüfung öffnen"}
            <Icon name="arrow" size={15} />
          </button>
        </section>
      )}
    </div>
  );
}
