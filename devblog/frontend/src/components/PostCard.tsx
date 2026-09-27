import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { Calendar, ArrowRight, User as UserIcon } from 'lucide-react';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const defaultCover = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";

  return (
    <article
      className={`group relative flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 ${
        featured ? 'md:grid md:grid-cols-2 md:gap-6' : ''
      }`}
    >
      <div className={`relative overflow-hidden aspect-[16/9] bg-slate-950 ${featured ? 'md:aspect-auto md:h-full' : ''}`}>
        <img
          src={post.cover_image || defaultCover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultCover;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
      </div>

      <div className="flex flex-col justify-between p-6 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Link
              to={`/authors/${post.author_id}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-400 font-medium transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
              </div>
              <span>{post.author?.name || 'Author'}</span>
            </Link>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formattedDate}
            </span>
          </div>

          <h3 className={`font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            <Link to={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </h3>

          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-5 mt-4 border-t border-slate-800/60 flex items-center justify-between">
          <Link
            to={`/posts/${post.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors"
          >
            Read Article
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};
