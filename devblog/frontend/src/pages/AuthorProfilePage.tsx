import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Author, Post } from '../types';
import { authorsApi } from '../services/api';
import { PostGrid } from '../components/PostGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Calendar, BookOpen, Mail } from 'lucide-react';

export const AuthorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const [profile, authorPosts] = await Promise.all([
          authorsApi.getAuthorProfile(id),
          authorsApi.getAuthorPosts(id)
        ]);
        setAuthor(profile);
        setPosts(authorPosts);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.detail || 'Author profile not found.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Loading author profile..." />
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorMessage message={error || 'Author profile unavailable.'} />
      </div>
    );
  }

  const joinedDate = new Date(author.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-lg shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[12px] flex items-center justify-center text-3xl font-bold text-indigo-400">
            {author.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">{author.name}</h1>
            <p className="text-sm text-indigo-400 font-mono mt-0.5 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" /> {author.email}
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" /> {author.posts_count} Articles Published
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" /> Member since {joinedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-800 pb-4">
          Publications by {author.name}
        </h2>

        <PostGrid
          posts={posts}
          emptyMessage={`${author.name} has not published any articles yet.`}
        />
      </div>
    </div>
  );
};
