import React from "react";
import { Trophy, Calendar, MapPin, Users, Plus, Clock } from "lucide-react";

const Tournaments = () => {
  const mockTournaments = [
    {
      id: 1,
      name: "Summer Cricket League 2024",
      format: "T20",
      location: "Mumbai, Maharashtra",
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      teamsCount: 16,
      maxTeams: 16,
      entryFee: 5000,
      prizePool: 100000,
      status: "upcoming",
      organizer: "Mumbai Cricket Association",
    },
    {
      id: 2,
      name: "Inter-City Championship",
      format: "ODI",
      location: "Delhi, Delhi",
      startDate: "2024-03-01",
      endDate: "2024-03-20",
      teamsCount: 8,
      maxTeams: 12,
      entryFee: 8000,
      prizePool: 150000,
      status: "registration_open",
      organizer: "Delhi Sports Club",
    },
    {
      id: 3,
      name: "Youth Cricket Cup",
      format: "T10",
      location: "Bangalore, Karnataka",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      teamsCount: 6,
      maxTeams: 8,
      entryFee: 3000,
      prizePool: 50000,
      status: "ongoing",
      organizer: "Bangalore Youth Cricket",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "status-upcoming";
      case "ongoing":
        return "status-ongoing";
      case "registration_open":
        return "status-registration-open";
      case "completed":
        return "status-completed";
      default:
        return "status-completed";
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
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Tournaments</h1>
          <p className="text-secondary mt-1">
            Participate in cricket tournaments and showcase your skills
          </p>
        </div>
        <button className="btn-cricket flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Tournament</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card-cricket">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button className="flex-1 py-2 px-4 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-md">
            All Tournaments
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Open for Registration
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Upcoming
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Live
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            My Tournaments
          </button>
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockTournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="card-cricket hover:shadow-xl transition-shadow cursor-pointer"
          >
            {/* Tournament Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {tournament.name}
                  </h3>
                  <p className="text-sm text-secondary">
                    {tournament.format} Format
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  tournament.status
                )}`}
              >
                {getStatusText(tournament.status)}
              </span>
            </div>

            {/* Tournament Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{tournament.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary">
                <Calendar className="w-4 h-4" />
                <span>
                  {tournament.startDate} to {tournament.endDate}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary">
                <Users className="w-4 h-4" />
                <span>
                  {tournament.teamsCount}/{tournament.maxTeams} teams registered
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary">
                <Clock className="w-4 h-4" />
                <span>By {tournament.organizer}</span>
              </div>
            </div>

            {/* Prize and Entry */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-light-gray rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">
                  ₹{tournament.entryFee.toLocaleString()}
                </p>
                <p className="text-xs text-muted">Entry Fee</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
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
            <div className="flex space-x-2">
              <button className="flex-1 btn-cricket-outline text-sm py-2">
                View Details
              </button>
              {tournament.status === "registration_open" && (
                <button className="flex-1 btn-cricket text-sm py-2">
                  Register Team
                </button>
              )}
              {tournament.status === "ongoing" && (
                <button className="flex-1 btn-cricket text-sm py-2">
                  Live Scores
                </button>
              )}
              {tournament.status === "upcoming" && (
                <button className="flex-1 btn-cricket-outline text-sm py-2">
                  Set Reminder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* My Tournaments Section */}
      <div className="card-cricket">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">
            My Tournament History
          </h2>
          <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-light-green rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 dark:bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">
                  Local Championship 2023
                </h3>
                <p className="text-sm text-secondary">Winners • T20 Format</p>
              </div>
            </div>
            <span className="status-registration-open px-2 py-1 rounded-full text-xs font-medium">
              1st Place
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-600 dark:bg-gray-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">
                  Inter-District Cup
                </h3>
                <p className="text-sm text-secondary">
                  Semi-Finals • ODI Format
                </p>
              </div>
            </div>
            <span className="status-completed px-2 py-1 rounded-full text-xs font-medium">
              4th Place
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
