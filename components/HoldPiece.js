'use client';

import React from 'react';
import { MiniBoard } from './GameBoard.js';

/**
 * Hold piece display component.
 *
 * @param {Object} props - Component props
 * @param {Object} props.holdPiece - Currently held tetromino piece
 * @param {boolean} props.canHold - Whether hold action is currently available
 * @param {Function} props.onHold - Hold action handler
 * @param {boolean} props.showButton - Whether to show hold button
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} HoldPiece component
 */
export function HoldPiece({ 
  holdPiece, 
  canHold = true, 
  onHold, 
  showButton = false,
  className = '' 
}) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground text-center mb-3">
        Hold
      </h3>
      
      <div className="flex justify-center mb-3">
        {holdPiece ? (
          <MiniBoard
            piece={holdPiece}
            size={4}
            className={`w-20 h-20 ${!canHold ? 'opacity-50' : ''}`}
            title="Hold Piece"
          />
        ) : (
          <div className="w-20 h-20 bg-muted/30 border border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center">
            <span className="text-muted-foreground/50 text-xs">Empty</span>
          </div>
        )}
      </div>
      
      {showButton && (
        <button
          onClick={onHold}
          disabled={!canHold}
          className={`
            mt-2 w-full px-3 py-1 text-xs rounded-md transition-all duration-150
            ${canHold 
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95' 
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            }
          `}
          title={canHold ? 'Hold current piece (C)' : 'Hold not available'}
        >
          {canHold ? 'Hold (C)' : 'Used'}
        </button>
      )}
    </div>
  );
}

/**
 * Enhanced hold piece component with additional information.
 *
 * @param {Object} props - Component props
 * @param {Object} props.holdPiece - Currently held tetromino piece
 * @param {boolean} props.canHold - Whether hold action is available
 * @param {Function} props.onHold - Hold action handler
 * @param {number} props.holdCount - Number of times hold has been used
 * @param {boolean} props.showStats - Whether to show hold statistics
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} EnhancedHoldPiece component
 */
export function EnhancedHoldPiece({ 
  holdPiece, 
  canHold = true, 
  onHold,
  holdCount = 0,
  showStats = false,
  className = '' 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main hold display */}
      <div className="relative">
        <PiecePreview
          piece={holdPiece}
          title="Hold"
          size="md"
          disabled={!canHold}
        />
        
        {/* Hold availability indicator */}
        <div className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background
          ${canHold ? 'bg-green-500' : 'bg-red-500'}
        `} />
      </div>

      {/* Hold information */}
      <div className="bg-card border border-border rounded-lg p-2">
        <div className="text-xs text-center space-y-1">
          <div className={`font-medium ${canHold ? 'text-foreground' : 'text-muted-foreground'}`}>
            {canHold ? 'Ready to Hold' : 'Hold Used'}
          </div>
          
          {!canHold && (
            <div className="text-muted-foreground">
              Place piece to reset
            </div>
          )}
          
          {showStats && (
            <div className="text-muted-foreground">
              Used {holdCount} times
            </div>
          )}
        </div>
      </div>

      {/* Hold strategy tip */}
      {!holdPiece && canHold && (
        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
          <div className="text-xs text-blue-800 dark:text-blue-200 text-center">
            💡 Hold pieces for later use
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact hold piece display for mobile layouts.
 *
 * @param {Object} props - Component props
 * @param {Object} props.holdPiece - Currently held tetromino piece
 * @param {boolean} props.canHold - Whether hold action is available
 * @param {Function} props.onHold - Hold action handler
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} CompactHoldPiece component
 */
export function CompactHoldPiece({ 
  holdPiece, 
  canHold = true, 
  onHold,
  className = '' 
}) {
  return (
    <div className={`flex items-center gap-2 bg-card border border-border rounded-lg p-2 ${className}`}>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        Hold:
      </span>
      
      <div className="w-12 h-12 flex items-center justify-center relative">
        {holdPiece ? (
          <PiecePreview
            piece={holdPiece}
            size="xs"
            disabled={!canHold}
            className="border-0 bg-transparent p-0"
          />
        ) : (
          <div className="text-muted-foreground/50 text-xs">
            --
          </div>
        )}
        
        {/* Status indicator */}
        <div className={`
          absolute -top-1 -right-1 w-2 h-2 rounded-full
          ${canHold ? 'bg-green-500' : 'bg-red-500'}
        `} />
      </div>
      
      {holdPiece && (
        <span className={`text-xs font-medium ${canHold ? 'text-foreground' : 'text-muted-foreground'}`}>
          {holdPiece.type}
        </span>
      )}
      
      <button
        onClick={onHold}
        disabled={!canHold}
        className={`
          ml-auto px-2 py-1 text-xs rounded transition-all duration-150
          ${canHold 
            ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95' 
            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          }
        `}
      >
        {canHold ? 'Hold' : 'Used'}
      </button>
    </div>
  );
}

/**
 * Hold piece sidebar for desktop layout.
 *
 * @param {Object} props - Component props
 * @param {Object} props.holdPiece - Currently held tetromino piece
 * @param {boolean} props.canHold - Whether hold action is available
 * @param {Function} props.onHold - Hold action handler
 * @param {number} props.holdCount - Number of times hold has been used
 * @param {Object} props.holdStats - Statistics about hold usage
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} HoldPieceSidebar component
 */
export function HoldPieceSidebar({ 
  holdPiece, 
  canHold = true, 
  onHold,
  holdCount = 0,
  holdStats = {},
  className = '' 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main hold display */}
      <EnhancedHoldPiece
        holdPiece={holdPiece}
        canHold={canHold}
        onHold={onHold}
        holdCount={holdCount}
        showStats={true}
      />

      {/* Hold strategy tips */}
      <HoldStrategy />

      {/* Hold statistics */}
      {holdStats && Object.keys(holdStats).length > 0 && (
        <HoldStatistics stats={holdStats} />
      )}
    </div>
  );
}

/**
 * Component displaying hold strategy tips.
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} HoldStrategy component
 */
function HoldStrategy({ className = '' }) {
  const tips = [
    'Save I-pieces for Tetrises',
    'Hold pieces that don\'t fit current setup',
    'Keep versatile pieces like T-blocks',
    'Use hold when you need a specific piece'
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-3 ${className}`}>
      <h4 className="text-xs font-medium text-muted-foreground mb-2">
        Hold Strategy
      </h4>
      
      <div className="space-y-1">
        {tips.map((tip, index) => (
          <div key={index} className="text-xs text-muted-foreground flex items-start gap-1">
            <span className="text-primary mt-0.5">•</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component displaying hold usage statistics.
 *
 * @param {Object} props - Component props
 * @param {Object} props.stats - Hold statistics object
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} HoldStatistics component
 */
function HoldStatistics({ stats, className = '' }) {
  return (
    <div className={`bg-card border border-border rounded-lg p-3 ${className}`}>
      <h4 className="text-xs font-medium text-muted-foreground mb-2">
        Hold Stats
      </h4>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Total Uses</span>
          <span className="font-mono">{stats.totalUses || 0}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Most Held</span>
          <span className="font-mono">{stats.mostHeld || '--'}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Efficiency</span>
          <span className="font-mono">{stats.efficiency || 0}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive hold button with visual feedback.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.canHold - Whether hold action is available
 * @param {Function} props.onHold - Hold action handler
 * @param {boolean} props.isPressed - Whether button is currently pressed
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} HoldButton component
 */
export function HoldButton({ 
  canHold = true, 
  onHold, 
  isPressed = false,
  className = '' 
}) {
  const buttonClasses = `
    px-4 py-2 rounded-lg font-medium transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    ${canHold 
      ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm' 
      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
    }
    ${isPressed ? 'scale-95 shadow-inner' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={onHold}
      disabled={!canHold}
      title={canHold ? 'Hold current piece (C)' : 'Hold not available - place current piece first'}
    >
      <span className="flex items-center gap-2">
        <span>Hold</span>
        <span className="text-xs opacity-70">(C)</span>
        {!canHold && <span className="text-xs">🚫</span>}
      </span>
    </button>
  );
}

export default HoldPiece;