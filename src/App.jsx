import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Columns3,
  Grid3X3,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Sun,
  UsersRound
} from "lucide-react";
import { getData, updateTask, createTask } from "./api";
import { aiSuggestions, PRIORITIES, STATUSES } from "./constants";
import { applyFilters, calculateStats, formatDate } from "./utils";
import BoardView from "./components/BoardView";
import Dashboard from "./components/Dashboard";
import EducationPage from "./components/EducationPage";
import GridView from "./components/GridView";
import TaskModal from "./components/TaskModal";

const defaultFilters = {
  search: "",
  priority: "All",
  assignee: "All",
  status: "All",
  due: "All",
  sort: "Recently updated"
};

function createBlankTask(memberId) {
  return {
    title: "New sprint task",
    description: "Describe the work, acceptance criteria, and expected outcome.",
    priority: "Medium",
    assignee: memberId,
    dueDate: "2026-05-15",
    startDate: "2026-05-08",
    status: "Backlog",
    tags: ["Planning"],
    progress: 0,
    label: "#2563eb",
    points: 3,
    notes: "",
    comments: [],
    subtasks: [{ text: "Define acceptance criteria", done: false }],
    attachments: []
  };
}

export default function App() {
  // App-level state keeps the demo easy to explain: API data, current view,
  // filters, selected task, theme, and real-time notifications all live here.
  const [data, setData] = useState({ tasks: [], members: [], sprints: [], activity: [] });
  const [view, setView] = useState(() => localStorage.getItem("view") || "dashboard");
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTask, setSelectedTask] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState([
    { title: "Sprint reminder", message: "Daily standup starts at 9:30 AM." },
    { title: "Calendar sync", message: "Sprint review is mocked for May 15." }
  ]);

  useEffect(() => {
    getData().then(setData).catch(console.error);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  useEffect(() => {
    // Socket.io lets two browser windows see task changes without refreshing.
    const socket = io();
    socket.on("data:changed", setData);
    socket.on("notification", (note) => setNotifications((current) => [note, ...current].slice(0, 6)));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    function handleShortcuts(event) {
      const isTyping = ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName);
      if (isTyping || event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === "1") setView("dashboard");
      if (event.key === "2") setView("board");
      if (event.key === "3") setView("grid");
      if (event.key.toLowerCase() === "n") addTask();
    }

    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, [data.members]);

  const filteredTasks = useMemo(() => applyFilters(data.tasks, filters), [data.tasks, filters]);
  const stats = useMemo(() => calculateStats(data.tasks, data.members), [data.tasks, data.members]);

  async function patchTask(id, updates) {
    const optimistic = {
      ...data,
      tasks: data.tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task))
    };
    setData(optimistic);
    await updateTask(id, updates);
  }

  async function addTask() {
    const task = createBlankTask(data.members[0]?.id || "alex");
    const created = await createTask(task);
    setSelectedTask(created);
  }

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <main>
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Scrum and Agile Workflow Management</p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AgileFlow Sprint Workspace</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SegmentedButton active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<LayoutDashboard size={17} />} label="Dashboard" />
              <SegmentedButton active={view === "board"} onClick={() => setView("board")} icon={<Columns3 size={17} />} label="Board" />
              <SegmentedButton active={view === "grid"} onClick={() => setView("grid")} icon={<Grid3X3 size={17} />} label="Grid" />
              <SegmentedButton active={view === "learn"} onClick={() => setView("learn")} icon={<UsersRound size={17} />} label="Learn" />
              <button className="icon-button" title="Toggle dark mode" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="primary-button" onClick={addTask}>
                <Plus size={18} /> Task
              </button>
            </div>
          </div>
        </header>

        <section className="px-4 py-5 sm:px-6">
          <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <Filters filters={filters} members={data.members} onChange={updateFilter} />
              {view === "dashboard" && <Dashboard data={data} stats={stats} />}
              {view === "board" && <BoardView members={data.members} tasks={filteredTasks} onTaskClick={setSelectedTask} onMoveTask={patchTask} />}
              {view === "grid" && <GridView members={data.members} tasks={filteredTasks} onTaskClick={setSelectedTask} onUpdate={patchTask} />}
              {view === "learn" && <EducationPage />}
            </div>
            <RightRail data={data} stats={stats} notifications={notifications} />
          </div>
        </section>
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          members={data.members}
          onClose={() => setSelectedTask(null)}
          onSave={async (updates) => {
            await patchTask(selectedTask.id, updates);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}

function SegmentedButton({ active, icon, label, onClick }) {
  return (
    <button className={`segmented-button ${active ? "segmented-active" : ""}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function Filters({ filters, members, onChange }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(5,minmax(140px,180px))]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" value={filters.search} onChange={(event) => onChange("search", event.target.value)} placeholder="Search tasks, tags, descriptions" />
        </label>
        <select className="input" value={filters.priority} onChange={(event) => onChange("priority", event.target.value)}>
          <option>All</option>
          {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
        </select>
        <select className="input" value={filters.assignee} onChange={(event) => onChange("assignee", event.target.value)}>
          <option value="All">All members</option>
          {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
        </select>
        <select className="input" value={filters.status} onChange={(event) => onChange("status", event.target.value)}>
          <option>All</option>
          {STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className="input" value={filters.due} onChange={(event) => onChange("due", event.target.value)}>
          <option>All</option>
          <option>Due soon</option>
          <option>Overdue</option>
          <option>No start date</option>
        </select>
        <select className="input" value={filters.sort} onChange={(event) => onChange("sort", event.target.value)}>
          <option>Recently updated</option>
          <option>Due date</option>
          <option>Priority</option>
          <option>Progress</option>
        </select>
      </div>
    </div>
  );
}

function RightRail({ data, stats, notifications }) {
  const sprint = data.sprints[0];
  return (
    <aside className="space-y-5">
      <section className="panel">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Sprint</h2>
          <CalendarDays size={18} className="text-blue-500" />
        </div>
        <h3 className="mt-3 text-lg font-bold">{sprint?.name}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sprint?.goal}</p>
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{formatDate(sprint?.startDate)}</span>
            <span>{formatDate(sprint?.endDate)}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Notifications</h2>
          <Bell size={18} className="text-blue-500" />
        </div>
        <div className="mt-3 space-y-3">
          {notifications.slice(0, 4).map((note, index) => (
            <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800" key={`${note.title}-${index}`}>
              <p className="text-sm font-semibold">{note.title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{note.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="flex items-center justify-between">
          <h2 className="section-title">AI Suggestions</h2>
          <Bot size={18} className="text-blue-500" />
        </div>
        <div className="mt-3 space-y-3">
          {aiSuggestions.map((suggestion) => (
            <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-300" key={suggestion}>
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">Activity Log</h2>
        <div className="mt-3 space-y-3">
          {data.activity.slice(0, 5).map((item) => (
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800" key={item.id}>
              <p className="text-sm font-semibold">{item.message}</p>
              <p className="text-xs uppercase text-slate-500">{item.time}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
