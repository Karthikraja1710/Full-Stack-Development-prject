import React from 'react';
import type { Comment } from '../types';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { MessageSquare } from 'lucide-react';

interface CommentListProps {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment: (commentId: string, newContent: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  return (
    <section className="mt-16 pt-10 border-t border-slate-800/80 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          Comments ({comments.length})
        </h3>
      </div>

      <CommentForm onSubmit={onAddComment} />

      <div className="space-y-4 pt-4">
        {comments.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
            />
          ))
        )}
      </div>
    </section>
  );
};
