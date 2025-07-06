'use client';

import { useReducer, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { 
  createInitialGameState, 
  canPlacePiece, 
  placePiece, 
  clearLines, 
  isGameOver,
  getHardDropDistance 
} from '../utils/gameLogic.js';
import { 
  createTetromino, 
  rotateTetromino, 
  getRandomTetrominoType,
  createTetrominoBag 
} from '../utils/tetrominoes.js';
import { 
  calculateLineScore, 
  calculateHardDropScore, 
  calculateSoftDropScore,
  calculateLevel 
} from '../utils/scoring.js';
import { STORAGE_KEYS, GAME_STATES } from '../utils/constants.js';

// Action types for game state reducer
export const GAME_ACTIONS = {
  INITIALIZE: 'INITIALIZE',
  START_GAME: 'START_GAME',
  MOVE_PIECE: 'MOVE_PIECE',
  ROTATE_PIECE: 'ROTATE_PIECE',
  DROP_PIECE: 'DROP_PIECE',
  SOFT_DROP: 'SOFT_DROP',
  HARD_DROP: 'HARD_DROP',
  PLACE_PIECE: 'PLACE_PIECE',
  HOLD_PIECE: 'HOLD_PIECE',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  RESET_GAME: 'RESET_GAME',
  GAME_OVER: 'GAME_OVER',
  UPDATE_SCORE: 'UPDATE_SCORE',
  LOAD_STATE: 'LOAD_STATE',
  SPAWN_PIECE: 'SPAWN_PIECE',
};

// Game state reducer
function gameStateReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.INITIALIZE:
      return createInitialGameState(action.playerName);

    case GAME_ACTIONS.START_GAME:
      const bag = createTetrominoBag();
      const firstPiece = createTetromino(bag[0]);
      const secondPiece = createTetromino(bag[1]);
      
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
        currentPiece: firstPiece,
        nextPiece: secondPiece,
        tetrominoBag: bag.slice(2),
        bagIndex: 2,
        isGameOver: false,
        isPaused: false,
        gameStartTime: Date.now(),
        lastDropTime: Date.now(),
      };

    case GAME_ACTIONS.MOVE_PIECE:
      if (state.isPaused || state.isGameOver || !state.currentPiece) return state;
      
      const newX = state.currentPiece.x + action.deltaX;
      const newY = state.currentPiece.y + action.deltaY;
      
      if (canPlacePiece(state.board, state.currentPiece, newX, newY)) {
        return {
          ...state,
          currentPiece: {
            ...state.currentPiece,
            x: newX,
            y: newY,
          },
        };
      }
      return state;

    case GAME_ACTIONS.ROTATE_PIECE:
      if (state.isPaused || state.isGameOver || !state.currentPiece) return state;
      
      const rotatedPiece = rotateTetromino(state.currentPiece);
      
      if (canPlacePiece(state.board, rotatedPiece)) {
        return {
          ...state,
          currentPiece: rotatedPiece,
        };
      }
      return state;

    case GAME_ACTIONS.SOFT_DROP:
      if (state.isPaused || state.isGameOver || !state.currentPiece) return state;
      
      const newYSoft = state.currentPiece.y + 1;
      
      if (canPlacePiece(state.board, state.currentPiece, state.currentPiece.x, newYSoft)) {
        const softDropPoints = calculateSoftDropScore(1);
        return {
          ...state,
          currentPiece: {
            ...state.currentPiece,
            y: newYSoft,
          },
          score: state.score + softDropPoints,
          lastDropTime: Date.now(),
        };
      }
      
      // Can't drop further, place the piece directly
      const softDropPlacedBoard = placePiece(state.board, state.currentPiece);
      const { newBoard: softDropClearedBoard, linesCleared: softDropLinesCleared } = clearLines(softDropPlacedBoard);
      
      const softDropLineScore = calculateLineScore(softDropLinesCleared, state.level);
      const softDropNewLines = state.lines + softDropLinesCleared;
      const softDropNewLevel = calculateLevel(softDropNewLines);
      const softDropNewScore = state.score + softDropLineScore;
      
      return {
        ...state,
        board: softDropClearedBoard,
        currentPiece: null,
        score: softDropNewScore,
        lines: softDropNewLines,
        level: softDropNewLevel,
        canHold: true, // Reset hold ability
        shouldSpawnNext: true,
      };

    case GAME_ACTIONS.HARD_DROP:
      if (state.isPaused || state.isGameOver || !state.currentPiece) return state;
      
      const dropDistance = getHardDropDistance(state.board, state.currentPiece);
      const hardDropPoints = calculateHardDropScore(dropDistance);
      
      const droppedPiece = {
        ...state.currentPiece,
        y: state.currentPiece.y + dropDistance,
      };
      
      // Place the piece directly without recursive reducer call
      const hardDropPlacedBoard = placePiece(state.board, droppedPiece);
      const { newBoard: hardDropClearedBoard, linesCleared: hardDropLinesCleared } = clearLines(hardDropPlacedBoard);
      
      const hardDropLineScore = calculateLineScore(hardDropLinesCleared, state.level);
      const hardDropNewLines = state.lines + hardDropLinesCleared;
      const hardDropNewLevel = calculateLevel(hardDropNewLines);
      const hardDropNewScore = state.score + hardDropPoints + hardDropLineScore;
      
      return {
        ...state,
        board: hardDropClearedBoard,
        currentPiece: null,
        score: hardDropNewScore,
        lines: hardDropNewLines,
        level: hardDropNewLevel,
        canHold: true, // Reset hold ability
        shouldSpawnNext: true,
      };

    case GAME_ACTIONS.PLACE_PIECE:
      if (!state.currentPiece) return state;
      
      const placePieceBoard = placePiece(state.board, state.currentPiece);
      const { newBoard: placePieceClearedBoard, linesCleared: placePieceLinesCleared } = clearLines(placePieceBoard);
      
      const placePieceLineScore = calculateLineScore(placePieceLinesCleared, state.level);
      const placePieceNewLines = state.lines + placePieceLinesCleared;
      const placePieceNewLevel = calculateLevel(placePieceNewLines);
      const placePieceNewScore = state.score + placePieceLineScore;
      
      return {
        ...state,
        board: placePieceClearedBoard,
        score: placePieceNewScore,
        lines: placePieceNewLines,
        level: placePieceNewLevel,
        currentPiece: null,
        canHold: true, // Reset hold ability
        shouldSpawnNext: true,
      };

    case GAME_ACTIONS.SPAWN_PIECE:
      if (state.isGameOver || !state.nextPiece) return state;
      
      let currentBag = state.tetrominoBag;
      let bagIndex = state.bagIndex;
      
      // If bag is empty, create a new one
      if (bagIndex >= currentBag.length) {
        currentBag = createTetrominoBag();
        bagIndex = 0;
      }
      
      const newCurrentPiece = state.nextPiece;
      const newNextPiece = createTetromino(currentBag[bagIndex]);
      
      // Check for game over
      if (isGameOver(state.board, newCurrentPiece)) {
        return {
          ...state,
          isGameOver: true,
          gameState: GAME_STATES.GAME_OVER,
          gameEndTime: Date.now(),
          // Ensure player name is preserved for leaderboard
          playerName: state.playerName || 'Player',
        };
      }
      
      return {
        ...state,
        currentPiece: newCurrentPiece,
        nextPiece: newNextPiece,
        tetrominoBag: currentBag,
        bagIndex: bagIndex + 1,
        shouldSpawnNext: false,
      };

    case GAME_ACTIONS.HOLD_PIECE:
      if (state.isPaused || state.isGameOver || !state.canHold || !state.currentPiece) return state;
      
      let newHoldPiece = { ...state.currentPiece, x: 3, y: -1, rotation: 0 };
      let newCurrentFromHold;
      
      if (state.holdPiece) {
        // Swap current piece with held piece
        newCurrentFromHold = { ...state.holdPiece, x: 3, y: -1 };
      } else {
        // No held piece, use next piece and trigger spawn
        newCurrentFromHold = state.nextPiece;
        return {
          ...state,
          currentPiece: newCurrentFromHold,
          holdPiece: newHoldPiece,
          canHold: false,
          shouldSpawnNext: true,
        };
      }
      
      return {
        ...state,
        currentPiece: newCurrentFromHold,
        holdPiece: newHoldPiece,
        canHold: false,
      };

    case GAME_ACTIONS.PAUSE_GAME:
      if (state.isGameOver) return state;
      return {
        ...state,
        isPaused: true,
        gameState: GAME_STATES.PAUSED,
      };

    case GAME_ACTIONS.RESUME_GAME:
      if (state.isGameOver) return state;
      return {
        ...state,
        isPaused: false,
        gameState: GAME_STATES.PLAYING,
        lastDropTime: Date.now(), // Reset drop timer
      };

    case GAME_ACTIONS.RESET_GAME:
      // Preserve player name when resetting
      const playerNameToKeep = state.playerName || 'Player';
      return createInitialGameState(playerNameToKeep);

    case GAME_ACTIONS.LOAD_STATE:
      return { ...state, ...action.gameState };

    default:
      console.warn('Unknown game action:', action.type);
      return state;
  }
}

/**
 * Custom hook for managing game state with persistence.
 *
 * @param {string} playerName - Name of the player
 * @returns {Object} Game state and dispatch function
 */
export function useGameState(playerName = 'Player') {
  const [gameState, dispatch] = useReducer(gameStateReducer, null, () => 
    createInitialGameState(playerName)
  );
  
  const [persistedState, setPersistedState] = useLocalStorage(STORAGE_KEYS.GAME_STATE, null);

  // Load persisted state on mount (only once)
  useEffect(() => {
    if (persistedState && persistedState.playerName === playerName && gameState.gameState === GAME_STATES.MENU) {
      dispatch({ type: GAME_ACTIONS.LOAD_STATE, gameState: persistedState });
    }
  }, [persistedState, playerName]); // Don't include gameState in deps to avoid loops

  // Save state to localStorage when significant game events occur
  useEffect(() => {
    // Only save if we're in a playing state to avoid infinite loops
    if (gameState && gameState.gameState === GAME_STATES.PLAYING && !gameState.isPaused) {
      setPersistedState(gameState);
    } else if (gameState && gameState.gameState === GAME_STATES.MENU) {
      // Clear persisted state when returning to menu
      setPersistedState(null);
    }
  }, [
    gameState, // Use the entire gameState object instead of individual properties
    setPersistedState
  ]);

  // Handle piece spawning
  useEffect(() => {
    if (gameState.shouldSpawnNext) {
      dispatch({ type: GAME_ACTIONS.SPAWN_PIECE });
    }
  }, [gameState.shouldSpawnNext]);

  return {
    gameState,
    dispatch,
    // Convenience action creators
    actions: {
      initializeGame: (playerName) => dispatch({ type: GAME_ACTIONS.INITIALIZE, playerName }),
      startGame: () => dispatch({ type: GAME_ACTIONS.START_GAME }),
      movePiece: (deltaX, deltaY) => dispatch({ type: GAME_ACTIONS.MOVE_PIECE, deltaX, deltaY }),
      rotatePiece: () => dispatch({ type: GAME_ACTIONS.ROTATE_PIECE }),
      softDrop: () => dispatch({ type: GAME_ACTIONS.SOFT_DROP }),
      hardDrop: () => dispatch({ type: GAME_ACTIONS.HARD_DROP }),
      holdPiece: () => dispatch({ type: GAME_ACTIONS.HOLD_PIECE }),
      pauseGame: () => dispatch({ type: GAME_ACTIONS.PAUSE_GAME }),
      resumeGame: () => dispatch({ type: GAME_ACTIONS.RESUME_GAME }),
      resetGame: () => dispatch({ type: GAME_ACTIONS.RESET_GAME }),
    },
  };
}