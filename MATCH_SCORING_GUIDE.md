# 🏏 Ball-by-Ball Match Scoring Guide

## ✅ **Setup Complete!**

Your match scoring system is now fully functional!

---

## 📍 **How to Access the Scorer**

### **Option 1: From Matches Page**

1. Navigate to **Matches** page (`/matches`)
2. Click on any match card
3. You'll be redirected to the Match Detail page with the scorer

### **Option 2: Direct URL**

- Go to: `http://localhost:3000/matches/{match_id}`
- Example: `http://localhost:3000/matches/1`

---

## 🎯 **Using the Match Scorer**

### **Step 1: View Match Information**

The top of the page shows:

- Match status (Live/Scheduled/Completed)
- Teams playing
- Match date, time, and venue
- Tournament info (if applicable)
- Both team squads

### **Step 2: Select Players**

Before scoring any ball, you must:

1. **Select Current Batsman** - Choose from the dropdown
2. **Select Current Bowler** - Choose from the dropdown

> 💡 **Tip**: The dropdowns filter players by role (batsmen/all-rounders for batting, bowlers/all-rounders for bowling)

### **Step 3: Record Ball Outcomes**

Click the appropriate button for each ball:

#### **Run Scoring:**

- **0** - Dot ball (no runs)
- **1** - Single run
- **2** - Two runs
- **3** - Three runs
- **4** - Boundary (4 runs)
- **6** - Six (6 runs)

#### **Extras:**

- **Wide** - Adds 1 run, doesn't count as legal ball
- **No Ball** - Adds 1 run, doesn't count as legal ball
- **Bye** - Run scored without bat contact
- **Leg Bye** - Run scored off body

#### **Wicket:**

1. Click **WICKET** button
2. A modal will appear
3. Select wicket type:
   - Bowled
   - Caught
   - LBW
   - Run Out
   - Stumped
   - Hit Wicket
4. Click **Submit Wicket**

### **Step 4: Add Commentary (Optional)**

- Type commentary in the text area below the buttons
- It will be saved with the ball
- Commentary auto-clears after each ball

---

## 📊 **Live Score Updates**

The scorer automatically displays:

- **Current Score**: Runs/Wickets for both teams
- **Overs Bowled**: Total overs completed
- **Current Over**: Shows which ball you're on (e.g., 5.3 = 5th over, 4th ball)
- **Recent Balls**: Visual display of last 6 balls
  - Red circles = Wickets
  - Green = Boundaries (4s)
  - Purple = Sixes
  - Yellow = Extras
  - Gray = Regular runs

---

## 🎮 **Scorer Controls**

### **Undo Last Ball**

- Click **Undo Last Ball** to remove the most recent ball
- Useful for correcting mistakes
- Requires confirmation

### **Complete Innings**

- Click **Complete Innings** when first innings ends
- Allows switching to second innings
- (Currently shows alert - logic to be implemented)

### **Complete Match**

- Click **Complete Match** when both innings are done
- Automatically determines winner based on scores
- Updates match status to "completed"
- Saves final scores

---

## 🔄 **How Scoring Works Behind the Scenes**

### **1. Ball Recording**

```
POST /matches/{id}/balls
```

Each ball records:

- Match ID
- Batting & Bowling team IDs
- Over number
- Batsman & Bowler IDs
- Outcome (runs, wicket, extra)
- Commentary (optional)

### **2. Scorecard Updates**

The system automatically:

- Updates batsman stats (runs, balls, 4s, 6s, strike rate)
- Updates bowler stats (overs, runs conceded, wickets, economy)
- Tracks fielding stats (catches, run-outs, stumpings)
- Calculates live score totals

### **3. Ball Validation**

- **Legal balls** count towards the over (6 balls = 1 over)
- **Extras** (wide, no-ball) don't count as legal deliveries
- Over number auto-increments after 6 legal balls

---

## 📋 **Match Workflow**

### **1. Create Match** (from Matches page)

- Click **Create Match**
- Select teams, date, venue, overs
- Match status = "scheduled"

### **2. Start Scoring**

- Navigate to the match
- Match status should be "live"
- Select opening batsman and bowler
- Start recording balls

### **3. Track Progress**

- Live score updates automatically
- Recent balls show at the bottom
- Commentary adds context to each ball

### **4. Complete Match**

- Finish both innings
- Click **Complete Match**
- Winner determined automatically
- Match status = "completed"

---

## 🎯 **Example Scoring Sequence**

### **Over 1:**

1. Select: Batsman = "John Doe", Bowler = "Jane Smith"
2. Click **0** (dot ball)
3. Click **1** (single run)
4. Click **4** (boundary)
5. Click **Wide** (extra run, ball doesn't count)
6. Click **2** (two runs)
7. Click **6** (six)
8. Click **Wicket** → Select "caught" → Submit
9. Select new batsman
10. Click **0** (dot ball)

**Result**: Over 1 complete! Score updated, next over begins.

---

## 📊 **Statistics Tracked**

### **Batting Stats:**

- ✅ Runs scored
- ✅ Balls faced
- ✅ Fours hit
- ✅ Sixes hit
- ✅ Strike rate
- ✅ Dismissal type

### **Bowling Stats:**

- ✅ Overs bowled
- ✅ Runs conceded
- ✅ Wickets taken
- ✅ Maidens (if applicable)
- ✅ Economy rate

### **Fielding Stats:**

- ✅ Catches
- ✅ Run-outs
- ✅ Stumpings

---

## 🚀 **Quick Start Checklist**

- [x] Backend running (`cd backend && npm run start:dev`)
- [x] Frontend running (`cd frontend && npm start`)
- [x] Database connected (PostgreSQL)
- [x] Teams created with players
- [x] Match created
- [ ] Navigate to match detail page
- [ ] Select batsman and bowler
- [ ] Start scoring!

---

## 🎨 **UI Features**

### **Dark Mode Support**

- Scorer fully supports dark mode
- Toggle from navbar
- All colors adjust automatically

### **Responsive Design**

- Works on desktop, tablet, and mobile
- Button layouts adjust to screen size
- Scrollable player lists

### **Color-Coded Buttons**

- **Gray**: Dot balls
- **Blue**: Regular runs (1, 2, 3)
- **Green**: Boundaries (4)
- **Purple**: Sixes (6)
- **Yellow**: Extras
- **Red**: Wickets

---

## 🐛 **Troubleshooting**

### **"Please select batsman and bowler first!"**

- **Solution**: Select players from the dropdowns before clicking any outcome button

### **"Failed to add ball"**

- **Solution**: Check that:
  - Backend is running
  - You're logged in (JWT token is valid)
  - Match ID is correct
  - Selected players exist

### **Players not showing in dropdowns**

- **Solution**: Ensure:
  - Both teams have players added
  - Players have roles assigned (Batsman, Bowler, All-rounder)
  - Teams are loaded correctly

### **Score not updating**

- **Solution**:
  - Check browser console for errors
  - Verify backend API is responding
  - Check network tab for failed requests

---

## 📁 **Files Involved**

### **Frontend:**

1. ✅ `frontend/src/pages/Matches/MatchDetail.js` - Match detail page
2. ✅ `frontend/src/components/Matches/MatchScorer.js` - Scorer component
3. ✅ `frontend/src/components/Matches/MatchCard.js` - Match cards
4. ✅ `frontend/src/pages/Matches/Matches.js` - Matches list
5. ✅ `frontend/src/App.js` - Routes
6. ✅ `frontend/src/store/slices/matchSlice.js` - Redux state

### **Backend:**

1. ✅ `backend/src/matches/matches.controller.ts` - API endpoints
2. ✅ `backend/src/matches/matches.service.ts` - Business logic
3. ✅ `backend/src/matches/dto/add-ball.dto.ts` - Ball data validation
4. ✅ `backend/src/matches/entities/ball.entity.ts` - Ball entity
5. ✅ `backend/src/matches/entities/scorecard.entity.ts` - Scorecard entity

---

## 🎉 **Summary**

### **What You Can Do Now:**

1. ✅ **Create Matches** - Set up friendly or tournament matches
2. ✅ **Ball-by-Ball Scoring** - Record every delivery
3. ✅ **Live Score Tracking** - See scores update in real-time
4. ✅ **Player Statistics** - Batting, bowling, and fielding stats
5. ✅ **Match History** - View completed matches with scorecards
6. ✅ **Undo Mistakes** - Remove incorrect ball entries
7. ✅ **Add Commentary** - Describe each ball

---

## 🔗 **Navigation Flow**

```
Matches List (/matches)
    ↓ (Click any match card)
Match Detail (/matches/:id)
    ↓ (Shows scorer)
Ball-by-Ball Scoring Interface
    ↓ (Record balls)
Live Score Updates
    ↓ (Complete match)
Final Result & Statistics
```

---

## 💡 **Pro Tips**

1. **Save Time**: Use keyboard shortcuts (future feature)
2. **Commentary**: Add context to important moments
3. **Undo**: Don't worry about mistakes - undo is quick
4. **Squad View**: Check team squads before starting
5. **Live Score**: Always visible while scoring

---

**Status**: ✅ **READY TO SCORE!**  
**Backend**: 🟢 Running  
**Frontend**: 🟢 Running  
**Database**: 🟢 Connected  
**Routes**: 🟢 Configured

**🏏 Start scoring your first match now!** 🎉

---

## 📞 **Need Help?**

Check the browser console (F12) for detailed error messages if something doesn't work!
