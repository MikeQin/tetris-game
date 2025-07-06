'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../../components/Navigation.js';
import { GameBoard } from '../../components/GameBoard.js';
import { GameStats } from '../../components/GameStats.js';
import { GameControls } from '../../components/GameControls.js';
import { HoldPiece } from '../../components/HoldPiece.js';
import { NextPiece } from '../../components/NextPiece.js';
import { PlayerNameInput } from '../../components/PlayerNameInput.js';
import { useAlert } from '../../components/AlertModal.js';
import { useGame } from '../../hooks/useGame.js';
import { useTetromino } from '../../hooks/useTetromino.js';
import { usePlayerName, useLeaderboard } from '../../hooks/useLeaderboard.js';

export default function GamePage() {
  const router = useRouter();
  const { playerName, setPlayerName, hasPlayerName, isHydrated } = usePlayerName();
  const { gameState, actions } = useGame(playerName);
  const { mobileControls } = useTetromino(actions, gameState);
  const leaderboardHook = useLeaderboard();
  const { addScore } = leaderboardHook;
  const { showAlert, hideAlert, alert, AlertModal } = useAlert();
  const [navigationTimer, setNavigationTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // Handle navigation to leaderboard 
  const navigateToLeaderboard = useCallback(() => {
    if (navigationTimer) {
      clearTimeout(navigationTimer);
      setNavigationTimer(null);
    }
    setCountdown(0);
    hideAlert();
    router.push('/leaderboard');
  }, [navigationTimer, hideAlert, router]);

  // Start countdown when alert is shown
  useEffect(() => {
    if (alert.isOpen && alert.title === 'Score Not Qualified') {
      setCountdown(10);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else {
      setCountdown(0);
    }
  }, [alert.isOpen, alert.title]);
  
  // Debug the hook state only once on mount
  useEffect(() => {
    console.log('🔍 Leaderboard hook initialized');
  }, []);
  const [showNameInput, setShowNameInput] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show name input if no player name (only after hydration)
  useEffect(() => {
    if (isHydrated && !hasPlayerName) {
      setShowNameInput(true);
    }
  }, [hasPlayerName, isHydrated]);

  // Handle game over - TEMPORARILY DISABLED TO STOP INFINITE LOOPS
  // useEffect(() => {
  //   if (gameState.isGameOver && gameState.score > 0) {
  //     // Check if we have a valid player name
  //     if (!hasPlayerName || !playerName || playerName.trim() === '') {
  //       // No valid player name - show the name input
  //       setShowNameInput(true);
  //       return;
  //     }
      
  //     // We have a valid player name, proceed with score submission
  //     const gameStateWithPlayer = {
  //       ...gameState,
  //       playerName: playerName.trim()
  //     };
      
  //     const result = addScore(gameStateWithPlayer);
  //     if (result.success) {
  //       console.log('Score added to leaderboard:', result.message);
  //     } else {
  //       console.warn('Score did not qualify for leaderboard. Score:', gameState.score);
  //     }
  //   }
  // }, [gameState.isGameOver, gameState.score, hasPlayerName, playerName, addScore]);

  const handlePlayerNameSubmit = (name) => {
    setPlayerName(name);
    setShowNameInput(false);
    
    // If there's a pending game over with a score, submit it now
    if (gameState.isGameOver && gameState.score > 0) {
      const gameStateWithPlayer = {
        ...gameState,
        playerName: name.trim()
      };
      
      const result = addScore(gameStateWithPlayer);
      if (result.success) {
        console.log('Score added to leaderboard:', result.message);
        // Navigate to leaderboard page
        router.push('/leaderboard');
      } else {
        console.warn('Score did not qualify for leaderboard. Score:', gameState.score);
        // Show message then go to leaderboard after a delay
        showAlert({
          type: 'warning',
          title: 'Score Not Qualified',
          message: `Score ${gameState.score.toLocaleString()} didn't qualify for the top 5.\n\nYou can view the current leaderboard to see what it takes!`,
          confirmText: 'OK',
          autoClose: false
        });
        // Set up automatic navigation after 10 seconds
        const timer = setTimeout(() => {
          navigateToLeaderboard();
        }, 10000);
        setNavigationTimer(timer);
      }
    } else {
      // No pending game over, initialize new game
      actions.initializeGame(name);
    }
  };

  const handleStartGame = () => {
    if (!hasPlayerName) {
      setShowNameInput(true);
      return;
    }
    actions.startGame();
  };

  const handlePlayAgain = () => {
    actions.resetGame();
    actions.startGame();
  };

  const handleSubmitScore = () => {
    if (gameState.isGameOver && gameState.score > 0) {
      if (!hasPlayerName || !playerName || playerName.trim() === '') {
        setShowNameInput(true);
        return;
      }
      
      const gameStateWithPlayer = {
        ...gameState,
        playerName: playerName.trim()
      };
      
      const result = addScore(gameStateWithPlayer);
      if (result.success) {
        console.log('Score added to leaderboard:', result.message);
        // Navigate to leaderboard page
        router.push('/leaderboard');
      } else {
        console.warn('Score did not qualify for leaderboard. Score:', gameState.score);
        // Show message then go to leaderboard after a delay
        showAlert({
          type: 'warning',
          title: 'Score Not Qualified',
          message: `Score ${gameState.score.toLocaleString()} didn't qualify for the top 5.\n\nYou can view the current leaderboard to see what it takes!`,
          confirmText: 'OK',
          autoClose: false
        });
        // Set up automatic navigation after 10 seconds
        const timer = setTimeout(() => {
          navigateToLeaderboard();
        }, 10000);
        setNavigationTimer(timer);
      }
    }
  };

  // Debug function to test leaderboard
  const debugTestLeaderboard = () => {
    console.log('🧪 Testing leaderboard with manual entry');
    console.log('🧪 addScore function type:', typeof addScore);
    
    const testGameState = {
      playerName: 'TestPlayer',
      score: 1000,
      lines: 10,
      level: 2,
      gameStartTime: Date.now() - 60000, // 1 minute ago
      gameEndTime: Date.now()
    };
    
    try {
      const result = leaderboardHook.addScore(testGameState);
      console.log('🧪 Test result:', result);
    } catch (error) {
      console.error('🧪 Test error:', error);
    }
  };

  // Add to window for manual testing
  if (typeof window !== 'undefined') {
    window.debugTestLeaderboard = debugTestLeaderboard;
    window.forceAddScore = (score = 1000) => {
      console.log('🚀 Force adding score:', score);
      // Directly modify localStorage
      const entry = {
        id: Date.now().toString(),
        playerName: 'TestPlayer',
        score: score,
        lines: 10,
        level: 2,
        duration: 60000,
        durationFormatted: '1:00',
        linesPerMinute: 10,
        date: new Date().toISOString(),
        dateFormatted: new Date().toLocaleDateString(),
      };
      
      const currentData = localStorage.getItem('tetris-leaderboard');
      const leaderboard = currentData ? JSON.parse(currentData) : [];
      leaderboard.push(entry);
      leaderboard.sort((a, b) => b.score - a.score);
      
      localStorage.setItem('tetris-leaderboard', JSON.stringify(leaderboard));
      console.log('🚀 Force added entry. New leaderboard:', leaderboard);
      
      // Refresh the page to see it
      window.location.reload();
    };
    window.clearTetrisStorage = () => {
      localStorage.removeItem('tetris-leaderboard');
      localStorage.removeItem('tetris-player-name');
      localStorage.removeItem('tetris-game-state');
      console.log('🧹 Cleared all tetris localStorage data');
      window.location.reload(); // Refresh to see changes
    };
  }

  // Keyboard and touch controls are now handled by useTetromino hook

  const isGameStarted = gameState.gameState === 'playing' || gameState.gameState === 'paused' || gameState.gameState === 'game_over';

  // Don't render game content until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">🧩 Tetris Game</h1>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Game Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">🧩 Tetris Game</h1>
            {hasPlayerName && (
              <p className="text-muted-foreground">
                Welcome back, <span className="font-medium">{playerName}</span>!
              </p>
            )}
          </div>

          {!isGameStarted ? (
            /* Start Screen */
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
                <p className="text-muted-foreground mb-6">
                  Start a new game and compete for the high score!
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleStartGame}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Start New Game
                  </button>
                  
                  {hasPlayerName && (
                    <div className="text-sm text-muted-foreground">
                      Playing as: {playerName}{' '}
                      <button
                        onClick={() => setShowNameInput(true)}
                        className="text-primary hover:underline"
                      >
                        (change)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Game Instructions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium mb-2">Movement</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>← → Move left/right</div>
                      <div>↓ Soft drop</div>
                      <div>↑ Rotate piece</div>
                      <div>Space Hard drop</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Game Controls</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>C Hold piece</div>
                      <div>P Pause/Resume</div>
                      <div>R Reset game</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Game Screen */
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                  <GameStats gameState={gameState} />
                  <HoldPiece
                    holdPiece={gameState.holdPiece}
                    canHold={gameState.canHold}
                    onHold={actions.holdPiece}
                    showButton={isMobile}
                  />
                </div>

                {/* Game Board */}
                <div className="lg:col-span-6 flex flex-col items-center space-y-4">
                  <GameBoard
                    board={gameState.board}
                    currentPiece={gameState.currentPiece}
                    showGhost={!gameState.isPaused}
                  />
                  
                  {/* Mobile Controls */}
                  {isMobile && (
                    <GameControls
                      gameState={gameState}
                      actions={actions}
                      mobileControls={mobileControls}
                      showMobileControls={true}
                    />
                  )}
                  
                  {/* Game Over Screen */}
                  {gameState.isGameOver && (
                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                      <div className="text-4xl mb-2">🎲</div>
                      <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                      <p className="text-muted-foreground mb-4">
                        Final Score: <span className="font-bold">{gameState.score.toLocaleString()}</span>
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={handleSubmitScore}
                          className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200 mr-2"
                        >
                          Submit Score
                        </button>
                        <button
                          onClick={handlePlayAgain}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                        >
                          Play Again
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Pause Screen */}
                  {gameState.isPaused && (
                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                      <div className="text-4xl mb-2">⏸️</div>
                      <h2 className="text-2xl font-bold mb-2">Game Paused</h2>
                      <p className="text-muted-foreground mb-4">
                        Press P to resume or click the button below
                      </p>
                      <button
                        onClick={actions.resumeGame}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                      >
                        Resume Game
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                  <NextPiece nextPiece={gameState.nextPiece} />
                  
                  {!isMobile && (
                    <GameControls
                      gameState={gameState}
                      actions={actions}
                      mobileControls={mobileControls}
                      showMobileControls={false}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Player Name Input Modal */}
        <PlayerNameInput
          isOpen={showNameInput}
          onSubmit={handlePlayerNameSubmit}
          onClose={() => setShowNameInput(false)}
          initialName={playerName}
          required={!hasPlayerName}
          title={hasPlayerName ? 'Change Your Name' : 'Enter Your Name'}
          description={
            hasPlayerName 
              ? 'Update your player name for the leaderboard.'
              : 'Enter your name to start playing and track your scores.'
          }
        />

        {/* Custom Alert Modal */}
        <AlertModal onClose={navigateToLeaderboard} externalCountdown={countdown} />
      </main>
    </>
  );
}