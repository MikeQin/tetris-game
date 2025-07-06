'use client';

import React, { useState } from 'react';
import { formatScore } from '../utils/scoring.js';

/**
 * Individual leaderboard entry component.
 *
 * @param {Object} props - Component props
 * @param {Object} props.entry - Leaderboard entry
 * @param {number} props.rank - Entry rank (1-based)
 * @param {boolean} props.isCurrentPlayer - Whether this is the current player's entry
 * @param {boolean} props.isNewEntry - Whether this is a new/highlighted entry
 * @param {Function} props.onRemove - Remove entry handler
 * @param {boolean} props.showRemove - Whether to show remove button
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} LeaderboardEntry component
 */
function LeaderboardEntry({ 
  entry, 
  rank, 
  isCurrentPlayer = false, 
  isNewEntry = false,
  onRemove,
  showRemove = false,
  className = '' 
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!onRemove) return;
    
    setIsRemoving(true);
    try {
      await onRemove(entry.id);
    } catch (error) {
      console.error('Failed to remove entry:', error);
      setIsRemoving(false);
    }
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClasses = (rank) => {
    if (rank === 1) return 'text-yellow-600 dark:text-yellow-400';
    if (rank === 2) return 'text-gray-600 dark:text-gray-400';
    if (rank === 3) return 'text-amber-600 dark:text-amber-400';
    return 'text-muted-foreground';
  };

  const entryClasses = `
    flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
    ${isCurrentPlayer 
      ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' 
      : 'bg-card border-border hover:bg-accent/50'
    }
    ${isNewEntry ? 'animate-pulse bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}
    ${className}
  `;

  return (
    <div className={entryClasses}>
      {/* Rank */}
      <div className={`text-lg font-bold w-8 text-center ${getRankClasses(rank)}`}>
        {getRankDisplay(rank)}
      </div>

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium truncate ${isCurrentPlayer ? 'text-primary' : 'text-foreground'}`}>
            {entry.playerName}
          </span>
          {isCurrentPlayer && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              You
            </span>
          )}
          {isNewEntry && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
              New!
            </span>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Level {entry.level} • {entry.lines} lines • {entry.durationFormatted}
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <div className="font-bold text-foreground">
          {formatScore(entry.score)}
        </div>
        <div className="text-xs text-muted-foreground">
          {entry.dateFormatted}
        </div>
      </div>

      {/* Remove button */}
      {showRemove && (
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-destructive hover:text-destructive/80 p-1 rounded transition-colors disabled:opacity-50"
          title="Remove entry"
        >
          {isRemoving ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Main leaderboard component.
 *
 * @param {Object} props - Component props
 * @param {Array} props.entries - Leaderboard entries
 * @param {string} props.currentPlayerName - Current player name for highlighting
 * @param {string} props.newEntryId - ID of newly added entry for highlighting
 * @param {Function} props.onRemoveEntry - Remove entry handler
 * @param {boolean} props.showRemoveButtons - Whether to show remove buttons
 * @param {string} props.title - Leaderboard title
 * @param {number} props.maxEntries - Maximum entries to display
 * @param {boolean} props.isLoading - Whether leaderboard is loading
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Leaderboard component
 */
export function Leaderboard({ 
  entries = [], 
  currentPlayerName = '',
  newEntryId = null,
  onRemoveEntry,
  showRemoveButtons = false,
  title = 'Leaderboard',
  maxEntries = 5,
  isLoading = false,
  className = '' 
}) {
  // Filter out entries without valid IDs and ensure proper structure
  const validEntries = entries.filter(entry => 
    entry && 
    (entry.id || entry.id === 0) && 
    entry.playerName && 
    typeof entry.score === 'number'
  );
  const displayEntries = validEntries.slice(0, maxEntries);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-xl font-bold text-center">{title}</h2>
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (displayEntries.length === 0) {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-muted-foreground">
            No scores yet. Be the first to play!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          Top {displayEntries.length} of {validEntries.length}
        </div>
      </div>

      <div className="space-y-2">
        {displayEntries.map((entry, index) => (
          <LeaderboardEntry
            key={entry.id || `entry-${index}`}
            entry={entry}
            rank={index + 1}
            isCurrentPlayer={entry.playerName === currentPlayerName}
            isNewEntry={entry.id === newEntryId}
            onRemove={onRemoveEntry}
            showRemove={showRemoveButtons}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact leaderboard for small spaces.
 *
 * @param {Object} props - Component props
 * @param {Array} props.entries - Leaderboard entries
 * @param {number} props.maxEntries - Maximum entries to show
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} CompactLeaderboard component
 */
export function CompactLeaderboard({ 
  entries = [], 
  maxEntries = 3,
  className = '' 
}) {
  // Filter out entries without valid IDs
  const validEntries = entries.filter(entry => 
    entry && 
    (entry.id || entry.id === 0) && 
    entry.playerName && 
    typeof entry.score === 'number'
  );
  const topEntries = validEntries.slice(0, maxEntries);

  if (topEntries.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-lg p-3 text-center text-muted-foreground text-sm ${className}`}>
        No scores yet
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-3 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Top Scores</h3>
      
      <div className="space-y-1">
        {topEntries.map((entry, index) => (
          <div key={entry.id || `compact-entry-${index}`} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-muted-foreground w-4">#{index + 1}</span>
              <span className="font-medium truncate">{entry.playerName}</span>
            </div>
            <span className="font-mono text-muted-foreground ml-2">
              {formatScore(entry.score)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Leaderboard statistics component.
 *
 * @param {Object} props - Component props
 * @param {Object} props.stats - Leaderboard statistics
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} LeaderboardStats component
 */
export function LeaderboardStats({ stats, className = '' }) {
  if (!stats || stats.totalEntries === 0) {
    return null;
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {formatScore(stats.highestScore)}
          </div>
          <div className="text-muted-foreground">Highest Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {formatScore(stats.averageScore)}
          </div>
          <div className="text-muted-foreground">Average Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {stats.totalEntries}
          </div>
          <div className="text-muted-foreground">Games Played</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {stats.lastGameDate ? new Date(stats.lastGameDate).toLocaleDateString() : '--'}
          </div>
          <div className="text-muted-foreground">Last Game</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Player's personal best component.
 *
 * @param {Object} props - Component props
 * @param {Object} props.personalBest - Player's best entry
 * @param {string} props.playerName - Player name
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PersonalBest component
 */
export function PersonalBest({ personalBest, playerName, className = '' }) {
  if (!personalBest) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 text-center ${className}`}>
        <div className="text-muted-foreground">
          No personal best yet for {playerName}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🏆</span>
        <h3 className="font-medium text-foreground">Personal Best</h3>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Score</span>
          <span className="font-bold">{formatScore(personalBest.score)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Level</span>
          <span className="font-medium">{personalBest.level}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Lines</span>
          <span className="font-medium">{personalBest.lines}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{personalBest.dateFormatted}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Leaderboard management component with controls.
 *
 * @param {Object} props - Component props
 * @param {Array} props.entries - Leaderboard entries
 * @param {Function} props.onClear - Clear leaderboard handler
 * @param {Function} props.onExport - Export leaderboard handler
 * @param {boolean} props.canManage - Whether user can manage leaderboard
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} LeaderboardManagement component
 */
export function LeaderboardManagement({ 
  entries = [], 
  onClear, 
  onExport,
  canManage = false,
  className = '' 
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    if (showConfirm) {
      onClear();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  if (!canManage || entries.length === 0) {
    return null;
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Management</h3>
      
      <div className="flex gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="flex-1 px-3 py-2 text-xs font-medium text-secondary-foreground bg-secondary border border-border rounded hover:bg-secondary/80 transition-colors"
          >
            Export
          </button>
        )}
        
        {onClear && (
          <button
            onClick={handleClear}
            className={`flex-1 px-3 py-2 text-xs font-medium border rounded transition-colors ${
              showConfirm 
                ? 'text-destructive-foreground bg-destructive border-destructive hover:bg-destructive/90' 
                : 'text-destructive border-destructive hover:bg-destructive/10'
            }`}
          >
            {showConfirm ? 'Confirm Clear' : 'Clear All'}
          </button>
        )}
      </div>
      
      {showConfirm && (
        <div className="mt-2 text-xs text-muted-foreground">
          Click again to permanently delete all scores
        </div>
      )}
    </div>
  );
}

export default Leaderboard;