export type Status =
  | "In Arbeit"
  | "Geplant"
  | "Offen"
  | "Bestätigt"
  | "Laufend"
  | "In Prüfung"
  | "Aktiv"
  | "Zu prüfen"
  | "Architekturthema"
  | "Später"
  | "Weitgehend vorbereitet"
  | "Teilweise in Arbeit"
  | "Erledigt";
export type Priority = "Sehr hoch" | "Hoch" | "Mittel";
export interface ProjectArea {
  id: string;
  number: string;
  title: string;
  status: Status;
  priority?: Priority;
  currentGoal: string;
  nextStep: string;
  details?: string;
  icon: string;
}
export interface Task {
  id: string;
  title: string;
  area: string;
  priority: Priority;
  status: Status;
  dependency: string;
}
export interface Risk {
  id: string;
  title: string;
  status: Status;
  impact: string;
  description: string;
  mitigation: string;
}
export interface Decision {
  id: string;
  topic: string;
  decision: string;
  status: Status;
  impact: string;
}
export interface Milestone {
  id: string;
  title: string;
  status: Status;
  items: string[];
}
export interface DashboardData {
  projects: ProjectArea[];
  tasks: Task[];
  risks: Risk[];
  decisions: Decision[];
  milestones: Milestone[];
  pilotMetrics: { label: string; value: string; note: string }[];
}

export type Panel =
  | { kind: "project"; item: ProjectArea }
  | { kind: "task"; item: Task }
  | { kind: "risk"; item: Risk }
  | { kind: "decision"; item: Decision }
  | {
      kind:
        | "search"
        | "settings"
        | "notifications"
        | "architecture"
        | "newTask"
        | "newDecision"
        | "profile";
    };
