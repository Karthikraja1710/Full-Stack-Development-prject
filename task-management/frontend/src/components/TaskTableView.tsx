import React from 'react';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { Edit3, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface TaskTableViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
}

export const TaskTableView: React.FC<TaskTableViewProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const priorityBadges: Record<TaskPriority, string> = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center my-6">
        <p className="text-slate-400 text-sm font-medium">No tasks found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tasks.map((task) => {
              const isOverdue =
                task.due_date && task.status !== 'Completed' && new Date(task.due_date) < new Date();
              const formattedDate = task.due_date
                ? new Date(task.due_date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '-';

              return (
                <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-100">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{task.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${priorityBadges[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formattedDate !== '-' ? (
                      <div
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          isOverdue ? 'text-rose-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {isOverdue ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{formattedDate}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs italic">No due date</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
