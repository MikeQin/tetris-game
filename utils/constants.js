// Game constants and settings
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const PREVIEW_SIZE = 4;

// Tetromino types
export const TETROMINO_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Initial drop speed in milliseconds
export const INITIAL_DROP_SPEED = 1000;

// Speed increase per level (makes game faster)
export const SPEED_INCREASE_PER_LEVEL = 100;

// Minimum drop speed (fastest possible)
export const MIN_DROP_SPEED = 50;

// Points awarded for different actions
export const POINTS = {
  SOFT_DROP: 1,
  HARD_DROP: 2,
  SINGLE_LINE: 40,
  DOUBLE_LINE: 100,
  TRIPLE_LINE: 300,
  TETRIS: 1200,
};

// Lines needed to advance to next level
export const LINES_PER_LEVEL = 10;

// Game states
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
};

// Keyboard controls
export const CONTROLS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',
  SPACE: ' ',
  HOLD: 'c',
  PAUSE: 'p',
  RESTART: 'r',
};

// Local storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'tetris-game-state',
  LEADERBOARD: 'tetris-leaderboard',
  PLAYER_NAME: 'tetris-player-name',
  HIGH_SCORE: 'tetris-high-score',
};

// Theme settings
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Tetromino colors (matching CSS classes)
export const TETROMINO_COLORS = {
  I: 'tetromino-i',
  O: 'tetromino-o',
  T: 'tetromino-t',
  S: 'tetromino-s',
  Z: 'tetromino-z',
  J: 'tetromino-j',
  L: 'tetromino-l',
};

// Responsive breakpoints (for mobile controls)
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
};

// Touch gesture settings
export const TOUCH_SETTINGS = {
  SWIPE_THRESHOLD: 50,
  TAP_TIMEOUT: 300,
  DOUBLE_TAP_TIMEOUT: 500,
};