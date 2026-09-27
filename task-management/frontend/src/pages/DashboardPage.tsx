import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Task, TaskStats, TaskCreate, TaskStatus } from '../types';
import { TaskStatsComponent } from '../components/TaskStats';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Plus, ArrowRight, Clock, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState<TaskStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);

  // Delete dialog states
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const [statsRes, tasksRes] = await Promise.all([
        api.get<TaskStats>('/api/tasks/stats'),
        api.get<Task[]>('/api/tasks?sort_by=due_date&order=asc'),
      ]);
      setStats(statsRes.data);
      setRecentTasks(tasksRes.data.slice(0, 6));
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real-time WebSockets sync callback
  useWebSocket(
    useCallback((data: any) => {
      if (['TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED'].includes(data?.type)) {
        fetchDashboardData();
      }
    }, [fetchDashboardData])
  );

  const handleCreateOrUpdateTask = async (data: TaskCreate) => {
    setIsSavingTask(true);
    try {
      if (taskToEdit) {
        await api.put(`/api/tasks/${taskToEdit.id}`, data);
        showToast('Task Updated', `"${data.title}" was successfully updated.`, 'success');
      } else {
        await api.post('/api/tasks', data);
        showToast('Task Created', `"${data.title}" has been created.`, 'success');
      }
      fetchDashboardData();
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Operation failed.', 'error');
      throw err;
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { status });
      showToast('Status Changed', `Task status changed to ${status}`, 'success');
      fetchDashboardData();
    } catch (err: any) {
      showToast('Error', 'Failed to update task status.', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/tasks/${deleteTaskId}`);
      showToast('Task Deleted', 'The task has been permanently removed.', 'info');
      setDeleteTaskId(null);
      fetchDashboardData();
    } catch (err: any) {
      showToast('Error', 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-brand-900/80 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>SaaS Executive Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Here is an overview of your current task metrics and upcoming deadlines. Stay focused and productive!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-950/50 flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="px-5 py-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-all"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Key Performance Indicators
        </h2>
        <TaskStatsComponent stats={stats} isLoading={isLoading} />
      </section>

      {/* Error display */}
      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* Recent & Upcoming Tasks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Upcoming & Urgent Tasks</h2>
            <p className="text-xs text-slate-400">Tasks sorted by due date priority</p>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading recent tasks..." />
        ) : recentTasks.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No tasks created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get started by creating your first task to track your workflow efficiently.
            </p>
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Task Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setIsModalOpen(true);
                }}
                onDelete={(id) => setDeleteTaskId(id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </section>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        taskToEdit={taskToEdit}
        isLoading={isSavingTask}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Yes, Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteTask}
        onClose={() => setDeleteTaskId(null)}
      />
    </div>
  );
};
