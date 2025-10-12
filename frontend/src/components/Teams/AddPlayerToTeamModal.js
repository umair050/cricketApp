import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { X, UserPlus, Search, Mail } from "lucide-react";
import {
  sendInvitation,
  fetchInvitations,
} from "../../store/slices/invitationSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";
import api from "../../services/api";

const AddPlayerToTeamModal = ({ isOpen, onClose, team }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen && team) {
      fetchPlayers();
    }
  }, [isOpen, team]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = players.filter(
        (player) =>
          player.user?.fullName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          player.user?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          player.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [searchQuery, players]);

  const fetchPlayers = async () => {
    setLoadingPlayers(true);
    try {
      const response = await api.get("/players");
      setPlayers(response.data || []);
      setFilteredPlayers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch players:", error);
      setError("Failed to load players");
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!selectedPlayer) {
      setError("Please select a player");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(
        sendInvitation({
          receiverId: selectedPlayer.user.id,
          type: "TEAM",
          entityId: team.id,
          message: message.trim() || `Join ${team.name}!`,
        })
      ).unwrap();

      await dispatch(fetchInvitations());
      setSuccess(`Invitation sent to ${selectedPlayer.user.fullName}!`);

      setTimeout(() => {
        setSelectedPlayer(null);
        setMessage("");
        setSearchQuery("");
        setSuccess("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to send invitation:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to send invitation. The player may have already been invited."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Add Player to {team?.name}
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Send an invitation to a player to join your team
            </p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Info Box */}
          <div
            className={`mb-4 p-4 rounded-lg border ${
              isDarkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-2">
              <Mail
                className={`w-5 h-5 mt-0.5 ${
                  isDarkMode ? "text-blue-300" : "text-blue-600"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-blue-300" : "text-blue-800"
                  }`}
                >
                  How it works:
                </p>
                <ul
                  className={`text-xs mt-1 space-y-1 ${
                    isDarkMode ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  <li>1. Select a player from the list below</li>
                  <li>2. Add an optional message</li>
                  <li>3. We'll send them a team invitation</li>
                  <li>4. When they accept, they'll be added to your team!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Search className="w-4 h-4 inline mr-1" />
              Search Players
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Player List */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Select Player
            </label>

            {loadingPlayers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {searchQuery ? "No players found" : "No players available"}
                </p>
              </div>
            ) : (
              <div
                className={`border rounded-lg max-h-64 overflow-y-auto ${
                  isDarkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className={`p-4 cursor-pointer transition-colors border-b last:border-b-0 ${
                      selectedPlayer?.id === player.id
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : isDarkMode
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          selectedPlayer?.id === player.id
                            ? "bg-green-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {player.user?.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {player.user?.fullName}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {player.role} • {player.battingStyle || "N/A"} •{" "}
                          {player.bowlingStyle || "N/A"}
                        </p>
                      </div>
                      {selectedPlayer?.id === player.id && (
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          {selectedPlayer && (
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Invitation Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hey ${selectedPlayer.user?.fullName}, join ${team?.name}!`}
                rows="3"
                className={`w-full p-3 rounded-lg border resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {success}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex gap-3">
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
              type="button"
              onClick={handleSendInvitation}
              disabled={loading || !selectedPlayer}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                loading || !selectedPlayer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Invitation
                </>
              )}
            </button>
          </div>

          {/* Helper Text */}
          <p
            className={`text-xs text-center mt-3 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            The player will receive an invitation notification. Once they
            accept, they'll be added to your team automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerToTeamModal;
