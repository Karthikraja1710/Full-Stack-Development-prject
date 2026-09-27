import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { postsApi } from '../services/api';
import { PostCard } from '../components/PostCard';
import { PostGrid } from '../components/PostGrid';
import { SearchBar } from '../components/SearchBar';
import { Sparkles, Terminal, Code2, ArrowRight, Cpu } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomePosts = async () => {
      try {
        const data = await postsApi.getPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch home posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomePosts();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/posts?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/posts');
    }
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.length > 1 ? posts.slice(1, 7) : [];

  return (
    <div className="space-y-16 py-8">
      <section className="relative overflow-hidden pt-12 pb-16 text-center space-y-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" /> DevBlog Technical Publishing Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight">
          Where Developers Share <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Architecture, Code & Insights
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          High-quality articles on FastAPI, React, PostgreSQL, Cloud Infrastructure, and Clean Code. Published by developers, for developers.
        </p>

        <div className="pt-4 max-w-xl mx-auto px-4">
          <SearchBar onSearch={handleSearch} placeholder="Search tutorials, architecture guides, code..." />
        </div>

        <div className="pt-4 flex items-center justify-center gap-6 text-slate-500 text-xs font-mono">
          <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4 text-indigo-400" /> FastAPI REST</span>
          <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4 text-sky-400" /> React 19 + Vite</span>
          <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-emerald-400" /> PostgreSQL</span>
        </div>
      </section>

      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Featured Publication
            </h2>
          </div>
          <PostCard post={featuredPost} featured={true} />
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Latest Articles</h2>
            <p className="text-sm text-slate-400 mt-1">Explore recent technical publications from our engineering authors</p>
          </div>
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PostGrid posts={recentPosts.length > 0 ? recentPosts : posts} isLoading={isLoading} />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 p-8 sm:p-12 overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Share Your Engineering Expertise?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Create an account on DevBlog to write markdown-rich technical articles, engage with comments, and showcase your profile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] text-center"
            >
              Start Writing Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
