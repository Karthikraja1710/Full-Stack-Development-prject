export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  created_at: string;
  posts_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  created_at: string;
  updated_at: string;
  author: User;
}

export interface PostDetail extends Post {
  comments: Comment[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}
