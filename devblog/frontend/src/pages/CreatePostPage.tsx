import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { PostEditor } from '../components/PostEditor';
import type { CreatePostData } from '../types';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (data: CreatePostData) => {
    setIsSubmitting(true);
    try {
      const newPost = await postsApi.createPost(data);
      showToast('Article published successfully!', 'success');
      navigate(`/posts/${newPost.id}`);
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.detail || 'Failed to publish article.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PostEditor
        onSubmit={handleCreatePost}
        isSubmitting={isSubmitting}
        submitButtonText="Publish Article"
        titleText="Create Technical Article"
      />
    </div>
  );
};
