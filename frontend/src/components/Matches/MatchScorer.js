import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RotateCcw,
  AlertCircle,
  Trophy,
  Target,
  CheckCircle,
} from "lucide-react";
import {
  addBall,
  fetchMatchBalls,
  undoLastBall,
  fetchLiveScore,
  updateMatchResult,
} from "../../store/slices/matchSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";

const MatchScorer = ({ match, players }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const { balls, liveScore, ballLoading, error } = useSelector(
    (state) => state.match
  );

  const [currentBatsman, setCurrentBatsman] = useState("");
  const [currentBowler, setCurrentBowler] = useState("");
  const [commentary, setCommentary] = useState("");
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState(null);

  // Calculate current over and ball
  const legalBalls = balls.filter((b) => b.isLegal).length;
  const currentOver = Math.floor(legalBalls / 6);
  const currentBall = legalBalls % 6;
  const overDisplay = `${currentOver}.${currentBall}`;

  useEffect(() => {
    if (match?.id) {
      dispatch(fetchMatchBalls(match.id));
      dispatch(fetchLiveScore(match.id));
    }
  }, [dispatch, match?.id]);

  const ballOutcomes = [
    { id: "dot", label: "0", runs: 0, color: "gray" },
    { id: "one", label: "1", runs: 1, color: "blue" },
    { id: "two", label: "2", runs: 2, color: "blue" },
    { id: "three", label: "3", runs: 3, color: "blue" },
    { id: "four", label: "4", runs: 4, color: "green" },
    { id: "six", label: "6", runs: 6, color: "purple" },
  ];

  const extras = [
    { id: "wide", label: "Wide", runs: 1 },
    { id: "no_ball", label: "No Ball", runs: 1 },
    { id: "bye", label: "Bye", runs: 1 },
    { id: "leg_bye", label: "Leg Bye", runs: 1 },
  ];

  const wicketTypes = [
    "bowled",
    "caught",
    "lbw",
    "run_out",
    "stumped",
    "hit_wicket",
  ];

  const handleBallClick = async (outcome) => {
    if (!currentBatsman || !currentBowler) {
      alert("Please select batsman and bowler first!");
      return;
    }

    if (outcome.id === "wicket") {
      setShowWicketModal(true);
      setSelectedOutcome(outcome);
      return;
    }

    await submitBall(outcome);
  };

  const submitBall = async (outcome, isWicket = false, wType = null) => {
    try {
      const ballData = {
        battingTeamId: match.teamA.id, // Adjust based on innings
        bowlingTeamId: match.teamB.id,
        overNumber: parseFloat(overDisplay),
        batsmanId: parseInt(currentBatsman),
        bowlerId: parseInt(currentBowler),
        outcome: outcome.id,
        runs: outcome.runs || 0,
        extras: ["wide", "no_ball", "bye", "leg_bye"].includes(outcome.id)
          ? outcome.runs
          : 0,
        isWicket,
        wicketType: wType,
        commentary: commentary || undefined,
      };

      await dispatch(addBall({ matchId: match.id, ballData })).unwrap();

      // Refresh live score
      dispatch(fetchLiveScore(match.id));

      // Clear commentary
      setCommentary("");

      // Close wicket modal if open
      setShowWicketModal(false);
    } catch (error) {
      console.error("Failed to add ball:", error);
      alert("Failed to add ball. Please try again.");
    }
  };

  const handleWicketSubmit = () => {
    if (!wicketType) {
      alert("Please select wicket type!");
      return;
    }

    submitBall({ id: "wicket", label: "W", runs: 0 }, true, wicketType);
  };

  const handleUndo = async () => {
    if (window.confirm("Are you sure you want to undo the last ball?")) {
      try {
        await dispatch(undoLastBall(match.id)).unwrap();
        dispatch(fetchLiveScore(match.id));
      } catch (error) {
        console.error("Failed to undo ball:", error);
        alert("Failed to undo ball.");
      }
    }
  };

  const handleCompleteInnings = async () => {
    if (
      window.confirm(
        "Are you sure you want to complete this innings? This action cannot be undone."
      )
    ) {
      // Implement innings completion logic
      alert("Innings completed! Implement logic to switch innings.");
    }
  };

  const handleCompleteMatch = async () => {
    if (
      window.confirm(
        "Are you sure you want to complete this match and declare the result?"
      )
    ) {
      try {
        await dispatch(
          updateMatchResult({
            matchId: match.id,
            resultData: {
              status: "completed",
              winnerId:
                liveScore?.teamAScore?.runs > liveScore?.teamBScore?.runs
                  ? match.teamA.id
                  : match.teamB.id,
              teamAScore: `${liveScore?.teamAScore?.score}`,
              teamBScore: `${liveScore?.teamBScore?.score}`,
            },
          })
        ).unwrap();
        alert("Match completed successfully!");
      } catch (error) {
        console.error("Failed to complete match:", error);
        alert("Failed to complete match.");
      }
    }
  };

  const getColorClass = (color) => {
    const colors = {
      gray: "bg-gray-500 hover:bg-gray-600",
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      purple: "bg-purple-500 hover:bg-purple-600",
      red: "bg-red-500 hover:bg-red-600",
      yellow: "bg-yellow-500 hover:bg-yellow-600",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Live Match Scorer
        </h2>
        <div
          className={`flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>
            {match?.teamA?.name} vs {match?.teamB?.name}
          </span>
        </div>
      </div>

      {/* Current Score */}
      {liveScore && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p
                className={`text-sm mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {match?.teamA?.name}
              </p>
              <p
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {liveScore.teamAScore?.score || "0/0"}
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                ({liveScore.teamAScore?.overs} overs)
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-sm mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {match?.teamB?.name}
              </p>
              <p
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {liveScore.teamBScore?.score || "Yet to bat"}
              </p>
              {liveScore.teamBScore?.overs && (
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  ({liveScore.teamBScore.overs} overs)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Over Display */}
      <div
        className={`mb-6 text-center p-4 rounded-lg ${
          isDarkMode ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <p
          className={`text-sm mb-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Current Over
        </p>
        <p
          className={`text-4xl font-bold ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`}
        >
          {overDisplay}
        </p>
        <p
          className={`text-xs mt-2 ${
            isDarkMode ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Ball {currentBall + 1} of 6
        </p>
      </div>

      {/* Player Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Batsman */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Target className="w-4 h-4 inline mr-1" />
            Current Batsman
          </label>
          <select
            value={currentBatsman}
            onChange={(e) => setCurrentBatsman(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Select Batsman</option>
            {players
              ?.filter((p) => p.role !== "Bowler")
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.user?.fullName} - {player.role}
                </option>
              ))}
          </select>
        </div>

        {/* Bowler */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-1" />
            Current Bowler
          </label>
          <select
            value={currentBowler}
            onChange={(e) => setCurrentBowler(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Select Bowler</option>
            {players
              ?.filter((p) => p.role !== "Batsman")
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.user?.fullName} - {player.role}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Ball Outcomes */}
      <div className="mb-6">
        <p
          className={`text-sm font-medium mb-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Select Ball Outcome
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ballOutcomes.map((outcome) => (
            <button
              key={outcome.id}
              onClick={() => handleBallClick(outcome)}
              disabled={ballLoading}
              className={`p-4 rounded-lg text-white font-bold text-xl transition-all ${getColorClass(
                outcome.color
              )} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {outcome.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extras & Wicket */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {extras.map((extra) => (
          <button
            key={extra.id}
            onClick={() => handleBallClick(extra)}
            disabled={ballLoading}
            className={`p-3 rounded-lg font-medium text-white transition-all ${getColorClass(
              "yellow"
            )} disabled:opacity-50`}
          >
            {extra.label}
          </button>
        ))}
        <button
          onClick={() => handleBallClick({ id: "wicket", label: "W" })}
          disabled={ballLoading}
          className={`p-3 rounded-lg font-bold text-white transition-all ${getColorClass(
            "red"
          )} disabled:opacity-50`}
        >
          WICKET
        </button>
      </div>

      {/* Commentary */}
      <div className="mb-6">
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Commentary (Optional)
        </label>
        <textarea
          value={commentary}
          onChange={(e) => setCommentary(e.target.value)}
          placeholder="Add commentary for this ball..."
          rows="2"
          className={`w-full p-3 rounded-lg border resize-none ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Recent Balls */}
      <div className="mb-6">
        <p
          className={`text-sm font-medium mb-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Recent Balls (Last 6)
        </p>
        <div className="flex gap-2 flex-wrap">
          {balls.slice(-6).map((ball, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                ball.isWicket
                  ? "bg-red-500 text-white"
                  : ball.runs === 4
                  ? "bg-green-500 text-white"
                  : ball.runs === 6
                  ? "bg-purple-500 text-white"
                  : !ball.isLegal
                  ? "bg-yellow-500 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {ball.isWicket ? "W" : ball.runs}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleUndo}
          disabled={balls.length === 0 || ballLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            balls.length === 0 || ballLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Undo Last Ball
        </button>

        <button
          onClick={handleCompleteInnings}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Complete Innings
        </button>

        <button
          onClick={handleCompleteMatch}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Trophy className="w-4 h-4" />
          Complete Match
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-lg shadow-xl max-w-md w-full p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Select Wicket Type
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {wicketTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setWicketType(type)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    wicketType === type
                      ? "bg-red-600 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {type.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWicketSubmit}
                disabled={!wicketType}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  !wicketType
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Submit Wicket
              </button>
              <button
                onClick={() => {
                  setShowWicketModal(false);
                  setWicketType("");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
      )}
    </div>
  );
};

export default MatchScorer;
