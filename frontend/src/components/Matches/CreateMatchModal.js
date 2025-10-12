import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Calendar, MapPin, Clock, Trophy } from "lucide-react";
import { createMatch, fetchMatches } from "../../store/slices/matchSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";
import api from "../../services/api";

const CreateMatchModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const { loading, error } = useSelector((state) => state.match);

  const [formData, setFormData] = useState({
    matchType: "friendly",
    teamAId: "",
    teamBId: "",
    matchDate: "",
    venue: "",
    city: "",
    overs: 20,
    tournamentId: "",
    groupName: "",
    stage: "",
  });

  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadTeams();
      loadTournaments();
    }
  }, [isOpen]);

  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await api.get("/teams");
      setTeams(response.data || []);
    } catch (error) {
      console.error("Failed to load teams:", error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const loadTournaments = async () => {
    setLoadingTournaments(true);
    try {
      const response = await api.get("/tournaments");
      setTournaments(response.data || []);
    } catch (error) {
      console.error("Failed to load tournaments:", error);
    } finally {
      setLoadingTournaments(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!formData.teamAId || !formData.teamBId) {
      setFormError("Please select both teams");
      return;
    }

    if (formData.teamAId === formData.teamBId) {
      setFormError("A team cannot play against itself!");
      return;
    }

    if (!formData.matchDate) {
      setFormError("Please select match date and time");
      return;
    }

    if (!formData.venue) {
      setFormError("Please enter a venue");
      return;
    }

    try {
      const matchData = {
        matchType: formData.matchType,
        teamAId: parseInt(formData.teamAId),
        teamBId: parseInt(formData.teamBId),
        matchDate: new Date(formData.matchDate).toISOString(),
        venue: formData.venue,
        city: formData.city || undefined,
        overs: parseInt(formData.overs),
      };

      // Add tournament fields if tournament match
      if (formData.matchType === "tournament") {
        if (!formData.tournamentId) {
          setFormError("Please select a tournament");
          return;
        }
        matchData.tournamentId = parseInt(formData.tournamentId);
        if (formData.groupName) matchData.groupName = formData.groupName;
        if (formData.stage) matchData.stage = formData.stage;
      }

      await dispatch(createMatch(matchData)).unwrap();
      await dispatch(fetchMatches()); // Refresh list

      // Reset form
      setFormData({
        matchType: "friendly",
        teamAId: "",
        teamBId: "",
        matchDate: "",
        venue: "",
        city: "",
        overs: 20,
        tournamentId: "",
        groupName: "",
        stage: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create match:", error);
      setFormError(
        error.message || "Failed to create match. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b sticky top-0 z-10 ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Create New Match
          </h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Match Type */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Match Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, matchType: "friendly" }))
                }
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.matchType === "friendly"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                    : isDarkMode
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <p
                  className={`font-medium ${
                    formData.matchType === "friendly"
                      ? "text-green-600"
                      : isDarkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Friendly Match
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Casual match between teams
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, matchType: "tournament" }))
                }
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.matchType === "tournament"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                    : isDarkMode
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Trophy
                  className={`w-5 h-5 mx-auto mb-1 ${
                    formData.matchType === "tournament"
                      ? "text-green-600"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                />
                <p
                  className={`font-medium ${
                    formData.matchType === "tournament"
                      ? "text-green-600"
                      : isDarkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Tournament Match
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Official tournament game
                </p>
              </button>
            </div>
          </div>

          {/* Teams Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team A */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Team A
              </label>
              <select
                name="teamAId"
                value={formData.teamAId}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select Team A</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Team B */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Team B
              </label>
              <select
                name="teamBId"
                value={formData.teamBId}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select Team B</option>
                {teams
                  .filter((team) => team.id !== parseInt(formData.teamAId))
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Tournament Fields (conditional) */}
          {formData.matchType === "tournament" && (
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Tournament *
                </label>
                <select
                  name="tournamentId"
                  value={formData.tournamentId}
                  onChange={handleChange}
                  required={formData.matchType === "tournament"}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select Tournament</option>
                  {tournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Group (Optional)
                  </label>
                  <input
                    type="text"
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleChange}
                    placeholder="e.g., Group A"
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Stage (Optional)
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Select Stage</option>
                    <option value="group">Group Stage</option>
                    <option value="quarter_final">Quarter Final</option>
                    <option value="semi_final">Semi Final</option>
                    <option value="final">Final</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Match Date & Time */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Match Date & Time
            </label>
            <input
              type="datetime-local"
              name="matchDate"
              value={formData.matchDate}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Venue & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                placeholder="e.g., Mumbai Cricket Ground"
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                City (Optional)
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Overs */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Overs Per Side
            </label>
            <select
              name="overs"
              value={formData.overs}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="3">3 Overs (Super Quick)</option>
              <option value="6">6 Overs (Quick)</option>
              <option value="10">10 Overs (T10)</option>
              <option value="20">20 Overs (T20)</option>
              <option value="50">50 Overs (ODI)</option>
            </select>
          </div>

          {/* Error Message */}
          {(formError || error) && (
            <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
              {formError || error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingTeams || loadingTournaments}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                loading || loadingTeams || loadingTournaments
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Creating..." : "Create Match"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchModal;
