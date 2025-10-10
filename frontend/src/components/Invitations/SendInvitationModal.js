import React, { useState, useEffect } from "react";
import { X, User, Shield, Users, Trophy } from "lucide-react";
import { useInvitations } from "../../contexts/InvitationContext";
import api from "../../services/api";

const SendInvitationModal = ({
  isOpen,
  onClose,
  invitationType = "FRIEND",
  entityId = null,
}) => {
  const { sendInvitation } = useInvitations();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getInvitationTypeInfo = (type) => {
    switch (type) {
      case "FRIEND":
        return {
          title: "Send Friend Request",
          icon: <User className="w-5 h-5" />,
          placeholder: "Search for players to add as friends...",
          messagePlaceholder: "Add a personal message (optional)",
        };
      case "TEAM":
        return {
          title: "Invite to Team",
          icon: <Shield className="w-5 h-5" />,
          placeholder: "Search for friends to invite to your team...",
          messagePlaceholder: "Add a message about the team invitation",
        };
      case "GROUP":
        return {
          title: "Invite to Group",
          icon: <Users className="w-5 h-5" />,
          placeholder: "Search for friends to invite to the group...",
          messagePlaceholder: "Add a message about the group invitation",
        };
      case "TOURNAMENT":
        return {
          title: "Invite to Tournament",
          icon: <Trophy className="w-5 h-5" />,
          placeholder: "Search for teams to invite...",
          messagePlaceholder: "Add a message about the tournament invitation",
        };
      default:
        return {
          title: "Send Invitation",
          icon: <User className="w-5 h-5" />,
          placeholder: "Search for users...",
          messagePlaceholder: "Add a message (optional)",
        };
    }
  };

  const typeInfo = getInvitationTypeInfo(invitationType);

  const fetchUsers = async (query = "") => {
    try {
      const response = await api.get(
        `/users/search?q=${encodeURIComponent(query)}`
      );
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers(searchQuery);
    } else {
      // Reset state when modal closes
      setUsers([]);
      setSelectedUser("");
      setSearchQuery("");
      setMessage("");
    }
  }, [isOpen, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendInvitation({
        receiverId: selectedUser,
        type: invitationType,
        entityId: entityId,
        message: message.trim() || undefined,
      });
      setSuccess("Invitation sent successfully!");
      setTimeout(() => {
        onClose();
        setSelectedUser("");
        setMessage("");
        setSearchQuery("");
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Failed to send invitation:", err);
      setError(err.message || "Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUser("");
    setMessage("");
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {typeInfo.icon}
            <h2 className="text-xl font-bold text-primary">{typeInfo.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 p-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-lg">
              {error}
            </div>
          )}
          {/* User Search */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Select User
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={typeInfo.placeholder}
              className="input-cricket w-full"
            />

            {/* Selected User Display */}
            {selectedUser && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">
                        {users.find((u) => u.id === selectedUser)?.fullName ||
                          "Selected User"}
                      </p>
                      <p className="text-sm text-secondary">
                        {users.find((u) => u.id === selectedUser)?.email || ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser("")}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* User List */}
            {!selectedUser && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                {users.length > 0 ? (
                  users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setSearchQuery("");
                      }}
                      className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-primary">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-secondary">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : searchQuery ? (
                  <div className="p-3 text-center text-secondary">
                    No users found
                  </div>
                ) : (
                  <div className="p-3 text-center text-secondary">
                    Start typing to search for users...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={typeInfo.messagePlaceholder}
              rows={3}
              className="input-cricket w-full resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 btn-cricket-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedUser || loading}
              className="flex-1 btn-cricket"
            >
              {loading ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendInvitationModal;
