import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { CreatePostData } from '../types';
import { Image, FileText, Eye, Edit3, Save } from 'lucide-react';

interface PostEditorProps {
  initialData?: Partial<CreatePostData>;
  onSubmit: (data: CreatePostData) => Promise<void>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  titleText?: string;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Publish Post",
  titleText = "Create New Article"
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [coverImage, setCoverImage] = useState(initialData.cover_image || '');
  const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
  const [content, setContent] = useState(initialData.content || '');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Article title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Article content is required.');
      return;
    }

    setError(null);
    await onSubmit({
      title: title.trim(),
      cover_image: coverImage.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">{titleText}</h1>

        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'write'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview Markdown
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Article Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Architecting Scalable Microservices with FastAPI"
            required
            className="w-full px-4 py-3 bg-slate-900 text-slate-100 placeholder-slate-500 text-lg font-bold rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
              <Image className="w-4 h-4 text-indigo-400" /> Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 bg-slate-900 text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Short Excerpt
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary for card preview..."
              className="w-full px-4 py-2.5 bg-slate-900 text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {activeTab === 'write' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">
                Article Body (Markdown Supported) <span className="text-rose-400">*</span>
              </label>
              <span className="text-xs text-slate-500">Supports headers, code blocks, tables & links</span>
            </div>
            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article using Markdown formatting..."
              required
              className="w-full p-4 bg-slate-900 text-slate-100 placeholder-slate-500 font-mono text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y leading-relaxed"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Live Markdown Preview</label>
            <div className="min-h-[350px] p-6 bg-slate-900/60 border border-slate-800 rounded-xl prose prose-invert max-w-none">
              {content.trim() ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-slate-500 italic">No content to preview yet. Switch back to write tab.</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};
