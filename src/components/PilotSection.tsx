import type { DashboardData, ProjectArea, Panel } from "../types";
import { Badge, EmptyState, Icon, SectionTitle } from "./UI";
import { pilotFlow, requiredFields } from "../data";
export function PilotSection({ data }: { data: DashboardData }) {
  return (
    <>
      <section className="pilot-section" id="pilot">
        <SectionTitle
          eyebrow="DER PRAXISNACHWEIS"
          title="Pilot – Zaunbetrieb"
          subtitle="Vom manuellen Eingang zum strukturierten Anfrageprozess."
        >
          <Badge status="In Arbeit" />
        </SectionTitle>
        <div className="pilot-grid">
          <div className="pilot-main card">
            <div className="pilot-title">
              <span className="project-icon green-icon">
                <Icon name="fence" size={23} />
              </span>
              <div>
                <h3>Ein echter Prozess. Ein klarer Anfang.</h3>
                <span>Vorbereitung / Entwicklung</span>
              </div>
            </div>
            <p className="pilot-description">
              Wir beginnen dort, wo im Alltag Zeit verloren geht: bei der
              Erfassung und Qualifizierung eingehender Kundenanfragen.
            </p>
            <div className="pilot-flow">
              {pilotFlow.map((step, i) => (
                <span key={step}>
                  <span className={`flow-step ${i === 0 ? "first" : ""}`}>
                    {step}
                  </span>
                  {i < pilotFlow.length - 1 && (
                    <Icon name="chevron" size={13} />
                  )}
                </span>
              ))}
            </div>
            <div className="pilot-metrics">
              {data.pilotMetrics.map((metric) => (
                <div key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.note}</small>
                </div>
              ))}
            </div>
            <div className="pilot-note">
              <Icon name="shield" size={15} />
              <span>Angebot und Preis bleiben in menschlicher Freigabe.</span>
            </div>
          </div>
          <div className="pilot-requirements card">
            <div className="card-heading">
              <h3>Was eine Anfrage braucht</h3>
              <Icon name="tasks" size={19} />
            </div>
            <p>Pflichtinformationen für einen vollständigen Vorgang.</p>
            <div className="required-grid">
              {requiredFields.map((field) => (
                <span key={field}>
                  <span className="field-circle" />
                  {field}
                </span>
              ))}
            </div>
            <div className="requirements-note">
              <Icon name="help" size={14} />
              Benötigte Angaben, kein Erledigungsstatus.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
