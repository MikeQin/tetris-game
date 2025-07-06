'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { 
  createLeaderboardEntry, 
  updateLeaderboard,
  qualifiesForLeaderboard 
} from '../utils/scoring.js';
import { STORAGE_KEYS } from '../utils/constants.js';

/**
 * Custom hook for managing the game leaderboard.
 *
 * @param {number} maxEntries - Maximum number of entries to keep (default: 5)
 * @returns {Object} Leaderboard state and management functions
 */
export function useLeaderboard(maxEntries = 5) {
  const [leaderboard, setLeaderboard, isHydrated] = useLocalStorage(STORAGE_KEYS.LEADERBOARD, []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure leaderboard is properly loaded after hydration
    if (isHydrated) {
      setIsLoading(false);
    }
  }, [isHydrated]);

  /**
   * Adds a new score to the leaderboard.
   *
   * @param {Object} gameState - Final game state
   * @returns {Object} Result with success status and entry details
   */
  const addScore = useCallback((gameState) => {
    try {
      if (!gameState || typeof gameState.score !== 'number') {
        throw new Error('Invalid game state provided');
      }
      
      // Validate and fallback for player name
      let playerName = gameState.playerName;
      if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
        playerName = 'Anonymous';
      }

      const newEntry = createLeaderboardEntry({
        ...gameState,
        playerName: playerName
      });
      const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
      
      // Check if score qualifies for leaderboard
      if (!qualifiesForLeaderboard(newEntry.score, currentLeaderboard, maxEntries)) {
        return {
          success: false,
          message: 'Score does not qualify for leaderboard',
          entry: newEntry,
          rank: null,
        };
      }

      const updatedLeaderboard = updateLeaderboard(currentLeaderboard, newEntry, maxEntries);
      setLeaderboard(updatedLeaderboard);

      // Find the rank of the new entry
      const rank = updatedLeaderboard.findIndex(entry => entry.id === newEntry.id) + 1;

      return {
        success: true,
        message: `New high score! Rank #${rank}`,
        entry: newEntry,
        rank,
        isNewRecord: rank === 1,
      };
    } catch (error) {
      console.error('Error adding score to leaderboard:', error);
      return {
        success: false,
        message: 'Failed to add score to leaderboard',
        error: error.message,
        entry: null,
        rank: null,
      };
    }
  }, [leaderboard, setLeaderboard, maxEntries]);

  /**
   * Removes a score from the leaderboard by ID.
   *
   * @param {string} entryId - ID of the entry to remove
   * @returns {boolean} True if successfully removed
   */
  const removeScore = useCallback((entryId) => {
    try {
      const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
      const updatedLeaderboard = currentLeaderboard.filter(entry => entry.id !== entryId);
      setLeaderboard(updatedLeaderboard);
      return true;
    } catch (error) {
      console.error('Error removing score from leaderboard:', error);
      return false;
    }
  }, [leaderboard, setLeaderboard]);

  /**
   * Clears the entire leaderboard.
   *
   * @returns {boolean} True if successfully cleared
   */
  const clearLeaderboard = useCallback(() => {
    try {
      setLeaderboard([]);
      return true;
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      return false;
    }
  }, [setLeaderboard]);

  /**
   * Gets the top N scores from the leaderboard.
   *
   * @param {number} count - Number of top scores to retrieve
   * @returns {Array} Array of top scores
   */
  const getTopScores = useCallback((count = 5) => {
    const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
    return currentLeaderboard.slice(0, count);
  }, [leaderboard]);

  /**
   * Gets the rank of a specific score.
   *
   * @param {number} score - Score to check rank for
   * @returns {number} Rank of the score (1-based), or null if not on leaderboard
   */
  const getScoreRank = useCallback((score) => {
    const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
    const sortedScores = [...currentLeaderboard].sort((a, b) => b.score - a.score);
    const rank = sortedScores.findIndex(entry => entry.score <= score) + 1;
    return rank > maxEntries ? null : rank;
  }, [leaderboard, maxEntries]);

  /**
   * Checks if a score would qualify for the leaderboard.
   *
   * @param {number} score - Score to check
   * @returns {boolean} True if score qualifies
   */
  const wouldQualify = useCallback((score) => {
    const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
    return qualifiesForLeaderboard(score, currentLeaderboard, maxEntries);
  }, [leaderboard, maxEntries]);

  /**
   * Gets statistics about the leaderboard.
   *
   * @returns {Object} Leaderboard statistics
   */
  const getLeaderboardStats = useCallback(() => {
    const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
    
    if (currentLeaderboard.length === 0) {
      return {
        totalEntries: 0,
        highestScore: 0,
        lowestScore: 0,
        averageScore: 0,
        totalGamesPlayed: 0,
      };
    }

    const scores = currentLeaderboard
      .filter(entry => entry && typeof entry.score === 'number' && !isNaN(entry.score))
      .map(entry => entry.score);
    
    if (scores.length === 0) {
      return {
        totalEntries: 0,
        highestScore: 0,
        lowestScore: 0,
        averageScore: 0,
        totalGamesPlayed: 0,
      };
    }
    
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    
    return {
      totalEntries: scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      averageScore: Math.round(totalScore / scores.length),
      totalGamesPlayed: scores.length,
      lastGameDate: currentLeaderboard.find(entry => entry && entry.date)?.date,
    };
  }, [leaderboard]);

  /**
   * Finds entries by player name.
   *
   * @param {string} playerName - Name to search for
   * @returns {Array} Array of entries for the player
   */
  const getPlayerScores = useCallback((playerName) => {
    const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
    if (!playerName || typeof playerName !== 'string') return [];
    
    return currentLeaderboard.filter(entry => 
      entry && 
      entry.playerName && 
      typeof entry.playerName === 'string' &&
      entry.playerName.toLowerCase() === playerName.toLowerCase()
    );
  }, [leaderboard]);

  /**
   * Gets the player's best score.
   *
   * @param {string} playerName - Name of the player
   * @returns {Object|null} Best score entry or null
   */
  const getPlayerBest = useCallback((playerName) => {
    const playerScores = getPlayerScores(playerName);
    return playerScores.length > 0 ? playerScores[0] : null;
  }, [getPlayerScores]);

  /**
   * Validates and repairs leaderboard data.
   *
   * @returns {boolean} True if repairs were made
   */
  const validateAndRepair = useCallback(() => {
    try {
      const currentLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
      
      // Filter out invalid entries
      const validEntries = currentLeaderboard.filter(entry => 
        entry &&
        typeof entry.id === 'string' &&
        typeof entry.playerName === 'string' &&
        typeof entry.score === 'number' &&
        entry.score >= 0
      );

      // Sort and limit entries
      const repairedLeaderboard = updateLeaderboard([], validEntries, maxEntries);
      
      if (repairedLeaderboard.length !== currentLeaderboard.length) {
        setLeaderboard(repairedLeaderboard);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error validating leaderboard:', error);
      setLeaderboard([]);
      return true;
    }
  }, [leaderboard, setLeaderboard, maxEntries]);

  // Skip validation for now to avoid infinite loops
  // useEffect(() => {
  //   validateAndRepair();
  // }, []);

  return {
    leaderboard: Array.isArray(leaderboard) ? leaderboard : [],
    isLoading,
    addScore,
    removeScore,
    clearLeaderboard,
    getTopScores,
    getScoreRank,
    wouldQualify,
    getLeaderboardStats,
    getPlayerScores,
    getPlayerBest,
    validateAndRepair,
  };
}

/**
 * Hook for managing player name persistence.
 *
 * @returns {Object} Player name state and setter
 */
export function usePlayerName() {
  const [playerName, setPlayerName, isHydrated] = useLocalStorage(STORAGE_KEYS.PLAYER_NAME, '');

  const updatePlayerName = useCallback((name) => {
    if (typeof name === 'string' && name.trim().length > 0) {
      setPlayerName(name.trim());
      return true;
    }
    return false;
  }, [setPlayerName]);

  return {
    playerName,
    setPlayerName: updatePlayerName,
    hasPlayerName: isHydrated && Boolean(playerName && playerName.trim()),
    isHydrated,
  };
}