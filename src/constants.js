export const STATUSES = ["Backlog", "To Do", "In Progress", "Testing", "Done"];
export const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const priorityStyles = {
  Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  Critical: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
};

export const aiSuggestions = [
  "Split the dashboard task into chart, filter, and mobile polish subtasks.",
  "Move high-priority testing work earlier to reduce end-of-sprint risk.",
  "Ask the Product Owner to clarify acceptance criteria for AI suggestions.",
  "Pair a backend developer with QA on real-time notification testing."
];
