'use client';

import React, { useState } from 'react';
import { CONTROLS } from '../utils/constants.js';

/**
 * Individual control button component.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler
 * @param {string} props.label - Button label
 * @param {string} props.shortcut - Keyboard shortcut
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'danger')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} ControlButton component
 */
function ControlButton({ 
  onClick, 
  label, 
  shortcut, 
  disabled = false, 
  variant = 'secondary',
  size = 'md',
  className = '' 
}) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    transition-all duration-150 select-none
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-w-[60px]',
    md: 'px-4 py-2 text-sm min-w-[80px]',
    lg: 'px-6 py-3 text-base min-w-[100px]',
  };

  const variantClasses = {
    primary: `
      bg-primary text-primary-foreground 
      hover:bg-primary/90 active:bg-primary/80
      shadow-sm
    `,
    secondary: `
      bg-secondary text-secondary-foreground border border-border
      hover:bg-secondary/80 active:bg-secondary/70
    `,
    danger: `
      bg-destructive text-destructive-foreground
      hover:bg-destructive/90 active:bg-destructive/80
      shadow-sm
    `,
  };

  const pressedClasses = isPressed ? 'scale-95 shadow-inner' : '';

  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]}
    ${pressedClasses}
    ${className}
  `;

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      <span className="flex flex-col items-center gap-1">
        <span>{label}</span>
        {shortcut && (
          <span className="text-xs opacity-70 font-mono">
            {shortcut}
          </span>
        )}
      </span>
    </button>
  );
}

/**
 * Touch control button for mobile devices.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onTouchStart - Touch start handler
 * @param {Function} props.onTouchEnd - Touch end handler
 * @param {string} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} TouchButton component
 */
function TouchButton({ onTouchStart, onTouchEnd, children, className = '' }) {
  const [isTouched, setIsTouched] = useState(false);

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsTouched(true);
    onTouchStart?.();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsTouched(false);
    onTouchEnd?.();
  };

  const touchClasses = `
    touch-none select-none user-select-none
    bg-secondary border-2 border-border rounded-lg
    text-secondary-foreground font-medium
    flex items-center justify-center
    transition-all duration-100
    active:scale-95 active:bg-secondary/80
    ${isTouched ? 'scale-95 bg-secondary/80 shadow-inner' : 'shadow-sm'}
    ${className}
  `;

  return (
    <button
      className={touchClasses}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {children}
    </button>
  );
}

/**
 * Main game controls component with both keyboard and touch support.
 *
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Current game state
 * @param {Object} props.actions - Game action functions
 * @param {Object} props.mobileControls - Mobile control functions from useTetromino hook
 * @param {boolean} props.showMobileControls - Whether to show mobile touch controls
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} GameControls component
 */
export function GameControls({ 
  gameState, 
  actions, 
  mobileControls,
  showMobileControls = false,
  className = '' 
}) {
  const { isPaused, isGameOver } = gameState;

  const handlePauseResume = () => {
    if (isPaused) {
      actions.resumeGame();
    } else {
      actions.pauseGame();
    }
  };

  if (showMobileControls) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Movement controls */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <TouchButton 
            onTouchStart={() => mobileControls?.rotate()}
            className="h-12 col-start-2"
          >
            ↻
          </TouchButton>
          
          <TouchButton 
            onTouchStart={() => mobileControls?.moveLeft()}
            className="h-12"
          >
            ←
          </TouchButton>
          
          <TouchButton 
            onTouchStart={() => mobileControls?.softDrop()}
            className="h-12"
          >
            ↓
          </TouchButton>
          
          <TouchButton 
            onTouchStart={() => mobileControls?.moveRight()}
            className="h-12"
          >
            →
          </TouchButton>
        </div>

        {/* Action controls */}
        <div className="flex gap-2 justify-center">
          <TouchButton 
            onTouchStart={() => mobileControls?.hardDrop()}
            className="h-10 px-4"
          >
            Drop
          </TouchButton>
          
          <TouchButton 
            onTouchStart={() => mobileControls?.hold()}
            className="h-10 px-4"
          >
            Hold
          </TouchButton>
        </div>

        {/* Game controls */}
        <div className="flex gap-2 justify-center">
          <ControlButton
            onClick={() => mobileControls?.pause()}
            label={isPaused ? 'Resume' : 'Pause'}
            disabled={isGameOver}
            variant="primary"
            size="sm"
          />
          
          <ControlButton
            onClick={actions.resetGame}
            label="Reset"
            variant="danger"
            size="sm"
          />
        </div>
      </div>
    );
  }

  // Desktop controls
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary game controls */}
      <div className="flex flex-col gap-2">
        <ControlButton
          onClick={handlePauseResume}
          label={isPaused ? 'Resume' : 'Pause'}
          shortcut={CONTROLS.PAUSE}
          disabled={isGameOver}
          variant="primary"
        />
        
        <ControlButton
          onClick={actions.resetGame}
          label="Reset"
          shortcut={CONTROLS.RESTART}
          variant="danger"
        />
      </div>

      {/* Movement controls */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Movement</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <ControlButton
            onClick={() => actions.movePiece(-1, 0)}
            label="Left"
            shortcut="←"
            disabled={isPaused || isGameOver}
            size="sm"
          />
          
          <ControlButton
            onClick={() => actions.movePiece(1, 0)}
            label="Right"
            shortcut="→"
            disabled={isPaused || isGameOver}
            size="sm"
          />
          
          <ControlButton
            onClick={() => actions.rotatePiece()}
            label="Rotate"
            shortcut="↑"
            disabled={isPaused || isGameOver}
            size="sm"
          />
          
          <ControlButton
            onClick={() => actions.softDrop()}
            label="Down"
            shortcut="↓"
            disabled={isPaused || isGameOver}
            size="sm"
          />
        </div>
      </div>

      {/* Action controls */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Actions</h4>
        
        <div className="space-y-2">
          <ControlButton
            onClick={() => actions.hardDrop()}
            label="Hard Drop"
            shortcut="Space"
            disabled={isPaused || isGameOver}
            size="sm"
          />
          
          <ControlButton
            onClick={() => actions.holdPiece()}
            label="Hold"
            shortcut="C"
            disabled={isPaused || isGameOver}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Simplified control panel for different game states.
 *
 * @param {Object} props - Component props
 * @param {string} props.gameState - Current game state
 * @param {Function} props.onStart - Start game handler
 * @param {Function} props.onReset - Reset game handler
 * @param {Function} props.onPause - Pause/resume handler
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} SimpleControls component
 */
export function SimpleControls({ 
  gameState, 
  // onStart, // Removed unused parameter
  onReset, 
  onPause, 
  className = '' 
}) {
  const { isGameOver, isPaused } = gameState;

  if (isGameOver) {
    return (
      <div className={`space-y-2 ${className}`}>
        <ControlButton
          onClick={onReset}
          label="Play Again"
          variant="primary"
        />
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <ControlButton
        onClick={onPause}
        label={isPaused ? 'Resume' : 'Pause'}
        variant={isPaused ? 'primary' : 'secondary'}
        size="sm"
      />
      
      <ControlButton
        onClick={onReset}
        label="Reset"
        variant="danger"
        size="sm"
      />
    </div>
  );
}

/**
 * Control instructions display.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.showMobile - Whether to show mobile instructions
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} ControlInstructions component
 */
export function ControlInstructions({ showMobile = false, className = '' }) {
  const instructions = showMobile ? [
    { action: 'Move Left/Right', control: 'Tap ← →' },
    { action: 'Rotate', control: 'Tap ↻' },
    { action: 'Soft Drop', control: 'Tap ↓' },
    { action: 'Hard Drop', control: 'Tap Drop' },
    { action: 'Hold Piece', control: 'Tap Hold' },
  ] : [
    { action: 'Move Left/Right', control: '← →' },
    { action: 'Rotate', control: '↑' },
    { action: 'Soft Drop', control: '↓' },
    { action: 'Hard Drop', control: 'Space' },
    { action: 'Hold Piece', control: 'C' },
    { action: 'Pause/Resume', control: 'P' },
    { action: 'Reset Game', control: 'R' },
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-3 ${className}`}>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">
        Controls
      </h4>
      
      <div className="space-y-1 text-xs">
        {instructions.map(({ action, control }, index) => (
          <div key={index} className="flex justify-between">
            <span>{action}</span>
            <span className="font-mono text-muted-foreground">{control}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameControls;