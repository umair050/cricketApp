import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  toggleLike,
  deletePost,
  sharePost,
} from "../../store/slices/feedSlice";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import CommentsModal from "./CommentsModal";
import ShareModal from "./ShareModal";

const FeedCard = ({ post, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { isDarkMode } = useDarkMode();
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);

  const isOwnPost = user?.id === post.user?.id;

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

  const handleLike = async () => {
    try {
      const result = await dispatch(toggleLike(post.id)).unwrap();
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deletePost(post.id)).unwrap();
        if (onDelete) {
          onDelete(post.id);
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post");
      }
    }
  };

  const handleShare = async (postId, shareText) => {
    try {
      await dispatch(sharePost({ postId, shareText })).unwrap();
      setShareCount((prev) => prev + 1);
      setShowShareModal(false);
    } catch (error) {
      console.error("Failed to share post:", error);
      if (error.message && error.message.includes("already shared")) {
        alert("You have already shared this post!");
      } else {
        alert("Failed to share post. Please try again.");
      }
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrls || post.mediaUrls.length === 0) return null;

    return (
      <div
        className={`mt-3 ${
          post.mediaUrls.length === 1 ? "" : "grid grid-cols-2 gap-2"
        }`}
      >
        {post.mediaUrls.map((url, index) => {
          const isVideo =
            post.mediaType === "video" ||
            url.includes(".mp4") ||
            url.includes("video");

          return isVideo ? (
            <video
              key={index}
              src={url}
              controls
              className="w-full rounded-lg max-h-96 object-cover"
            />
          ) : (
            <img
              key={index}
              src={url}
              alt={`Post media ${index + 1}`}
              className="w-full rounded-lg object-cover"
              style={{
                maxHeight: post.mediaUrls.length === 1 ? "500px" : "250px",
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div
        className={`rounded-lg shadow-md p-6 mb-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Post Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {post.user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {post.user?.fullName}
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                >
                  {formatTimeAgo(post.createdAt)}
                </span>
                {post.location && (
                  <>
                    <span
                      className={isDarkMode ? "text-gray-600" : "text-gray-400"}
                    >
                      •
                    </span>
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      📍 {post.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Post Menu */}
          {isOwnPost && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <svg
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {showMenu && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  } border ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={handleDelete}
                    className={`w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg`}
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className={`mt-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {post.content && (
            <p className="whitespace-pre-wrap break-words">{post.content}</p>
          )}
        </div>

        {/* Media */}
        {renderMedia()}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                className={`text-sm ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } hover:underline cursor-pointer`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div
          className={`mt-4 pt-3 border-t flex items-center justify-between ${
            isDarkMode
              ? "border-gray-700 text-gray-400"
              : "border-gray-200 text-gray-500"
          }`}
        >
          <span className="text-sm">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
          <span className="text-sm">
            {post.commentCount || 0}{" "}
            {post.commentCount === 1 ? "comment" : "comments"}
          </span>
        </div>

        {/* Action Buttons */}
        <div
          className={`mt-3 pt-3 border-t flex items-center justify-around ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                : `${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">{isLiked ? "Liked" : "Like"}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium">Comment</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="font-medium">
              Share {shareCount > 0 && `(${shareCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal post={post} onClose={() => setShowComments(false)} />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}
    </>
  );
};

export default FeedCard;
