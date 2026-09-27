import React from 'react';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { Calendar, Edit3, Trash2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  // Format due date & calculate overdue status
  const isOverdue = React.useMemo(() => {
    if (!task.due_date || task.status === 'Completed') return false;
    return new Date(task.due_date) < new Date();
  }, [task.due_date, task.status]);

  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const priorityStyles: Record<TaskPriority, { bg: string; text: string; border: string }> = {
    Low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    Medium: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
    High: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    Critical: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  };

  const statusStyles: Record<TaskStatus, { bg: string; text: string }> = {
    Todo: { bg: 'bg-slate-800 text-slate-300', text: 'text-slate-300' },
    'In Progress': { bg: 'bg-sky-950 text-sky-300 border border-sky-500/30', text: 'text-sky-300' },
    Completed: { bg: 'bg-emerald-950 text-emerald-300 border border-emerald-500/30', text: 'text-emerald-300' },
  };

  const currentPriority = priorityStyles[task.priority] || priorityStyles.Medium;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 hover:shadow-2xl transition-all flex flex-col justify-between gap-4 group backdrop-blur-xl">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${currentPriority.bg} ${currentPriority.text} ${currentPriority.border} flex items-center gap-1`}
          >
            {task.priority === 'Critical' && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            )}
            {task.priority}
          </span>

          {/* Quick status selector */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-0 focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors ${
              statusStyles[task.status]?.bg || 'bg-slate-800 text-slate-200'
            }`}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-base text-slate-100 line-clamp-2 leading-snug ${
            task.status === 'Completed' ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        {/* Due Date Indicator */}
        {formattedDueDate ? (
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue
                ? 'text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20'
                : task.status === 'Completed'
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : task.status === 'Completed' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span>{formattedDueDate}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-500 italic">
            <Clock className="w-3.5 h-3.5" />
            <span>No due date</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
