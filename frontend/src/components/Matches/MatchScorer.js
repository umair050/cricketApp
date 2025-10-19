import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import BowlerSelectionModal from "./BowlerSelectionModal";
import ExtraRunsModal from "./ExtraRunsModal";
import {
  saveScorerState,
  loadScorerState,
} from "../../utils/matchScorerStorage";

// Module-level Set to track loaded matches across all component instances
// This persists even if component unmounts/remounts
const loadedMatches = new Set();
const loadingMatches = new Set();

const MatchScorer = ({ match, players }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const { balls, liveScore, ballLoading, error } = useSelector(
    (state) => state.match
  );

  const [currentBatsman, setCurrentBatsman] = useState("");
  const [currentNonStriker, setCurrentNonStriker] = useState("");
  const [currentBowler, setCurrentBowler] = useState("");
  const [commentary, setCommentary] = useState("");
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [lastBowler, setLastBowler] = useState(null);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [isFreeHit, setIsFreeHit] = useState(false);
  const [showExtraRunsModal, setShowExtraRunsModal] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [extraRuns, setExtraRuns] = useState(0);

  // Extract match ID once to prevent object reference issues
  const matchId = match?.id;

  // Track component mounts for debugging
  useEffect(() => {
    console.log("[MatchScorer] Component MOUNTED for match:", matchId);
    return () => {
      console.log("[MatchScorer] Component UNMOUNTED for match:", matchId);
    };
  }, [matchId]);

  // Load saved state on mount (persists across remounts)
  useEffect(() => {
    if (!matchId) return;

    const savedState = loadScorerState(matchId);
    console.log(
      "[Persistence] Attempting to load saved state for match:",
      matchId
    );

    if (savedState) {
      console.log("[Persistence] Found saved state! Restoring:", savedState);
      setCurrentBatsman(savedState.currentBatsman || "");
      setCurrentNonStriker(savedState.currentNonStriker || "");
      setCurrentBowler(savedState.currentBowler || "");
      setLastBowler(savedState.lastBowler || null);
      setIsFreeHit(savedState.isFreeHit || false);
    } else {
      console.log("[Persistence] No saved state found. Starting fresh.");
    }
  }, [matchId]);

  // Save state whenever players change
  useEffect(() => {
    if (!matchId) return;

    // Only save if at least one player is selected
    if (currentBatsman || currentNonStriker || currentBowler) {
      console.log("[Persistence] Saving state:", {
        currentBatsman,
        currentNonStriker,
        currentBowler,
        lastBowler,
        isFreeHit,
      });

      saveScorerState(matchId, {
        currentBatsman,
        currentNonStriker,
        currentBowler,
        lastBowler,
        isFreeHit,
      });
    }
  }, [
    matchId,
    currentBatsman,
    currentNonStriker,
    currentBowler,
    lastBowler,
    isFreeHit,
  ]);

  // Memoize calculated values to prevent unnecessary recalculations
  const { legalBalls, currentOver, currentBall, overDisplay } = useMemo(() => {
    const legal = balls.filter((b) => b.isLegal).length;
    const over = Math.floor(legal / 6);
    const ball = legal % 6;
    return {
      legalBalls: legal,
      currentOver: over,
      currentBall: ball,
      overDisplay: `${over}.${ball}`,
    };
  }, [balls]);

  // Memoize static data
  const ballOutcomes = useMemo(
    () => [
      { id: "dot", label: "0", runs: 0, color: "gray" },
      { id: "single", label: "1", runs: 1, color: "blue" },
      { id: "double", label: "2", runs: 2, color: "blue" },
      { id: "triple", label: "3", runs: 3, color: "blue" },
      { id: "four", label: "4", runs: 4, color: "green" },
      { id: "six", label: "6", runs: 6, color: "purple" },
    ],
    []
  );

  const extras = useMemo(
    () => [
      { id: "wide", label: "Wide", runs: 1 },
      { id: "no_ball", label: "No Ball", runs: 1 },
      { id: "bye", label: "Bye", runs: 1 },
      { id: "leg_bye", label: "Leg Bye", runs: 1 },
    ],
    []
  );

  // Wicket types - filter based on free hit
  const wicketTypes = useMemo(() => {
    const allWickets = [
      "bowled",
      "caught",
      "lbw",
      "run_out",
      "stumped",
      "hit_wicket",
    ];

    // During free hit, only run_out is allowed
    if (isFreeHit) {
      return ["run_out"];
    }

    return allWickets;
  }, [isFreeHit]);

  // Fetch match data only once when match ID changes
  useEffect(() => {
    console.log(
      "[MatchScorer] useEffect triggered - matchId:",
      matchId,
      "loaded:",
      loadedMatches.has(matchId),
      "loading:",
      loadingMatches.has(matchId)
    );

    // Skip if no match ID, already loaded, or currently loading
    if (!matchId || loadedMatches.has(matchId) || loadingMatches.has(matchId)) {
      console.log("[MatchScorer] Skipping fetch - already loaded or loading");
      return;
    }

    console.log("[MatchScorer] Fetching match data for matchId:", matchId);

    // Mark as loading and loaded IMMEDIATELY to prevent race conditions
    loadingMatches.add(matchId);
    loadedMatches.add(matchId);

    // Reset state when match changes
    setCurrentBatsman("");
    setCurrentNonStriker("");
    setCurrentBowler("");
    setCommentary("");
    setShowWicketModal(false);
    setWicketType("");
    setLastBowler(null);
    setIsFreeHit(false);
    setShowExtraRunsModal(false);
    setSelectedExtra(null);
    setExtraRuns(0);

    // Fetch match data
    const fetchData = async () => {
      try {
        console.log("[MatchScorer] Starting API calls...");
        await Promise.all([
          dispatch(fetchMatchBalls(matchId)),
          dispatch(fetchLiveScore(matchId)),
        ]);
        console.log("[MatchScorer] API calls completed");
      } catch (error) {
        console.error("Failed to fetch match data:", error);
        // On error, remove from loaded set so it can retry
        loadedMatches.delete(matchId);
      } finally {
        loadingMatches.delete(matchId);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      loadingMatches.delete(matchId);
    };
    // dispatch is stable from Redux, safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  // Swap striker and non-striker
  const swapBatsmen = useCallback(() => {
    console.log(
      "[Rotation] Swapping batsmen - Striker:",
      currentBatsman,
      "Non-Striker:",
      currentNonStriker
    );
    const temp = currentBatsman;
    setCurrentBatsman(currentNonStriker);
    setCurrentNonStriker(temp);
  }, [currentBatsman, currentNonStriker]);

  // Memoize submit ball function
  const submitBall = useCallback(
    async (outcome, isWicket = false, wType = null) => {
      if (!matchId || !match?.teamA?.id || !match?.teamB?.id) {
        console.error("Match data incomplete");
        return;
      }

      try {
        const ballData = {
          matchId: matchId, // Add matchId to the payload
          battingTeamId: match.teamA.id,
          bowlingTeamId: match.teamB.id,
          overNumber: parseFloat(overDisplay),
          batsmanId: parseInt(currentBatsman),
          nonStrikerId: currentNonStriker ? parseInt(currentNonStriker) : null,
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

        await dispatch(addBall({ matchId, ballData })).unwrap();

        // Refresh live score after adding ball
        await dispatch(fetchLiveScore(matchId));

        // Clear commentary
        setCommentary("");

        // Close wicket modal if open
        setShowWicketModal(false);

        // AUTO-ROTATION LOGIC
        const runsScored = outcome.runs || 0;
        const isLegalBall = !["wide", "no_ball"].includes(outcome.id);

        console.log(
          "[Rotation] Ball completed - Runs:",
          runsScored,
          "Legal:",
          isLegalBall,
          "Current Ball:",
          currentBall,
          "Free Hit:",
          isFreeHit
        );

        // FREE HIT LOGIC
        if (outcome.id === "no_ball") {
          console.log("[Free Hit] No-ball bowled - next ball is FREE HIT!");
          setIsFreeHit(true);
        } else if (isFreeHit) {
          console.log("[Free Hit] Free hit completed - resetting");
          setIsFreeHit(false);
        }

        // Rotate on odd runs (1, 3, 5) - only if non-striker is selected
        if (runsScored % 2 === 1 && currentNonStriker) {
          console.log("[Rotation] Odd runs scored - rotating batsmen");
          swapBatsmen();
        }

        // Rotate at end of over (after 6th legal ball)
        if (isLegalBall && currentBall === 5 && currentNonStriker) {
          console.log("[Rotation] Over complete - rotating batsmen");
          // Add small delay so user can see the ball result first
          setTimeout(() => {
            swapBatsmen();
            // Show bowler selection modal after rotation
            setLastBowler(currentBowler);
            setShowBowlerModal(true);
          }, 800);
        }
      } catch (error) {
        console.error("Failed to add ball:", error);
        alert("Failed to add ball. Please try again.");
      }
    },
    [
      matchId,
      match?.teamA?.id,
      match?.teamB?.id,
      overDisplay,
      currentBatsman,
      currentNonStriker,
      currentBowler,
      currentBall,
      commentary,
      dispatch,
      swapBatsmen,
    ]
  );

  const handleBallClick = useCallback(
    async (outcome) => {
      if (!currentBatsman || !currentBowler) {
        alert("Please select batsman and bowler first!");
        return;
      }

      // Handle wicket
      if (outcome.id === "wicket") {
        setShowWicketModal(true);
        setSelectedOutcome(outcome);
        return;
      }

      // Handle bye/leg-bye - need to select runs
      if (outcome.id === "bye" || outcome.id === "leg_bye") {
        setSelectedExtra(outcome);
        setShowExtraRunsModal(true);
        return;
      }

      // Handle wide/no-ball - can have additional runs
      if (outcome.id === "wide" || outcome.id === "no_ball") {
        setSelectedExtra(outcome);
        setShowExtraRunsModal(true);
        return;
      }

      // Normal ball - submit directly
      await submitBall(outcome);
    },
    [currentBatsman, currentBowler, submitBall]
  );

  const handleWicketSubmit = useCallback(() => {
    if (!wicketType) {
      alert("Please select wicket type!");
      return;
    }

    submitBall({ id: "wicket", label: "W", runs: 0 }, true, wicketType);
    setWicketType("");
  }, [wicketType, submitBall]);

  const handleUndo = useCallback(async () => {
    if (!matchId) return;

    if (window.confirm("Are you sure you want to undo the last ball?")) {
      try {
        await dispatch(undoLastBall(matchId)).unwrap();
        await dispatch(fetchLiveScore(matchId));
      } catch (error) {
        console.error("Failed to undo ball:", error);
        alert("Failed to undo ball.");
      }
    }
  }, [matchId, dispatch]);

  const handleCompleteInnings = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to complete this innings? This action cannot be undone."
      )
    ) {
      alert("Innings completed! Implement logic to switch innings.");
    }
  }, []);

  const handleCompleteMatch = useCallback(async () => {
    if (!matchId || !match) return;

    if (
      window.confirm(
        "Are you sure you want to complete this match and declare the result?"
      )
    ) {
      try {
        await dispatch(
          updateMatchResult({
            matchId,
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
  }, [matchId, match, liveScore, dispatch]);

  const handleBowlerSelection = useCallback(
    (newBowlerId) => {
      console.log(
        "[Bowler Change] New bowler selected:",
        newBowlerId,
        "Last bowler:",
        lastBowler
      );

      if (newBowlerId == lastBowler) {
        alert("Same bowler cannot bowl consecutive overs!");
        return;
      }

      setCurrentBowler(newBowlerId);
      setShowBowlerModal(false);
    },
    [lastBowler]
  );

  const handleExtraRunsSubmit = useCallback(
    (extraType, additionalRuns) => {
      console.log(
        "[Extras] Submitting extra:",
        extraType.id,
        "Additional runs:",
        additionalRuns
      );

      // Create outcome with total runs
      const totalRuns = (extraType.runs || 0) + additionalRuns;
      const outcomeWithRuns = {
        ...extraType,
        runs: totalRuns,
      };

      submitBall(outcomeWithRuns);
      setShowExtraRunsModal(false);
      setSelectedExtra(null);
      setExtraRuns(0);
    },
    [submitBall]
  );

  const getColorClass = useCallback((color) => {
    const colors = {
      gray: "bg-gray-500 hover:bg-gray-600",
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      purple: "bg-purple-500 hover:bg-purple-600",
      red: "bg-red-500 hover:bg-red-600",
      yellow: "bg-yellow-500 hover:bg-yellow-600",
    };
    return colors[color] || colors.gray;
  }, []);

  // Memoize recent balls to prevent unnecessary re-renders
  const recentBalls = useMemo(() => balls.slice(-6), [balls]);

  // Calculate bowler stats from balls
  const bowlerStats = useMemo(() => {
    const stats = {};

    balls.forEach((ball) => {
      const bowlerId = ball.bowler?.id;
      if (!bowlerId) return;

      if (!stats[bowlerId]) {
        stats[bowlerId] = {
          playerId: bowlerId,
          overs: 0,
          wickets: 0,
          runsConceded: 0,
          economy: 0,
          legalBalls: 0,
        };
      }

      if (ball.isLegal) {
        stats[bowlerId].legalBalls += 1;
      }
      stats[bowlerId].wickets += ball.isWicket ? 1 : 0;
      stats[bowlerId].runsConceded += (ball.runs || 0) + (ball.extras || 0);
    });

    // Calculate overs and economy
    Object.values(stats).forEach((stat) => {
      const completedOvers = Math.floor(stat.legalBalls / 6);
      const remainingBalls = stat.legalBalls % 6;
      stat.overs = parseFloat(`${completedOvers}.${remainingBalls}`);

      if (stat.overs > 0) {
        const oversDecimal = completedOvers + remainingBalls / 6;
        stat.economy = stat.runsConceded / oversDecimal;
      }
    });

    return Object.values(stats);
  }, [balls]);

  if (!match) {
    return (
      <div
        className={`rounded-lg shadow-md p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <p
          className={`text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No match data available
        </p>
      </div>
    );
  }

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
            {match.teamA?.name} vs {match.teamB?.name}
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
                {match.teamA?.name}
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
                ({liveScore.teamAScore?.overs || "0.0"} overs)
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-sm mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {match.teamB?.name}
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

      {/* Free Hit Indicator */}
      {isFreeHit && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-lg font-bold text-center animate-pulse shadow-lg">
            <p className="text-2xl mb-1">🔥 FREE HIT 🔥</p>
            <p className="text-sm font-normal">
              Batsman cannot be dismissed (except run-out)
            </p>
          </div>
        </div>
      )}

      {/* Current Batsmen Display */}
      {(currentBatsman || currentNonStriker) && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <p
            className={`text-xs font-medium mb-3 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            On Crease
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Striker */}
            <div
              className={`text-center p-3 rounded-lg border-2 ${
                currentBatsman
                  ? isDarkMode
                    ? "border-green-500 bg-gray-800"
                    : "border-green-500 bg-white"
                  : isDarkMode
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <p
                className={`text-xs mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Striker ⭐
              </p>
              <p
                className={`font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {currentBatsman
                  ? players?.find((p) => p.id == currentBatsman)?.user
                      ?.fullName || "Unknown"
                  : "Not selected"}
              </p>
            </div>

            {/* Non-Striker */}
            <div
              className={`text-center p-3 rounded-lg border ${
                currentNonStriker
                  ? isDarkMode
                    ? "border-gray-500 bg-gray-800"
                    : "border-gray-400 bg-white"
                  : isDarkMode
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <p
                className={`text-xs mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Non-Striker
              </p>
              <p
                className={`font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {currentNonStriker
                  ? players?.find((p) => p.id == currentNonStriker)?.user
                      ?.fullName || "Unknown"
                  : "Not selected"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Player Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Striker */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Target className="w-4 h-4 inline mr-1" />
            Striker ⭐
          </label>
          <select
            value={currentBatsman}
            onChange={(e) => setCurrentBatsman(e.target.value)}
            className={`w-full p-3 rounded-lg border-2 ${
              isDarkMode
                ? "bg-gray-700 border-green-500 text-white"
                : "bg-white border-green-500 text-gray-900"
            }`}
          >
            <option value="">Select Striker</option>
            {players
              ?.filter((p) => p.role !== "Bowler" && p.id != currentNonStriker)
              .map((player) => (
                <option
                  key={`striker-${player.id}-${player.teamId}`}
                  value={player.id}
                >
                  {player.user?.fullName} - {player.role} ({player.teamName})
                </option>
              ))}
          </select>
        </div>

        {/* Non-Striker */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Target className="w-4 h-4 inline mr-1" />
            Non-Striker
          </label>
          <select
            value={currentNonStriker}
            onChange={(e) => setCurrentNonStriker(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Select Non-Striker</option>
            {players
              ?.filter((p) => p.role !== "Bowler" && p.id != currentBatsman)
              .map((player) => (
                <option
                  key={`non-striker-${player.id}-${player.teamId}`}
                  value={player.id}
                >
                  {player.user?.fullName} - {player.role} ({player.teamName})
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
                <option
                  key={`bowler-${player.id}-${player.teamId}`}
                  value={player.id}
                >
                  {player.user?.fullName} - {player.role} ({player.teamName})
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
              type="button"
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
            type="button"
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
          type="button"
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
          {recentBalls.map((ball, index) => (
            <div
              key={`${ball.id || index}-${index}`}
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
          type="button"
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
          type="button"
          onClick={handleCompleteInnings}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Complete Innings
        </button>

        <button
          type="button"
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
          <span>
            {typeof error === "string"
              ? error
              : error?.message || error?.error || "An error occurred"}
          </span>
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
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Select Wicket Type
            </h3>

            {isFreeHit && (
              <div className="mb-4 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  🔥 FREE HIT - Only run-out is allowed!
                </p>
              </div>
            )}

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

      {/* Bowler Selection Modal */}
      <BowlerSelectionModal
        isOpen={showBowlerModal}
        onClose={() => setShowBowlerModal(false)}
        onSelectBowler={handleBowlerSelection}
        players={players}
        currentBowler={currentBowler}
        lastBowler={lastBowler}
        bowlerStats={bowlerStats}
      />

      {/* Extra Runs Modal */}
      <ExtraRunsModal
        isOpen={showExtraRunsModal}
        onClose={() => {
          setShowExtraRunsModal(false);
          setSelectedExtra(null);
          setExtraRuns(0);
        }}
        onSubmit={handleExtraRunsSubmit}
        extraType={selectedExtra}
      />
    </div>
  );
};

export default MatchScorer;
