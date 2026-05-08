import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Avatar from "./Avatar";

const burndown = [
  { day: "Day 1", ideal: 76, actual: 76 },
  { day: "Day 3", ideal: 61, actual: 67 },
  { day: "Day 5", ideal: 46, actual: 51 },
  { day: "Day 7", ideal: 30, actual: 34 },
  { day: "Day 9", ideal: 15, actual: 18 },
  { day: "Done", ideal: 0, actual: 7 }
];

const velocity = [
  { sprint: "S9", points: 31 },
  { sprint: "S10", points: 38 },
  { sprint: "S11", points: 34 },
  { sprint: "S12", points: 42 }
];

const colors = ["#64748b", "#f59e0b", "#f97316", "#ef4444"];

export default function Dashboard({ data, stats }) {
  const recent = [...data.tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Completed" value={`${stats.completed}/${stats.total}`} detail={`${stats.percent}% of sprint tasks`} />
        <Metric label="Active Story Points" value={stats.activePoints} detail="Remaining team effort" />
        <Metric label="Team Members" value={data.members.length} detail="Cross-functional roles" />
        <Metric label="Sprint Health" value={stats.percent >= 50 ? "On Track" : "Watch"} detail="Based on done work" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="panel min-h-[320px]">
          <h2 className="section-title">Burndown Chart</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={burndown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeWidth={2} />
              <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="panel min-h-[320px]">
          <h2 className="section-title">Team Workload</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.workload}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1.1fr]">
        <section className="panel">
          <h2 className="section-title">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.priority} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {stats.priority.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h2 className="section-title">Velocity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={velocity}>
              <XAxis dataKey="sprint" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="points" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h2 className="section-title">Recently Updated</h2>
          <div className="mt-4 space-y-3">
            {recent.map((task) => (
              <div className="flex items-center justify-between rounded-md bg-slate-100 p-3 dark:bg-slate-800" key={task.id}>
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.status} - {task.progress}% complete</p>
                </div>
                <Avatar member={data.members.find((member) => member.id === task.assignee)} small />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2 className="section-title">Team Directory</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.members.map((member) => {
            const count = data.tasks.filter((task) => task.assignee === member.id).length;
            return (
              <div className="flex items-center gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800" key={member.id}>
                <Avatar member={member} />
                <div>
                  <p className="font-bold">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.role} - {count} assigned</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, detail }) {
  return (
    <section className="panel">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{detail}</p>
    </section>
  );
}
