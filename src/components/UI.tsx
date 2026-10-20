import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleHelp,
  ClipboardList,
  Compass,
  Database,
  Ellipsis,
  Fence,
  FileText,
  Flag,
  Layers3,
  LayoutDashboard,
  Menu,
  Megaphone,
  Moon,
  Network,
  Package,
  PanelLeftClose,
  Plus,
  Route,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  TriangleAlert,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Status } from "../types";
export const icons: Record<string, LucideIcon> = {
  activity: Activity,
  arrow: ArrowUpRight,
  bell: Bell,
  book: BookOpen,
  bot: Bot,
  building: Building2,
  calendar: CalendarDays,
  chart: ChartNoAxesCombined,
  check: Check,
  chevron: ChevronRight,
  down: ChevronDown,
  circle: Circle,
  help: CircleHelp,
  tasks: ClipboardList,
  compass: Compass,
  database: Database,
  more: Ellipsis,
  fence: Fence,
  file: FileText,
  flag: Flag,
  layers: Layers3,
  dashboard: LayoutDashboard,
  menu: Menu,
  megaphone: Megaphone,
  moon: Moon,
  network: Network,
  package: Package,
  collapse: PanelLeftClose,
  plus: Plus,
  route: Route,
  search: Search,
  settings: Settings2,
  shield: ShieldCheck,
  filter: SlidersHorizontal,
  sparkles: Sparkles,
  sun: Sun,
  target: Target,
  warning: TriangleAlert,
  workflow: Workflow,
  x: X,
  zap: Zap,
};
export function Icon({
  name,
  size = 18,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = icons[name] || Circle;
  return <Component size={size} strokeWidth={1.65} {...props} />;
}
export function Badge({ status }: { status: Status | string }) {
  const green = [
    "Bestätigt",
    "Laufend",
    "Erledigt",
    "Weitgehend vorbereitet",
  ].includes(status);
  const amber = [
    "In Arbeit",
    "In Prüfung",
    "Zu prüfen",
    "Teilweise in Arbeit",
  ].includes(status);
  const red = status === "Aktiv";
  return (
    <span
      className={`badge ${green ? "green" : amber ? "amber" : red ? "red" : "gray"}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="section-actions">{children}</div>
    </div>
  );
}
export function EmptyState({
  text = "Keine Einträge gefunden.",
  onReset,
}: {
  text?: string;
  onReset?: () => void;
}) {
  return (
    <div className="empty-state">
      <Icon name="search" size={25} />
      <h3>{text}</h3>
      <p>Versuche einen anderen Suchbegriff oder passe die Filter an.</p>
      {onReset && (
        <button className="button secondary" onClick={onReset}>
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
}
