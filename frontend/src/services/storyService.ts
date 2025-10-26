import { api } from '@/config/api';

export interface CreateStoryData {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  caption?: string;
  duration?: number;
  backgroundColor?: string;
  textColor?: string;
}

export const storyService = {
  async createStory(data: CreateStoryData) {
    const response = await api.post('/stories/create', data);
    return response.data;
  },

  async getStories() {
    const response = await api.get('/stories');
    return response.data;
  },

  async viewStory(storyId: string) {
    const response = await api.post(`/stories/${storyId}/view`);
    return response.data;
  },

  async deleteStory(storyId: string) {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  },

  async getStoryDetails(storyId: string) {
    const response = await api.get(`/stories/${storyId}`);
    return response.data;
  },
};

