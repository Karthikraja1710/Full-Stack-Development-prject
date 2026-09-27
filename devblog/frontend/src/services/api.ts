import axios from 'axios';
import type {
  AuthResponse,
  User,
  Post,
  PostDetail,
  Comment,
  Author,
  CreatePostData,
  UpdatePostData,
  CreateCommentData,
  UpdateCommentData
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: { name: string; email: string; password: string }): Promise<User> => {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },
};

export const postsApi = {
  getPosts: async (search?: string): Promise<Post[]> => {
    const params = search ? { search } : {};
    const response = await api.get<Post[]>('/api/posts', { params });
    return response.data;
  },
  getPost: async (id: string): Promise<PostDetail> => {
    const response = await api.get<PostDetail>(`/api/posts/${id}`);
    return response.data;
  },
  getMyPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/api/posts/my-posts');
    return response.data;
  },
  createPost: async (data: CreatePostData): Promise<Post> => {
    const response = await api.post<Post>('/api/posts', data);
    return response.data;
  },
  updatePost: async (id: string, data: UpdatePostData): Promise<Post> => {
    const response = await api.put<Post>(`/api/posts/${id}`, data);
    return response.data;
  },
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/api/posts/${id}`);
  },
};

export const commentsApi = {
  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get<Comment[]>(`/api/posts/${postId}/comments`);
    return response.data;
  },
  createComment: async (postId: string, data: CreateCommentData): Promise<Comment> => {
    const response = await api.post<Comment>(`/api/posts/${postId}/comments`, data);
    return response.data;
  },
  updateComment: async (commentId: string, data: UpdateCommentData): Promise<Comment> => {
    const response = await api.put<Comment>(`/api/comments/${commentId}`, data);
    return response.data;
  },
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/api/comments/${commentId}`);
  },
};

export const authorsApi = {
  getAuthorProfile: async (authorId: string): Promise<Author> => {
    const response = await api.get<Author>(`/api/authors/${authorId}`);
    return response.data;
  },
  getAuthorPosts: async (authorId: string): Promise<Post[]> => {
    const response = await api.get<Post[]>(`/api/authors/${authorId}/posts`);
    return response.data;
  },
};
