'use client';

import React, { useState, useEffect } from 'react';
import { formatScore, calculateGameStats, getLinesUntilNextLevel } from '../utils/scoring.js';
import { calculateDropSpeed } from '../utils/gameLogic.js';

/**
 * Individual stat display component.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Stat label
 * @param {string|number} props.value - Stat value
 * @param {string} props.description - Optional description/subtitle
 * @param {boolean} props.highlight - Whether to highlight this stat
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} StatDisplay component
 */
function StatDisplay({ label, value, description, highlight = false, className = '' }) {
  const containerClasses = `
    text-center p-2 rounded-md transition-all duration-200
    ${highlight ? 'bg-primary/10 border border-primary/20' : 'bg-card/50'}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </div>
      <div className={`text-lg font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </div>
      {description && (
        <div className="text-xs text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  );
}

/**
 * Animated score display with score changes.
 *
 * @param {Object} props - Component props
 * @param {number} props.score - Current score
 * @param {number} props.previousScore - Previous score for animation
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} AnimatedScore component
 */
function AnimatedScore({ score, className = '' }) {
  // Just display the score directly without any state or effects to avoid loops
  return (
    <div className={className}>
      <StatDisplay
        label="Score"
        value={formatScore(score)}
        highlight={false}
      />
    </div>
  );
}

/**
 * Level progress indicator.
 *
 * @param {Object} props - Component props
 * @param {number} props.level - Current level
 * @param {number} props.lines - Total lines cleared
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} LevelProgress component
 */
function LevelProgress({ level, lines, className = '' }) {
  const linesUntilNext = getLinesUntilNextLevel(lines);
  const linesForCurrentLevel = 10; // LINES_PER_LEVEL from constants
  const progressPercentage = ((linesForCurrentLevel - linesUntilNext) / linesForCurrentLevel) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <StatDisplay
        label="Level"
        value={level}
        description={`${linesUntilNext} lines to next`}
      />
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Game timer display.
 *
 * @param {Object} props - Component props
 * @param {number} props.startTime - Game start timestamp
 * @param {boolean} props.isPaused - Whether game is paused
 * @param {boolean} props.isGameOver - Whether game is over
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} GameTimer component
 */
function GameTimer({ startTime, isPaused, isGameOver, className = '' }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isPaused || isGameOver || !startTime) return;

    const timer = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isPaused, isGameOver]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StatDisplay
      label="Time"
      value={formatTime(elapsed)}
      className={className}
    />
  );
}

/**
 * Performance metrics display.
 *
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Current game state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PerformanceStats component
 */
function PerformanceStats({ gameState, className = '' }) {
  const stats = calculateGameStats(gameState);
  const dropSpeed = calculateDropSpeed(gameState.level);

  return (
    <div className={`bg-card border border-border rounded-lg p-3 ${className}`}>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">
        Performance
      </h4>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Lines/Min</span>
          <span className="font-mono">{stats.linesPerMinute}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Points/Line</span>
          <span className="font-mono">{stats.pointsPerLine}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Drop Speed</span>
          <span className="font-mono">{dropSpeed}ms</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Main game statistics component.
 *
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Current game state
 * @param {Object} props.previousGameState - Previous game state for animations
 * @param {boolean} props.showPerformance - Whether to show performance stats
 * @param {boolean} props.compact - Whether to use compact layout
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} GameStats component
 */
export function GameStats({ 
  gameState, 
  // previousGameState = {}, // Removed unused parameter
  showPerformance = false,
  compact = false,
  className = '' 
}) {
  const { score, level, lines, gameStartTime, isPaused, isGameOver } = gameState;

  if (compact) {
    return (
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        <StatDisplay label="Score" value={formatScore(score)} />
        <StatDisplay label="Level" value={level} />
        <StatDisplay label="Lines" value={lines} />
        <GameTimer 
          startTime={gameStartTime} 
          isPaused={isPaused} 
          isGameOver={isGameOver} 
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary stats */}
      <div className="space-y-2">
        <AnimatedScore 
          score={score} 
        />
        
        <LevelProgress level={level} lines={lines} />
        
        <StatDisplay
          label="Lines"
          value={lines}
          description={`${Math.floor(lines / 4)} Tetrises`}
        />
        
        <GameTimer 
          startTime={gameStartTime} 
          isPaused={isPaused} 
          isGameOver={isGameOver} 
        />
      </div>

      {/* Performance stats */}
      {showPerformance && (
        <PerformanceStats gameState={gameState} />
      )}
    </div>
  );
}

/**
 * Game over statistics display.
 *
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Final game state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} GameOverStats component
 */
export function GameOverStats({ gameState, className = '' }) {
  const stats = calculateGameStats(gameState);

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center mb-4">Final Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <StatDisplay
          label="Final Score"
          value={formatScore(gameState.score)}
          highlight={true}
        />
        
        <StatDisplay
          label="Level Reached"
          value={gameState.level}
        />
        
        <StatDisplay
          label="Lines Cleared"
          value={gameState.lines}
        />
        
        <StatDisplay
          label="Game Time"
          value={stats.duration.formatted}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground">Lines/Minute</div>
            <div className="font-semibold">{stats.linesPerMinute}</div>
          </div>
          
          <div className="text-center">
            <div className="text-muted-foreground">Points/Line</div>
            <div className="font-semibold">{stats.pointsPerLine}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Leaderboard position indicator.
 *
 * @param {Object} props - Component props
 * @param {number} props.rank - Current rank (null if not on leaderboard)
 * @param {number} props.score - Current score
 * @param {boolean} props.isNewRecord - Whether this is a new personal record
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} LeaderboardPosition component
 */
export function LeaderboardPosition({ rank, /* score, */ isNewRecord = false, className = '' }) {
  if (!rank) {
    return (
      <div className={`text-center text-muted-foreground text-sm ${className}`}>
        Score does not qualify for leaderboard
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className={`text-lg font-bold ${isNewRecord ? 'text-primary' : 'text-foreground'}`}>
        #{rank} on Leaderboard
      </div>
      {isNewRecord && (
        <div className="text-sm text-primary font-medium">
          🎉 New Personal Record!
        </div>
      )}
    </div>
  );
}

export default GameStats;