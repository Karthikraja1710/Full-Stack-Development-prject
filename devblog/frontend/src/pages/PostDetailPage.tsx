import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { PostDetail, Comment } from '../types';
import { postsApi, commentsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CommentList } from '../components/CommentList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Calendar, User as UserIcon, Edit, Trash2, ArrowLeft, Share2, Check } from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchPostDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await postsApi.getPost(id);
      setPost(data);
      setComments(data.comments || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to load post details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  const isOwner = user && post && user.id === post.author_id;

  const handleDeletePost = async () => {
    if (!post) return;
    try {
      await postsApi.deletePost(post.id);
      showToast('Article deleted successfully.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete article.', 'error');
    }
  };

  const handleAddComment = async (content: string) => {
    if (!post) return;
    try {
      const newComment = await commentsApi.createComment(post.id, { content });
      setComments((prev) => [...prev, newComment]);
      showToast('Comment posted successfully!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to post comment.', 'error');
    }
  };

  const handleUpdateComment = async (commentId: string, newContent: string) => {
    try {
      const updated = await commentsApi.updateComment(commentId, { content: newContent });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: updated.content, updated_at: updated.updated_at } : c))
      );
      showToast('Comment updated.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update comment.', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentsApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast('Comment removed.', 'info');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete comment.', 'error');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Loading article content..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorMessage message={error || 'Article not found.'} onRetry={fetchPostDetail} />
        <Link to="/posts" className="inline-flex items-center gap-2 text-sm text-indigo-400 font-medium mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const defaultCover = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <Link
        to="/posts"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <header className="space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-y border-slate-800/80 py-4">
          <Link
            to={`/authors/${post.author_id}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
              {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors block">
                {post.author?.name || 'Author'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Published {formattedDate}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Share article"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/edit/${post.id}`}
                  className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Post
                </Link>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-950 border border-slate-800 shadow-xl">
        <img
          src={post.cover_image || defaultCover}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultCover;
          }}
        />
      </div>

      <section className="prose prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800/80 text-slate-200">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </section>

      <CommentList
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Blog Article?"
        message="Are you sure you want to delete this article? This action is permanent and will remove all associated comments."
        confirmText="Delete Article"
        onConfirm={handleDeletePost}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDangerous={true}
      />
    </article>
  );
};
