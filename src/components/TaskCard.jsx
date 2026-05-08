import { MessageSquare, Paperclip, ListChecks } from "lucide-react";
import { priorityStyles } from "../constants";
import { formatDate, getMember } from "../utils";
import Avatar from "./Avatar";

export default function TaskCard({ task, members, onClick, onDragStart }) {
  const member = getMember(members, task.assignee);

  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onClick={() => onClick(task)}
      className="task-card"
      style={{ borderTopColor: task.label }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold leading-snug">{task.title}</h3>
        <span className={`badge ${priorityStyles[task.priority]}`}>{task.priority}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{task.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.tags.map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
          <span>{task.progress}%</span>
          <span>Due {formatDate(task.dueDate)}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${task.progress}%` }} />
        </div>
      </div>
      <footer className="mt-4 flex items-center justify-between">
        <Avatar member={member} small />
        <div className="flex items-center gap-3 text-slate-500">
          <span className="card-meta"><MessageSquare size={14} />{task.comments.length}</span>
          <span className="card-meta"><ListChecks size={14} />{task.subtasks.filter((item) => item.done).length}/{task.subtasks.length}</span>
          <span className="card-meta"><Paperclip size={14} />{task.attachments.length}</span>
        </div>
      </footer>
    </article>
  );
}
