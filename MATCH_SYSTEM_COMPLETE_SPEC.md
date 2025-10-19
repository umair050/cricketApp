# Match & Tournament System - Complete Specification

## 🚀 **STATUS: Architecture Complete - Ready for Full Implementation**

All database entities and DTOs are created. This document provides the complete specification for implementing the remaining components.

## ✅ **What's Already Implemented (30% Complete)**

### Backend Entities ✅

1. **Match** - Friendly + Tournament matches with all metadata
2. **Scorecard** - Player statistics per match
3. **Ball** - Ball-by-ball tracking with outcomes
4. **TournamentGroup** - Pool/Group management
5. **TournamentTeam** - Points table data

### Backend DTOs ✅

1. **CreateMatchDto** - Match creation validation
2. **UpdateMatchResultDto** - Match result updates
3. **CreateScorecardDto** - Player stats
4. **AddBallDto** - Ball-by-ball entry

## 🎯 **Core Features to Implement**

### 1. Ball-by-Ball Scorecard Admin Panel

**Requirements:**
The tournament admin can track every ball with:

- Select current batsman (striker)
- Select non-striker
- Select bowler
- Record outcome:
  - Dot ball (0 runs)
  - Single (1 run)
  - Double (2 runs)
  - Triple (3 runs)
  - Four (4 runs, boundary)
  - Six (6 runs, boundary)
  - Wide (+1 extra, rebowl)
  - No ball (+1 extra, free hit)
  - Bye/Leg bye
  - Wicket (with type: bowled, caught, lbw, run out, stumped, etc.)
- Optional commentary for each ball
- Auto-calculate strike rates, economy, etc.

**UI Flow:**

```
┌─────────────────────────────────────┐
│  Live Match Scorer                  │
├─────────────────────────────────────┤
│  Team A: 145/3 (15.2 overs)        │
│  Team B: Yet to bat                 │
├─────────────────────────────────────┤
│  Current Over: 15                   │
│  Balls: 2                           │
│                                     │
│  Batsman: Virat Kohli (45* off 32) │
│  Bowler: J. Bumrah (3-0-18-1)      │
│                                     │
│  [0] [1] [2] [3] [4] [6]           │
│  [Wide] [No Ball] [Bye] [Wicket]   │
│                                     │
│  Commentary: _________________      │
│  [Submit Ball]                      │
└─────────────────────────────────────┘
```

### 2. Real-time Leaderboards

**Match Leaderboard (after each match):**

- Top 3 batsmen (by runs)
- Top 3 bowlers (by wickets)
- Best fielder (by catches/run outs)
- Man of the Match selection

**Tournament Leaderboard (live updated):**

- Orange Cap (most runs)
- Purple Cap (most wickets)
- Best batting average
- Best bowling economy
- Most sixes
- Best strike rate
- Most catches

### 3. Points Table (Auto-calculated)

After every match completion:

- Win: +2 points
- Tie/No Result: +1 point
- Loss: 0 points
- Net Run Rate (NRR) updated
- Teams sorted by: Points → NRR → Wins

**Example:**

```
Group A Standings:
┌──────┬───────────────┬───┬───┬───┬──────┬────────┐
│ Pos  │ Team          │ P │ W │ L │ Pts  │ NRR    │
├──────┼───────────────┼───┼───┼───┼──────┼────────┤
│  1   │ Mumbai        │ 6 │ 5 │ 1 │ 10   │ +1.250 │
│  2   │ Chennai       │ 6 │ 4 │ 2 │  8   │ +0.850 │
│  3   │ Delhi         │ 6 │ 2 │ 4 │  4   │ -0.450 │
│  4   │ Bangalore     │ 6 │ 1 │ 5 │  2   │ -1.100 │
└──────┴───────────────┴───┴───┴───┴──────┴────────┘
```

## 🗄️ **Complete Database Schema**

### Already Created:

```sql
-- Matches (friendly + tournament)
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  match_type VARCHAR CHECK (match_type IN ('friendly', 'tournament')),
  tournament_id INTEGER REFERENCES tournaments(id),
  group_name VARCHAR,
  stage VARCHAR,
  team_a_id INTEGER REFERENCES teams(id),
  team_b_id INTEGER REFERENCES teams(id),
  match_date TIMESTAMP,
  venue VARCHAR,
  city VARCHAR,
  overs INTEGER DEFAULT 20,
  status VARCHAR DEFAULT 'scheduled',
  winner_id INTEGER REFERENCES teams(id),
  team_a_score VARCHAR,
  team_b_score VARCHAR,
  match_summary TEXT,
  man_of_match_id INTEGER REFERENCES players(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ball-by-ball tracking
CREATE TABLE balls (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  batting_team_id INTEGER REFERENCES teams(id),
  bowling_team_id INTEGER REFERENCES teams(id),
  over_number DECIMAL(3,1),
  ball_number INTEGER,
  batsman_id INTEGER REFERENCES players(id),
  non_striker_id INTEGER REFERENCES players(id),
  bowler_id INTEGER REFERENCES players(id),
  outcome VARCHAR,
  runs INTEGER DEFAULT 0,
  extras INTEGER DEFAULT 0,
  is_wicket BOOLEAN DEFAULT FALSE,
  wicket_type VARCHAR,
  fielder_id INTEGER REFERENCES players(id),
  commentary TEXT,
  is_boundary BOOLEAN DEFAULT FALSE,
  is_legal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player scorecards
CREATE TABLE scorecards (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES players(id),
  team_id INTEGER REFERENCES teams(id),
  runs INTEGER DEFAULT 0,
  balls INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  strike_rate DECIMAL(5,2) DEFAULT 0,
  is_out BOOLEAN DEFAULT FALSE,
  dismissal_type VARCHAR,
  overs_bowled DECIMAL(4,1) DEFAULT 0,
  wickets INTEGER DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  maidens INTEGER DEFAULT 0,
  economy DECIMAL(5,2) DEFAULT 0,
  catches INTEGER DEFAULT 0,
  run_outs INTEGER DEFAULT 0,
  stumpings INTEGER DEFAULT 0,
  is_player_of_match BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tournament groups
CREATE TABLE tournament_groups (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  name VARCHAR,
  max_teams INTEGER DEFAULT 4,
  qualifying_teams INTEGER DEFAULT 2,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tournament team standings
CREATE TABLE tournament_teams (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id),
  group_id INTEGER REFERENCES tournament_groups(id),
  points INTEGER DEFAULT 0,
  net_run_rate DECIMAL(10,3) DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  no_results INTEGER DEFAULT 0,
  runs_scored INTEGER DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  overs_faced DECIMAL(10,3) DEFAULT 0,
  overs_bowled DECIMAL(10,3) DEFAULT 0,
  is_qualified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);
```

## 📡 **Complete API Endpoints Specification**

### Matches

```http
POST   /matches
Body: { matchType, teamAId, teamBId, matchDate, venue, overs, tournamentId?, groupName?, stage? }
Response: Match object

GET    /matches?status=live&tournamentId=5&teamId=2
Response: { matches: [], total: number }

GET    /matches/:id
Response: Match with teams, scorecards, balls

PATCH  /matches/:id/result
Body: { status, winnerId, teamAScore, teamBScore, matchSummary }
Response: Updated match

DELETE /matches/:id
Response: 204 No Content
```

### Ball-by-Ball Scoring

```http
POST   /matches/:id/balls
Body: { batsmanId, bowlerId, outcome, runs, isWicket, wicketType, commentary }
Response: Ball object + updated scores

GET    /matches/:id/balls
Response: { balls: [], currentScore, currentOver }

DELETE /balls/:id
Response: 204 (undo last ball)

GET    /matches/:id/live-score
Response: { teamA: {...}, teamB: {...}, currentOver, recentBalls: [] }
```

### Scorecards

```http
GET    /matches/:id/scorecard
Response: { battingScores: [], bowlingFigures: [] }

POST   /matches/:id/scorecard
Body: { playerId, teamId, runs, balls, wickets, oversBowled }
Response: Scorecard object

PATCH  /scorecards/:id
Body: Updated stats
Response: Updated scorecard
```

### Leaderboards

```http
GET    /matches/:id/leaderboard
Response: {
  topBatsmen: [{ player, runs, balls, sr }],
  topBowlers: [{ player, wickets, overs, economy }],
  manOfMatch: Player
}

GET    /tournaments/:id/leaderboard?type=batting
Response: {
  players: [{
    player: {...},
    totalRuns: 450,
    matches: 8,
    average: 56.25,
    strikeRate: 145.3,
    fifties: 3,
    hundreds: 1
  }]
}

GET    /tournaments/:id/leaderboard?type=bowling
Response: {
  players: [{
    player: {...},
    totalWickets: 15,
    matches: 8,
    economy: 6.8,
    average: 18.5,
    bestFigures: "4/18"
  }]
}
```

### Points Table

```http
GET    /tournaments/:id/points-table
Response: {
  groups: [{
    name: "Group A",
    teams: [{
      team: {...},
      matchesPlayed: 6,
      wins: 5,
      points: 10,
      netRunRate: +1.25,
      runsScored: 1200,
      runsConceded: 1050
    }]
  }]
}
```

### Tournament Management

```http
POST   /tournaments/:id/generate-group-matches
Response: { matches: [], message: "12 matches generated" }

POST   /tournaments/:id/generate-knockout-matches
Response: { matches: [], qualifiedTeams: [] }

POST   /tournaments/:id/advance-teams
Body: { groupId, teamIds: [] }
Response: { qualifiedTeams: [] }

GET    /tournaments/:id/groups
Response: { groups: [{ name, teams: [], standings: [] }] }
```

## 🎮 **Frontend Components Specification**

### 1. MatchScorer Component (Ball-by-Ball)

```javascript
// frontend/src/components/Matches/MatchScorer.js

Features:
- Current match status display
- Team scores (live update)
- Select batsman dropdown
- Select bowler dropdown
- Ball outcome buttons (0, 1, 2, 3, 4, 6, W, Wd, NB)
- Wicket modal (type of dismissal, fielder)
- Commentary input
- Recent balls display (last 6 balls)
- Current over display
- Auto-switch strike after odd runs
- Auto-complete over after 6 legal balls
- Undo last ball button
- Complete innings button
```

### 2. Leaderboard Component

```javascript
// frontend/src/components/Matches/Leaderboard.js

Features:
- Tabs: Batting | Bowling | Fielding | All-Rounders
- Sortable columns
- Player photos
- Key stats highlighted
- Filters by group/team
- Export to PDF
- Share on social feed
```

### 3. PointsTable Component

```javascript
// frontend/src/components/Matches/PointsTable.js

Features:
- Group-wise tabs
- Sortable by points/NRR
- Qualified teams highlighted
- Recent form (W/L/W/W/L)
- Click team to see fixtures
- Responsive mobile view
```

### 4. MatchCard Component

```javascript
// frontend/src/components/Matches/MatchCard.js

Features:
- Team logos and names
- Match status badge
- Scores (if completed/live)
- Date, time, venue
- "Live" indicator
- Click to view full scorecard
```

### 5. LiveMatchView Component

```javascript
// frontend/src/components/Matches/LiveMatchView.js

Features:
- Real-time score updates
- Ball-by-ball commentary
- Current partnership
- Run rate graphs
- Player stats (batsmen/bowlers)
- Wagon wheel / Manhattan (future)
```

## 💾 **Service Implementation Guide**

The Matches Service needs these key methods:

### Match Management

```typescript
async createMatch(createMatchDto: CreateMatchDto): Promise<Match>
async getAllMatches(filters: MatchFilters): Promise<Match[]>
async getMatchById(id: number): Promise<Match>
async updateMatchResult(id: number, result: UpdateMatchResultDto): Promise<Match>
async startMatch(id: number): Promise<Match> // Set status to 'live'
async endMatch(id: number): Promise<Match> // Finalize scores
async deleteMatch(id: number): Promise<void>
```

### Ball-by-Ball Tracking

```typescript
async addBall(addBallDto: AddBallDto): Promise<Ball>
async getMatchBalls(matchId: number): Promise<Ball[]>
async undoLastBall(matchId: number): Promise<void>
async getCurrentMatchState(matchId: number): Promise<LiveMatchState>
```

### Scorecard Management

```typescript
async generateScorecard(matchId: number): Promise<void> // Auto from balls
async getMatchScorecard(matchId: number): Promise<ScorecardResponse>
async updatePlayerStat(scorecardId: number, stats: Partial<Scorecard>): Promise<Scorecard>
```

### Leaderboards

```typescript
async getMatchLeaderboard(matchId: number): Promise<MatchLeaderboard>
async getTournamentLeaderboard(tournamentId: number, type: 'batting' | 'bowling' | 'fielding'): Promise<TournamentLeaderboard>
async getPlayerTournamentStats(playerId: number, tournamentId: number): Promise<PlayerStats>
```

### Points Table & NRR

```typescript
async getPointsTable(tournamentId: number): Promise<PointsTableResponse>
async updatePointsTable(matchId: number): Promise<void> // Called after match end
async calculateNetRunRate(teamId: number, tournamentId: number): Promise<number>
```

### Tournament Progression

```typescript
async generateGroupMatches(tournamentId: number): Promise<Match[]>
async generateKnockoutMatches(tournamentId: number): Promise<Match[]>
async advanceTeamsToKnockout(tournamentId: number): Promise<void>
async getQualifiedTeams(tournamentId: number): Promise<Team[]>
```

## 🎨 **Frontend Redux Slice Structure**

```javascript
// frontend/src/store/slices/matchSlice.js

const initialState = {
  matches: [],
  currentMatch: null,
  liveMatches: [],
  leaderboard: {
    batting: [],
    bowling: [],
    fielding: []
  },
  pointsTable: [],
  matchBalls: [],
  loading: false,
  error: null,
};

// Async Thunks (15+)
export const createMatch = createAsyncThunk(...)
export const fetchMatches = createAsyncThunk(...)
export const fetchMatchById = createAsyncThunk(...)
export const updateMatchResult = createAsyncThunk(...)
export const addBall = createAsyncThunk(...)
export const undoLastBall = createAsyncThunk(...)
export const fetchMatchBalls = createAsyncThunk(...)
export const fetchMatchLeaderboard = createAsyncThunk(...)
export const fetchTournamentLeaderboard = createAsyncThunk(...)
export const fetchPointsTable = createAsyncThunk(...)
export const generateGroupMatches = createAsyncThunk(...)
export const generateKnockoutMatches = createAsyncThunk(...)
```

## 📊 **NRR Calculation Algorithm**

```typescript
calculateNetRunRate(teamStats: TournamentTeam): number {
  if (teamStats.oversFaced === 0 || teamStats.oversBowled === 0) {
    return 0;
  }

  const runRateFor = teamStats.runsScored / teamStats.oversFaced;
  const runRateAgainst = teamStats.runsConceded / teamStats.oversBowled;

  return parseFloat((runRateFor - runRateAgainst).toFixed(3));
}

// Update after each match
async updateTeamNRR(match: Match): Promise<void> {
  // Parse scores: "180/7" → runs: 180, overs: 20.0
  const teamAStats = parseScore(match.teamAScore);
  const teamBStats = parseScore(match.teamBScore);

  // Update both teams in tournament_teams table
  await this.updateTournamentTeamStats(match.teamA.id, match.tournament.id, {
    runsScored: += teamAStats.runs,
    runsConceded: += teamBStats.runs,
    oversFaced: += teamAStats.overs,
    oversBowled: += teamBStats.overs,
  });

  // Recalculate NRR
  const nrr = await this.calculateNetRunRate(teamId, tournamentId);
  await this.updateNRR(teamId, tournamentId, nrr);
}
```

## 🎯 **Auto-Match Generation Logic**

### Group Stage (Round Robin)

```typescript
async generateGroupMatches(tournamentId: number, groupId: number): Promise<Match[]> {
  const teams = await this.getGroupTeams(groupId);
  const matches = [];

  // Round-robin: each team plays every other team once
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        matchType: 'tournament',
        tournamentId,
        groupName: group.name,
        stage: 'group',
        teamAId: teams[i].id,
        teamBId: teams[j].id,
        matchDate: generateMatchDate(matches.length),
        overs: tournament.oversPerMatch,
      });
    }
  }

  return await this.matchRepository.save(matches);
}
```

### Knockout Generation

```typescript
async generateKnockoutMatches(tournamentId: number): Promise<Match[]> {
  const qualifiedTeams = await this.getQualifiedTeams(tournamentId);

  // Group A #1 vs Group B #2, Group B #1 vs Group A #2
  const semiFinals = [
    {
      teamAId: qualifiedTeams.groupA[0].id,
      teamBId: qualifiedTeams.groupB[1].id,
      stage: 'semi_final',
    },
    {
      teamAId: qualifiedTeams.groupB[0].id,
      teamBId: qualifiedTeams.groupA[1].id,
      stage: 'semi_final',
    }
  ];

  return await this.matchRepository.save(semiFinals);
}
```

## 📱 **Mobile App Features**

- Push notifications when match starts
- Live score updates every ball
- Quick share match result to feed
- Player performance cards
- Tournament bracket visualization
- Offline mode for scorecard entry (sync later)

## 🔐 **Permissions & Roles**

| Action            | Admin | Scorer | Player | Fan |
| ----------------- | ----- | ------ | ------ | --- |
| Create Match      | ✅    | ✅     | ❌     | ❌  |
| Add Ball          | ✅    | ✅     | ❌     | ❌  |
| View Scorecard    | ✅    | ✅     | ✅     | ✅  |
| Edit Result       | ✅    | ✅     | ❌     | ❌  |
| View Leaderboard  | ✅    | ✅     | ✅     | ✅  |
| Generate Fixtures | ✅    | ❌     | ❌     | ❌  |

## 🚀 **Implementation Priority**

Given the scope, here's the recommended order:

### Week 1: Core Match System

1. ✅ Entities & DTOs (DONE)
2. Matches Service (CRUD + basic scorecard)
3. Matches Controller
4. Matches Module
5. Basic frontend Match List page

### Week 2: Ball-by-Ball Scoring

6. Ball tracking service methods
7. MatchScorer frontend component
8. Live match view
9. Auto-calculate stats from balls

### Week 3: Leaderboards & Points

10. Leaderboard calculation logic
11. Points table calculation
12. Frontend Leaderboard component
13. Frontend PointsTable component

### Week 4: Tournament Progression

14. Auto-generate fixtures
15. Knockout bracket logic
16. Team advancement
17. Tournament completion flow

## 📝 **Quick Start - Minimal Viable Implementation**

If you want to start simple, implement just these:

1. **Create friendly match** (Team A vs B)
2. **Manual scorecard entry** (just runs, wickets - no ball-by-ball)
3. **Basic match leaderboard** (top 3 performers)
4. **Match list page**

This MVP can be done in ~4-5 hours and provides immediate value!

Then gradually add:

- Ball-by-ball scoring
- Tournament integration
- Auto-generated fixtures
- Advanced leaderboards

## 📚 **Documentation to Create**

Once implemented:

- MATCH_SYSTEM_GUIDE.md - Complete user guide
- BALL_BY_BALL_SCORING.md - Scorer's manual
- LEADERBOARD_CALCULATIONS.md - Algorithm explanations
- TOURNAMENT_PROGRESSION_GUIDE.md - How to manage tournaments

## 🎉 **What This Gives You**

With this complete system, your app will have:

- Professional cricket scoring system
- IPL-style points tables
- Real-time leaderboards
- Tournament management like Cricbuzz/ESPN
- Ball-by-ball commentary like live matches
- Player statistics tracking
- Automatic NRR calculations
- Knockout bracket progression

**This is a complete professional cricket management platform!** 🏆

---

**Ready to implement?** I'll start building the matches service with all the logic!


