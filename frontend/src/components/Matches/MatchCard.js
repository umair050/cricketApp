import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Calendar, MapPin, Clock, Eye } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const MatchCard = ({ match }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const getStatusBadge = (status) => {
    const badges = {
      live: { bg: "bg-red-500", text: "LIVE", pulse: true },
      scheduled: { bg: "bg-blue-500", text: "SCHEDULED", pulse: false },
      completed: { bg: "bg-green-500", text: "COMPLETED", pulse: false },
      cancelled: { bg: "bg-gray-500", text: "CANCELLED", pulse: false },
    };
    return (
      badges[status] || {
        bg: "bg-gray-500",
        text: status.toUpperCase(),
        pulse: false,
      }
    );
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
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

  const status = getStatusBadge(match.status);

  return (
    <div
      onClick={() => navigate(`/matches/${match.id}`)}
      className={`rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-all duration-200 border ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-green-500"
          : "bg-white border-gray-200 hover:border-green-500"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium text-white ${
              status.bg
            } ${status.pulse ? "animate-pulse" : ""}`}
          >
            {status.text}
          </span>
          {match.matchType === "tournament" && (
            <Trophy
              className="w-4 h-4 text-yellow-500"
              title="Tournament Match"
            />
          )}
        </div>
        {match.viewCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{match.viewCount}</span>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-3">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                isDarkMode
                  ? "bg-green-700 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {match.teamA?.name?.charAt(0).toUpperCase()}
            </div>
            <span
              className={`font-medium truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {match.teamA?.name}
            </span>
          </div>
          <span
            className={`text-lg font-bold ml-2 ${
              match.winner?.id === match.teamA?.id
                ? "text-green-600"
                : isDarkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {match.teamAScore || "-"}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                isDarkMode ? "bg-blue-700 text-white" : "bg-blue-600 text-white"
              }`}
            >
              {match.teamB?.name?.charAt(0).toUpperCase()}
            </div>
            <span
              className={`font-medium truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {match.teamB?.name}
            </span>
          </div>
          <span
            className={`text-lg font-bold ml-2 ${
              match.winner?.id === match.teamB?.id
                ? "text-green-600"
                : isDarkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {match.teamBScore || "-"}
          </span>
        </div>
      </div>

      {/* Match Summary */}
      {match.matchSummary && match.status === "completed" && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p
            className={`text-sm text-center font-medium ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            {match.matchSummary}
          </p>
        </div>
      )}

      {/* Match Info */}
      <div
        className={`mt-3 pt-3 border-t space-y-1 ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div
          className={`flex items-center text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(match.matchDate)}
          <Clock className="w-3 h-3 ml-3 mr-1" />
          {formatTime(match.matchDate)}
        </div>
        {match.venue && (
          <div
            className={`flex items-center text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <MapPin className="w-3 h-3 mr-1" />
            {match.venue}
            {match.city && `, ${match.city}`}
          </div>
        )}
        {match.tournament && (
          <div
            className={`flex items-center text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Trophy className="w-3 h-3 mr-1" />
            {match.tournament.name}
            {match.groupName && ` - ${match.groupName}`}
          </div>
        )}
      </div>

      {/* Overs Info */}
      <div className="mt-2 flex justify-between items-center">
        <span
          className={`text-xs ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {match.overs} overs
        </span>
        {match.stage && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {match.stage.replace("_", " ").toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
