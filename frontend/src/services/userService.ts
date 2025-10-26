import { api } from '@/config/api';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  country?: string;
  occupation?: string;
  bio?: string;
  profileImage?: string;
}

export const userService = {
  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData) {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  async getSuggestions(limit = 10) {
    const response = await api.get(`/user/suggestions?limit=${limit}`);
    return response.data;
  },

  async followUser(userId: string) {
    const response = await api.post('/user/follow', { userId });
    return response.data;
  },

  async unfollowUser(userId: string) {
    const response = await api.delete(`/user/follow?userId=${userId}`);
    return response.data;
  },

  async getCountries() {
    const response = await api.get('/countries');
    return response.data;
  },
};

