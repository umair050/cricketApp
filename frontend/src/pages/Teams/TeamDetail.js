import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Trophy,
  MapPin,
  Calendar,
  ArrowLeft,
  Mail,
  Phone,
  Star,
  UserPlus,
  Edit,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import api from "../../services/api";
import AddPlayerToTeamModal from "../../components/Teams/AddPlayerToTeamModal";

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/teams/${id}`);
      setTeam(response.data);
    } catch (err) {
      console.error("Failed to fetch team details:", err);
      setError("Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Shield className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {error || "Team not found"}
        </h3>
        <button
          onClick={() => navigate("/teams")}
          className="btn-cricket flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Teams
        </button>
      </div>
    );
  }

  const playerCount = team.members?.length || 0;
  const winRate =
    team.matchesPlayed > 0
      ? Math.round((team.matchesWon / team.matchesPlayed) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/teams")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-3xl font-bold text-primary">Team Details</h1>
      </div>

      {/* Team Header Card */}
      <div className="card-cricket">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Team Logo */}
          <div className="bg-gradient-to-br from-green-500 to-blue-500 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg">
            {team.logo ? (
              <img
                src={team.logo}
                alt={team.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <Shield className="w-12 h-12 text-white" />
            )}
          </div>

          {/* Team Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-primary mb-2">
              {team.name}
            </h2>
            {team.description && (
              <p className="text-secondary mb-3">{team.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              {team.city && (
                <div className="flex items-center gap-1 text-muted">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {team.city}
                    {team.state && `, ${team.state}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted">
                <Calendar className="w-4 h-4" />
                <span>
                  Created {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="btn-cricket flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Player
            </button>
            <button className="btn-cricket-outline flex items-center justify-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Team
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{playerCount}</p>
            <p className="text-sm text-muted">Players</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {team.matchesWon || 0}
            </p>
            <p className="text-sm text-muted">Wins</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {team.matchesLost || 0}
            </p>
            <p className="text-sm text-muted">Losses</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{winRate}%</p>
            <p className="text-sm text-muted">Win Rate</p>
          </div>
        </div>
      </div>

      {/* Captain & Creator Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Captain Card */}
        {team.captain && (
          <div className="card-cricket">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-primary">
                Team Captain
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                {team.captain.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-primary">
                  {team.captain.fullName}
                </p>
                <p className="text-sm text-muted">{team.captain.email}</p>
                {team.captain.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{team.captain.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Creator Card */}
        {team.createdBy && (
          <div className="card-cricket">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-primary">Team Owner</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {team.createdBy.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-primary">
                  {team.createdBy.fullName}
                </p>
                <p className="text-sm text-muted">{team.createdBy.email}</p>
                {team.createdBy.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{team.createdBy.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Players List */}
      <div className="card-cricket">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-primary">
              Team Players ({playerCount})
            </h3>
          </div>
          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="btn-cricket-outline text-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Player
          </button>
        </div>

        {playerCount === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-muted mb-4">No players in this team yet</p>
            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="btn-cricket inline-flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add First Player
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {member.player?.user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-primary">
                      {member.player?.user?.fullName}
                    </p>
                    <p className="text-xs text-muted">{member.player?.role}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Batting:</span>
                    <span className="text-primary font-medium">
                      {member.player?.battingStyle || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Bowling:</span>
                    <span className="text-primary font-medium">
                      {member.player?.bowlingStyle || "N/A"}
                    </span>
                  </div>
                </div>

                {member.player?.user?.email && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">
                        {member.player.user.email}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      <AddPlayerToTeamModal
        isOpen={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        team={team}
      />
    </div>
  );
};

export default TeamDetail;
