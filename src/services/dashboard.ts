import { initialData } from "../data";
import type { DashboardData, Task, Decision } from "../types";
const storageKey = "kmu-dashboard-v1";
type LocalData = { tasks: Task[]; decisions: Decision[] };
function readLocal(): LocalData {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return { tasks: [], decisions: [] };
  const data = JSON.parse(raw);
  if (!Array.isArray(data.tasks) || !Array.isArray(data.decisions))
    throw new Error(
      "Die lokal gespeicherten Daten konnten nicht gelesen werden.",
    );
  return data;
}
// Replace this adapter with a Directus request when a real API becomes available.
export const dashboardService = {
  async load(): Promise<DashboardData> {
    const local = readLocal();
    return {
      ...initialData,
      tasks: [...local.tasks, ...initialData.tasks],
      decisions: [...local.decisions, ...initialData.decisions],
    };
  },
  addTask(task: Task) {
    const local = readLocal();
    local.tasks.unshift(task);
    localStorage.setItem(storageKey, JSON.stringify(local));
  },
  addDecision(decision: Decision) {
    const local = readLocal();
    local.decisions.unshift(decision);
    localStorage.setItem(storageKey, JSON.stringify(local));
  },
};
