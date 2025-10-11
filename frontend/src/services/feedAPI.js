import api from "./api";

// Feeds API
export const feedAPI = {
  // Posts
  createPost: (data) => api.post("/feeds", data),
  getPosts: (params) => api.get("/feeds", { params }),
  getPostById: (id) => api.get(`/feeds/${id}`),
  updatePost: (id, data) => api.patch(`/feeds/${id}`, data),
  deletePost: (id) => api.delete(`/feeds/${id}`),

  // Likes
  toggleLike: (postId) => api.post(`/feeds/${postId}/like`),
  getPostLikes: (postId) => api.get(`/feeds/${postId}/likes`),

  // Comments
  addComment: (postId, data) => api.post(`/feeds/${postId}/comments`, data),
  getPostComments: (postId, params) =>
    api.get(`/feeds/${postId}/comments`, { params }),
  deleteComment: (commentId) => api.delete(`/feeds/comments/${commentId}`),

  // Comment Replies
  addReply: (commentId, data) =>
    api.post(`/feeds/comments/${commentId}/replies`, data),
  getCommentReplies: (commentId, params) =>
    api.get(`/feeds/comments/${commentId}/replies`, { params }),

  // Shares
  sharePost: (postId, shareText) =>
    api.post(`/feeds/${postId}/share`, { shareText }),
  getPostShares: (postId) => api.get(`/feeds/${postId}/shares`),
  unsharePost: (postId) => api.delete(`/feeds/${postId}/share`),

  // Trending
  getTrendingHashtags: (limit = 10) =>
    api.get(`/feeds/trending/hashtags`, { params: { limit } }),

  // Media upload (to be implemented with cloud storage)
  uploadMedia: async (files) => {
    // This would typically upload to cloud storage (AWS S3, etc.)
    // For now, we'll return mock URLs
    // In production, implement multipart/form-data upload
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    // Mock implementation - replace with actual cloud upload
    return Promise.resolve({
      data: {
        urls: files.map(
          (file, index) => URL.createObjectURL(file) // Temporary local URL
        ),
      },
    });
  },
};

export default feedAPI;
