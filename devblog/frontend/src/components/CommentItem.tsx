import React, { useState } from 'react';
import type { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, Edit2, Trash2, Check, X, User as UserIcon } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: string, newContent: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = user?.id === comment.user_id;

  const formattedDate = new Date(comment.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onUpdate(comment.id, editContent);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-semibold text-xs border border-slate-700">
            {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-200 block">
              {comment.user?.name || 'Anonymous User'}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Edit comment"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3 pt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 bg-slate-950 text-slate-100 text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 resize-y min-h-[80px]"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting || !editContent.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pl-11">
          {comment.content}
        </p>
      )}
    </div>
  );
};
