import { STATUSES } from "../constants";
import TaskCard from "./TaskCard";

export default function BoardView({ tasks, members, onTaskClick, onMoveTask }) {
  function handleDragStart(event, taskId) {
    event.dataTransfer.setData("text/plain", taskId);
  }

  function handleDrop(event, status) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const task = tasks.find((item) => item.id === taskId);
    if (task && task.status !== status) {
      onMoveTask(taskId, { status });
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {STATUSES.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <section
            className="min-h-[360px] rounded-lg border border-slate-200 bg-slate-100/70 p-3 transition-colors dark:border-slate-800 dark:bg-slate-900/60"
            key={status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, status)}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold">{status}</h2>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">{columnTasks.length}</span>
            </div>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} members={members} onClick={onTaskClick} onDragStart={handleDragStart} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
