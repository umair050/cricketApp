import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Filter,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { fetchMatches } from "../../store/slices/matchSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";
import MatchCard from "../../components/Matches/MatchCard";
import CreateMatchModal from "../../components/Matches/CreateMatchModal";

const Matches = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const { matches, loading, error } = useSelector((state) => state.match);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [dispatch]);

  const loadMatches = () => {
    const filters = {};
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    dispatch(fetchMatches(filters));
  };

  useEffect(() => {
    loadMatches();
  }, [statusFilter]);

  const filterTabs = [
    { id: "all", label: "All Matches", icon: Trophy },
    { id: "live", label: "Live", icon: Clock },
    { id: "scheduled", label: "Upcoming", icon: Clock },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ];

  const typeTabs = [
    { id: "all", label: "All Types" },
    { id: "friendly", label: "Friendly" },
    { id: "tournament", label: "Tournament" },
  ];

  const filteredMatches = matches.filter((match) => {
    if (typeFilter === "all") return true;
    return match.matchType === typeFilter;
  });

  const getMatchCount = (status) => {
    if (status === "all") return matches.length;
    return matches.filter((m) => m.status === status).length;
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Matches
            </h1>
            <p
              className={`mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              View all matches, scores, and statistics
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Match
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
          {filterTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setStatusFilter(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                statusFilter === id
                  ? "bg-green-600 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  statusFilter === id
                    ? "bg-white bg-opacity-20"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}
              >
                {getMatchCount(id)}
              </span>
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mb-6">
          {typeTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTypeFilter(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                typeFilter === id
                  ? isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-900"
                  : isDarkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mb-4" />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No matches found
            </h3>
            <p
              className={`mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {statusFilter === "all"
                ? "Create your first match to get started"
                : `No ${statusFilter} matches available`}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Match
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && filteredMatches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && matches.length > 0 && (
          <div
            className={`mt-8 p-6 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {matches.length}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Matches
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">
                  {matches.filter((m) => m.status === "live").length}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Live
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">
                  {matches.filter((m) => m.status === "scheduled").length}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Upcoming
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">
                  {matches.filter((m) => m.status === "completed").length}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Completed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create Match Modal */}
        <CreateMatchModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  );
};

export default Matches;
