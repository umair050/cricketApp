import React, { useState, useEffect } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Plus,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { tournamentsAPI } from "../../services/api";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tournaments data
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tournamentsAPI.getAll();
        const tournamentsData = response.data.map((tournament) => ({
          id: tournament.id,
          name: tournament.name,
          format: formatTournamentFormat(tournament.format),
          location: formatLocation(
            tournament.city,
            tournament.state,
            tournament.country
          ),
          startDate: formatDate(tournament.startDate),
          endDate: formatDate(tournament.endDate),
          teamsCount: tournament.teams ? tournament.teams.length : 0,
          maxTeams: tournament.maxTeams || 16,
          entryFee: parseFloat(tournament.entryFee) || 0,
          prizePool: parseFloat(tournament.prizePool) || 0,
          status: determineStatus(
            tournament.status,
            tournament.startDate,
            tournament.endDate,
            tournament.registrationDeadline
          ),
          organizer: tournament.organizer
            ? `${tournament.organizer.firstName} ${tournament.organizer.lastName}`
            : "Unknown Organizer",
          venue: tournament.venue,
          description: tournament.description,
          registrationDeadline: tournament.registrationDeadline,
        }));
        setTournaments(tournamentsData);
        setFilteredTournaments(tournamentsData);
      } catch (err) {
        setError("Failed to fetch tournaments. Please try again later.");
        console.error("Error fetching tournaments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Filter tournaments based on active filter and search term
  useEffect(() => {
    let filtered = tournaments;

    // Apply status filter
    switch (activeFilter) {
      case "registration_open":
        filtered = tournaments.filter((t) => t.status === "registration_open");
        break;
      case "upcoming":
        filtered = tournaments.filter((t) => t.status === "upcoming");
        break;
      case "ongoing":
        filtered = tournaments.filter((t) => t.status === "ongoing");
        break;
      case "my_tournaments":
        // TODO: Filter by user's tournaments when user context is available
        filtered = tournaments.filter((t) => t.teamsCount > 0);
        break;
      default:
        filtered = tournaments;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tournament) =>
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          tournament.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTournaments(filtered);
  }, [tournaments, activeFilter, searchTerm]);

  // Helper functions
  const formatTournamentFormat = (format) => {
    const formatMap = {
      t20: "T20",
      odi: "ODI",
      test: "Test",
      t10: "T10",
    };
    return formatMap[format] || format?.toUpperCase();
  };

  const formatLocation = (city, state, country) => {
    const parts = [city, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location TBA";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const determineStatus = (
    dbStatus,
    startDate,
    endDate,
    registrationDeadline
  ) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const regDeadline = registrationDeadline
      ? new Date(registrationDeadline)
      : null;

    if (dbStatus === "cancelled") return "cancelled";
    if (dbStatus === "completed" || end < now) return "completed";
    if (start <= now && end >= now) return "ongoing";
    if (regDeadline && regDeadline >= now && start > now)
      return "registration_open";
    if (start > now) return "upcoming";

    return dbStatus;
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-secondary">Loading tournaments...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">
            Error Loading Tournaments
          </h3>
          <p className="text-secondary mb-4">{error}</p>
          <button onClick={handleRefresh} className="btn-cricket">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "registration_open":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Live";
      case "registration_open":
        return "Open for Registration";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Tournaments
          </h1>
          <p className="text-secondary mt-1 text-sm sm:text-base">
            Participate in cricket tournaments and showcase your skills
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleRefresh}
            className="btn-cricket-outline flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm"
            title="Refresh tournaments"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            className="btn-cricket flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm"
            onClick={() => {
              // TODO: Implement create tournament functionality
              console.log("Create tournament clicked");
            }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Create</span>
            <span className="hidden sm:inline">Tournament</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card-cricket space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tournaments by name, location, format, or organizer..."
            className="input-cricket pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-hidden">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => handleFilterChange("all")}
              className={`flex-shrink-0 py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeFilter === "all"
                  ? "text-white bg-green-600 dark:bg-green-500 shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <span className="hidden sm:inline">All Tournaments</span>
              <span className="sm:hidden">All</span>
            </button>
            <button
              onClick={() => handleFilterChange("registration_open")}
              className={`flex-shrink-0 py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeFilter === "registration_open"
                  ? "text-white bg-green-600 dark:bg-green-500 shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <span className="hidden sm:inline">Open for Registration</span>
              <span className="sm:hidden">Open</span>
            </button>
            <button
              onClick={() => handleFilterChange("upcoming")}
              className={`flex-shrink-0 py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeFilter === "upcoming"
                  ? "text-white bg-green-600 dark:bg-green-500 shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleFilterChange("ongoing")}
              className={`flex-shrink-0 py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeFilter === "ongoing"
                  ? "text-white bg-green-600 dark:bg-green-500 shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => handleFilterChange("my_tournaments")}
              className={`flex-shrink-0 py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeFilter === "my_tournaments"
                  ? "text-white bg-green-600 dark:bg-green-500 shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <span className="hidden sm:inline">My Tournaments</span>
              <span className="sm:hidden">Mine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {filteredTournaments.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-secondary">
            Showing {filteredTournaments.length} of {tournaments.length}{" "}
            tournaments
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              No Tournaments Found
            </h3>
            <p className="text-secondary">
              {activeFilter !== "all"
                ? "No tournaments match the selected filter"
                : "No tournaments have been created yet"}
            </p>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="card-cricket hover:shadow-xl transition-shadow cursor-pointer"
            >
              {/* Tournament Header */}
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-primary truncate">
                      {tournament.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary truncate">
                      {tournament.format} Format
                      {tournament.venue && ` • ${tournament.venue}`}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(
                    tournament.status
                  )}`}
                >
                  {getStatusText(tournament.status)}
                </span>
              </div>

              {/* Tournament Details */}
              <div className="space-y-2 sm:space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-secondary">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tournament.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-secondary">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {tournament.startDate} to {tournament.endDate}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-secondary">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {tournament.teamsCount}/{tournament.maxTeams} teams
                    registered
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-secondary">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">By {tournament.organizer}</span>
                </div>
              </div>

              {/* Prize and Entry */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 p-2 sm:p-3 bg-light-gray rounded-lg">
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-primary">
                    ₹{tournament.entryFee.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted">Entry Fee</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                    ₹{tournament.prizePool.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted">Prize Pool</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-secondary mb-1">
                  <span>Registration Progress</span>
                  <span>
                    {Math.round(
                      (tournament.teamsCount / tournament.maxTeams) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (tournament.teamsCount / tournament.maxTeams) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  className="flex-1 btn-cricket-outline text-xs sm:text-sm py-2"
                  onClick={() => {
                    // TODO: Implement view details functionality
                    console.log("View details for tournament:", tournament.id);
                  }}
                >
                  View Details
                </button>
                {tournament.status === "registration_open" &&
                  tournament.teamsCount < tournament.maxTeams && (
                    <button
                      className="flex-1 btn-cricket text-xs sm:text-sm py-2"
                      onClick={() => {
                        // TODO: Implement team registration functionality
                        console.log(
                          "Register team for tournament:",
                          tournament.id
                        );
                      }}
                    >
                      Register Team
                    </button>
                  )}
                {tournament.status === "ongoing" && (
                  <button
                    className="flex-1 btn-cricket text-xs sm:text-sm py-2"
                    onClick={() => {
                      // TODO: Implement live scores functionality
                      console.log(
                        "View live scores for tournament:",
                        tournament.id
                      );
                    }}
                  >
                    Live Scores
                  </button>
                )}
                {tournament.status === "upcoming" && (
                  <button
                    className="flex-1 btn-cricket-outline text-xs sm:text-sm py-2"
                    onClick={() => {
                      // TODO: Implement reminder functionality
                      console.log(
                        "Set reminder for tournament:",
                        tournament.id
                      );
                    }}
                  >
                    Set Reminder
                  </button>
                )}
                {tournament.status === "completed" && (
                  <button
                    className="flex-1 btn-cricket-outline text-xs sm:text-sm py-2"
                    onClick={() => {
                      // TODO: Implement results functionality
                      console.log(
                        "View results for tournament:",
                        tournament.id
                      );
                    }}
                  >
                    View Results
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* My Tournaments Section - TODO: Implement with real user tournament data */}
      {tournaments.length > 0 && (
        <div className="card-cricket">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">
              Tournament Statistics
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-light-green rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {tournaments.filter((t) => t.status === "ongoing").length}
              </div>
              <div className="text-sm text-secondary">Live Tournaments</div>
            </div>
            <div className="text-center p-4 bg-light-gray rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {
                  tournaments.filter((t) => t.status === "registration_open")
                    .length
                }
              </div>
              <div className="text-sm text-secondary">
                Open for Registration
              </div>
            </div>
            <div className="text-center p-4 bg-light-gray rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {tournaments.filter((t) => t.status === "upcoming").length}
              </div>
              <div className="text-sm text-secondary">Upcoming</div>
            </div>
            <div className="text-center p-4 bg-light-gray rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {tournaments.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-secondary">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;
