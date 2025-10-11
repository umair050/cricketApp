import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { feedAPI } from "../../services/feedAPI";

// Async Thunks for API calls

// Fetch posts with filters
export const fetchPosts = createAsyncThunk(
  "feed/fetchPosts",
  async ({ params, append = false }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.getPosts(params);
      return { ...response.data, append };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

// Fetch single post
export const fetchPostById = createAsyncThunk(
  "feed/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await feedAPI.getPostById(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);

// Create post
export const createPost = createAsyncThunk(
  "feed/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await feedAPI.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

// Update post
export const updatePost = createAsyncThunk(
  "feed/updatePost",
  async ({ postId, updateData }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.updatePost(postId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post"
      );
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  "feed/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await feedAPI.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

// Toggle like
export const toggleLike = createAsyncThunk(
  "feed/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await feedAPI.toggleLike(postId);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle like"
      );
    }
  }
);

// Add comment
export const addComment = createAsyncThunk(
  "feed/addComment",
  async ({ postId, commentText }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.addComment(postId, { commentText });
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

// Get post comments
export const getPostComments = createAsyncThunk(
  "feed/getPostComments",
  async ({ postId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.getPostComments(postId, { page, limit });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "feed/deleteComment",
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      await feedAPI.deleteComment(commentId);
      return { commentId, postId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

// Add reply
export const addReply = createAsyncThunk(
  "feed/addReply",
  async ({ commentId, replyText }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.addReply(commentId, {
        commentText: replyText,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add reply"
      );
    }
  }
);

// Get comment replies
export const getCommentReplies = createAsyncThunk(
  "feed/getCommentReplies",
  async ({ commentId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.getCommentReplies(commentId, {
        page,
        limit,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch replies"
      );
    }
  }
);

// Share post
export const sharePost = createAsyncThunk(
  "feed/sharePost",
  async ({ postId, shareText }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.sharePost(postId, shareText);
      return { postId, share: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to share post"
      );
    }
  }
);

// Unshare post
export const unsharePost = createAsyncThunk(
  "feed/unsharePost",
  async (postId, { rejectWithValue }) => {
    try {
      await feedAPI.unsharePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unshare post"
      );
    }
  }
);

// Get trending hashtags
export const fetchTrendingHashtags = createAsyncThunk(
  "feed/fetchTrendingHashtags",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await feedAPI.getTrendingHashtags(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trending hashtags"
      );
    }
  }
);

// Upload media
export const uploadMedia = createAsyncThunk(
  "feed/uploadMedia",
  async (files, { rejectWithValue }) => {
    try {
      const response = await feedAPI.uploadMedia(files);
      return response.data.urls;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload media"
      );
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  selectedPost: null,
  trendingHashtags: [],
  currentPage: 1,
  totalPosts: 0,
  hasMore: true,
  loading: false,
  error: null,
  uploadingMedia: false,
};

// Feed Slice
const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.totalPosts = 0;
      state.hasMore = true;
      state.selectedPost = null;
      state.error = null;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, total, page, append } = action.payload;

        if (append) {
          state.posts = [...state.posts, ...posts];
        } else {
          state.posts = posts;
        }

        state.totalPosts = total;
        state.currentPage = page;
        state.hasMore = state.posts.length < total;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single post
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.totalPosts += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload;
        }
      })

      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
        state.totalPosts -= 1;
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost = null;
        }
      })

      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, liked, likeCount } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.likeCount = likeCount;
          post.isLikedByCurrentUser = liked;
        }
        if (state.selectedPost?.id === postId) {
          state.selectedPost.likeCount = likeCount;
          state.selectedPost.isLikedByCurrentUser = liked;
        }
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.commentCount = (post.commentCount || 0) + 1;
        }
        if (state.selectedPost?.id === postId) {
          state.selectedPost.commentCount =
            (state.selectedPost.commentCount || 0) + 1;
        }
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
        }
        if (state.selectedPost?.id === postId) {
          state.selectedPost.commentCount = Math.max(
            0,
            (state.selectedPost.commentCount || 0) - 1
          );
        }
      })

      // Share post
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.shareCount = (post.shareCount || 0) + 1;
          post.isSharedByCurrentUser = true;
        }
      })

      // Unshare post
      .addCase(unsharePost.fulfilled, (state, action) => {
        const postId = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.shareCount = Math.max(0, (post.shareCount || 0) - 1);
          post.isSharedByCurrentUser = false;
        }
      })

      // Fetch trending hashtags
      .addCase(fetchTrendingHashtags.fulfilled, (state, action) => {
        state.trendingHashtags = action.payload;
      })

      // Upload media
      .addCase(uploadMedia.pending, (state) => {
        state.uploadingMedia = true;
      })
      .addCase(uploadMedia.fulfilled, (state) => {
        state.uploadingMedia = false;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.uploadingMedia = false;
        state.error = action.payload;
      });
  },
});

export const { resetFeed, setSelectedPost, clearError } = feedSlice.actions;
export default feedSlice.reducer;
