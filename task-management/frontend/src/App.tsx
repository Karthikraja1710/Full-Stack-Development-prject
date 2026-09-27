import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TaskModal } from './components/TaskModal';
import { useToast } from './context/ToastContext';
import api from './services/api';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import type { TaskCreate } from './types';

const MainLayout: React.FC = () => {
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleGlobalCreateTask = async (data: TaskCreate) => {
    setIsSaving(true);
    try {
      await api.post('/api/tasks', data);
      showToast('Task Created', `"${data.title}" was added.`, 'success');
      // Trigger a page refresh/update by dispatching event if needed or letting WebSockets update
      window.dispatchEvent(new Event('task-updated'));
      setIsCreateTaskModalOpen(false);
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to create task.', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
        onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
      />

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar
          isOpenMobile={isOpenMobileSidebar}
          onCloseMobile={() => setIsOpenMobileSidebar(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Create Task Modal */}
      <TaskModal
        isOpen={isCreateTaskModalOpen}
        isLoading={isSaving}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleGlobalCreateTask}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
