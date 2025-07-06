'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameState, GAME_ACTIONS } from './useGameState.js';
import { 
  INITIAL_DROP_SPEED, 
  SPEED_INCREASE_PER_LEVEL, 
  MIN_DROP_SPEED, 
  GAME_STATES 
} from '../utils/constants.js';

/**
 * Calculate drop speed based on current level.
 * 
 * @param {number} level - Current game level
 * @returns {number} Drop speed in milliseconds
 */
function calculateDropSpeed(level) {
  const speed = INITIAL_DROP_SPEED - (level * SPEED_INCREASE_PER_LEVEL);
  return Math.max(speed, MIN_DROP_SPEED);
}

/**
 * Main game hook that manages the game loop, timing, and automatic piece dropping.
 * 
 * @param {string} playerName - Name of the player
 * @returns {Object} Game state and control functions
 */
export function useGame(playerName = 'Player') {
  const { gameState, dispatch, actions } = useGameState(playerName);
  
  // Refs for game loop management
  const gameLoopRef = useRef(null);
  const lastUpdateTime = useRef(0);
  const dropTimer = useRef(0);
  const isActiveRef = useRef(true);

  // Calculate current drop speed based on level
  const dropSpeed = calculateDropSpeed(gameState.level);

  // Game loop function
  const gameLoop = useCallback((timestamp) => {
    if (!isActiveRef.current) return;

    const deltaTime = timestamp - lastUpdateTime.current;
    lastUpdateTime.current = timestamp;

    // Only process game logic if game is actively playing
    if (gameState.gameState === GAME_STATES.PLAYING && 
        !gameState.isPaused && 
        !gameState.isGameOver) {
      
      // Update drop timer
      dropTimer.current += deltaTime;
      
      // Check if it's time to drop the piece
      if (dropTimer.current >= dropSpeed) {
        // Try to drop the piece naturally
        dispatch({ type: GAME_ACTIONS.SOFT_DROP });
        dropTimer.current = 0;
      }
    }

    // Continue the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameState, gameState.isPaused, gameState.isGameOver, dropSpeed, dispatch]);

  // Start the game loop
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    isActiveRef.current = true;
    lastUpdateTime.current = performance.now();
    dropTimer.current = 0;
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Stop the game loop
  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    isActiveRef.current = false;
  }, []);

  // Pause/Resume game loop
  const pauseGameLoop = useCallback(() => {
    isActiveRef.current = false;
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  const resumeGameLoop = useCallback(() => {
    if (gameState.gameState === GAME_STATES.PLAYING && !gameState.isPaused) {
      startGameLoop();
    }
  }, [gameState.gameState, gameState.isPaused, startGameLoop]);

  // Handle game state changes
  useEffect(() => {
    switch (gameState.gameState) {
      case GAME_STATES.PLAYING:
        if (!gameState.isPaused) {
          startGameLoop();
        } else {
          pauseGameLoop();
        }
        break;
      case GAME_STATES.PAUSED:
        pauseGameLoop();
        break;
      case GAME_STATES.GAME_OVER:
      case GAME_STATES.MENU:
        stopGameLoop();
        break;
      default:
        break;
    }
  }, [gameState.gameState, gameState.isPaused, startGameLoop, pauseGameLoop, stopGameLoop]);

  // Clean up game loop on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Enhanced action creators with game loop awareness
  const enhancedActions = {
    ...actions,
    
    // Start game and game loop
    startGame: useCallback(() => {
      actions.startGame();
      // Game loop will start automatically via useEffect
    }, [actions]),
    
    // Pause game and loop
    pauseGame: useCallback(() => {
      actions.pauseGame();
      // Game loop will pause automatically via useEffect
    }, [actions]),
    
    // Resume game and loop
    resumeGame: useCallback(() => {
      actions.resumeGame();
      // Game loop will resume automatically via useEffect
    }, [actions]),
    
    // Reset game and stop loop
    resetGame: useCallback(() => {
      actions.resetGame();
      // Game loop will stop automatically via useEffect
    }, [actions]),
    
    // Manual drop with timer reset
    softDrop: useCallback(() => {
      actions.softDrop();
      dropTimer.current = 0; // Reset drop timer
    }, [actions]),
    
    // Hard drop with timer reset
    hardDrop: useCallback(() => {
      actions.hardDrop();
      dropTimer.current = 0; // Reset drop timer
    }, [actions]),
  };

  return {
    // Game state
    gameState,
    
    // Actions
    actions: enhancedActions,
    
    // Game loop controls
    gameLoop: {
      start: startGameLoop,
      stop: stopGameLoop,
      pause: pauseGameLoop,
      resume: resumeGameLoop,
      isActive: isActiveRef.current,
    },
    
    // Game timing info
    timing: {
      dropSpeed,
      nextDropIn: Math.max(0, dropSpeed - dropTimer.current),
    },
  };
}