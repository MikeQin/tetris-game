'use client';

import React from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_COLORS } from '../utils/constants.js';
import { getBoardWithPiece, getShadowPiece } from '../utils/gameLogic.js';

/**
 * Individual cell component for the game board.
 *
 * @param {Object} props - Component props
 * @param {string|number} props.value - Cell value (tetromino type or 0 for empty)
 * @param {boolean} props.isGhost - Whether this is a ghost/shadow piece
 * @param {boolean} props.isCurrent - Whether this is part of the current piece
 * @returns {JSX.Element} Cell component
 */
function BoardCell({ value, isGhost = false, isCurrent = false }) {
  let cellClasses = 'w-full h-full border border-border/20 transition-all duration-150 min-h-[24px]';
  
  if (value && value !== 0) {
    if (isGhost) {
      // Ghost piece styling - semi-transparent with dotted border
      cellClasses += ` border-2 border-dashed border-muted-foreground/40 bg-transparent`;
    } else {
      // Filled cell with tetromino color
      cellClasses += ` ${value} border-foreground/30 shadow-sm`;
      
      if (isCurrent) {
        // Current piece has a subtle glow effect
        cellClasses += ' ring-1 ring-primary/20';
      }
    }
  } else {
    // Empty cell
    cellClasses += ' bg-background/50';
  }
  
  return <div className={cellClasses} />;
}

/**
 * Main game board component that renders the Tetris playing field.
 *
 * @param {Object} props - Component props
 * @param {Array<Array>} props.board - 2D array representing the game board
 * @param {Object} props.currentPiece - Current falling tetromino
 * @param {boolean} props.showGhost - Whether to show ghost/shadow piece
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} GameBoard component
 */
export function GameBoard({ 
  board, 
  currentPiece, 
  showGhost = true, 
  className = '' 
}) {
  // Get board with current piece rendered
  const boardWithPiece = currentPiece ? getBoardWithPiece(board, currentPiece) : board;
  
  // Get ghost piece position for preview
  const ghostPiece = currentPiece && showGhost ? getShadowPiece(board, currentPiece) : null;
  
  // Create a representation that includes ghost piece
  const displayBoard = React.useMemo(() => {
    if (!ghostPiece) return boardWithPiece;
    
    // Create a copy of the board
    const ghostBoard = boardWithPiece.map(row => [...row]);
    
    // Add ghost piece markers
    const shape = ghostPiece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardX = ghostPiece.x + col;
          const boardY = ghostPiece.y + row;
          
          if (boardY >= 0 && boardY < BOARD_HEIGHT && 
              boardX >= 0 && boardX < BOARD_WIDTH &&
              ghostBoard[boardY][boardX] === 0) {
            // Mark as ghost piece (we'll handle this in rendering)
            ghostBoard[boardY][boardX] = `ghost-${ghostPiece.type}`;
          }
        }
      }
    }
    
    return ghostBoard;
  }, [boardWithPiece, ghostPiece]);
  
  // Check which cells are part of the current piece
  const getCurrentPieceCells = React.useMemo(() => {
    if (!currentPiece) return new Set();
    
    const cells = new Set();
    const shape = currentPiece.shape;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardX = currentPiece.x + col;
          const boardY = currentPiece.y + row;
          
          if (boardY >= 0 && boardY < BOARD_HEIGHT && 
              boardX >= 0 && boardX < BOARD_WIDTH) {
            cells.add(`${boardY}-${boardX}`);
          }
        }
      }
    }
    
    return cells;
  }, [currentPiece]);

  const baseClasses = `
    grid grid-cols-10 gap-0 
    bg-card border-2 border-border rounded-lg shadow-lg
    aspect-[1/2] w-96 h-[48rem] max-w-none mx-auto
    relative overflow-hidden
  `;

  return (
    <div className={`${baseClasses} ${className}`}>
      {displayBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isGhost = typeof cell === 'string' && cell.startsWith('ghost-');
          const isCurrent = getCurrentPieceCells.has(`${rowIndex}-${colIndex}`);
          let cellValue = cell;
          
          if (isGhost) {
            // Extract the tetromino type from ghost- prefix and get its CSS class
            const tetrominoType = cell.replace('ghost-', '');
            cellValue = `tetromino-${tetrominoType.toLowerCase()}`;
          }
          
          return (
            <BoardCell
              key={`${rowIndex}-${colIndex}`}
              value={cellValue}
              isGhost={isGhost}
              isCurrent={isCurrent}
            />
          );
        })
      )}
      
      {/* Grid lines overlay for better visibility */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical lines */}
        {Array.from({ length: BOARD_WIDTH - 1 }, (_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-border/10"
            style={{ left: `${((i + 1) / BOARD_WIDTH) * 100}%` }}
          />
        ))}
        
        {/* Horizontal lines */}
        {Array.from({ length: BOARD_HEIGHT - 1 }, (_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-border/10"
            style={{ top: `${((i + 1) / BOARD_HEIGHT) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Miniature board component for previews (next piece, hold piece).
 *
 * @param {Object} props - Component props
 * @param {Object} props.piece - Tetromino piece to display
 * @param {number} props.size - Grid size (default: 4)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Title for accessibility
 * @returns {JSX.Element} MiniBoard component
 */
export function MiniBoard({ piece, size = 4, className = '', title = 'Preview' }) {
  const miniBoard = React.useMemo(() => {
    // Create empty mini board
    const board = Array(size).fill().map(() => Array(size).fill(0));
    
    if (piece && piece.shape) {
      // Center the piece in the mini board
      const shape = piece.shape;
      const offsetX = Math.floor((size - shape[0].length) / 2);
      const offsetY = Math.floor((size - shape.length) / 2);
      
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const boardX = offsetX + col;
            const boardY = offsetY + row;
            
            if (boardY >= 0 && boardY < size && boardX >= 0 && boardX < size) {
              board[boardY][boardX] = TETROMINO_COLORS[piece.type];
            }
          }
        }
      }
    }
    
    return board;
  }, [piece, size]);

  const baseClasses = `
    grid gap-0 bg-card border border-border rounded-md shadow-sm
    aspect-square
  `;

  const gridClass = size === 4 ? 'grid-cols-4' : `grid-cols-${size}`;

  return (
    <div 
      className={`${baseClasses} ${gridClass} ${className}`}
      title={title}
      role="img"
      aria-label={title}
    >
      {miniBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
          />
        ))
      )}
    </div>
  );
}

/**
 * Game board container with responsive layout.
 *
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Current game state
 * @param {React.ReactNode} props.children - Child components (stats, controls, etc.)
 * @returns {JSX.Element} GameBoardContainer component
 */
export function GameBoardContainer({ gameState, children }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
      {/* Left sidebar - stats and hold piece */}
      <div className="lg:w-48 flex lg:flex-col gap-4 order-2 lg:order-1">
        {children?.left}
      </div>
      
      {/* Center - main game board */}
      <div className="flex-1 flex flex-col items-center gap-4 order-1 lg:order-2">
        <GameBoard
          board={gameState.board}
          currentPiece={gameState.currentPiece}
          showGhost={!gameState.isPaused}
        />
        {children?.center}
      </div>
      
      {/* Right sidebar - next piece and controls */}
      <div className="lg:w-48 flex lg:flex-col gap-4 order-3">
        {children?.right}
      </div>
    </div>
  );
}

export default GameBoard;