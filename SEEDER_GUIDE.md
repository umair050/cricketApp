# 🌱 Database Seeder Documentation

## Overview

The database seeder populates your Cricket Platform with realistic fake data for testing and development purposes.

## What Data is Created

### 👥 **Users (10 users)**

- **Famous Cricket Players**: Virat Kohli, MS Dhoni, Rohit Sharma, Jasprit Bumrah, etc.
- **Demo Account**: `demo@cricket.com` / `demo123`
- **Admin Account**: Tournament Organizer
- **Default Password**: `password123` (except demo user)

### 🏏 **Players (8 players)**

- **Complete player profiles** with realistic stats
- **Different roles**: Batsman, Bowler, All-rounder, Wicket-keeper
- **Batting/Bowling styles**: Left/Right handed, Fast/Spin bowling
- **Career statistics**: Matches, runs, wickets, averages, strike rates
- **Jersey numbers** and experience years

### 🛡️ **Teams (4 teams)**

- **Mumbai Indians** (Captain: Rohit Sharma)
- **Chennai Super Kings** (Captain: MS Dhoni)
- **Royal Challengers Bangalore** (Captain: Virat Kohli)
- **Punjab Kings** (Captain: KL Rahul)
- **Team details**: City, home ground, founded date, coach

### 🏆 **Tournaments (5 tournaments)**

- **IPL 2024** (Completed)
- **World Cup 2023** (Completed)
- **T20 World Cup 2024** (Completed)
- **Champions Trophy 2025** (Upcoming)
- **IPL 2025** (Upcoming)
- **Various formats**: T20, ODI
- **Prize pools** and team registrations

## How to Use the Seeder

### Method 1: API Endpoint (Recommended)

1. **Start your backend server**:

   ```bash
   npm run start:dev
   ```

2. **Visit Swagger Documentation**:
   Go to `http://localhost:3001/api`

3. **Find the "Database Seeder" section**

4. **Execute the seeder**:
   - Click on `POST /seeder/seed-all`
   - Click "Try it out"
   - Click "Execute"

### Method 2: Command Line

```bash
npm run seed
```

### Method 3: Manual API Call

```bash
curl -X POST http://localhost:3001/seeder/seed-all
```

## Sample Accounts for Testing

### 🎮 **Demo Account**

- **Email**: `demo@cricket.com`
- **Password**: `demo123`
- **Role**: Player

### 👑 **Admin Account**

- **Email**: `organizer@cricket.com`
- **Password**: `password123`
- **Role**: Admin

### 🏏 **Player Accounts**

- **Virat Kohli**: `virat@cricket.com` / `password123`
- **MS Dhoni**: `dhoni@cricket.com` / `password123`
- **Rohit Sharma**: `rohit@cricket.com` / `password123`
- And more...

## Database Reset

⚠️ **Warning**: The seeder **clears all existing data** before inserting new data.

The seeding process:

1. Deletes all tournaments
2. Deletes all teams
3. Deletes all players
4. Deletes all users
5. Creates fresh data

## Response Format

When seeding completes successfully, you'll get a response like:

```json
{
  "success": true,
  "created": {
    "users": 10,
    "players": 8,
    "teams": 4,
    "tournaments": 5
  }
}
```

## Testing Your Application

After seeding, you can:

1. **Login** with demo account or any player account
2. **Browse players** with realistic stats and profiles
3. **View teams** with proper captain assignments
4. **Check tournaments** with different statuses and formats
5. **Test all CRUD operations** with existing data

## Customization

To add more data or modify existing data, edit:

- `src/seeder/seeder.service.ts`
- Update the data arrays in each seed method
- Run the seeder again to refresh the data

Enjoy testing your Cricket Platform with realistic data! 🏏✨
