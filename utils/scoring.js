import { POINTS, LINES_PER_LEVEL } from './constants.js';

/**
 * Calculates points for clearing lines.
 *
 * @param {number} linesCleared - Number of lines cleared (1-4)
 * @param {number} level - Current level
 * @returns {number} Points awarded
 */
export function calculateLineScore(linesCleared, level) {
  if (linesCleared === 0) return 0;

  let basePoints;
  
  switch (linesCleared) {
    case 1:
      basePoints = POINTS.SINGLE_LINE;
      break;
    case 2:
      basePoints = POINTS.DOUBLE_LINE;
      break;
    case 3:
      basePoints = POINTS.TRIPLE_LINE;
      break;
    case 4:
      basePoints = POINTS.TETRIS;
      break;
    default:
      // Should not happen in standard Tetris, but handle gracefully
      basePoints = POINTS.SINGLE_LINE * linesCleared;
  }

  // Score increases with level
  return basePoints * level;
}

/**
 * Calculates points for soft drop (pressing down arrow).
 *
 * @param {number} cells - Number of cells dropped
 * @returns {number} Points awarded
 */
export function calculateSoftDropScore(cells) {
  return cells * POINTS.SOFT_DROP;
}

/**
 * Calculates points for hard drop (space bar).
 *
 * @param {number} cells - Number of cells dropped
 * @returns {number} Points awarded
 */
export function calculateHardDropScore(cells) {
  return cells * POINTS.HARD_DROP;
}

/**
 * Calculates the current level based on lines cleared.
 *
 * @param {number} totalLines - Total lines cleared
 * @returns {number} Current level (1-based)
 */
export function calculateLevel(totalLines) {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
}

/**
 * Calculates how many lines are needed to reach the next level.
 *
 * @param {number} totalLines - Total lines cleared
 * @returns {number} Lines needed for next level
 */
export function getLinesUntilNextLevel(totalLines) {
  const currentLevel = calculateLevel(totalLines);
  const linesForNextLevel = currentLevel * LINES_PER_LEVEL;
  return linesForNextLevel - totalLines;
}

/**
 * Calculates the drop speed based on the current level.
 *
 * @param {number} level - Current level
 * @returns {number} Drop interval in milliseconds
 */
export function calculateDropSpeed(level) {
  // Formula: start at 1000ms, decrease by 50ms per level, minimum 50ms
  const baseSpeed = 1000;
  const speedDecrease = 50;
  const minSpeed = 50;
  
  return Math.max(minSpeed, baseSpeed - (level - 1) * speedDecrease);
}

/**
 * Formats a score with thousands separators.
 *
 * @param {number} score - Score to format
 * @returns {string} Formatted score string
 */
export function formatScore(score) {
  return score.toLocaleString();
}

/**
 * Calculates statistics for the end of game.
 *
 * @param {Object} gameState - Current game state
 * @returns {Object} Game statistics
 */
export function calculateGameStats(gameState) {
  // Provide fallback values for missing timestamps
  const startTime = gameState.gameStartTime || Date.now();
  const endTime = gameState.gameEndTime || Date.now();
  
  const duration = endTime - startTime;
  const safeDuration = Math.max(0, duration); // Ensure non-negative

  const minutes = Math.floor(safeDuration / 60000);
  const seconds = Math.floor((safeDuration % 60000) / 1000);

  return {
    score: gameState.score || 0,
    lines: gameState.lines || 0,
    level: gameState.level || 1,
    duration: {
      total: safeDuration,
      formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    },
    linesPerMinute: minutes > 0 ? Math.round((gameState.lines || 0) / minutes) : 0,
    pointsPerLine: (gameState.lines || 0) > 0 ? Math.round((gameState.score || 0) / (gameState.lines || 1)) : 0,
  };
}

/**
 * Determines if a score qualifies for the leaderboard.
 *
 * @param {number} score - Score to check
 * @param {Array} leaderboard - Current leaderboard entries
 * @param {number} maxEntries - Maximum entries in leaderboard (default: 5)
 * @returns {boolean} True if score qualifies
 */
export function qualifiesForLeaderboard(score, leaderboard, maxEntries = 5) {
  // If leaderboard isn't full, any score qualifies
  if (leaderboard.length < maxEntries) {
    return true;
  }
  
  // If leaderboard is full, score must be higher than the lowest score
  const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
  return score > lowestScore;
}

/**
 * Calculates bonus points for special achievements.
 *
 * @param {Object} achievement - Achievement data
 * @returns {number} Bonus points
 */
export function calculateBonusPoints(achievement) {
  switch (achievement.type) {
    case 'back_to_back_tetris':
      return 1200; // Full Tetris bonus
    case 'perfect_clear':
      return 3000; // Clearing entire board
    case 'first_tetris':
      return 500;  // First Tetris of the game
    case 'level_milestone':
      return achievement.level * 100; // 100 points per level reached
    default:
      return 0;
  }
}

/**
 * Tracks and calculates combo points.
 *
 * @param {number} comboCount - Current combo count
 * @param {number} level - Current level
 * @returns {number} Combo bonus points
 */
export function calculateComboPoints(comboCount, level) {
  if (comboCount <= 0) return 0;
  
  // Combo points: 50 * combo count * level
  return 50 * comboCount * level;
}

/**
 * Creates a leaderboard entry.
 *
 * @param {Object} gameState - Final game state
 * @returns {Object} Leaderboard entry
 */
export function createLeaderboardEntry(gameState) {
  const stats = calculateGameStats(gameState);
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
    playerName: gameState.playerName,
    score: gameState.score,
    lines: gameState.lines,
    level: gameState.level,
    duration: stats.duration.total,
    durationFormatted: stats.duration.formatted,
    linesPerMinute: stats.linesPerMinute,
    date: new Date().toISOString(),
    dateFormatted: new Date().toLocaleDateString(),
  };
}

/**
 * Updates and sorts a leaderboard with a new entry.
 *
 * @param {Array} leaderboard - Current leaderboard
 * @param {Object} newEntry - New entry to add
 * @param {number} maxEntries - Maximum entries to keep (default: 10)
 * @returns {Array} Updated leaderboard
 */
export function updateLeaderboard(leaderboard, newEntry, maxEntries = 10) {
  const updatedBoard = [...leaderboard, newEntry];
  
  // Sort by score (highest first), then by lines, then by level
  updatedBoard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.lines !== a.lines) return b.lines - a.lines;
    return b.level - a.level;
  });
  
  // Keep only the top entries
  return updatedBoard.slice(0, maxEntries);
}