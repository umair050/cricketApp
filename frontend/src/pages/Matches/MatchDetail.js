import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchById } from "../../store/slices/matchSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";
import MatchScorer from "../../components/Matches/MatchScorer";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Clock,
  Target,
} from "lucide-react";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const { currentMatch, loading, error } = useSelector((state) => state.match);

  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const fetchedTeamsRef = useRef(new Set());

  useEffect(() => {
    if (id) {
      dispatch(fetchMatchById(id));
    }
  }, [id, dispatch]);

  const fetchTeamPlayers = useCallback(async () => {
    if (!currentMatch?.teamA?.id || !currentMatch?.teamB?.id) {
      return;
    }

    // Create a unique key for this match's teams
    const teamsKey = `${currentMatch.teamA.id}-${currentMatch.teamB.id}`;

    // Skip if already fetched or currently fetching
    if (fetchedTeamsRef.current.has(teamsKey) || loadingPlayers) {
      return;
    }

    // Mark as fetched
    fetchedTeamsRef.current.add(teamsKey);
    setLoadingPlayers(true);

    try {
      // Fetch both teams in parallel
      const [teamAResponse, teamBResponse] = await Promise.all([
        fetch(`http://localhost:3001/teams/${currentMatch.teamA.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch(`http://localhost:3001/teams/${currentMatch.teamB.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const [teamAData, teamBData] = await Promise.all([
        teamAResponse.json(),
        teamBResponse.json(),
      ]);

      const teamAPlayersList =
        teamAData.members?.map((member) => ({
          id: member.player.id,
          ...member.player,
        })) || [];

      const teamBPlayersList =
        teamBData.members?.map((member) => ({
          id: member.player.id,
          ...member.player,
        })) || [];

      setTeamAPlayers(teamAPlayersList);
      setTeamBPlayers(teamBPlayersList);
    } catch (error) {
      console.error("Failed to fetch team players:", error);
      // Remove from fetched set on error so it can retry
      fetchedTeamsRef.current.delete(teamsKey);
    } finally {
      setLoadingPlayers(false);
    }
  }, [currentMatch?.teamA?.id, currentMatch?.teamB?.id, loadingPlayers]);

  useEffect(() => {
    fetchTeamPlayers();
  }, [fetchTeamPlayers]);

  // Combine all players for the scorer - memoize to prevent recreating array
  // Must be before any conditional returns (React Hooks rule)
  const allPlayers = React.useMemo(
    () => [...teamAPlayers, ...teamBPlayers],
    [teamAPlayers, teamBPlayers]
  );

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !currentMatch) {
    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`rounded-lg shadow-md p-8 text-center ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Match Not Found
            </h2>
            <p
              className={`mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {error || "The match you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/matches")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Matches
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/matches")}
            className={`flex items-center gap-2 mb-4 text-sm font-medium ${
              isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Matches
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Match Scorer
              </h1>
              <p
                className={`mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Ball-by-ball scoring for this match
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentMatch.status === "live"
                  ? "bg-red-500 text-white animate-pulse"
                  : currentMatch.status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {currentMatch.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Match Info Card */}
        <div
          className={`rounded-lg shadow-md p-6 mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teams */}
            <div>
              <h3
                className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Users className="w-4 h-4" />
                Teams
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentMatch.teamA?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentMatch.teamA?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentMatch.teamB?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentMatch.teamB?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Match Details */}
            <div>
              <h3
                className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Target className="w-4 h-4" />
                Match Details
              </h3>
              <div
                className={`space-y-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(currentMatch.matchDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(currentMatch.matchDate)}</span>
                </div>
                {currentMatch.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {currentMatch.venue}
                      {currentMatch.city && `, ${currentMatch.city}`}
                    </span>
                  </div>
                )}
                {currentMatch.tournament && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>{currentMatch.tournament.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>{currentMatch.overs} overs per side</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Team A */}
          <div
            className={`rounded-lg shadow-md p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {currentMatch.teamA?.name} Squad
            </h3>
            <div className="space-y-2">
              {teamAPlayers.length > 0 ? (
                teamAPlayers.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {player.user?.fullName}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkMode
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {player.role}
                    </span>
                  </div>
                ))
              ) : (
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No players available
                </p>
              )}
            </div>
          </div>

          {/* Team B */}
          <div
            className={`rounded-lg shadow-md p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {currentMatch.teamB?.name} Squad
            </h3>
            <div className="space-y-2">
              {teamBPlayers.length > 0 ? (
                teamBPlayers.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {player.user?.fullName}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkMode
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {player.role}
                    </span>
                  </div>
                ))
              ) : (
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No players available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Match Scorer Component */}
        <MatchScorer
          key={`match-scorer-${currentMatch.id}`}
          match={currentMatch}
          players={allPlayers}
        />
      </div>
    </div>
  );
};

export default MatchDetail;
