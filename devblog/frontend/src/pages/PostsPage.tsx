import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Post } from '../types';
import { postsApi } from '../services/api';
import { PostGrid } from '../components/PostGrid';
import { SearchBar } from '../components/SearchBar';
import { Compass, Filter } from 'lucide-react';

export const PostsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('search') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await postsApi.getPosts(queryParam || undefined);
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [queryParam]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const tags = ['All', 'FastAPI', 'React', 'PostgreSQL', 'TypeScript', 'Architecture'];

  const filteredPosts = posts.filter((post) => {
    if (selectedTag === 'All') return true;
    return (
      post.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
      post.content.toLowerCase().includes(selectedTag.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 flex items-center justify-center gap-3">
          <Compass className="w-8 h-8 text-indigo-400" /> Technical Articles & Publications
        </h1>
        <p className="text-slate-400 text-sm">
          Browse through all published posts. Search by topic, title, code snippet, or author.
        </p>

        <SearchBar onSearch={handleSearch} initialValue={queryParam} />
      </div>

      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Topic Filter:
        </span>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {queryParam && (
        <div className="text-center text-sm text-slate-400">
          Showing search results for "<strong className="text-indigo-400">{queryParam}</strong>" ({filteredPosts.length} posts found)
        </div>
      )}

      <PostGrid
        posts={filteredPosts}
        isLoading={isLoading}
        emptyMessage={queryParam ? `No posts matched "${queryParam}".` : "No articles found."}
      />
    </div>
  );
};
