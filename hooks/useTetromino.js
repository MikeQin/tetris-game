'use client';

import { useEffect, useCallback, useRef } from 'react';
import { CONTROLS } from '../utils/constants.js';

/**
 * Hook for managing tetromino piece controls, keyboard input, and mobile touch gestures.
 * 
 * @param {Object} actions - Game actions from useGame hook
 * @param {Object} gameState - Current game state
 * @returns {Object} Tetromino control functions and state
 */
export function useTetromino(actions, gameState) {
  const keyPressedRef = useRef(new Set());
  const moveIntervalRef = useRef(null);
  const dropIntervalRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // Handle keyboard input
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase();
    
    // Prevent default browser behavior for game keys
    if (Object.values(CONTROLS).includes(event.key) || 
        Object.values(CONTROLS).includes(key)) {
      event.preventDefault();
    }
    
    // Skip if key is already pressed (for autorepeat)
    if (keyPressedRef.current.has(key)) {
      return;
    }
    
    keyPressedRef.current.add(key);
    
    // Handle single-press actions
    switch (key) {
      case CONTROLS.UP.toLowerCase():
        actions.rotatePiece();
        break;
      case CONTROLS.SPACE.toLowerCase():
        actions.hardDrop();
        break;
      case CONTROLS.HOLD.toLowerCase():
        actions.holdPiece();
        break;
      case CONTROLS.PAUSE.toLowerCase():
        if (gameState.isPaused) {
          actions.resumeGame();
        } else {
          actions.pauseGame();
        }
        break;
      case CONTROLS.RESTART.toLowerCase():
        if (confirm('Are you sure you want to restart the game?')) {
          actions.resetGame();
        }
        break;
    }
    
    // Handle repeating actions (movement)
    if (key === CONTROLS.LEFT.toLowerCase()) {
      actions.movePiece(-1, 0);
      // Start auto-repeat after initial delay
      moveIntervalRef.current = setInterval(() => {
        actions.movePiece(-1, 0);
      }, 100);
    } else if (key === CONTROLS.RIGHT.toLowerCase()) {
      actions.movePiece(1, 0);
      // Start auto-repeat after initial delay
      moveIntervalRef.current = setInterval(() => {
        actions.movePiece(1, 0);
      }, 100);
    } else if (key === CONTROLS.DOWN.toLowerCase()) {
      actions.softDrop();
      // Start auto-repeat for soft drop
      dropIntervalRef.current = setInterval(() => {
        actions.softDrop();
      }, 50);
    }
  }, [actions, gameState.isPaused]);

  const handleKeyUp = useCallback((event) => {
    const key = event.key.toLowerCase();
    keyPressedRef.current.delete(key);
    
    // Stop auto-repeat for movement keys
    if (key === CONTROLS.LEFT.toLowerCase() || 
        key === CONTROLS.RIGHT.toLowerCase()) {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    }
    
    // Stop auto-repeat for soft drop
    if (key === CONTROLS.DOWN.toLowerCase()) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
    }
  }, []);

  // Touch gesture handlers for mobile
  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
  }, []);

  const handleTouchMove = useCallback((event) => {
    event.preventDefault(); // Prevent scrolling
  }, []);

  const handleTouchEnd = useCallback((event) => {
    if (!touchStartRef.current) return;
    
    const touch = event.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    
    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.timestamp - touchStartRef.current.timestamp;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Swipe thresholds
    const minSwipeDistance = 50;
    const maxSwipeTime = 500;
    
    if (deltaTime < maxSwipeTime) {
      // Horizontal swipe
      if (absX > minSwipeDistance && absX > absY) {
        if (deltaX > 0) {
          actions.movePiece(1, 0); // Right
        } else {
          actions.movePiece(-1, 0); // Left
        }
      }
      // Vertical swipe
      else if (absY > minSwipeDistance && absY > absX) {
        if (deltaY > 0) {
          actions.softDrop(); // Down
        } else {
          actions.rotatePiece(); // Up
        }
      }
      // Tap (short distance, quick time)
      else if (absX < 20 && absY < 20 && deltaTime < 200) {
        actions.rotatePiece();
      }
    }
    
    // Long press for hard drop
    if (deltaTime > 600 && absX < 20 && absY < 20) {
      actions.hardDrop();
    }
    
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [actions]);

  // Set up keyboard event listeners
  useEffect(() => {
    // Only attach keyboard listeners if game is active
    if (gameState.gameState === 'playing' || gameState.gameState === 'paused') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [handleKeyDown, handleKeyUp, gameState.gameState]);

  // Set up touch event listeners for mobile
  useEffect(() => {
    if (gameState.gameState === 'playing') {
      // Add touch listeners to the document to capture gestures anywhere
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, gameState.gameState]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, []);

  // Mobile control functions for touch buttons
  const mobileControls = {
    moveLeft: () => actions.movePiece(-1, 0),
    moveRight: () => actions.movePiece(1, 0),
    rotate: () => actions.rotatePiece(),
    softDrop: () => actions.softDrop(),
    hardDrop: () => actions.hardDrop(),
    hold: () => actions.holdPiece(),
    pause: () => {
      if (gameState.isPaused) {
        actions.resumeGame();
      } else {
        actions.pauseGame();
      }
    },
  };

  return {
    // Mobile control functions
    mobileControls,
    
    // Current input state
    inputState: {
      pressedKeys: Array.from(keyPressedRef.current),
      isMoving: moveIntervalRef.current !== null,
      isDropping: dropIntervalRef.current !== null,
    },
    
    // Control configuration
    controls: CONTROLS,
  };
}