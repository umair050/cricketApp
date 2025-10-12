import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy, Target, Shield, TrendingUp } from "lucide-react";
import { fetchTournamentLeaderboard } from "../../store/slices/matchSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";

const Leaderboard = ({ tournamentId, type = "batting" }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const { tournamentLeaderboard, loading, error } = useSelector(
    (state) => state.match
  );
  const [activeTab, setActiveTab] = useState(type);

  useEffect(() => {
    if (tournamentId) {
      dispatch(fetchTournamentLeaderboard({ tournamentId, type: activeTab }));
    }
  }, [dispatch, tournamentId, activeTab]);

  const tabs = [
    { id: "batting", label: "Batting", icon: Target, badge: "🔶 Orange Cap" },
    { id: "bowling", label: "Bowling", icon: Trophy, badge: "🟣 Purple Cap" },
    { id: "fielding", label: "Fielding", icon: Shield, badge: "" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  const currentLeaderboard = tournamentLeaderboard[activeTab] || [];

  const getPositionBadge = (index) => {
    if (index === 0)
      return <span className="text-yellow-500 text-2xl font-bold">👑</span>;
    if (index === 1)
      return <span className="text-gray-400 text-xl font-bold">🥈</span>;
    if (index === 2)
      return <span className="text-orange-400 text-xl font-bold">🥉</span>;
    return (
      <span
        className={`font-bold text-lg ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {index + 1}
      </span>
    );
  };

  const renderBattingStats = (player) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Runs
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.totalRuns}
        </p>
      </div>
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Average
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.average.toFixed(2)}
        </p>
      </div>
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Strike Rate
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.strikeRate.toFixed(2)}
        </p>
      </div>
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Matches
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.matches}
        </p>
      </div>
    </div>
  );

  const renderBowlingStats = (player) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Wickets
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.totalWickets}
        </p>
      </div>
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Economy
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.economy.toFixed(2)}
        </p>
      </div>
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Average
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.average > 0 ? player.average.toFixed(2) : "-"}
        </p>
      </div>
      <div className="text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Matches
        </p>
        <p
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {player.matches}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={`rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === id
                ? "border-b-2 border-green-600 text-green-600"
                : isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {badge && activeTab === id && (
              <span className="text-xs ml-1 hidden md:inline">{badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {currentLeaderboard.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            No leaderboard data available yet
          </p>
          <p
            className={`text-sm mt-2 ${
              isDarkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Play some matches to see the leaderboard!
          </p>
        </div>
      )}

      {/* Leaderboard List */}
      {currentLeaderboard.length > 0 && (
        <div className="p-4 space-y-4">
          {currentLeaderboard.map((player, index) => (
            <div
              key={player.player?.id || index}
              className={`p-4 rounded-lg transition-all ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 ring-2 ring-yellow-400"
                  : isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Position */}
                <div className="w-12 flex items-center justify-center">
                  {getPositionBadge(index)}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                          : isDarkMode
                          ? "bg-green-700 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {player.player?.user?.fullName?.charAt(0).toUpperCase() ||
                        "?"}
                    </div>
                    <div>
                      <p
                        className={`font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {player.player?.user?.fullName || "Unknown Player"}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {player.player?.role || "Player"}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  {activeTab === "batting" && renderBattingStats(player)}
                  {activeTab === "bowling" && renderBowlingStats(player)}
                </div>

                {/* Trophy for Leader */}
                {index === 0 && (
                  <div className="hidden md:flex flex-col items-center">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mt-1">
                      {activeTab === "batting" ? "Orange Cap" : "Purple Cap"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show More Button (if needed) */}
      {currentLeaderboard.length >= 10 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={() => alert("Load more functionality - to be implemented")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            View All Players
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

