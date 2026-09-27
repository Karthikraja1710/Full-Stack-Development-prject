import React from 'react';
import type { Post } from '../types';
import { PostCard } from './PostCard';
import { LoadingSpinner } from './LoadingSpinner';
import { FileText } from 'lucide-react';

interface PostGridProps {
  posts: Post[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const PostGrid: React.FC<PostGridProps> = ({
  posts,
  isLoading = false,
  emptyMessage = "No blog posts found."
}) => {
  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner text="Fetching latest technical articles..." />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 my-8">
        <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-1">{emptyMessage}</h3>
        <p className="text-sm text-slate-500">Check back later or try searching with different keywords.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
