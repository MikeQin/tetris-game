import { BOARD_WIDTH, BOARD_HEIGHT, LINES_PER_LEVEL, TETROMINO_COLORS, GAME_STATES } from './constants.js';
import { getTetrominoPositions } from './tetrominoes.js';

/**
 * Creates a new empty game board.
 *
 * @returns {Array<Array<number>>} 2D array representing the game board
 */
export function createEmptyBoard() {
  return Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
}

/**
 * Checks if a tetromino can be placed at the specified position.
 *
 * @param {Array<Array<number>>} board - The game board
 * @param {Object} tetromino - The tetromino to check
 * @param {number} x - X position to check
 * @param {number} y - Y position to check
 * @returns {boolean} True if the piece can be placed, false otherwise
 */
export function canPlacePiece(board, tetromino, x = tetromino.x, y = tetromino.y) {
  const shape = tetromino.shape;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with placed pieces (ignore negative Y for piece spawn)
        if (newY >= 0 && board[newY][newX]) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Places a tetromino on the board and returns a new board.
 *
 * @param {Array<Array<number>>} board - The game board
 * @param {Object} tetromino - The tetromino to place
 * @returns {Array<Array<number>>} New board with the piece placed
 */
export function placePiece(board, tetromino) {
  const newBoard = board.map(row => [...row]);
  const positions = getTetrominoPositions(tetromino);

  positions.forEach(({ x, y }) => {
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      // Store the tetromino CSS class for proper coloring
      newBoard[y][x] = TETROMINO_COLORS[tetromino.type];
    }
  });

  return newBoard;
}

/**
 * Finds all complete lines on the board.
 *
 * @param {Array<Array<number>>} board - The game board
 * @returns {Array<number>} Array of row indices that are complete
 */
export function findCompleteLines(board) {
  const completeLines = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== 0)) {
      completeLines.push(y);
    }
  }

  return completeLines;
}

/**
 * Clears complete lines from the board and returns the new board.
 *
 * @param {Array<Array<number>>} board - The game board
 * @returns {Object} Object with newBoard and linesCleared count
 */
export function clearLines(board) {
  const completeLines = findCompleteLines(board);
  
  if (completeLines.length === 0) {
    return { newBoard: board, linesCleared: 0 };
  }

  // Create new board without complete lines
  const newBoard = [];
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (!completeLines.includes(y)) {
      newBoard.push([...board[y]]);
    }
  }

  // Add empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }

  return { newBoard, linesCleared: completeLines.length };
}

/**
 * Checks if the game is over (pieces stacked above the board).
 *
 * @param {Array<Array<number>>} board - The game board
 * @param {Object} tetromino - The current tetromino
 * @returns {boolean} True if game is over, false otherwise
 */
export function isGameOver(board, tetromino) {
  // Game over if we can't place the current piece at its spawn position
  return !canPlacePiece(board, tetromino, tetromino.x, tetromino.y);
}

/**
 * Calculates the hard drop distance for a tetromino.
 *
 * @param {Array<Array<number>>} board - The game board
 * @param {Object} tetromino - The tetromino to drop
 * @returns {number} Distance the piece can fall
 */
export function getHardDropDistance(board, tetromino) {
  let distance = 0;
  
  while (canPlacePiece(board, tetromino, tetromino.x, tetromino.y + distance + 1)) {
    distance++;
  }
  
  return distance;
}

/**
 * Gets the shadow/ghost piece position for preview.
 *
 * @param {Array<Array<number>>} board - The game board
 * @param {Object} tetromino - The current tetromino
 * @returns {Object} Tetromino at the hard drop position
 */
export function getShadowPiece(board, tetromino) {
  const dropDistance = getHardDropDistance(board, tetromino);
  return {
    ...tetromino,
    y: tetromino.y + dropDistance,
  };
}

/**
 * Calculates the current level based on lines cleared.
 *
 * @param {number} linesCleared - Total lines cleared
 * @returns {number} Current level (1-based)
 */
export function calculateLevel(linesCleared) {
  return Math.floor(linesCleared / LINES_PER_LEVEL) + 1;
}

/**
 * Calculates the drop speed for the current level.
 *
 * @param {number} level - Current level
 * @returns {number} Drop interval in milliseconds
 */
export function calculateDropSpeed(level) {
  const baseSpeed = 1000;
  const speedIncrease = 100;
  const minSpeed = 50;
  
  return Math.max(minSpeed, baseSpeed - (level - 1) * speedIncrease);
}

/**
 * Checks if a position is within the board boundaries.
 *
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} True if position is within bounds
 */
export function isWithinBounds(x, y) {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

/**
 * Gets a copy of the board with the current piece rendered on it.
 *
 * @param {Array<Array<number>>} board - The game board
 * @param {Object} tetromino - The current tetromino
 * @returns {Array<Array<number>>} Board with current piece
 */
export function getBoardWithPiece(board, tetromino) {
  if (!tetromino) return board;
  
  const newBoard = board.map(row => [...row]);
  const positions = getTetrominoPositions(tetromino);

  positions.forEach(({ x, y }) => {
    if (isWithinBounds(x, y)) {
      newBoard[y][x] = TETROMINO_COLORS[tetromino.type];
    }
  });

  return newBoard;
}

/**
 * Validates that a board is in a valid state.
 *
 * @param {Array<Array<number>>} board - The game board
 * @returns {boolean} True if board is valid
 */
export function validateBoard(board) {
  if (!Array.isArray(board) || board.length !== BOARD_HEIGHT) {
    return false;
  }

  return board.every(row => 
    Array.isArray(row) && 
    row.length === BOARD_WIDTH &&
    row.every(cell => typeof cell === 'string' || cell === 0)
  );
}

/**
 * Creates initial game state.
 *
 * @param {string} playerName - Name of the player
 * @returns {Object} Initial game state object
 */
export function createInitialGameState(playerName = '') {
  // Only use the player name if it's valid, otherwise leave empty
  const validPlayerName = playerName && typeof playerName === 'string' && playerName.trim() 
    ? playerName.trim() 
    : '';
    
  return {
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    holdPiece: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    isGameOver: false,
    isPaused: false,
    gameState: GAME_STATES.MENU,
    playerName: validPlayerName,
    gameStartTime: Date.now(),
    lastDropTime: Date.now(),
    tetrominoBag: [],
    bagIndex: 0,
    shouldSpawnNext: false,
  };
}