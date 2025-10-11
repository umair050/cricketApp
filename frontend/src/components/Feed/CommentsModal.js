import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addComment,
  getPostComments,
  deleteComment,
  addReply,
  getCommentReplies,
} from "../../store/slices/feedSlice";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";

const CommentsModal = ({ post, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { isDarkMode } = useDarkMode();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await dispatch(
        getPostComments({ postId: post.id, page: 1, limit: 20 })
      ).unwrap();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const result = await dispatch(
        addComment({ postId: post.id, commentText: newComment })
      ).unwrap();
      setComments((prev) => [result.comment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await dispatch(
          deleteComment({ commentId, postId: post.id })
        ).unwrap();
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment:", error);
        alert("Failed to delete comment");
      }
    }
  };

  const loadReplies = async (commentId) => {
    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
    try {
      const data = await dispatch(
        getCommentReplies({ commentId, page: 1, limit: 10 })
      ).unwrap();
      setReplies((prev) => ({ ...prev, [commentId]: data.replies || [] }));
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      const reply = await dispatch(
        addReply({ commentId, replyText })
      ).unwrap();
      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), reply],
      }));

      // Update reply count in the comment
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, replyCount: (c.replyCount || 0) + 1 } : c
        )
      );

      setReplyText("");
      setReplyTo(null);
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert("Failed to add reply");
    }
  };

  const handleDeleteReply = async (replyId, commentId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      try {
        await dispatch(
          deleteComment({ commentId: replyId, postId: post.id })
        ).unwrap();
        setReplies((prev) => ({
          ...prev,
          [commentId]: prev[commentId].filter((r) => r.id !== replyId),
        }));

        // Update reply count in the comment
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replyCount: Math.max(0, (c.replyCount || 0) - 1) }
              : c
          )
        );
      } catch (error) {
        console.error("Failed to delete reply:", error);
        alert("Failed to delete reply");
      }
    }
  };

  const toggleReplies = (commentId) => {
    if (showReplies[commentId]) {
      setShowReplies((prev) => ({ ...prev, [commentId]: false }));
    } else {
      if (!replies[commentId]) {
        loadReplies(commentId);
      } else {
        setShowReplies((prev) => ({ ...prev, [commentId]: true }));
      }
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;

    return "Just now";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Comments
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            <svg
              className={`w-6 h-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Post Preview */}
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-start">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {post.user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 flex-1">
              <p
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {post.user?.fullName}
              </p>
              {post.content && (
                <p
                  className={`text-sm mt-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : comments.length === 0 ? (
            <div
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {comment.user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <div
                    className={`rounded-lg p-3 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`font-medium text-sm ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {comment.user?.fullName}
                        </p>
                        <p
                          className={`mt-1 ${
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {comment.commentText}
                        </p>
                      </div>
                      {user?.id === comment.user?.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                          title="Delete comment"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 ml-3">
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {formatTimeAgo(comment.createdAt)}
                    </p>

                    {/* Reply Button */}
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className={`text-xs font-medium ${
                        isDarkMode
                          ? "text-green-400 hover:text-green-300"
                          : "text-green-600 hover:text-green-700"
                      }`}
                    >
                      Reply
                    </button>

                    {/* View Replies Button */}
                    {(comment.replyCount > 0 ||
                      replies[comment.id]?.length > 0) && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className={`text-xs font-medium ${
                          isDarkMode
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        {loadingReplies[comment.id]
                          ? "Loading..."
                          : showReplies[comment.id]
                          ? "Hide replies"
                          : `View ${
                              comment.replyCount ||
                              replies[comment.id]?.length ||
                              0
                            } ${
                              (comment.replyCount || 0) === 1
                                ? "reply"
                                : "replies"
                            }`}
                      </button>
                    )}
                  </div>

                  {/* Reply Input */}
                  {replyTo === comment.id && (
                    <div className="mt-3 ml-3 flex items-start space-x-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDarkMode
                            ? "bg-gray-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          autoFocus
                          className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmitReply(comment.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyText.trim()}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            !replyText.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setReplyText("");
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDarkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies List */}
                  {showReplies[comment.id] && replies[comment.id] && (
                    <div className="mt-3 ml-6 space-y-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                      {replies[comment.id].map((reply) => (
                        <div key={reply.id} className="flex items-start group">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isDarkMode
                                ? "bg-gray-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {reply.user?.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-2 flex-1">
                            <div
                              className={`rounded-lg p-2 ${
                                isDarkMode ? "bg-gray-600" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p
                                    className={`font-medium text-xs ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {reply.user?.fullName}
                                  </p>
                                  <p
                                    className={`mt-1 text-sm ${
                                      isDarkMode
                                        ? "text-gray-200"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {reply.commentText}
                                  </p>
                                </div>
                                {user?.id === reply.user?.id && (
                                  <button
                                    onClick={() =>
                                      handleDeleteReply(reply.id, comment.id)
                                    }
                                    className="ml-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                                    title="Delete reply"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            <p
                              className={`text-xs mt-1 ml-2 ${
                                isDarkMode ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {formatTimeAgo(reply.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <form
            onSubmit={handleSubmitComment}
            className="flex items-start space-x-3"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  submitting || !newComment.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
