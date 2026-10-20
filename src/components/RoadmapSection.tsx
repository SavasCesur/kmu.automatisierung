import type { DashboardData, ProjectArea, Panel } from "../types";
import { Badge, EmptyState, Icon, SectionTitle } from "./UI";
import { pilotFlow, requiredFields } from "../data";
export function RoadmapSection({
  data,
  setPanel,
}: {
  data: DashboardData;
  setPanel: (p: Panel) => void;
}) {
  return (
    <>
      <section className="roadmap-section" id="roadmap">
        <SectionTitle
          title="Der Weg zum Betriebs-Cockpit"
          subtitle="Ein klarer Rahmen. Bewusst in Etappen."
        >
          <span className="subtle-tag">
            <span className="status-dot" />
            Zwei aktive Arbeitsphasen
          </span>
        </SectionTitle>
        <div className="roadmap card">
          {data.milestones.map((m, i) => (
            <button
              className={`roadmap-phase ${i === 1 || i === 2 ? "current" : ""}`}
              key={m.id}
              onClick={() =>
                setPanel({
                  kind: "project",
                  item: {
                    id: m.id,
                    number: `Phase ${i + 1}`,
                    title: m.title,
                    status: m.status,
                    currentGoal: m.items.join(" · "),
                    nextStep:
                      i === 1 || i === 2
                        ? "Aktuellen Arbeitsstrang weiterentwickeln."
                        : "Gemäß Roadmap konkretisieren.",
                    icon: "route",
                  },
                })
              }
            >
              <div className="roadmap-track">
                <span className="roadmap-dot">
                  {i === 0 ? (
                    <Icon name="check" size={13} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span className="track-line" />
              </div>
              <h3>{m.title}</h3>
              <span className="roadmap-status">{m.status}</span>
              <ul>
                {m.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
