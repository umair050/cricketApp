import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, uploadMedia } from "../../store/slices/feedSlice";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";

const CreatePost = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { loading, uploadingMedia } = useSelector((state) => state.feed);
  const { isDarkMode } = useDarkMode();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [showOptions, setShowOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to 5 files
    const selectedFiles = files.slice(0, 5);
    setMediaFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));

    // Create previews
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview((prev) =>
          [
            ...prev,
            {
              url: reader.result,
              type: file.type.startsWith("image/") ? "image" : "video",
              name: file.name,
            },
          ].slice(0, 5)
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map((tag) => tag.substring(1)) : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && mediaFiles.length === 0) {
      alert("Please add some content or media");
      return;
    }

    try {
      setIsUploading(true);

      // Upload media files if any
      let mediaUrls = [];
      if (mediaFiles.length > 0) {
        mediaUrls = await dispatch(uploadMedia(mediaFiles)).unwrap();
      }

      // Extract hashtags from content and hashtag input
      const contentHashtags = extractHashtags(content);
      const inputHashtags = hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      const allHashtags = [...new Set([...contentHashtags, ...inputHashtags])];

      // Determine media type
      let mediaType = "text";
      if (mediaUrls.length > 0) {
        const hasVideo = mediaFiles.some((file) =>
          file.type.startsWith("video/")
        );
        const hasImage = mediaFiles.some((file) =>
          file.type.startsWith("image/")
        );

        if (hasVideo && hasImage) {
          mediaType = "mixed";
        } else if (hasVideo) {
          mediaType = "video";
        } else if (hasImage) {
          mediaType = "image";
        }
      }

      const postData = {
        content: content.trim(),
        mediaType,
        mediaUrls,
        location: location.trim() || undefined,
        hashtags: allHashtags.length > 0 ? allHashtags : undefined,
        privacy,
      };

      await dispatch(createPost(postData)).unwrap();

      // Reset form
      setContent("");
      setMediaFiles([]);
      setMediaPreview([]);
      setLocation("");
      setHashtags("");
      setPrivacy("public");
      setShowOptions(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 mb-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <form onSubmit={handleSubmit}>
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-green-600 text-white"
            }`}
          >
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p
              className={`font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.fullName}
            </p>
          </div>
        </div>

        {/* Content Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in your cricket world?"
          className={`w-full p-3 rounded-lg border resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          rows="3"
        />

        {/* Media Preview */}
        {mediaPreview.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {mediaPreview.map((media, index) => (
              <div key={index} className="relative group">
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt={media.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Additional Options (expandable) */}
        {showOptions && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
              className={`w-full p-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="Add hashtags (comma separated)"
              className={`w-full p-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {/* Add Media Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={mediaFiles.length >= 5}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                mediaFiles.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Add photos/videos"
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* More Options Button */}
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="More options"
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>

            {/* File Input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Post Button */}
          <button
            type="submit"
            disabled={
              loading ||
              uploadingMedia ||
              isUploading ||
              (!content.trim() && mediaFiles.length === 0)
            }
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              loading ||
              uploadingMedia ||
              isUploading ||
              (!content.trim() && mediaFiles.length === 0)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading || uploadingMedia || isUploading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
