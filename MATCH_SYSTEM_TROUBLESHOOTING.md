# Match System Troubleshooting Guide

## 🚨 **Common Issue: Database Schema Conflict**

### Error Message:

```
QueryFailedError: column "tournamentId" is in a primary key
```

### **Cause**:

An old version of the `tournament_teams` table exists in your database with a different schema (possibly from a previous implementation or test).

### **Solution**:

#### Option 1: Quick Fix (Recommended)

Run the SQL fix script to drop and recreate tables:

```bash
# From the project root
psql -U postgres -d cricketapp -f DATABASE_FIX_MATCH_TABLES.sql
```

#### Option 2: Manual Fix

Connect to PostgreSQL and run:

```sql
-- Connect to database
psql -U postgres -d cricketapp

-- Drop the conflicting tables
DROP TABLE IF EXISTS tournament_teams CASCADE;
DROP TABLE IF EXISTS balls CASCADE;
DROP TABLE IF EXISTS scorecards CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS tournament_groups CASCADE;

-- Exit
\q
```

#### Option 3: Fresh Database (Nuclear Option)

If above doesn't work, recreate the entire database:

```sql
-- Connect as postgres
psql -U postgres

-- Drop and recreate database
DROP DATABASE IF EXISTS cricketapp;
CREATE DATABASE cricketapp;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE cricketapp TO postgres;

\q
```

Then restart backend:

```bash
cd backend
npm run start:dev
```

---

## ✅ **After Fix - Verify Tables Created**

```sql
psql -U postgres -d cricketapp

-- Check if match tables exist
\dt *match*
\dt *ball*
\dt *scorecard*
\dt *tournament*

-- You should see:
-- matches
-- balls
-- scorecards
-- tournament_groups
-- tournament_teams

-- Verify tournament_teams structure
\d tournament_teams

-- Expected structure:
--  Column          | Type    | Nullable | Default
-- -----------------+---------+----------+---------
--  id              | integer | not null | nextval(...)
--  points          | integer | not null | 0
--  netRunRate      | numeric | not null | 0
--  matchesPlayed   | integer | not null | 0
--  ... (etc)
```

---

## 🎯 **Complete Startup Sequence**

### 1. Fix Database (if needed)

```bash
psql -U postgres -d cricketapp -f DATABASE_FIX_MATCH_TABLES.sql
```

### 2. Build Backend

```bash
cd backend
npm run build
```

### 3. Start Backend

```bash
npm run start:dev
```

**Expected Output**:

```
[Nest] INFO [TypeOrmModule] Mapped {matches} table
[Nest] INFO [TypeOrmModule] Mapped {balls} table
[Nest] INFO [TypeOrmModule] Mapped {scorecards} table
[Nest] INFO [TypeOrmModule] Mapped {tournament_groups} table
[Nest] INFO [TypeOrmModule] Mapped {tournament_teams} table
[Nest] INFO [RoutesResolver] MatchesController {/matches}
... (17 routes mapped)
[Nest] INFO Application is running on: http://localhost:3001
```

### 4. Verify API

```bash
curl http://localhost:3001/matches
# Should return: []
```

### 5. Start Frontend

```bash
cd frontend
npm start
```

---

## 🔍 **Other Potential Issues**

### Issue: "Cannot find module '@reduxjs/toolkit'"

**Solution**:

```bash
cd frontend
npm install @reduxjs/toolkit react-redux
```

### Issue: "Cannot GET /matches"

**Solution**:

- Check if backend is running on port 3001
- Check if MatchesModule is imported in app.module.ts
- Rebuild backend: `npm run build`

### Issue: Frontend shows empty matches page

**Solution**:

- No matches created yet (this is normal!)
- Create a match via API or wait for CreateMatchModal implementation

### Issue: "Player not found" when adding balls

**Solution**:

- Make sure you have players created in the database
- Use the seeder: `npm run seed` (if seeder includes players)

---

## 📊 **Database Table Dependencies**

```
tournament_teams depends on:
  - tournaments (must exist first)
  - teams (must exist first)
  - tournament_groups (nullable)

matches depends on:
  - teams (teamA, teamB, winner)
  - tournaments (nullable)
  - users (manOfTheMatch, nullable)

balls depends on:
  - matches
  - teams (batting, bowling)
  - players (batsman, bowler, nonStriker, fielder)

scorecards depends on:
  - matches
  - players
  - teams
```

**Startup Order**:

1. Core entities (users, players, teams, tournaments)
2. Match system entities (groups, tournament_teams, matches)
3. Match details (balls, scorecards)

---

## 🎯 **Quick Health Check**

Run these commands to verify everything is working:

```bash
# 1. Check backend is running
curl http://localhost:3001

# 2. Check matches endpoint
curl http://localhost:3001/matches

# 3. Check database connection
psql -U postgres -d cricketapp -c "SELECT COUNT(*) FROM matches;"

# 4. Check frontend
curl http://localhost:3000
```

---

## 💡 **Pro Tips**

### Development Mode

- Set `synchronize: true` in TypeORM config for auto-migrations
- Be careful in production - use proper migrations

### Clean Slate

If you want to start fresh for testing:

```bash
# Drop all match tables
psql -U postgres -d cricketapp -f DATABASE_FIX_MATCH_TABLES.sql

# Restart backend
cd backend && npm run start:dev
```

### Check Logs

Always check the NestJS console output for:

- Table creation confirmations
- Route mapping confirmations
- Any errors during startup

---

## 📞 **Still Having Issues?**

### Check These:

1. ✅ PostgreSQL is running
2. ✅ Database "cricketapp" exists
3. ✅ Backend built: `npm run build`
4. ✅ Backend running: `npm run start:dev`
5. ✅ No TypeScript errors in console
6. ✅ All 5 match tables created
7. ✅ 17 routes mapped

### Debug Steps:

```bash
# Check if tables exist
psql -U postgres -d cricketapp -c "\dt"

# Check backend logs
cd backend
npm run start:dev 2>&1 | grep -i error

# Check if ports are available
netstat -an | grep 3001
```

---

**Status**: Database fix provided ✅  
**Next**: Apply fix and restart backend  
**Then**: Full system operational! 🚀
