import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { postsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  LayoutDashboard,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postsApi.getMyPosts();
      setPosts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to fetch dashboard posts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDeletePost = async () => {
    if (!deleteTargetId) return;
    try {
      await postsApi.deletePost(deleteTargetId);
      showToast('Article deleted successfully.', 'info');
      setPosts((prev) => prev.filter((p) => p.id !== deleteTargetId));
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete article.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Loading author dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" /> Creator Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-slate-400">Manage your published engineering articles and content.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/authors/${user?.id}`}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
          >
            Public Profile <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/create"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/25 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" /> Create New Post
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchMyPosts} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Publications</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{posts.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account Role</span>
            <p className="text-lg font-bold text-emerald-400 mt-1">Verified Author</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</span>
            <p className="text-sm font-mono text-slate-300 mt-1 truncate max-w-[180px]">{user?.email}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100">My Articles ({posts.length})</h2>

        {posts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-4">
            <FileText className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-medium text-slate-300">You haven't written any articles yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Share your knowledge with the engineering community by creating your first technical blog post.</p>
            <div>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Create First Article
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-4 px-6">Article Title</th>
                  <th className="py-4 px-6">Published Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-100">
                      <Link to={`/posts/${post.id}`} className="hover:text-indigo-400 transition-colors line-clamp-1">
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/posts/${post.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit/${post.id}`}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTargetId(post.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Article?"
        message="Are you sure you want to delete this article? All comments will also be permanently deleted."
        confirmText="Delete"
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteTargetId(null)}
        isDangerous={true}
      />
    </div>
  );
};
