import api from "./api";

export const matchAPI = {
  // Match CRUD
  createMatch: (data) => api.post("/matches", data),
  getAllMatches: (params) => api.get("/matches", { params }),
  getMatchById: (id) => api.get(`/matches/${id}`),
  updateMatchResult: (id, data) => api.patch(`/matches/${id}/result`, data),
  deleteMatch: (id) => api.delete(`/matches/${id}`),

  // Ball-by-Ball Scoring
  addBall: (matchId, data) => api.post(`/matches/${matchId}/balls`, data),
  getMatchBalls: (matchId) => api.get(`/matches/${matchId}/balls`),
  undoLastBall: (matchId) => api.delete(`/matches/${matchId}/balls/undo`),
  getLiveScore: (matchId) => api.get(`/matches/${matchId}/live-score`),

  // Scorecards
  addScorecard: (data) => api.post(`/matches/${data.matchId}/scorecard`, data),
  getMatchScorecard: (matchId) => api.get(`/matches/${matchId}/scorecard`),

  // Leaderboards
  getMatchLeaderboard: (matchId) => api.get(`/matches/${matchId}/leaderboard`),
  getTournamentLeaderboard: (tournamentId, type = "batting") =>
    api.get(`/matches/tournament/${tournamentId}/leaderboard`, {
      params: { type },
    }),
  getPointsTable: (tournamentId) =>
    api.get(`/matches/tournament/${tournamentId}/points-table`),

  // Tournament Management
  generateGroupMatches: (tournamentId) =>
    api.post(`/matches/tournament/${tournamentId}/generate-group-matches`),
  generateKnockoutMatches: (tournamentId) =>
    api.post(`/matches/tournament/${tournamentId}/generate-knockout-matches`),
  advanceTeams: (tournamentId, teamIds) =>
    api.post(`/matches/tournament/${tournamentId}/advance-teams`, { teamIds }),
  getQualifiedTeams: (tournamentId) =>
    api.get(`/matches/tournament/${tournamentId}/qualified-teams`),
};

export default matchAPI;
