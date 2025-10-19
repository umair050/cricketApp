# 🏏 Advanced Cricket Scoring System - Implementation Roadmap

## ✅ **What's Already Built**

### **Backend (Data Model)** - 95% Complete!

- ✅ Ball entity with `nonStriker` field
- ✅ All wicket types (bowled, caught, lbw, run_out, stumped, hit_wicket, caught_and_bowled, retired_hurt)
- ✅ All ball outcomes (dot, single, double, triple, four, six, wide, no_ball, bye, leg_bye, wicket)
- ✅ `isLegal` flag (for distinguishing extras)
- ✅ `fielder` field (for catches/runouts)
- ✅ `commentary` field
- ✅ Scorecard entity with batting & bowling stats
- ✅ Basic ball recording API

### **Frontend (UI)** - 60% Complete

- ✅ Ball outcome buttons (0-6, extras, wicket)
- ✅ Player selection (batsman, bowler)
- ✅ Live score display
- ✅ Recent balls visualization
- ✅ Wicket modal with dismissal types
- ✅ Commentary input
- ✅ Undo last ball
- ⚠️ **Missing:** Non-striker selection
- ⚠️ **Missing:** Auto striker rotation
- ⚠️ **Missing:** Over completion logic
- ⚠️ **Missing:** Free hit handling
- ⚠️ **Missing:** New batsman selection modal

---

## 🎯 **Implementation Plan - 4 Phases**

---

## **Phase 1: Core Striker/Non-Striker Logic** ⭐ PRIORITY

### **1.1 Add Non-Striker Selection to UI**

**Complexity:** 🟢 Easy (30 min)

**Changes:**

- Add third dropdown in MatchScorer for "Non-Striker"
- Store in state: `currentNonStriker`
- Include in ball submission payload

**File:** `frontend/src/components/Matches/MatchScorer.js`

```javascript
const [currentNonStriker, setCurrentNonStriker] = useState("");

// In ballData:
nonStrikerId: parseInt(currentNonStriker) || null,
```

---

### **1.2 Implement Auto Striker Rotation**

**Complexity:** 🟡 Medium (1 hour)

**Logic:**

```javascript
const handleBallClick = async (outcome) => {
  await submitBall(outcome);

  // Auto-rotate logic
  const runsScored = outcome.runs || 0;
  const isLegal = !["wide", "no_ball"].includes(outcome.id);

  // Rotate on odd runs
  if (runsScored % 2 === 1) {
    swapBatsmen();
  }

  // Rotate at end of over
  if (isLegal && currentBall === 5) {
    // 6th ball
    swapBatsmen();
  }
};

const swapBatsmen = () => {
  const temp = currentBatsman;
  setCurrentBatsman(currentNonStriker);
  setCurrentNonStriker(temp);
};
```

---

### **1.3 Ball Count Logic**

**Complexity:** 🟢 Easy (15 min)

**Update:**

```javascript
// Only increment ball count for legal deliveries
if (isLegal) {
  // Increment ball number
  // After 6 balls → complete over
}
```

---

## **Phase 2: Over Completion & Bowler Management** ⭐⭐

### **2.1 Over Completion Detection**

**Complexity:** 🟡 Medium (45 min)

**Logic:**

```javascript
const checkOverComplete = () => {
  const legalBallsInOver = balls.filter(
    (b) => b.overNumber === currentOver && b.isLegal
  ).length;

  if (legalBallsInOver === 6) {
    handleOverComplete();
  }
};

const handleOverComplete = () => {
  // 1. Swap batsmen
  swapBatsmen();

  // 2. Prompt for new bowler
  setShowBowlerSelectionModal(true);

  // 3. Reset ball count
  // Ball count automatically handled by backend
};
```

---

### **2.2 Bowler Selection Modal**

**Complexity:** 🟡 Medium (1 hour)

**Create:** `BowlerSelectionModal.js`

**Features:**

- List all bowlers from bowling team
- Exclude current bowler (can't bowl consecutive overs)
- Show each bowler's stats (overs bowled, wickets, economy)
- Highlight suggested bowlers

---

### **2.3 Bowler History Tracking**

**Complexity:** 🟢 Easy (30 min)

**State:**

```javascript
const [lastBowler, setLastBowler] = useState(null);
const [bowlerHistory, setBowlerHistory] = useState([]);
```

**Validation:**

```javascript
// Prevent same bowler in consecutive overs
if (selectedBowler === lastBowler) {
  alert("Same bowler cannot bowl consecutive overs!");
  return;
}
```

---

## **Phase 3: Advanced Extras & Free Hits** ⭐⭐⭐

### **3.1 Enhanced Extras Handling**

**Complexity:** 🟡 Medium (1.5 hours)

**Wide/No-Ball with Additional Runs:**

```javascript
const handleExtra = (extraType) => {
  setSelectedExtra(extraType);
  setShowExtraRunsModal(true);
};

// ExtraRunsModal allows:
// - Wide: +1 base, option to add run-out attempts
// - No-Ball: +1 base, option to add runs from bat
```

---

### **3.2 Free Hit Implementation**

**Complexity:** 🟡 Medium (1 hour)

**State:**

```javascript
const [isFreeHit, setIsFreeHit] = useState(false);
```

**Logic:**

```javascript
if (outcome.id === "no_ball") {
  setIsFreeHit(true); // Next ball is free hit
}

// During free hit:
// - Show "FREE HIT" badge
// - Disable bowled, lbw, caught, stumped wicket options
// - Only run-out possible
```

**UI:**

```javascript
{
  isFreeHit && (
    <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
      🔥 FREE HIT 🔥
    </div>
  );
}
```

---

### **3.3 Bye/Leg-Bye Run Selection**

**Complexity:** 🟢 Easy (30 min)

**Modal:**

- When Bye/Leg-Bye clicked → show modal
- Let scorer select: 1, 2, 3, or 4 runs
- Runs go to team extras, not batsman

---

## **Phase 4: Wicket Handling & New Batsman** ⭐⭐⭐⭐

### **4.1 Enhanced Wicket Modal**

**Complexity:** 🟡 Medium (1 hour)

**Add Fields:**

- Who got out? (Striker/Non-Striker selection)
- Fielder selection (for caught/run-out/stumped)
- Optional: Commentary about the dismissal

---

### **4.2 New Batsman Selection Modal**

**Complexity:** 🟡 Medium (1.5 hours)

**Create:** `NewBatsmanModal.js`

**Features:**

- List all batsmen not yet out
- Show their current match stats
- Highlight recommended next batsman (batting order)
- Auto-assign to striker or non-striker position based on who got out

**Logic:**

```javascript
const handleWicketAccepted = (wicketDetails) => {
  // 1. Record wicket
  submitBall(wicketDetails);

  // 2. Check if all out
  if (wickets === 9) {
    // 10th wicket
    handleInningsComplete();
    return;
  }

  // 3. Show new batsman modal
  setWhoGotOut(wicketDetails.striker ? "striker" : "non-striker");
  setShowNewBatsmanModal(true);
};

const handleNewBatsmanSelected = (newBatsman) => {
  if (whoGotOut === "striker") {
    setCurrentBatsman(newBatsman);
  } else {
    setCurrentNonStriker(newBatsman);
  }
};
```

---

### **4.3 Run-Out Handling**

**Complexity:** 🔴 Complex (2 hours)

**Special Modal:**

- Who was running? (Striker/Non-Striker)
- Who ran out? (Could be either end)
- Fielder who threw/ran out

---

## **Phase 5: Real-Time Stats & Analytics** ⭐⭐⭐⭐⭐

### **5.1 Live Match Stats Dashboard**

**Complexity:** 🔴 Complex (3 hours)

**Metrics:**

- Current run rate (CRR)
- Required run rate (RRR) - if chasing
- Projected score
- Partnership runs & balls
- Batsman strike rates
- Bowler economy rates
- Manhattan/Worm chart (runs per over)

---

### **5.2 Partnership Tracking**

**Complexity:** 🟡 Medium (1 hour)

**State:**

```javascript
const [currentPartnership, setCurrentPartnership] = useState({
  batsman1: null,
  batsman2: null,
  runs: 0,
  balls: 0,
  startedAt: null,
});
```

**Update:** After each ball, increment partnership stats

---

### **5.3 Commentary Generator**

**Complexity:** 🟡 Medium (2 hours)

**Auto-generate commentary based on ball outcome:**

```javascript
const generateCommentary = (ball) => {
  const templates = {
    four: [
      `${batsman} finds the gap and drives through cover for FOUR!`,
      `Beautiful shot! ${batsman} times it perfectly for a boundary!`,
      `${batsman} pierces the field with a cracking FOUR!`,
    ],
    six: [
      `That's HUGE! ${batsman} launches it over the boundary!`,
      `Maximum! ${batsman} connects beautifully for SIX!`,
      `${batsman} goes downtown! What a shot, SIX runs!`,
    ],
    wicket: {
      bowled: `Timber! ${bowler} shatters the stumps!`,
      caught: `${fielder} takes a brilliant catch! ${batsman} has to go.`,
      lbw: `That's plumb! ${batsman} is trapped in front.`,
    },
  };

  return selectRandomTemplate(templates, ball);
};
```

---

## **Phase 6: Advanced Features** 🚀

### **6.1 Innings Management**

**Complexity:** 🔴 Complex (4 hours)

- Complete first innings
- Switch batting/bowling teams
- Start second innings
- Show target if chasing

---

### **6.2 Match Completion**

**Complexity:** 🟡 Medium (2 hours)

**Triggers:**

- All out
- Overs completed
- Target achieved (in 2nd innings)
- Match tied/super over

**Result Calculation:**

- Winner determination
- Margin (runs/wickets)
- Player of the match
- Final scorecard

---

### **6.3 Undo/Edit Ball**

**Already implemented!** ✅

**Enhancement:**

- Allow editing any ball (not just last)
- Show ball-by-ball history
- Click any ball to edit

---

### **6.4 Offline Mode**

**Complexity:** 🔴 Complex (6 hours)

- Use IndexedDB/LocalStorage
- Queue API calls when offline
- Sync when online
- Conflict resolution

---

### **6.5 Multi-Device Scoring**

**Complexity:** 🔴 Very Complex (10+ hours)

- WebSocket real-time sync
- Multiple scorers can collaborate
- Live updates to viewers
- Conflict resolution

---

## 📊 **Estimated Timeline**

| Phase       | Features                    | Time          | Priority                |
| ----------- | --------------------------- | ------------- | ----------------------- |
| **Phase 1** | Striker/Non-Striker Logic   | **3 hours**   | ⭐ Critical             |
| **Phase 2** | Over Completion & Bowler    | **3 hours**   | ⭐⭐ High               |
| **Phase 3** | Advanced Extras & Free Hits | **4 hours**   | ⭐⭐⭐ Medium           |
| **Phase 4** | Wicket & New Batsman        | **5 hours**   | ⭐⭐⭐⭐ High           |
| **Phase 5** | Stats & Analytics           | **6 hours**   | ⭐⭐⭐⭐⭐ Nice-to-have |
| **Phase 6** | Advanced Features           | **20+ hours** | 🚀 Future               |

**Total Core Features (Phase 1-4):** ~15 hours  
**With Analytics (Phase 1-5):** ~21 hours  
**Complete System (All Phases):** ~40+ hours

---

## 🎯 **Recommended Approach**

### **Week 1: Core Logic (Phase 1-2)**

✅ Non-striker selection  
✅ Auto striker rotation  
✅ Over completion  
✅ Bowler management

**Outcome:** Basic match can be scored properly

---

### **Week 2: Extras & Wickets (Phase 3-4)**

✅ Free hits  
✅ Enhanced extras  
✅ Wicket handling  
✅ New batsman selection

**Outcome:** Complete ball-by-ball scoring

---

### **Week 3: Polish & Stats (Phase 5)**

✅ Live dashboard  
✅ Partnerships  
✅ Commentary

**Outcome:** Professional scoring system

---

### **Future: Advanced Features (Phase 6)**

✅ Innings switching  
✅ Match completion  
✅ Offline mode  
✅ Multi-device support

**Outcome:** Production-ready system

---

## 📝 **Backend Changes Needed**

Most features just need **frontend changes**! Backend is ready.

**Minor backend additions:**

1. ✅ Add `freeHit` boolean field to Ball entity
2. ✅ Add `partnership_id` field to track partnerships
3. ✅ Add `innings_id` field to group balls by innings
4. ✅ API endpoint for suggesting next batsman
5. ✅ API endpoint for match completion

---

## 🎨 **UI/UX Enhancements**

1. **Compact Mode:** For faster scoring
2. **Shortcuts:** Keyboard shortcuts (0-6, W for wicket, etc.)
3. **Visual Feedback:** Animations for boundaries, wickets
4. **Sound Effects:** Optional sounds for 4s, 6s, wickets
5. **Dark Mode:** Already have this! ✅
6. **Mobile Optimized:** Touch-friendly buttons

---

## 🧪 **Testing Checklist**

- [ ] Striker rotation on odd runs
- [ ] Striker rotation at over end
- [ ] No rotation on even runs
- [ ] Bowler selection after over
- [ ] Cannot select same bowler consecutively
- [ ] Free hit after no-ball
- [ ] Wicket handling with new batsman
- [ ] Extras (wide, no-ball, bye, leg-bye)
- [ ] Run-out from either end
- [ ] Partnership tracking
- [ ] Stats calculations
- [ ] Undo last ball
- [ ] Match completion scenarios

---

## 🎊 **Summary**

### **Current Status:**

- ✅ **Backend:** 95% ready!
- ⚠️ **Frontend:** 60% ready (basic scoring works)

### **To Build Complete System:**

- 🟢 **Phase 1-2 (Core):** 6 hours → **Minimum viable**
- 🟡 **Phase 3-4 (Advanced):** 9 hours → **Full-featured**
- 🔵 **Phase 5 (Polish):** 6 hours → **Professional**
- 🟣 **Phase 6 (Future):** 20+ hours → **Production-grade**

### **Next Immediate Steps:**

1. Fix NaN bug (restart backend)
2. Implement Phase 1 (Non-striker + Rotation)
3. Implement Phase 2 (Over completion)
4. Test thoroughly
5. Move to Phase 3-4

---

**Ready to start? Which phase would you like to tackle first?** 🏏

