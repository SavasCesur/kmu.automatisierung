import type { DashboardData, ProjectArea, Panel } from "../types";
import { Badge, EmptyState, Icon, SectionTitle } from "./UI";
import { pilotFlow, requiredFields } from "../data";
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
      <section className="overview-grid" aria-label="Executive Overview">
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
            <Icon name="activity" size={18} />
          </div>
          <div className="summary-value">
            <span className="large-dot amber-dot" />
            Auf Kurs
          </div>
          <p>
            Fundament, Datenbasis und
            <br className="desktop-break" /> Pilotentwicklung laufen parallel.
          </p>
          <span className="summary-foot">
            <Badge status="In Arbeit" />
            <span>
              Schritt für Schritt voran <Icon name="arrow" size={13} />
            </span>
          </span>
        </button>
        <button className="summary-card" onClick={() => jump("roadmap")}>
          <div className="summary-top">
            <span>Aktuelle Projektphase</span>
            <Icon name="layers" size={18} />
          </div>
          <div className="summary-value">Pilotentwicklung</div>
          <p>
            Technische Grundlagen und erster
            <br className="desktop-break" /> End-to-End-Prozess.
          </p>
          <span className="summary-foot">
            <span className="muted-label">Datenbasis & Pilot V1</span>
            <Icon name="arrow" size={15} />
          </span>
        </button>
        <button className="summary-card" onClick={() => jump("pilot")}>
          <div className="summary-top">
            <span>Nächster Meilenstein</span>
            <Icon name="flag" size={18} />
          </div>
          <div className="summary-value milestone-value">
            Erster vollständiger
            <br />
            Anfrageprozess
          </div>
          <p>Anfrage → Extraktion → Rückfragen → Vorgang</p>
          <span className="summary-foot">
            <span className="muted-label">Der nächste praktische Nachweis</span>
            <Icon name="arrow" size={15} />
          </span>
        </button>
        <button
          className="summary-card blocker-summary"
          onClick={() => jump("risks")}
        >
          <div className="summary-top">
            <span>Aktive Blocker</span>
            <Icon name="warning" size={18} />
          </div>
          <div className="summary-value milestone-value">
            Mehrere Punkte
            <br />
            in Prüfung
          </div>
          <p>
            Lexware, Kommunikationskanäle,
            <br className="desktop-break" /> Datenschutz.
          </p>
          <span className="summary-foot">
            <span className="warning-label">Aufmerksamkeit erforderlich</span>
            <Icon name="arrow" size={15} />
          </span>
        </button>
      </section>
      <section className="priority-card">
        <div className="priority-content">
          <div className="priority-eyebrow">
            <span className="priority-icon">
              <Icon name="target" size={18} />
            </span>{" "}
            AKTUELLE HAUPTPRIORITÄT <span className="focus-chip">Fokus V1</span>
          </div>
          <h2>
            Pilot V1 technisch
            <br className="mobile-only" /> funktionsfähig machen.
          </h2>
          <p>
            Eine reale Kundenanfrage automatisch erfassen, auswerten, fehlende
            Informationen
            <br className="desktop-break" /> erkennen und als strukturierten
            Vorgang speichern.
          </p>
          <div className="priority-bottom">
            <span>
              <span className="light-dot" />
              Der erste relevante Praxisnachweis
            </span>
            <button
              onClick={() =>
                setPanel({ kind: "project", item: data.projects[0] })
              }
            >
              Pilot im Detail <Icon name="arrow" size={15} />
            </button>
          </div>
        </div>
        <div className="priority-steps">
          {[
            ["Datenmodell", "In Arbeit"],
            ["Eingangskanal", "In Arbeit"],
            ["KI-Extraktion", "Geplant"],
            ["Strukturierter Vorgang", "Geplant"],
          ].map(([label, state], i) => (
            <div
              className={`priority-step ${i < 2 ? "working" : ""}`}
              key={label}
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
              {i < 2 && <span className="step-pulse" />}
            </div>
          ))}
        </div>
        <div className="priority-watermark" aria-hidden="true">
          ↗
        </div>
      </section>
    </>
  );
}
