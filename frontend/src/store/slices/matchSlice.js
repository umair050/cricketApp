import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matchAPI } from "../../services/matchAPI";

// ==================== ASYNC THUNKS ====================

// Match CRUD
export const createMatch = createAsyncThunk(
  "match/createMatch",
  async (matchData, { rejectWithValue }) => {
    try {
      const response = await matchAPI.createMatch(matchData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMatches = createAsyncThunk(
  "match/fetchMatches",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getAllMatches(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMatchById = createAsyncThunk(
  "match/fetchMatchById",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getMatchById(matchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMatchResult = createAsyncThunk(
  "match/updateMatchResult",
  async ({ matchId, resultData }, { rejectWithValue }) => {
    try {
      const response = await matchAPI.updateMatchResult(matchId, resultData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMatch = createAsyncThunk(
  "match/deleteMatch",
  async (matchId, { rejectWithValue }) => {
    try {
      await matchAPI.deleteMatch(matchId);
      return matchId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Ball-by-Ball Scoring
export const addBall = createAsyncThunk(
  "match/addBall",
  async ({ matchId, ballData }, { rejectWithValue }) => {
    try {
      const response = await matchAPI.addBall(matchId, ballData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMatchBalls = createAsyncThunk(
  "match/fetchMatchBalls",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getMatchBalls(matchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const undoLastBall = createAsyncThunk(
  "match/undoLastBall",
  async (matchId, { rejectWithValue }) => {
    try {
      await matchAPI.undoLastBall(matchId);
      return matchId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLiveScore = createAsyncThunk(
  "match/fetchLiveScore",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getLiveScore(matchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Scorecards
export const addScorecard = createAsyncThunk(
  "match/addScorecard",
  async (scorecardData, { rejectWithValue }) => {
    try {
      const response = await matchAPI.addScorecard(scorecardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMatchScorecard = createAsyncThunk(
  "match/fetchMatchScorecard",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getMatchScorecard(matchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Leaderboards
export const fetchMatchLeaderboard = createAsyncThunk(
  "match/fetchMatchLeaderboard",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getMatchLeaderboard(matchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTournamentLeaderboard = createAsyncThunk(
  "match/fetchTournamentLeaderboard",
  async ({ tournamentId, type }, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getTournamentLeaderboard(
        tournamentId,
        type
      );
      return { data: response.data, type };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPointsTable = createAsyncThunk(
  "match/fetchPointsTable",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getPointsTable(tournamentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Tournament Management
export const generateGroupMatches = createAsyncThunk(
  "match/generateGroupMatches",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.generateGroupMatches(tournamentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateKnockoutMatches = createAsyncThunk(
  "match/generateKnockoutMatches",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.generateKnockoutMatches(tournamentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const advanceTeams = createAsyncThunk(
  "match/advanceTeams",
  async ({ tournamentId, teamIds }, { rejectWithValue }) => {
    try {
      const response = await matchAPI.advanceTeams(tournamentId, teamIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchQualifiedTeams = createAsyncThunk(
  "match/fetchQualifiedTeams",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getQualifiedTeams(tournamentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== INITIAL STATE ====================

const initialState = {
  // Matches
  matches: [],
  currentMatch: null,
  liveMatches: [],

  // Ball-by-Ball
  balls: [],
  liveScore: null,

  // Scorecards
  scorecard: null,

  // Leaderboards
  matchLeaderboard: null,
  tournamentLeaderboard: {
    batting: [],
    bowling: [],
    fielding: [],
  },
  pointsTable: [],

  // Tournament
  qualifiedTeams: [],
  generatedMatches: [],

  // UI State
  loading: false,
  error: null,
  ballLoading: false,
};

// ==================== SLICE ====================

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetMatchState: (state) => {
      return initialState;
    },
    setCurrentMatch: (state, action) => {
      state.currentMatch = action.payload;
    },
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
      state.balls = [];
      state.liveScore = null;
      state.scorecard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Match
      .addCase(createMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matches.unshift(action.payload);
        state.currentMatch = action.payload;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create match";
      })

      // Fetch Matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        state.liveMatches = action.payload.filter((m) => m.status === "live");
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch matches";
      })

      // Fetch Match By ID
      .addCase(fetchMatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch match";
      })

      // Update Match Result
      .addCase(updateMatchResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMatchResult.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
        const index = state.matches.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
      })
      .addCase(updateMatchResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update match";
      })

      // Delete Match
      .addCase(deleteMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = state.matches.filter((m) => m.id !== action.payload);
        if (state.currentMatch?.id === action.payload) {
          state.currentMatch = null;
        }
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete match";
      })

      // Add Ball
      .addCase(addBall.pending, (state) => {
        state.ballLoading = true;
        state.error = null;
      })
      .addCase(addBall.fulfilled, (state, action) => {
        state.ballLoading = false;
        state.balls.push(action.payload);
      })
      .addCase(addBall.rejected, (state, action) => {
        state.ballLoading = false;
        state.error = action.payload || "Failed to add ball";
      })

      // Fetch Match Balls
      .addCase(fetchMatchBalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchBalls.fulfilled, (state, action) => {
        state.loading = false;
        state.balls = action.payload;
      })
      .addCase(fetchMatchBalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch balls";
      })

      // Undo Last Ball
      .addCase(undoLastBall.pending, (state) => {
        state.ballLoading = true;
        state.error = null;
      })
      .addCase(undoLastBall.fulfilled, (state) => {
        state.ballLoading = false;
        state.balls.pop(); // Remove last ball
      })
      .addCase(undoLastBall.rejected, (state, action) => {
        state.ballLoading = false;
        state.error = action.payload || "Failed to undo ball";
      })

      // Fetch Live Score
      .addCase(fetchLiveScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveScore.fulfilled, (state, action) => {
        state.loading = false;
        state.liveScore = action.payload;
      })
      .addCase(fetchLiveScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch live score";
      })

      // Add Scorecard
      .addCase(addScorecard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScorecard.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addScorecard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add scorecard";
      })

      // Fetch Match Scorecard
      .addCase(fetchMatchScorecard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchScorecard.fulfilled, (state, action) => {
        state.loading = false;
        state.scorecard = action.payload;
      })
      .addCase(fetchMatchScorecard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch scorecard";
      })

      // Fetch Match Leaderboard
      .addCase(fetchMatchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.matchLeaderboard = action.payload;
      })
      .addCase(fetchMatchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leaderboard";
      })

      // Fetch Tournament Leaderboard
      .addCase(fetchTournamentLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTournamentLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        const { data, type } = action.payload;
        state.tournamentLeaderboard[type] = data;
      })
      .addCase(fetchTournamentLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch tournament leaderboard";
      })

      // Fetch Points Table
      .addCase(fetchPointsTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointsTable.fulfilled, (state, action) => {
        state.loading = false;
        state.pointsTable = action.payload;
      })
      .addCase(fetchPointsTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch points table";
      })

      // Generate Group Matches
      .addCase(generateGroupMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateGroupMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedMatches = action.payload;
      })
      .addCase(generateGroupMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate matches";
      })

      // Generate Knockout Matches
      .addCase(generateKnockoutMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateKnockoutMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedMatches = action.payload;
      })
      .addCase(generateKnockoutMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate knockout matches";
      })

      // Advance Teams
      .addCase(advanceTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(advanceTeams.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(advanceTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to advance teams";
      })

      // Fetch Qualified Teams
      .addCase(fetchQualifiedTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQualifiedTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.qualifiedTeams = action.payload;
      })
      .addCase(fetchQualifiedTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch qualified teams";
      });
  },
});

export const {
  clearError,
  resetMatchState,
  setCurrentMatch,
  clearCurrentMatch,
} = matchSlice.actions;
export default matchSlice.reducer;
