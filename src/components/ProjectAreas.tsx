import type { DashboardData, ProjectArea, Panel } from "../types";
import { Badge, EmptyState, Icon, SectionTitle } from "./UI";
import { pilotFlow, requiredFields } from "../data";
export function ProjectAreas({
  projects,
  status,
  setStatus,
  priority,
  setPriority,
  setPanel,
  showAll,
  setShowAll,
}: {
  projects: ProjectArea[];
  status: string;
  setStatus: (s: string) => void;
  priority: string;
  setPriority: (s: string) => void;
  setPanel: (p: Panel) => void;
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}) {
  return (
    <>
      <section className="projects-section" id="projects">
        <SectionTitle
          title="Projektbereiche"
          subtitle="Die wichtigsten Arbeitsstränge. Ein gemeinsames Ziel."
        >
          <div className="filters">
            <label className="filter-select">
              <Icon name="filter" size={14} />
              <select
                aria-label="Projektstatus filtern"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {[
                  "Alle Status",
                  "In Arbeit",
                  "Laufend",
                  "Teilweise in Arbeit",
                  "Geplant",
                  "Offen",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <Icon name="down" size={12} />
            </label>
            <label className="filter-select">
              <Icon name="flag" size={14} />
              <select
                aria-label="Priorität filtern"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {["Alle Prioritäten", "Sehr hoch", "Hoch", "Mittel"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
              <Icon name="down" size={12} />
            </label>
          </div>
        </SectionTitle>
        <div className="project-grid">
          {projects.map((project) => (
            <button
              className="project-card"
              key={project.id}
              onClick={() => setPanel({ kind: "project", item: project })}
            >
              <div className="project-card-top">
                <span
                  className={`project-icon ${project.id === "pilot" ? "green-icon" : ""}`}
                >
                  <Icon name={project.icon} size={22} />
                </span>
                <span className="project-number">{project.number}</span>
                <Badge status={project.status} />
              </div>
              <h3>
                {project.title}
                <Icon name="arrow" size={17} />
              </h3>
              <p>{project.currentGoal}</p>
              <div className="project-next">
                <span>NÄCHSTER SCHRITT</span>
                <p>{project.nextStep}</p>
              </div>
              <div className="project-footer">
                <span
                  className={`priority-level ${project.priority === "Sehr hoch" ? "high" : ""}`}
                >
                  <span className="priority-bars">
                    <i />
                    <i />
                    <i />
                  </span>
                  {project.priority
                    ? `Priorität ${project.priority.toLowerCase()}`
                    : "Priorität offen"}
                </span>
                <span>
                  Details <Icon name="chevron" size={13} />
                </span>
              </div>
            </button>
          ))}
        </div>
        {!projects.length && (
          <EmptyState
            onReset={() => {
              setStatus("Alle Status");
              setPriority("Alle Prioritäten");
            }}
          />
        )}
        <button className="all-projects" onClick={() => setShowAll(!showAll)}>
          {showAll
            ? "Weniger Projektbereiche anzeigen"
            : "Alle Projektbereiche anzeigen"}
          <Icon name={showAll ? "down" : "arrow"} size={15} />
        </button>
      </section>
    </>
  );
}
