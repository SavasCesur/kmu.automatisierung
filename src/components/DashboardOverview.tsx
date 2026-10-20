import type { DashboardData, Panel } from "../types";
import { Badge, Icon } from "./UI";
export function DashboardOverview({
  data,
  setPanel,
  jump,
}: {
  data: DashboardData;
  setPanel: (p: Panel) => void;
  jump: (id: string) => void;
}) {
  return (
    <>
      <section className="overview-grid" aria-label="Projektüberblick">
        <button
          className="summary-card"
          onClick={() =>
            setPanel({
              kind: "project",
              item: {
                id: "overview",
                number: "00",
                title: "Projektstatus",
                status: "In Arbeit",
                currentGoal:
                  "Fundament, Datenbasis und Pilotentwicklung laufen parallel.",
                nextStep: "Pilot V1 technisch funktionsfähig machen.",
                icon: "activity",
              },
            })
          }
        >
          <div className="summary-top">
            <span>Projektstatus</span>
            <Icon name="activity" />
          </div>
          <div className="summary-value">
            <span className="large-dot amber-dot" />
            Auf Kurs
          </div>
          <Badge status="In Arbeit" />
        </button>
        <button className="summary-card" onClick={() => jump("pilot")}>
          <div className="summary-top">
            <span>Nächster Meilenstein</span>
            <Icon name="flag" />
          </div>
          <div className="summary-value">Anfrageprozess V1</div>
          <p>
            Erster vollständiger Durchlauf <Icon name="arrow" size={14} />
          </p>
        </button>
        <button className="summary-card" onClick={() => jump("risks")}>
          <div className="summary-top">
            <span>Aufmerksamkeit</span>
            <Icon name="warning" />
          </div>
          <div className="summary-value">Punkte in Prüfung</div>
          <p>
            Lexware · Kanäle · Datenschutz <Icon name="arrow" size={14} />
          </p>
        </button>
      </section>
      <section className="priority-card">
        <div className="priority-content">
          <span className="priority-eyebrow">
            <Icon name="target" size={18} />
            JETZT IM FOKUS <span className="focus-chip">Pilot V1</span>
          </span>
          <h2>Pilot technisch funktionsfähig machen.</h2>
          <p>
            Eine reale Anfrage erfassen, auswerten und als vollständigen Vorgang
            speichern.
          </p>
          <button className="priority-detail" onClick={() => jump("pilot")}>
            Pilot ansehen <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="priority-steps">
          {[
            ["Datenmodell", "In Arbeit"],
            ["Eingangskanal", "In Arbeit"],
            ["KI-Extraktion", "Geplant"],
            ["Strukturierter Vorgang", "Geplant"],
          ].map(([label, state], i) => (
            <div
              key={label}
              className={`priority-step ${i < 2 ? "working" : ""}`}
            >
              <span className="step-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <strong>{label}</strong>
                <small>
                  <span className="status-dot" />
                  {state}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
