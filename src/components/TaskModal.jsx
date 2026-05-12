import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { PRIORITIES, STATUSES } from "../constants";

export default function TaskModal({ task, members, onClose, onSave }) {
  const [draft, setDraft] = useState({
    ...task,
    tagsText: task.tags.join(", ")
  });

  function update(name, value) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function addComment() {
    setDraft((current) => ({ ...current, comments: [...current.comments, "New comment"] }));
  }

  function updateComment(index, value) {
    setDraft((current) => ({
      ...current,
      comments: current.comments.map((comment, commentIndex) => (commentIndex === index ? value : comment))
    }));
  }

  function removeComment(index) {
    setDraft((current) => ({
      ...current,
      comments: current.comments.filter((_, commentIndex) => commentIndex !== index)
    }));
  }

  function addSubtask() {
    setDraft((current) => ({ ...current, subtasks: [...current.subtasks, { text: "New checklist item", done: false }] }));
  }

  function updateSubtask(index, updates) {
    setDraft((current) => ({
      ...current,
      subtasks: current.subtasks.map((item, itemIndex) => (itemIndex === index ? { ...item, ...updates } : item))
    }));
  }

  function removeSubtask(index) {
    setDraft((current) => ({
      ...current,
      subtasks: current.subtasks.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  function addAttachments(files) {
    const names = Array.from(files).map((file) => file.name);
    setDraft((current) => ({ ...current, attachments: [...current.attachments, ...names] }));
  }

  function removeAttachment(index) {
    setDraft((current) => ({
      ...current,
      attachments: current.attachments.filter((_, attachmentIndex) => attachmentIndex !== index)
    }));
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
            <p className="text-sm font-semibold text-accent">Task editor</p>
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
            <input className="mt-3 w-full accent-control" type="range" min="0" max="100" value={draft.progress} onChange={(event) => update("progress", event.target.value)} />
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
          <EditableList title="Comments" onAdd={addComment}>
            {draft.comments.length === 0 && <p className="text-sm text-slate-500">No comments yet</p>}
            {draft.comments.map((comment, index) => (
              <div className="flex gap-2" key={`comment-${index}`}>
                <input className="input" value={comment} onChange={(event) => updateComment(index, event.target.value)} />
                <button className="icon-button" title="Remove comment" onClick={() => removeComment(index)}><Trash2 size={15} /></button>
              </div>
            ))}
          </EditableList>

          <EditableList title="Checklist" onAdd={addSubtask}>
            {draft.subtasks.map((item, index) => (
              <div className="flex items-center gap-2" key={`subtask-${index}`}>
                <input className="size-4 accent-control" type="checkbox" checked={item.done} onChange={(event) => updateSubtask(index, { done: event.target.checked })} />
                <input className="input" value={item.text} onChange={(event) => updateSubtask(index, { text: event.target.value })} />
                <button className="icon-button" title="Remove checklist item" onClick={() => removeSubtask(index)}><Trash2 size={15} /></button>
              </div>
            ))}
          </EditableList>

          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <h3 className="font-bold">Attachments</h3>
            <label className="secondary-button mt-3 w-full justify-center">
              Attach files
              <input className="hidden" type="file" multiple onChange={(event) => addAttachments(event.target.files)} />
            </label>
            <div className="mt-3 space-y-2">
              {draft.attachments.length === 0 && <p className="text-sm text-slate-500">No files attached</p>}
              {draft.attachments.map((attachment, index) => (
                <div className="flex items-center justify-between gap-2 rounded-md bg-slate-100 p-2 text-sm dark:bg-slate-800" key={`${attachment}-${index}`}>
                  <span className="truncate">{attachment}</span>
                  <button className="icon-button size-8" title="Remove attachment" onClick={() => removeAttachment(index)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={save}>Save task</button>
        </div>
      </section>
    </div>
  );
}

function EditableList({ title, onAdd, children }) {
  return (
    <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold">{title}</h3>
        <button className="icon-button size-8" title={`Add ${title}`} onClick={onAdd}><Plus size={14} /></button>
      </div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}
