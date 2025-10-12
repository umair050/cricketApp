import React, { useState } from "react";
import { X, Shield, User, Upload, ImageIcon } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import api from "../../services/api";

const CreateTeamModal = ({ isOpen, onClose, onSuccess }) => {
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Team name is required");
      return;
    }

    if (formData.name.trim().length < 3) {
      setError("Team name must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/teams", {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        logo: formData.logo.trim() || undefined,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        logo: "",
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data);
      }

      onClose();
    } catch (err) {
      console.error("Failed to create team:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create team. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-md w-full ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Create New Team
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            <X
              className={`w-6 h-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Team Name */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Shield className="w-4 h-4 inline mr-1" />
              Team Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter team name"
              required
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Minimum 3 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your team..."
              rows="3"
              className={`w-full p-3 rounded-lg border resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Logo URL */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Team Logo URL (Optional)
            </label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Enter a URL to an image for your team logo
            </p>
          </div>

          {/* Logo Preview */}
          {formData.logo && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <img
                src={formData.logo}
                alt="Team logo preview"
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Logo Preview
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {formData.name || "Your team name"}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              <strong>What's next?</strong> After creating your team, you can:
            </p>
            <ul
              className={`text-xs mt-2 ml-4 space-y-1 ${
                isDarkMode ? "text-blue-400" : "text-blue-700"
              }`}
            >
              <li>• Invite players to join your team</li>
              <li>• Register for tournaments</li>
              <li>• Schedule matches</li>
              <li>• Track team statistics</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                loading || !formData.name.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                "Create Team"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
