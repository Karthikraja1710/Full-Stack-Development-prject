import React from 'react';
import type { TaskStats as TaskStatsType } from '../types';
import { CheckCircle2, Clock, AlertCircle, Layers, PlayCircle } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStatsType | null;
  isLoading?: boolean;
}

export const TaskStatsComponent: React.FC<TaskStatsProps> = ({ stats, isLoading }) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: Layers,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
    },
    {
      title: 'Pending (Todo)',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      title: 'In Progress',
      value: stats.in_progress,
      icon: PlayCircle,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: stats.overdue > 0 ? 'text-rose-400' : 'text-slate-400',
      bg: stats.overdue > 0 ? 'bg-rose-500/10' : 'bg-slate-800/40',
      border: stats.overdue > 0 ? 'border-rose-500/30' : 'border-slate-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        const percent = stats.total > 0 ? Math.round((card.value / stats.total) * 100) : 0;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${card.border} bg-slate-900/80 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-black text-white tracking-tight">{card.value}</span>
              {card.title !== 'Total Tasks' && (
                <span className="text-xs font-semibold text-slate-500">{percent}%</span>
              )}
            </div>

            {/* Progress bar */}
            {card.title !== 'Total Tasks' && (
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    card.title === 'Completed'
                      ? 'bg-emerald-500'
                      : card.title === 'In Progress'
                      ? 'bg-sky-500'
                      : card.title === 'Pending (Todo)'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
