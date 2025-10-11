import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuthContext } from "./AuthContext";
import { feedAPI } from "../services/feedAPI";

const FeedContext = createContext();

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
};

export const FeedProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [trendingHashtags, setTrendingHashtags] = useState([]);

  // Fetch posts with filters
  const fetchPosts = useCallback(async (params = {}, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedAPI.getPosts(params);
      const { posts: fetchedPosts, total, page } = response.data;

      if (append) {
        setPosts((prev) => {
          const newPosts = [...prev, ...fetchedPosts];
          setHasMore(newPosts.length < total);
          return newPosts;
        });
      } else {
        setPosts(fetchedPosts);
        setHasMore(fetchedPosts.length < total);
      }

      setTotalPosts(total);
      setCurrentPage(page);

      return fetchedPosts;
    } catch (err) {
      setError(err.message || "Failed to fetch posts");
      console.error("Failed to fetch posts:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch global feed
  const fetchGlobalFeed = useCallback(
    async (page = 1, limit = 10) => {
      return fetchPosts(
        { feedType: "global", page, limit, sortBy: "newest" },
        page > 1
      );
    },
    [fetchPosts]
  );

  // Fetch personal feed
  const fetchPersonalFeed = useCallback(
    async (page = 1, limit = 10) => {
      if (!user) return;
      return fetchPosts(
        { feedType: "personal", page, limit, sortBy: "newest" },
        page > 1
      );
    },
    [user, fetchPosts]
  );

  // Fetch user's posts
  const fetchUserPosts = useCallback(
    async (userId, page = 1, limit = 10) => {
      return fetchPosts(
        { feedType: "user", userId, page, limit, sortBy: "newest" },
        page > 1
      );
    },
    [fetchPosts]
  );

  // Fetch team feed
  const fetchTeamFeed = useCallback(
    async (teamId, page = 1, limit = 10) => {
      return fetchPosts(
        { feedType: "team", teamId, page, limit, sortBy: "newest" },
        page > 1
      );
    },
    [fetchPosts]
  );

  // Fetch tournament feed
  const fetchTournamentFeed = useCallback(
    async (tournamentId, page = 1, limit = 10) => {
      return fetchPosts(
        { feedType: "tournament", tournamentId, page, limit, sortBy: "newest" },
        page > 1
      );
    },
    [fetchPosts]
  );

  // Get single post
  const fetchPostById = async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedAPI.getPostById(postId);
      setSelectedPost(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to fetch post");
      console.error("Failed to fetch post:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (postData) => {
    if (!user) {
      const error = new Error("You must be logged in to create a post");
      setError(error.message);
      throw error;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await feedAPI.createPost(postData);
      const newPost = response.data;

      // Add to the beginning of posts
      setPosts((prev) => [newPost, ...prev]);
      setTotalPosts((prev) => prev + 1);

      return newPost;
    } catch (err) {
      setError(err.message || "Failed to create post");
      console.error("Failed to create post:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a post
  const updatePost = async (postId, updateData) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const response = await feedAPI.updatePost(postId, updateData);
      const updatedPost = response.data;

      // Update in the list
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? updatedPost : post))
      );

      if (selectedPost?.id === postId) {
        setSelectedPost(updatedPost);
      }

      return updatedPost;
    } catch (err) {
      setError(err.message || "Failed to update post");
      console.error("Failed to update post:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      await feedAPI.deletePost(postId);

      // Remove from the list
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setTotalPosts((prev) => prev - 1);

      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
    } catch (err) {
      setError(err.message || "Failed to delete post");
      console.error("Failed to delete post:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle like on a post
  const toggleLike = async (postId) => {
    if (!user) {
      const error = new Error("You must be logged in to like a post");
      setError(error.message);
      throw error;
    }

    try {
      const response = await feedAPI.toggleLike(postId);
      const { liked, likeCount } = response.data;

      // Update in the list
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likeCount,
              isLikedByCurrentUser: liked,
            };
          }
          return post;
        })
      );

      if (selectedPost?.id === postId) {
        setSelectedPost((prev) => ({
          ...prev,
          likeCount,
          isLikedByCurrentUser: liked,
        }));
      }

      return { liked, likeCount };
    } catch (err) {
      setError(err.message || "Failed to toggle like");
      console.error("Failed to toggle like:", err);
      throw err;
    }
  };

  // Add a comment to a post
  const addComment = async (postId, commentText) => {
    if (!user) {
      const error = new Error("You must be logged in to comment");
      setError(error.message);
      throw error;
    }

    try {
      const response = await feedAPI.addComment(postId, { commentText });
      const newComment = response.data;

      // Update comment count
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              commentCount: post.commentCount + 1,
            };
          }
          return post;
        })
      );

      if (selectedPost?.id === postId) {
        setSelectedPost((prev) => ({
          ...prev,
          commentCount: prev.commentCount + 1,
        }));
      }

      return newComment;
    } catch (err) {
      setError(err.message || "Failed to add comment");
      console.error("Failed to add comment:", err);
      throw err;
    }
  };

  // Get comments for a post
  const getPostComments = async (postId, page = 1, limit = 20) => {
    try {
      const response = await feedAPI.getPostComments(postId, { page, limit });
      return response.data;
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      throw err;
    }
  };

  // Delete a comment
  const deleteComment = async (commentId, postId) => {
    if (!user) return;

    try {
      await feedAPI.deleteComment(commentId);

      // Update comment count
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              commentCount: Math.max(0, post.commentCount - 1),
            };
          }
          return post;
        })
      );

      if (selectedPost?.id === postId) {
        setSelectedPost((prev) => ({
          ...prev,
          commentCount: Math.max(0, prev.commentCount - 1),
        }));
      }
    } catch (err) {
      setError(err.message || "Failed to delete comment");
      console.error("Failed to delete comment:", err);
      throw err;
    }
  };

  // Fetch trending hashtags
  const fetchTrendingHashtags = async (limit = 10) => {
    try {
      const response = await feedAPI.getTrendingHashtags(limit);
      setTrendingHashtags(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch trending hashtags:", err);
      throw err;
    }
  };

  // Upload media files
  const uploadMedia = async (files) => {
    try {
      const response = await feedAPI.uploadMedia(files);
      return response.data.urls;
    } catch (err) {
      setError(err.message || "Failed to upload media");
      console.error("Failed to upload media:", err);
      throw err;
    }
  };

  // Load more posts (for infinite scroll)
  const loadMore = useCallback(
    async (currentParams) => {
      if (!hasMore || loading) return;

      const nextPage = currentPage + 1;
      return fetchPosts({ ...currentParams, page: nextPage }, true);
    },
    [currentPage, hasMore, loading, fetchPosts]
  );

  // Reset feed
  const resetFeed = () => {
    setPosts([]);
    setCurrentPage(1);
    setTotalPosts(0);
    setHasMore(true);
    setSelectedPost(null);
    setError(null);
  };

  // Add a reply to a comment
  const addReply = async (commentId, replyText) => {
    if (!user) {
      const error = new Error("You must be logged in to reply");
      setError(error.message);
      throw error;
    }

    try {
      const response = await feedAPI.addReply(commentId, {
        commentText: replyText,
      });
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to add reply");
      console.error("Failed to add reply:", err);
      throw err;
    }
  };

  // Get replies for a comment
  const getCommentReplies = async (commentId, page = 1, limit = 10) => {
    try {
      const response = await feedAPI.getCommentReplies(commentId, {
        page,
        limit,
      });
      return response.data;
    } catch (err) {
      console.error("Failed to fetch replies:", err);
      throw err;
    }
  };

  // Share a post
  const sharePost = async (postId, shareText) => {
    if (!user) {
      const error = new Error("You must be logged in to share");
      setError(error.message);
      throw error;
    }

    try {
      const response = await feedAPI.sharePost(postId, shareText);

      // Update share count in posts
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              shareCount: (post.shareCount || 0) + 1,
              isSharedByCurrentUser: true,
            };
          }
          return post;
        })
      );

      return response.data;
    } catch (err) {
      setError(err.message || "Failed to share post");
      console.error("Failed to share post:", err);
      throw err;
    }
  };

  // Unshare a post
  const unsharePost = async (postId) => {
    if (!user) return;

    try {
      await feedAPI.unsharePost(postId);

      // Update share count in posts
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              shareCount: Math.max(0, (post.shareCount || 0) - 1),
              isSharedByCurrentUser: false,
            };
          }
          return post;
        })
      );
    } catch (err) {
      setError(err.message || "Failed to unshare post");
      console.error("Failed to unshare post:", err);
      throw err;
    }
  };

  // Get shares for a post
  const getPostShares = async (postId) => {
    try {
      const response = await feedAPI.getPostShares(postId);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch shares:", err);
      throw err;
    }
  };

  const value = {
    posts,
    loading,
    error,
    currentPage,
    totalPosts,
    hasMore,
    selectedPost,
    trendingHashtags,
    fetchPosts,
    fetchGlobalFeed,
    fetchPersonalFeed,
    fetchUserPosts,
    fetchTeamFeed,
    fetchTournamentFeed,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    getPostComments,
    deleteComment,
    addReply,
    getCommentReplies,
    sharePost,
    unsharePost,
    getPostShares,
    fetchTrendingHashtags,
    uploadMedia,
    loadMore,
    resetFeed,
    setSelectedPost,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};
