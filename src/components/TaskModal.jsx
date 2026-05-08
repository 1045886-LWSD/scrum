import { useState } from "react";
import { X } from "lucide-react";
import { PRIORITIES, STATUSES } from "../constants";

export default function TaskModal({ task, members, onClose, onSave }) {
  const [draft, setDraft] = useState({
    ...task,
    tagsText: task.tags.join(", ")
  });

  function update(name, value) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function save() {
    const { tagsText, ...rest } = draft;
    onSave({
      ...rest,
      tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      progress: Number(rest.progress)
    });
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Task editor</p>
            <h2 className="text-2xl font-bold">{task.title}</h2>
          </div>
          <button className="icon-button" title="Close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="field md:col-span-2">Title
            <input className="input mt-1" value={draft.title} onChange={(event) => update("title", event.target.value)} />
          </label>
          <label className="field md:col-span-2">Description
            <textarea className="input mt-1 min-h-24" value={draft.description} onChange={(event) => update("description", event.target.value)} />
          </label>
          <label className="field">Priority
            <select className="input mt-1" value={draft.priority} onChange={(event) => update("priority", event.target.value)}>
              {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label className="field">Status
            <select className="input mt-1" value={draft.status} onChange={(event) => update("status", event.target.value)}>
              {STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="field">Assigned Team Member
            <select className="input mt-1" value={draft.assignee} onChange={(event) => update("assignee", event.target.value)}>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </label>
          <label className="field">Progress
            <input className="mt-3 w-full accent-blue-600" type="range" min="0" max="100" value={draft.progress} onChange={(event) => update("progress", event.target.value)} />
            <span className="text-sm font-bold">{draft.progress}%</span>
          </label>
          <label className="field">Start Date
            <input className="input mt-1" type="date" value={draft.startDate || ""} onChange={(event) => update("startDate", event.target.value)} />
          </label>
          <label className="field">Due Date
            <input className="input mt-1" type="date" value={draft.dueDate} onChange={(event) => update("dueDate", event.target.value)} />
          </label>
          <label className="field">Color Label
            <input className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-950" type="color" value={draft.label} onChange={(event) => update("label", event.target.value)} />
          </label>
          <label className="field">Tags
            <input className="input mt-1" value={draft.tagsText} onChange={(event) => update("tagsText", event.target.value)} />
          </label>
          <label className="field md:col-span-2">Notes
            <textarea className="input mt-1 min-h-20" value={draft.notes} onChange={(event) => update("notes", event.target.value)} />
          </label>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoList title="Comments" items={draft.comments} />
          <InfoList title="Checklist" items={draft.subtasks.map((item) => `${item.done ? "Done" : "Open"}: ${item.text}`)} />
          <InfoList title="Attachments" items={draft.attachments.length ? draft.attachments : ["No files attached"]} />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={save}>Save task</button>
        </div>
      </section>
    </div>
  );
}

function InfoList({ title, items }) {
  return (
    <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ul>
    </div>
  );
}
