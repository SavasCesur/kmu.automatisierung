import type { DashboardData, ProjectArea, Panel } from "../types";
import { Badge, EmptyState, Icon, SectionTitle } from "./UI";
import { pilotFlow, requiredFields } from "../data";
export function DecisionsSection({
  data,
  setPanel,
}: {
  data: DashboardData;
  setPanel: (p: Panel) => void;
}) {
  return (
    <>
      <section id="decisions" className="decisions-section">
        <SectionTitle
          title="Letzte wichtige Entscheidungen"
          subtitle="Festgehalten, damit wir auf einer gemeinsamen Grundlage weiterarbeiten."
        >
          <button
            className="text-button"
            onClick={() => setPanel({ kind: "newDecision" })}
          >
            <Icon name="plus" size={15} />
            Entscheidung hinzufügen
          </button>
        </SectionTitle>
        <div className="decision-table card">
          <table>
            <thead>
              <tr>
                <th>Thema</th>
                <th>Entscheidung</th>
                <th>Status</th>
                <th>Auswirkung</th>
                <th>
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.decisions.map((d) => (
                <tr key={d.id}>
                  <td>
                    <button
                      className="table-link"
                      onClick={() => setPanel({ kind: "decision", item: d })}
                    >
                      {d.topic}
                    </button>
                  </td>
                  <td>{d.decision}</td>
                  <td>
                    <Badge status={d.status} />
                  </td>
                  <td className="impact-cell">{d.impact}</td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`Entscheidung ${d.topic} öffnen`}
                      onClick={() => setPanel({ kind: "decision", item: d })}
                    >
                      <Icon name="arrow" size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
