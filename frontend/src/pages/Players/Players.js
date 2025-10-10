import React from "react";
import { Users, Search, Filter, Plus } from "lucide-react";
import InvitePlayerButton from "../../components/Invitations/InvitePlayerButton";

const Players = () => {
  const mockPlayers = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Batsman",
      location: "Mumbai, Maharashtra",
      battingAvg: 45.2,
      matchesPlayed: 23,
      verified: true,
      profilePic: null,
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "All-rounder",
      location: "Ahmedabad, Gujarat",
      battingAvg: 32.8,
      matchesPlayed: 18,
      verified: false,
      profilePic: null,
    },
    {
      id: 3,
      name: "Arjun Singh",
      role: "Bowler",
      location: "Delhi, Delhi",
      battingAvg: 12.5,
      matchesPlayed: 31,
      verified: true,
      profilePic: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Players</h1>
          <p className="text-secondary mt-1">
            Discover and connect with cricket players
          </p>
        </div>
        <button className="btn-cricket flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Player Profile</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card-cricket">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players by name, location, or role..."
                className="input-cricket pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="input-cricket">
              <option>All Roles</option>
              <option>Batsman</option>
              <option>Bowler</option>
              <option>All-rounder</option>
              <option>Wicket Keeper</option>
            </select>
            <select className="input-cricket">
              <option>All Locations</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Chennai</option>
            </select>
            <button className="btn-cricket-outline flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlayers.map((player) => (
          <div
            key={player.id}
            className="card-cricket hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-primary">
                    {player.name}
                  </h3>
                  {player.verified && (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                  {player.role}
                </p>
                <p className="text-muted text-sm">{player.location}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {player.battingAvg}
                  </p>
                  <p className="text-xs text-muted">Batting Avg</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {player.matchesPlayed}
                  </p>
                  <p className="text-xs text-muted">Matches</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 btn-cricket-outline text-sm py-2">
                View Profile
              </button>
              <InvitePlayerButton player={player} type="FRIEND" />
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-cricket-outline">Load More Players</button>
      </div>
    </div>
  );
};

export default Players;
