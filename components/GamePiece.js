'use client';

import React from 'react';
import { TETROMINO_COLORS } from '../utils/constants.js';

/**
 * Component for rendering a single tetromino piece block.
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Tetromino type (I, O, T, S, Z, J, L)
 * @param {boolean} props.isGhost - Whether this is a ghost/shadow piece
 * @param {boolean} props.isActive - Whether this is part of the active piece
 * @param {string} props.size - Size variant ('xs', 'sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PieceBlock component
 */
export function PieceBlock({ 
  type, 
  isGhost = false, 
  isActive = false, 
  size = 'md', 
  className = '' 
}) {
  if (!type || type === 0) {
    return <div className={`bg-transparent ${className}`} />;
  }

  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  let blockClasses = `
    ${sizeClasses[size]} 
    border transition-all duration-150
    ${className}
  `;

  if (isGhost) {
    // Ghost/shadow piece styling
    blockClasses += ` 
      border-2 border-dashed border-muted-foreground/40 
      bg-transparent
    `;
  } else {
    // Normal piece styling
    const colorClass = TETROMINO_COLORS[type] || 'bg-muted';
    blockClasses += ` 
      ${colorClass} 
      border-foreground/20
      shadow-sm
    `;
    
    if (isActive) {
      blockClasses += ' ring-1 ring-primary/30 scale-105';
    }
  }

  return <div className={blockClasses} />;
}

/**
 * Component for rendering a complete tetromino piece.
 *
 * @param {Object} props - Component props
 * @param {Object} props.piece - Tetromino piece object with shape and type
 * @param {boolean} props.isGhost - Whether this is a ghost/shadow piece
 * @param {boolean} props.isActive - Whether this is the active falling piece
 * @param {string} props.size - Size variant for blocks
 * @param {boolean} props.centerInGrid - Whether to center the piece in a 4x4 grid
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} GamePiece component
 */
export function GamePiece({ 
  piece, 
  isGhost = false, 
  isActive = false, 
  size = 'md',
  centerInGrid = false,
  className = '' 
}) {
  if (!piece || !piece.shape) {
    return null;
  }

  const { shape, type } = piece;

  if (centerInGrid) {
    // Render in a 4x4 grid with the piece centered
    const gridSize = 4;
    const shapeHeight = shape.length;
    const shapeWidth = shape[0]?.length || 0;
    
    const offsetY = Math.floor((gridSize - shapeHeight) / 2);
    const offsetX = Math.floor((gridSize - shapeWidth) / 2);

    return (
      <div className={`grid grid-cols-4 gap-0.5 ${className}`}>
        {Array.from({ length: gridSize * gridSize }, (_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          
          const shapeRow = row - offsetY;
          const shapeCol = col - offsetX;
          
          const isFilledBlock = 
            shapeRow >= 0 && 
            shapeRow < shapeHeight && 
            shapeCol >= 0 && 
            shapeCol < shapeWidth && 
            shape[shapeRow][shapeCol];

          return (
            <PieceBlock
              key={index}
              type={isFilledBlock ? type : null}
              isGhost={isGhost}
              isActive={isActive}
              size={size}
            />
          );
        })}
      </div>
    );
  }

  // Render the piece as-is (for game board display)
  return (
    <div className={`inline-grid gap-0.5 ${className}`} style={{ gridTemplateColumns: `repeat(${shape[0]?.length || 0}, 1fr)` }}>
      {shape.flat().map((cell, index) => (
        <PieceBlock
          key={index}
          type={cell ? type : null}
          isGhost={isGhost}
          isActive={isActive}
          size={size}
        />
      ))}
    </div>
  );
}

/**
 * Component for displaying tetromino pieces in a preview container.
 *
 * @param {Object} props - Component props
 * @param {Object} props.piece - Tetromino piece to display
 * @param {string} props.title - Title for the preview
 * @param {string} props.size - Size variant
 * @param {boolean} props.disabled - Whether the preview is disabled
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PiecePreview component
 */
export function PiecePreview({ 
  piece, 
  title, 
  size = 'sm', 
  disabled = false,
  className = '' 
}) {
  const containerClasses = `
    bg-card border border-border rounded-lg p-3
    flex flex-col items-center gap-2
    transition-opacity duration-200
    ${disabled ? 'opacity-50' : 'opacity-100'}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground text-center">
          {title}
        </h3>
      )}
      
      <div className="w-16 h-16 flex items-center justify-center">
        {piece ? (
          <GamePiece
            piece={piece}
            size={size}
            centerInGrid={true}
          />
        ) : (
          <div className="text-muted-foreground/50 text-xs text-center">
            Empty
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Component for displaying multiple pieces (e.g., next pieces queue).
 *
 * @param {Object} props - Component props
 * @param {Array} props.pieces - Array of tetromino pieces
 * @param {string} props.title - Title for the queue
 * @param {number} props.maxVisible - Maximum number of pieces to show
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PieceQueue component
 */
export function PieceQueue({ 
  pieces = [], 
  title, 
  maxVisible = 3,
  className = '' 
}) {
  const visiblePieces = pieces.slice(0, maxVisible);

  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
      )}
      
      <div className="space-y-2">
        {visiblePieces.map((piece, index) => (
          <PiecePreview
            key={index}
            piece={piece}
            size="xs"
            className={index > 0 ? 'scale-90 opacity-75' : ''}
          />
        ))}
        
        {visiblePieces.length === 0 && (
          <div className="text-muted-foreground/50 text-xs text-center py-4">
            No pieces in queue
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Component for displaying piece statistics/count.
 *
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics object with piece counts
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PieceStats component
 */
export function PieceStats({ stats = {}, className = '' }) {
  const pieceTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  return (
    <div className={`bg-card border border-border rounded-lg p-3 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Pieces Used
      </h3>
      
      <div className="space-y-1">
        {pieceTypes.map(type => (
          <div key={type} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <PieceBlock type={type} size="xs" />
              <span className="font-mono">{type}</span>
            </div>
            <span className="text-muted-foreground">
              {stats[type] || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamePiece;