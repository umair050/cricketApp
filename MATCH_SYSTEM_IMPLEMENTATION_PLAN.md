# Match & Tournament System - Complete Implementation Plan

## 🎯 Overview

Implementing a comprehensive match and tournament management system with:

- ✅ Standalone friendly matches (Team A vs Team B)
- ✅ Tournament matches with groups and knockouts
- ✅ Player scorecards with detailed statistics
- ✅ Leaderboards for matches and tournaments
- ✅ Automatic points table calculation
- ✅ Tournament progression (Group → Knockout → Semi → Final)

## ✅ What's Already Created

### Backend Entities (4 entities)

1. ✅ **Match Entity** (`backend/src/matches/entities/match.entity.ts`)

   - Supports both friendly and tournament matches
   - Group stage and knockout stages
   - Match status (scheduled, live, completed)
   - Team scores and winner tracking
   - Man of the match

2. ✅ **Scorecard Entity** (`backend/src/matches/entities/scorecard.entity.ts`)

   - Detailed player statistics per match
   - Batting stats (runs, balls, 4s, 6s, strike rate)
   - Bowling stats (overs, wickets, economy, maidens)
   - Fielding stats (catches, run outs, stumpings)
   - Player of the match flag

3. ✅ **TournamentGroup Entity** (`backend/src/matches/entities/group.entity.ts`)

   - Pool/Group management (Group A, B, C, etc.)
   - Max teams per group
   - Qualifying teams count

4. ✅ **TournamentTeam Entity** (`backend/src/matches/entities/tournament-team.entity.ts`)
   - Points table for each team in tournament
   - Win/loss/draw tracking
   - Net Run Rate (NRR) calculation fields
   - Qualification status

### Backend DTOs (3 DTOs)

1. ✅ **CreateMatchDto** - Validation for creating matches
2. ✅ **UpdateMatchResultDto** - Update match results
3. ✅ **CreateScorecardDto** - Add player stats

## 🔨 What Needs to Be Implemented

### 1. Matches Service

Create `backend/src/matches/matches.service.ts` with:

```typescript
@Injectable()
export class MatchesService {
  // Match CRUD
  createMatch(createMatchDto);
  getAllMatches(filters);
  getMatchById(id);
  updateMatchResult(id, result);
  deleteMatch(id);

  // Scorecard Management
  addScorecard(scorecardDto);
  getMatchScorecard(matchId);
  updatePlayerStats(scorecardId, stats);

  // Leaderboards
  getMatchLeaderboard(matchId); // Top performers in a match
  getTournamentLeaderboard(tournamentId, type); // type: batting/bowling/fielding
  getPlayerStats(playerId, tournamentId);

  // Tournament Management
  generateGroupMatches(tournamentId);
  generateKnockoutMatches(tournamentId);
  updatePointsTable(matchId);
  calculateNetRunRate(teamId, tournamentId);
  advanceTeamsToKnockout(tournamentId);
}
```

### 2. Matches Controller

Create `backend/src/matches/matches.controller.ts` with endpoints:

```typescript
// Matches
POST   /matches                    - Create match (friendly or tournament)
GET    /matches                    - Get all matches with filters
GET    /matches/:id                - Get match details with scorecards
PATCH  /matches/:id/result         - Update match result
DELETE /matches/:id                - Delete match

// Scorecards
POST   /matches/:id/scorecard      - Add player scorecard
GET    /matches/:id/scorecard      - Get full scorecard
PATCH  /scorecards/:id             - Update player stats

// Leaderboards
GET    /matches/:id/leaderboard    - Match leaderboard
GET    /tournaments/:id/leaderboard - Tournament leaderboard
GET    /tournaments/:id/points-table - Group points table

// Tournament Management
POST   /tournaments/:id/generate-fixtures  - Auto-generate matches
POST   /tournaments/:id/advance-teams      - Move teams to knockout
GET    /tournaments/:id/groups              - Get all groups
```

### 3. Frontend Components

```
frontend/src/
├── components/Matches/
│   ├── CreateMatchModal.js       - Create friendly/tournament match
│   ├── MatchCard.js               - Display match info
│   ├── MatchLeaderboard.js        - Top performers
│   ├── Scorecard.js               - Detailed player stats
│   └── PointsTable.js             - Group standings
├── pages/Matches/
│   ├── Matches.js                 - All matches list
│   ├── MatchDetails.js            - Single match view
│   └── CreateMatch.js             - Match creation page
└── pages/Tournaments/
    └── TournamentDetails.js       - Enhanced with groups & brackets
```

### 4. Redux Slice

Create `frontend/src/store/slices/matchSlice.js`:

```javascript
// Async Thunks
-createMatch -
  fetchMatches -
  fetchMatchById -
  updateMatchResult -
  addScorecard -
  fetchMatchLeaderboard -
  fetchTournamentLeaderboard -
  fetchPointsTable;
```

## 📊 Key Features

### 1. Match Creation

**Friendly Match:**

```javascript
{
  "matchType": "friendly",
  "teamAId": 1,
  "teamBId": 2,
  "matchDate": "2025-10-15T14:00:00Z",
  "venue": "Mumbai Cricket Ground",
  "overs": 20
}
```

**Tournament Match:**

```javascript
{
  "matchType": "tournament",
  "tournamentId": 5,
  "groupName": "Group A",
  "stage": "group",
  "teamAId": 3,
  "teamBId": 4,
  "matchDate": "2025-10-15T14:00:00Z",
  "overs": 20
}
```

### 2. Scorecard Example

```javascript
{
  "matchId": 1,
  "playerId": 10,
  "teamId": 2,
  "runs": 45,
  "balls": 32,
  "fours": 4,
  "sixes": 2,
  "strikeRate": 140.62,
  "wickets": 2,
  "oversBowled": 4.0,
  "economy": 7.5
}
```

### 3. Leaderboard Response

```javascript
{
  "batting": [
    {
      "player": { "id": 1, "name": "Virat Kohli" },
      "runs": 450,
      "average": 75.0,
      "strikeRate": 145.2,
      "fifties": 3,
      "hundreds": 1
    }
  ],
  "bowling": [
    {
      "player": { "id": 2, "name": "Jasprit Bumrah" },
      "wickets": 15,
      "economy": 6.2,
      "bestFigures": "4/18"
    }
  ]
}
```

### 4. Points Table Response

```javascript
{
  "groups": [
    {
      "name": "Group A",
      "teams": [
        {
          "team": { "name": "Mumbai Indians" },
          "matchesPlayed": 6,
          "wins": 5,
          "losses": 1,
          "points": 10,
          "netRunRate": 1.25,
          "isQualified": true
        }
      ]
    }
  ]
}
```

## 🔄 Tournament Progression Flow

### Step 1: Tournament Created

```
Tournament → Format: Group + Knockout
Teams: 8
Groups: 2 (A & B)
Teams per group: 4
```

### Step 2: Auto-Generate Group Matches

```
System creates round-robin matches for each group:
- Group A: 6 matches (each team plays 3)
- Group B: 6 matches
Total: 12 group matches
```

### Step 3: Group Stage Complete

```
After all group matches:
- Points table calculated
- Top 2 from each group qualify
- Teams marked as isQualified = true
```

### Step 4: Generate Knockout Matches

```
Semi-Final 1: Group A #1 vs Group B #2
Semi-Final 2: Group B #1 vs Group A #2
```

### Step 5: Final

```
Winner SF1 vs Winner SF2
```

## 📈 Net Run Rate (NRR) Calculation

Formula:

```
NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)
```

Example:

```
Team scored 600 runs in 50 overs across 3 matches
Team conceded 550 runs in 48 overs
NRR = (600/50) - (550/48) = 12.0 - 11.46 = +0.54
```

## 🎯 Use Cases

### Use Case 1: Create Friendly Match

```
1. User goes to "Create Match"
2. Selects "Friendly Match"
3. Chooses Team A and Team B
4. Sets date, time, venue
5. Match created (not tied to any tournament)
```

### Use Case 2: Tournament with Groups

```
1. Organizer creates tournament
2. Adds 8 teams
3. Selects format: "Group + Knockout"
4. System creates 2 groups
5. System generates 12 group matches
6. After groups complete, top 4 teams advance
7. System generates semi-finals
8. Winners play final
```

### Use Case 3: View Leaderboard

```
1. Go to Tournament page
2. Click "Leaderboard" tab
3. See top batsmen, bowlers, fielders
4. Sortable by runs, wickets, average, etc.
```

## 💡 Quick Implementation Guide

This is a **BIG feature** (similar scope to the entire Feeds module). Here's the recommended approach:

### Phase 1 (MVP - Essential)

- [ ] Basic match creation (friendly only)
- [ ] Match list and details
- [ ] Simple scorecard entry
- [ ] Basic leaderboard (top 5 players)

### Phase 2 (Tournament Support)

- [ ] Group creation
- [ ] Tournament match generation
- [ ] Points table calculation
- [ ] NRR calculation

### Phase 3 (Advanced)

- [ ] Knockout bracket visualization
- [ ] Live match updates
- [ ] Ball-by-ball commentary
- [ ] Match analytics

## 📝 Estimated Effort

Based on the Feeds module complexity:

| Component           | Files           | Est. Time       |
| ------------------- | --------------- | --------------- |
| Backend Entities    | 4               | ✅ Done         |
| Backend DTOs        | 5-6             | Partial         |
| Backend Service     | 1 large         | 3-4 hours       |
| Backend Controller  | 1               | 1 hour          |
| Frontend Components | 8-10            | 4-5 hours       |
| Frontend Pages      | 3-4             | 2-3 hours       |
| Redux Slice         | 1               | 1 hour          |
| **Total**           | **20-25 files** | **12-15 hours** |

## 🚀 Next Steps

Would you like me to:

1. **Complete the full implementation now** (will take time but I'll finish everything)
2. **Implement Phase 1 (MVP)** first - basic matches and leaderboards
3. **Create detailed spec document** for you to review before implementation
4. **Focus on specific part** (e.g., just leaderboards or just match creation)

The system architecture is ready - just needs the service logic and frontend components!

## 📚 Files Status

### Created ✅

- `backend/src/matches/entities/match.entity.ts`
- `backend/src/matches/entities/scorecard.entity.ts`
- `backend/src/matches/entities/group.entity.ts`
- `backend/src/matches/entities/tournament-team.entity.ts`
- `backend/src/matches/dto/create-match.dto.ts`
- `backend/src/matches/dto/update-match-result.dto.ts`
- `backend/src/matches/dto/create-scorecard.dto.ts`

### Needed 📝

- `backend/src/matches/matches.service.ts`
- `backend/src/matches/matches.controller.ts`
- `backend/src/matches/matches.module.ts`
- Frontend components (8-10 files)
- Redux slice for matches
- API service integration

---

**Let me know how you'd like to proceed!** I can implement the complete system, or we can start with just the essentials. 🏏
