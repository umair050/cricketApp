import React, { useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuthContext } from "../../contexts/AuthContext";

const ShareModal = ({ post, onClose, onShare }) => {
  const { user } = useAuthContext();
  const { isDarkMode } = useDarkMode();
  const [shareText, setShareText] = useState("");
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      await onShare(post.id, shareText);
      onClose();
    } catch (error) {
      console.error("Failed to share:", error);
      alert(error.message || "Failed to share post");
    } finally {
      setSharing(false);
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
        className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col ${
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
            Share Post
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Share Text Input */}
          <div className="mb-4">
            <div className="flex items-start space-x-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                placeholder="Add your thoughts... (optional)"
                className={`flex-1 p-3 rounded-lg border resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                rows="3"
              />
            </div>
          </div>

          {/* Original Post Preview */}
          <div
            className={`rounded-lg border p-4 ${
              isDarkMode
                ? "border-gray-700 bg-gray-700/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center mb-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode
                    ? "bg-gray-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {post.user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2">
                <p
                  className={`font-medium text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {post.user?.fullName}
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Post Content Preview */}
            {post.content && (
              <p
                className={`text-sm mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>
            )}

            {/* Media Preview */}
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mt-2">
                {post.mediaUrls[0].includes("video") ||
                post.mediaType === "video" ? (
                  <div
                    className={`rounded-lg p-4 flex items-center justify-center ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    <svg
                      className={`w-8 h-8 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span
                      className={`ml-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Video
                    </span>
                  </div>
                ) : (
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post preview"
                    className="w-full rounded-lg max-h-48 object-cover"
                  />
                )}
                {post.mediaUrls.length > 1 && (
                  <p
                    className={`text-xs mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    +{post.mediaUrls.length - 1} more
                  </p>
                )}
              </div>
            )}

            {/* Post Stats */}
            <div
              className={`mt-3 pt-3 border-t flex items-center space-x-4 text-xs ${
                isDarkMode
                  ? "border-gray-600 text-gray-400"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              <span>{post.likeCount || 0} likes</span>
              <span>{post.commentCount || 0} comments</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={sharing}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                sharing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {sharing ? "Sharing..." : "Share Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
