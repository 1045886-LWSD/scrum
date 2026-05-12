import { useEffect, useState } from "react";
import { priorityStyles, STATUSES } from "../constants";
import { formatDate, getMember } from "../utils";
import Avatar from "./Avatar";

export default function GridView({ tasks, members, onTaskClick, onUpdate }) {
  const [draftProgress, setDraftProgress] = useState({});

  useEffect(() => {
    setDraftProgress((current) => {
      const next = { ...current };
      tasks.forEach((task) => {
        if (next[task.id] === undefined) {
          next[task.id] = task.progress;
        }
      });
      return next;
    });
  }, [tasks]);

  function commitProgress(task) {
    const progress = Number(draftProgress[task.id] ?? task.progress);
    if (progress !== task.progress) {
      onUpdate(task.id, { progress });
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">Task Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Assigned Team Member</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const member = getMember(members, task.assignee);
              return (
                <tr className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60" key={task.id}>
                  <td className="px-4 py-4">
                    <button className="font-bold text-accent hover:underline" onClick={() => onTaskClick(task)}>{task.title}</button>
                  </td>
                  <td className="max-w-[280px] px-4 py-4 text-slate-600 dark:text-slate-300">{task.description}</td>
                  <td className="px-4 py-4"><span className={`badge ${priorityStyles[task.priority]}`}>{task.priority}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2"><Avatar member={member} small /> {member.name}</div>
                  </td>
                  <td className="px-4 py-4">{formatDate(task.startDate)}</td>
                  <td className="px-4 py-4">{formatDate(task.dueDate)}</td>
                  <td className="px-4 py-4">
                    <select className="input min-w-36" value={task.status} onChange={(event) => onUpdate(task.id, { status: event.target.value })}>
                      {STATUSES.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">{task.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      className="w-24 accent-control"
                      type="range"
                      min="0"
                      max="100"
                      value={draftProgress[task.id] ?? task.progress}
                      onChange={(event) => setDraftProgress((current) => ({ ...current, [task.id]: Number(event.target.value) }))}
                      onPointerUp={() => commitProgress(task)}
                      onBlur={() => commitProgress(task)}
                      onKeyUp={(event) => {
                        if (event.key === "Enter" || event.key === " ") commitProgress(task);
                      }}
                    />
                    <span className="ml-2 text-xs font-bold">{draftProgress[task.id] ?? task.progress}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
