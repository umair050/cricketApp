-- Database Fix for Match System Tables
-- Run this if you encounter "column tournamentId is in a primary key" error

-- Drop existing tournament_teams table if it exists
DROP TABLE IF EXISTS tournament_teams CASCADE;

-- Drop other match-related tables if they exist
DROP TABLE IF EXISTS balls CASCADE;
DROP TABLE IF EXISTS scorecards CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS tournament_groups CASCADE;

-- Now restart your backend and TypeORM will recreate them correctly
-- The tables will be auto-created with the correct schema

-- To execute this:
-- psql -U postgres -d cricketapp -f DATABASE_FIX_MATCH_TABLES.sql

-- Or from psql prompt:
-- \c cricketapp
-- \i DATABASE_FIX_MATCH_TABLES.sql



