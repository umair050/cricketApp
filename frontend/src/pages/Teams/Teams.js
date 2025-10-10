import React from "react";
import { Shield, Users, Plus, MapPin, Trophy } from "lucide-react";
import InvitePlayerButton from "../../components/Invitations/InvitePlayerButton";

const Teams = () => {
  const mockTeams = [
    {
      id: 1,
      name: "Mumbai Warriors",
      location: "Mumbai, Maharashtra",
      playersCount: 15,
      matchesPlayed: 12,
      matchesWon: 8,
      captain: "Rahul Sharma",
      logo: null,
    },
    {
      id: 2,
      name: "Delhi Capitals",
      location: "Delhi, Delhi",
      playersCount: 18,
      matchesPlayed: 10,
      matchesWon: 6,
      captain: "Arjun Singh",
      logo: null,
    },
    {
      id: 3,
      name: "Chennai Express",
      location: "Chennai, Tamil Nadu",
      playersCount: 16,
      matchesPlayed: 14,
      matchesWon: 11,
      captain: "Vikram Kumar",
      logo: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Teams</h1>
          <p className="text-secondary mt-1">
            Discover teams and create your own
          </p>
        </div>
        <button className="btn-cricket flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeams.map((team) => (
          <div
            key={team.id}
            className="card-cricket hover:shadow-xl transition-shadow cursor-pointer"
          >
            {/* Team Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-blue-500 w-16 h-16 rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">{team.name}</h3>
                <div className="flex items-center space-x-1 text-muted text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{team.location}</span>
                </div>
              </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {team.playersCount}
                </p>
                <p className="text-xs text-muted">Players</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {team.matchesWon}
                </p>
                <p className="text-xs text-muted">Wins</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {team.matchesPlayed}
                </p>
                <p className="text-xs text-muted">Matches</p>
              </div>
            </div>

            {/* Captain Info */}
            <div className="mb-4 p-3 bg-light-gray rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted" />
                <span className="text-sm text-secondary">Captain:</span>
                <span className="text-sm font-medium text-primary">
                  {team.captain}
                </span>
              </div>
            </div>

            {/* Win Rate Badge */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary">
                  Win Rate
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    team.matchesWon / team.matchesPlayed > 0.6
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }`}
                >
                  {Math.round((team.matchesWon / team.matchesPlayed) * 100)}%
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="flex-1 btn-cricket-outline text-sm py-2">
                View Team
              </button>
              <InvitePlayerButton 
                player={{ id: '1', fullName: 'Sample Player', email: 'player@example.com' }} 
                type="TEAM" 
                entityId={team.id} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* My Teams Section */}
      <div className="card-cricket">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">My Teams</h2>
          <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-light-green rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 dark:bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Mumbai Warriors</h3>
                <p className="text-sm text-secondary">Captain • 15 players</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm text-secondary">8 wins</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 dark:bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">
                  Bangalore Challengers
                </h3>
                <p className="text-sm text-secondary">Player • 12 players</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-secondary">3 wins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
