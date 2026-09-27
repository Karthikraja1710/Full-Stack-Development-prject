import React from 'react';
import type { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, ListTodo, PlayCircle, CheckCircle2 } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onAddTaskClick: (defaultStatus?: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onAddTaskClick,
}) => {
  const columns: { title: string; status: TaskStatus; icon: any; color: string; bg: string; border: string }[] = [
    {
      title: 'TODO',
      status: 'Todo',
      icon: ListTodo,
      color: 'text-slate-300',
      bg: 'bg-slate-800/40',
      border: 'border-slate-800',
    },
    {
      title: 'IN PROGRESS',
      status: 'In Progress',
      icon: PlayCircle,
      color: 'text-sky-400',
      bg: 'bg-sky-950/20',
      border: 'border-sky-500/20',
    },
    {
      title: 'COMPLETED',
      status: 'Completed',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/20',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        const Icon = col.icon;

        return (
          <div
            key={col.status}
            className={`rounded-3xl border ${col.border} ${col.bg} p-5 flex flex-col gap-4 min-h-[500px] backdrop-blur-xl shadow-xl`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${col.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-100 tracking-wider">{col.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300">
                {colTasks.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 flex flex-col gap-3">
              {colTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl text-center">
                  <p className="text-xs text-slate-500 font-medium">No tasks in {col.status.toLowerCase()}</p>
                  <button
                    onClick={() => onAddTaskClick(col.status)}
                    className="mt-3 text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Task
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => onAddTaskClick(col.status)}
              className="w-full py-2.5 px-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Task to {col.status}
            </button>
          </div>
        );
      })}
    </div>
  );
};
