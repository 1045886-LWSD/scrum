export function formatDate(date) {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}

export function getMember(members, id) {
  return members.find((member) => member.id === id) ?? members[0];
}

export function calculateStats(tasks, members) {
  const completed = tasks.filter((task) => task.status === "Done").length;
  const total = tasks.length || 1;
  const workload = members.map((member) => ({
    name: member.name.split(" ")[0],
    tasks: tasks.filter((task) => task.assignee === member.id).length
  }));
  const priority = ["Low", "Medium", "High", "Critical"].map((level) => ({
    name: level,
    value: tasks.filter((task) => task.priority === level).length
  }));
  const status = ["Backlog", "To Do", "In Progress", "Testing", "Done"].map((name) => ({
    name,
    tasks: tasks.filter((task) => task.status === name).length
  }));

  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    workload,
    priority,
    status,
    activePoints: tasks.filter((task) => task.status !== "Done").reduce((sum, task) => sum + task.points, 0)
  };
}

export function applyFilters(tasks, filters) {
  const query = filters.search.trim().toLowerCase();
  const today = new Date("2026-05-08T00:00:00");
  const nextWeek = new Date("2026-05-15T23:59:59");
  let result = tasks.filter((task) => {
    const dueDate = task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null;
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.join(" ").toLowerCase().includes(query);
    const matchesDue =
      filters.due === "All" ||
      (filters.due === "Due soon" && dueDate && dueDate >= today && dueDate <= nextWeek) ||
      (filters.due === "Overdue" && dueDate && dueDate < today && task.status !== "Done") ||
      (filters.due === "No start date" && !task.startDate);

    return (
      matchesSearch &&
      (filters.priority === "All" || task.priority === filters.priority) &&
      (filters.assignee === "All" || task.assignee === filters.assignee) &&
      (filters.status === "All" || task.status === filters.status) &&
      matchesDue
    );
  });

  result = [...result].sort((a, b) => {
    if (filters.sort === "Due date") return new Date(a.dueDate) - new Date(b.dueDate);
    if (filters.sort === "Priority") {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return order[a.priority] - order[b.priority];
    }
    if (filters.sort === "Progress") return b.progress - a.progress;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return result;
}
