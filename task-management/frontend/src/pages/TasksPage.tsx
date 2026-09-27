import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Task, TaskFiltersState, TaskCreate, TaskStatus } from '../types';
import { TaskFilters } from '../components/TaskFilters';
import { TaskBoard } from '../components/TaskBoard';
import { TaskTableView } from '../components/TaskTableView';
import { TaskModal } from '../components/TaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Plus, ListTodo } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [filters, setFilters] = useState<TaskFiltersState>({
    status: undefined,
    priority: undefined,
    search: '',
    sortBy: 'due_date',
    order: 'asc',
  });

  // View mode: 'board' | 'list'
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('q', filters.search);
    if (filters.sortBy) params.append('sort_by', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    try {
      const response = await api.get<Task[]>(`/api/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Real-time WebSockets sync
  useWebSocket(
    useCallback((data: any) => {
      if (['TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED'].includes(data?.type)) {
        fetchTasks();
      }
    }, [fetchTasks])
  );

  const handleCreateOrUpdateTask = async (data: TaskCreate) => {
    setIsSaving(true);
    try {
      if (taskToEdit) {
        await api.put(`/api/tasks/${taskToEdit.id}`, data);
        showToast('Task Updated', `"${data.title}" was updated successfully.`, 'success');
      } else {
        await api.post('/api/tasks', data);
        showToast('Task Created', `"${data.title}" was created.`, 'success');
      }
      fetchTasks();
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Operation failed.', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { status });
      showToast('Status Changed', `Task moved to ${status}`, 'success');
      fetchTasks();
    } catch (err: any) {
      showToast('Error', 'Failed to update status.', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/tasks/${deleteTaskId}`);
      showToast('Task Deleted', 'Task removed successfully.', 'info');
      setDeleteTaskId(null);
      fetchTasks();
    } catch (err: any) {
      showToast('Error', 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: undefined,
      priority: undefined,
      search: '',
      sortBy: 'due_date',
      order: 'asc',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <ListTodo className="w-4 h-4 text-brand-400" />
            <span>Task Management Workspace</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">Tasks</h1>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-950/50 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <TaskFilters
        filters={filters}
        viewMode={viewMode}
        onFilterChange={setFilters}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
      />

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={fetchTasks} />}

      {/* Loading state */}
      {isLoading ? (
        <LoadingSpinner message="Fetching tasks..." />
      ) : viewMode === 'board' ? (
        <TaskBoard
          tasks={tasks}
          onEditTask={(t) => {
            setTaskToEdit(t);
            setIsModalOpen(true);
          }}
          onDeleteTask={(id) => setDeleteTaskId(id)}
          onStatusChange={handleStatusChange}
          onAddTaskClick={(defaultStatus) => {
            setTaskToEdit(defaultStatus ? ({ status: defaultStatus } as Task) : null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <TaskTableView
          tasks={tasks}
          onEditTask={(t) => {
            setTaskToEdit(t);
            setIsModalOpen(true);
          }}
          onDeleteTask={(id) => setDeleteTaskId(id)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        taskToEdit={taskToEdit}
        isLoading={isSaving}
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
