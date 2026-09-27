import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PostEditor } from '../components/PostEditor';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { CreatePostData, PostDetail } from '../types';

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await postsApi.getPost(id);
        if (user && data.author_id !== user.id) {
          setError('Unauthorized: You can only edit your own posts.');
        } else {
          setPost(data);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load post for editing.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleUpdatePost = async (data: CreatePostData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await postsApi.updatePost(id, data);
      showToast('Article updated successfully!', 'success');
      navigate(`/posts/${id}`);
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.detail || 'Failed to update article.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Fetching post editor data..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorMessage message={error || 'Post not found'} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PostEditor
        initialData={{
          title: post.title,
          cover_image: post.cover_image,
          excerpt: post.excerpt,
          content: post.content,
        }}
        onSubmit={handleUpdatePost}
        isSubmitting={isSubmitting}
        submitButtonText="Save Changes"
        titleText="Edit Technical Article"
      />
    </div>
  );
};
