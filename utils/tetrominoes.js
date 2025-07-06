import { TETROMINO_COLORS, TETROMINO_TYPES } from './constants.js';

// Define all tetromino shapes with their 4 rotation states
// Each shape is represented as a 2D array where 1 = filled block, 0 = empty
const TETROMINO_SHAPES = {
  I: [
    // Rotation 0: Horizontal
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // Rotation 1: Vertical
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    // Rotation 2: Horizontal (same as 0)
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // Rotation 3: Vertical (same as 1)
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
  ],
  O: [
    // Square piece - same for all rotations
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ],
  T: [
    // T-shaped piece
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  S: [
    // S-shaped piece
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
    ],
  ],
  Z: [
    // Z-shaped piece
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
    ],
  ],
  J: [
    // J-shaped piece
    [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
    ],
  ],
  L: [
    // L-shaped piece
    [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
};

/**
 * Creates a new tetromino piece with initial position and rotation.
 *
 * @param {string} type - The tetromino type (I, O, T, S, Z, J, L)
 * @param {number} x - Initial x position (default: center of board)
 * @param {number} y - Initial y position (default: 0)
 * @param {number} rotation - Initial rotation (default: 0)
 * @returns {Object} Tetromino object with shape, position, and metadata
 */
export function createTetromino(type, x = 3, y = -1, rotation = 0) {
  if (!TETROMINO_TYPES.includes(type)) {
    throw new Error(`Invalid tetromino type: ${type}`);
  }

  return {
    type,
    x,
    y,
    rotation: rotation % 4,
    shape: TETROMINO_SHAPES[type][rotation % 4],
    color: TETROMINO_COLORS[type],
  };
}

/**
 * Rotates a tetromino clockwise by 90 degrees.
 *
 * @param {Object} tetromino - The tetromino to rotate
 * @returns {Object} New tetromino with updated rotation and shape
 */
export function rotateTetromino(tetromino) {
  const newRotation = (tetromino.rotation + 1) % 4;
  return {
    ...tetromino,
    rotation: newRotation,
    shape: TETROMINO_SHAPES[tetromino.type][newRotation],
  };
}

/**
 * Rotates a tetromino counter-clockwise by 90 degrees.
 *
 * @param {Object} tetromino - The tetromino to rotate
 * @returns {Object} New tetromino with updated rotation and shape
 */
export function rotateTetrominoCounterClockwise(tetromino) {
  const newRotation = (tetromino.rotation + 3) % 4; // +3 is same as -1 in mod 4
  return {
    ...tetromino,
    rotation: newRotation,
    shape: TETROMINO_SHAPES[tetromino.type][newRotation],
  };
}

/**
 * Generates a random tetromino type.
 *
 * @returns {string} Random tetromino type
 */
export function getRandomTetrominoType() {
  return TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
}

/**
 * Creates a bag of all 7 tetromino types in random order.
 * This implements the "7-bag" randomization system used in modern Tetris.
 *
 * @returns {Array<string>} Shuffled array of all tetromino types
 */
export function createTetrominoBag() {
  const bag = [...TETROMINO_TYPES];
  
  // Fisher-Yates shuffle algorithm
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  
  return bag;
}

/**
 * Gets the bounding box of a tetromino (actual piece dimensions).
 *
 * @param {Object} tetromino - The tetromino to analyze
 * @returns {Object} Bounding box with minX, maxX, minY, maxY
 */
export function getTetrominoBounds(tetromino) {
  const shape = tetromino.shape;
  let minX = 4, maxX = -1, minY = 4, maxY = -1;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { minX, maxX, minY, maxY };
}

/**
 * Gets all filled positions of a tetromino relative to its position.
 *
 * @param {Object} tetromino - The tetromino to analyze
 * @returns {Array<Object>} Array of {x, y} positions
 */
export function getTetrominoPositions(tetromino) {
  const positions = [];
  const shape = tetromino.shape;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        positions.push({
          x: tetromino.x + x,
          y: tetromino.y + y,
        });
      }
    }
  }

  return positions;
}