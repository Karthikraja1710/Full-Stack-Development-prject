import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const { isAuthenticated, user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-800 text-center space-y-3">
        <MessageSquare className="w-8 h-8 text-indigo-400 mx-auto" />
        <h4 className="text-base font-semibold text-slate-200">Join the Conversation</h4>
        <p className="text-sm text-slate-400">Please sign in to leave a comment on this article.</p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Sign In to Comment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-semibold text-xs border border-slate-700">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="text-sm font-medium text-slate-300">Comment as <strong className="text-white">{user?.name}</strong></span>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          required
          className="w-full p-4 bg-slate-900 text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y transition-all"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-all disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
