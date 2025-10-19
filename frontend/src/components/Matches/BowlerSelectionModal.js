import React, { useState, useMemo } from "react";
import { X, Trophy, TrendingUp } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const BowlerSelectionModal = ({
  isOpen,
  onClose,
  onSelectBowler,
  players,
  currentBowler,
  lastBowler,
  bowlerStats,
}) => {
  const { isDarkMode } = useDarkMode();
  const [selectedBowler, setSelectedBowler] = useState("");

  // Filter available bowlers
  const availableBowlers = useMemo(() => {
    return (
      players?.filter(
        (p) =>
          p.role !== "Batsman" && // Must be bowler or all-rounder
          p.id != lastBowler // Can't bowl consecutive overs
      ) || []
    );
  }, [players, lastBowler]);

  const handleSelect = () => {
    if (!selectedBowler) {
      alert("Please select a bowler!");
      return;
    }

    if (selectedBowler == lastBowler) {
      alert("Same bowler cannot bowl consecutive overs!");
      return;
    }

    onSelectBowler(selectedBowler);
    setSelectedBowler("");
    onClose();
  };

  const getBowlerStats = (playerId) => {
    return (
      bowlerStats?.find((s) => s.playerId == playerId) || {
        overs: 0,
        wickets: 0,
        runsConceded: 0,
        economy: 0,
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div>
            <h3
              className={`text-xl font-semibold flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Trophy className="w-5 h-5 text-green-500" />
              Select New Bowler
            </h3>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Over completed! Choose the next bowler.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bowler List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {availableBowlers.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                No available bowlers
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {availableBowlers.map((player) => {
                const stats = getBowlerStats(player.id);
                const isLastBowler = player.id == lastBowler;
                const isSelected = selectedBowler == player.id;

                return (
                  <button
                    key={player.id}
                    onClick={() => setSelectedBowler(player.id)}
                    disabled={isLastBowler}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isLastBowler
                        ? "opacity-50 cursor-not-allowed border-gray-400"
                        : isSelected
                        ? "border-green-500 bg-green-50 dark:bg-green-900"
                        : isDarkMode
                        ? "border-gray-600 bg-gray-700 hover:border-green-500"
                        : "border-gray-300 bg-white hover:border-green-500"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {player.user?.fullName}
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {player.role} • {player.bowlingStyle || "Unknown"}
                        </p>
                      </div>
                      {isLastBowler && (
                        <span className="px-2 py-1 text-xs bg-red-500 text-white rounded">
                          Last Over
                        </span>
                      )}
                      {isSelected && (
                        <span className="px-2 py-1 text-xs bg-green-500 text-white rounded">
                          Selected
                        </span>
                      )}
                    </div>

                    {/* Bowler Stats */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div
                        className={`text-center p-2 rounded ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <p
                          className={`font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stats.overs || 0}
                        </p>
                        <p
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Overs
                        </p>
                      </div>
                      <div
                        className={`text-center p-2 rounded ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <p
                          className={`font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stats.wickets || 0}
                        </p>
                        <p
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Wickets
                        </p>
                      </div>
                      <div
                        className={`text-center p-2 rounded ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <p
                          className={`font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stats.runsConceded || 0}
                        </p>
                        <p
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Runs
                        </p>
                      </div>
                      <div
                        className={`text-center p-2 rounded ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <p
                          className={`font-bold flex items-center justify-center gap-1 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stats.economy?.toFixed(2) || "0.00"}
                          {stats.economy < 6 && (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          )}
                        </p>
                        <p
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Economy
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex gap-3 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={handleSelect}
            disabled={!selectedBowler}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              !selectedBowler
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Confirm Bowler
          </button>
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BowlerSelectionModal;

