// Utility to persist match scorer state across remounts
const STORAGE_KEY_PREFIX = "match_scorer_";

export const saveScorerState = (matchId, state) => {
  if (!matchId) return;

  const key = `${STORAGE_KEY_PREFIX}${matchId}`;
  const data = {
    currentBatsman: state.currentBatsman,
    currentNonStriker: state.currentNonStriker,
    currentBowler: state.currentBowler,
    lastBowler: state.lastBowler,
    isFreeHit: state.isFreeHit,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save scorer state:", error);
  }
};

export const loadScorerState = (matchId) => {
  if (!matchId) return null;

  const key = `${STORAGE_KEY_PREFIX}${matchId}`;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const data = JSON.parse(stored);

    // Check if data is recent (within 24 hours)
    const ageInHours = (Date.now() - data.timestamp) / (1000 * 60 * 60);
    if (ageInHours > 24) {
      // Clear old data
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to load scorer state:", error);
    return null;
  }
};

export const clearScorerState = (matchId) => {
  if (!matchId) return;

  const key = `${STORAGE_KEY_PREFIX}${matchId}`;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear scorer state:", error);
  }
};

