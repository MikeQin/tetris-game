'use client';

import React from 'react';
import { MiniBoard } from './GameBoard.js';

/**
 * Next piece preview component.
 *
 * @param {Object} props - Component props
 * @param {Object} props.nextPiece - Next tetromino piece
 * @param {Array} props.upcomingPieces - Array of upcoming pieces (for queue)
 * @param {boolean} props.showQueue - Whether to show upcoming pieces queue
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} NextPiece component
 */
export function NextPiece({ 
  nextPiece, 
  upcomingPieces = [], 
  showQueue = false,
  className = '' 
}) {
  if (showQueue && upcomingPieces.length > 0) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <h3 className="text-sm font-medium text-muted-foreground text-center mb-3">
          Next Pieces
        </h3>
        
        <div className="space-y-2">
          {[nextPiece, ...upcomingPieces].slice(0, 4).map((piece, index) => (
            <div key={index} className="flex justify-center">
              <MiniBoard
                piece={piece}
                size={3}
                className={`${index === 0 ? 'w-16 h-16' : 'w-12 h-12'}`}
                title={index === 0 ? 'Next' : `+${index}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground text-center mb-3">
        Next
      </h3>
      
      <div className="flex justify-center">
        {nextPiece ? (
          <MiniBoard
            piece={nextPiece}
            size={4}
            className="w-20 h-20"
            title="Next Piece"
          />
        ) : (
          <div className="w-20 h-20 bg-muted/30 border border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center">
            <span className="text-muted-foreground/50 text-xs">None</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Enhanced next piece component with additional information.
 *
 * @param {Object} props - Component props
 * @param {Object} props.nextPiece - Next tetromino piece
 * @param {Array} props.pieceHistory - Recent pieces for pattern tracking
 * @param {Object} props.pieceStats - Statistics about piece usage
 * @param {boolean} props.showStats - Whether to show piece statistics
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} EnhancedNextPiece component
 */
export function EnhancedNextPiece({ 
  nextPiece, 
  pieceHistory = [], 
  pieceStats = {},
  showStats = false,
  className = '' 
}) {
  // Calculate recent piece pattern
  const recentPattern = pieceHistory.slice(-7).map(piece => piece?.type).join('');
  const hasDrought = (type) => {
    const lastFive = pieceHistory.slice(-5);
    return !lastFive.some(piece => piece?.type === type);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main next piece display */}
      <PiecePreview
        piece={nextPiece}
        title="Next Piece"
        size="md"
      />

      {/* Piece information */}
      {nextPiece && (
        <div className="bg-card border border-border rounded-lg p-2">
          <div className="text-xs text-center space-y-1">
            <div className="font-medium">
              {nextPiece.type}-Piece
            </div>
            
            {showStats && pieceStats[nextPiece.type] && (
              <div className="text-muted-foreground">
                Used: {pieceStats[nextPiece.type]} times
              </div>
            )}
            
            {hasDrought(nextPiece.type) && (
              <div className="text-yellow-600 dark:text-yellow-400 font-medium">
                ⚠ Long wait!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent pattern indicator */}
      {recentPattern.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-2">
          <div className="text-xs text-center">
            <div className="text-muted-foreground mb-1">Recent Pattern</div>
            <div className="font-mono text-xs">
              {recentPattern}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact next piece display for mobile layouts.
 *
 * @param {Object} props - Component props
 * @param {Object} props.nextPiece - Next tetromino piece
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} CompactNextPiece component
 */
export function CompactNextPiece({ nextPiece, className = '' }) {
  return (
    <div className={`flex items-center gap-2 bg-card border border-border rounded-lg p-2 ${className}`}>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        Next:
      </span>
      
      <div className="w-12 h-12 flex items-center justify-center">
        {nextPiece ? (
          <PiecePreview
            piece={nextPiece}
            size="xs"
            className="border-0 bg-transparent p-0"
          />
        ) : (
          <div className="text-muted-foreground/50 text-xs">
            --
          </div>
        )}
      </div>
      
      {nextPiece && (
        <span className="text-xs font-medium">
          {nextPiece.type}
        </span>
      )}
    </div>
  );
}

/**
 * Next pieces sidebar for desktop layout.
 *
 * @param {Object} props - Component props
 * @param {Object} props.nextPiece - Current next piece
 * @param {Array} props.upcomingPieces - Queue of upcoming pieces
 * @param {Object} props.pieceStats - Statistics about piece usage
 * @param {Array} props.pieceHistory - History of recent pieces
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} NextPieceSidebar component
 */
export function NextPieceSidebar({ 
  nextPiece, 
  upcomingPieces = [], 
  pieceStats = {},
  pieceHistory = [],
  className = '' 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary next piece */}
      <PiecePreview
        piece={nextPiece}
        title="Next"
        size="md"
      />

      {/* Upcoming pieces queue */}
      {upcomingPieces.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground text-center">
            Upcoming
          </h4>
          
          <div className="space-y-1">
            {upcomingPieces.slice(0, 3).map((piece, index) => (
              <PiecePreview
                key={index}
                piece={piece}
                size="xs"
                className="scale-75 opacity-75"
              />
            ))}
          </div>
        </div>
      )}

      {/* Piece drought warnings */}
      <DroughtWarnings 
        pieceHistory={pieceHistory}
        className="text-xs"
      />
    </div>
  );
}

/**
 * Component to warn about piece droughts (long waits for specific pieces).
 *
 * @param {Object} props - Component props
 * @param {Array} props.pieceHistory - History of recent pieces
 * @param {number} props.droughtThreshold - Number of pieces to consider a drought
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} DroughtWarnings component
 */
function DroughtWarnings({ pieceHistory = [], droughtThreshold = 7, className = '' }) {
  const pieceTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const droughts = [];

  pieceTypes.forEach(type => {
    const lastIndex = pieceHistory.findIndex(piece => piece?.type === type);
    if (lastIndex === -1 || lastIndex >= droughtThreshold) {
      droughts.push({
        type,
        count: lastIndex === -1 ? pieceHistory.length : lastIndex
      });
    }
  });

  if (droughts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 ${className}`}>
      <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
        ⚠ Piece Droughts
      </div>
      
      <div className="space-y-1">
        {droughts.map(({ type, count }) => (
          <div key={type} className="flex items-center justify-between text-xs text-yellow-700 dark:text-yellow-300">
            <span className="font-mono">{type}</span>
            <span>{count}+ pieces ago</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NextPiece;