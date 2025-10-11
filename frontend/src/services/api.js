import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

// Users API
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Players API
export const playersAPI = {
  getAll: () => api.get("/players"),
  getById: (id) => api.get(`/players/${id}`),
  create: (data) => api.post("/players", data),
  update: (id, data) => api.patch(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  searchByLocation: (params) => api.get("/players/search", { params }),
};

// Teams API
export const teamsAPI = {
  getAll: () => api.get("/teams"),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post("/teams", data),
  update: (id, data) => api.patch(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  addPlayer: (teamId, playerId) =>
    api.post(`/teams/${teamId}/players/${playerId}`),
  removePlayer: (teamId, playerId) =>
    api.delete(`/teams/${teamId}/players/${playerId}`),
};

// Tournaments API
export const tournamentsAPI = {
  getAll: () => api.get("/tournaments"),
  getById: (id) => api.get(`/tournaments/${id}`),
  create: (data) => api.post("/tournaments", data),
  update: (id, data) => api.patch(`/tournaments/${id}`, data),
  delete: (id) => api.delete(`/tournaments/${id}`),
  addTeam: (tournamentId, teamId) =>
    api.post(`/tournaments/${tournamentId}/teams/${teamId}`),
  removeTeam: (tournamentId, teamId) =>
    api.delete(`/tournaments/${tournamentId}/teams/${teamId}`),
};

// Feeds API
export const feedsAPI = {
  createPost: (data) => api.post("/feeds", data),
  getPosts: (params) => api.get("/feeds", { params }),
  getPostById: (id) => api.get(`/feeds/${id}`),
  updatePost: (id, data) => api.patch(`/feeds/${id}`, data),
  deletePost: (id) => api.delete(`/feeds/${id}`),
  toggleLike: (postId) => api.post(`/feeds/${postId}/like`),
  getPostLikes: (postId) => api.get(`/feeds/${postId}/likes`),
  addComment: (postId, data) => api.post(`/feeds/${postId}/comments`, data),
  getPostComments: (postId, params) =>
    api.get(`/feeds/${postId}/comments`, { params }),
  deleteComment: (commentId) => api.delete(`/feeds/comments/${commentId}`),
  getTrendingHashtags: (limit) =>
    api.get("/feeds/trending/hashtags", { params: { limit } }),
};

export default api;
