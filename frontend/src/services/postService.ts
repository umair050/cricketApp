import { api } from '@/config/api';

export interface CreatePostData {
  caption?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
}

export const postService = {
  async createPost(data: CreatePostData) {
    const response = await api.post('/posts/create', data);
    return response.data;
  },

  async getPosts(page = 1, limit = 10) {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },
};

