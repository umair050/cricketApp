import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import InvitePlayerButton from "../../components/Invitations/InvitePlayerButton";
import { playersAPI } from "../../services/api";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  // Fetch players data
  useEffect(() => {
    const fetchPlayersData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await playersAPI.getAll();
        console.log("Players API response:", response.data); // Debug log

        const playersData = response.data.map((player) => {
          console.log("Processing player:", player); // Debug log
          return {
            id: player.id,
            name: player.user?.fullName || "Unknown Player",
            role: formatPlayerRole(player.role),
            location: formatLocation(player.city, player.state, player.country),
            battingAvg: parseFloat(player.battingAverage) || 0,
            matchesPlayed: player.matchesPlayed || 0,
            verified: player.isVerified || false,
            profilePic: player.profilePicture,
            email: player.user?.email,
            bio: player.bio,
          };
        });

        console.log("Processed players data:", playersData); // Debug log
        setPlayers(playersData);
        setFilteredPlayers(playersData);
      } catch (err) {
        let errorMessage = "Failed to fetch players. Please try again later.";
        if (err.response?.status === 401) {
          errorMessage = "Please log in to view players.";
        } else if (err.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.code === "ECONNREFUSED") {
          errorMessage =
            "Unable to connect to server. Please check if the backend is running.";
        }
        setError(errorMessage);
        console.error("Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayersData();
  }, []);

  // Filter players based on search and filters
  useEffect(() => {
    let filtered = players;

    if (searchTerm) {
      filtered = filtered.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(
        (player) => player.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((player) =>
        player.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredPlayers(filtered);
  }, [players, searchTerm, roleFilter, locationFilter]);

  // Helper functions
  const formatPlayerRole = (role) => {
    const roleMap = {
      batsman: "Batsman",
      bowler: "Bowler",
      all_rounder: "All-rounder",
      wicket_keeper: "Wicket Keeper",
    };
    return roleMap[role] || role;
  };

  const formatLocation = (city, state, country) => {
    const parts = [city, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // Re-trigger the useEffect by updating a dependency
    fetchPlayers();
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await playersAPI.getAll();
      console.log("Players API response:", response.data); // Debug log

      const playersData = response.data.map((player) => {
        console.log("Processing player:", player); // Debug log
        return {
          id: player.id,
          name: player.user?.fullName || "Unknown Player",
          role: formatPlayerRole(player.role),
          location: formatLocation(player.city, player.state, player.country),
          battingAvg: parseFloat(player.battingAverage) || 0,
          matchesPlayed: player.matchesPlayed || 0,
          verified: player.isVerified || false,
          profilePic: player.profilePicture,
          email: player.user?.email,
          bio: player.bio,
        };
      });

      console.log("Processed players data:", playersData); // Debug log
      setPlayers(playersData);
      setFilteredPlayers(playersData);
    } catch (err) {
      let errorMessage = "Failed to fetch players. Please try again later.";
      if (err.response?.status === 401) {
        errorMessage = "Please log in to view players.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage =
          "Unable to connect to server. Please check if the backend is running.";
      }
      setError(errorMessage);
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-secondary">Loading players...</span>
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
            Error Loading Players
          </h3>
          <p className="text-secondary mb-4">{error}</p>
          <button onClick={handleRefresh} className="btn-cricket">
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="input-cricket"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-rounder">All-rounder</option>
              <option value="Wicket Keeper">Wicket Keeper</option>
            </select>
            <select
              className="input-cricket"
              value={locationFilter}
              onChange={handleLocationFilterChange}
            >
              <option value="">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
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
        {filteredPlayers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              No Players Found
            </h3>
            <p className="text-secondary">
              {searchTerm || roleFilter || locationFilter
                ? "Try adjusting your search criteria"
                : "No players have been registered yet"}
            </p>
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="card-cricket hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                  {player.profilePic ? (
                    <img
                      src={player.profilePic}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-white" />
                  )}
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
          ))
        )}
      </div>

      {/* Load More - Hidden for now as we're loading all players at once */}
      {filteredPlayers.length > 0 && filteredPlayers.length >= 10 && (
        <div className="text-center">
          <button
            className="btn-cricket-outline"
            onClick={() => {
              // TODO: Implement pagination when backend supports it
              console.log("Load more functionality to be implemented");
            }}
          >
            Load More Players
          </button>
        </div>
      )}
    </div>
  );
};

export default Players;
