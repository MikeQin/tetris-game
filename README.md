# 🧩 Tetris Game - Built with Context Engineering

A modern, fully-featured Tetris game built with Next.js, showcasing the power of **Context Engineering** for AI-assisted development.

![Tetris Game Preview](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Live Demo

[**Play Now on Vercel** →](https://your-deployment-url.vercel.app)

## ✨ Features

### 🎮 Core Gameplay
- **Classic Tetris Mechanics** - All 7 standard tetrominoes with authentic gameplay
- **Hold Piece** - Store a piece for later use (once per piece)
- **Next Piece Preview** - See what's coming next
- **Ghost Piece** - Shadow shows where pieces will land
- **Line Clearing** - Standard Tetris line clearing with scoring
- **Level Progression** - Increasing speed as you advance

### 🏆 Game Modes & Features
- **Player Registration** - Enter your name and compete
- **Leaderboard** - Top 10 players with persistent scores
- **Pause/Resume** - Toggle gameplay with spacebar
- **Game Statistics** - Track score, level, lines cleared, and time
- **Game State Persistence** - Resume where you left off

### 🎨 Modern UX
- **Dark/Light Theme** - Toggle or use system preference
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Touch Controls** - Mobile-optimized touch interface
- **Keyboard Controls** - Full keyboard support for desktop
- **Smooth Animations** - 60fps gameplay with CSS animations

### 🛠️ Technical Features
- **localStorage Persistence** - Game state and scores saved locally
- **Custom Modal System** - No browser popups, elegant custom modals
- **Progressive Enhancement** - Works without JavaScript for basic functionality
- **Accessibility** - Keyboard navigation and screen reader support

## 🎯 Controls

### Desktop (Keyboard)
- **Arrow Left/Right** - Move piece left/right
- **Arrow Down** - Soft drop (faster fall)
- **Arrow Up** - Rotate piece clockwise
- **Spacebar** - Hard drop (instant drop)
- **C** - Hold piece
- **P** - Pause/Resume
- **R** - Reset game

### Mobile (Touch)
- **Tap Left/Right edges** - Move piece
- **Tap Center** - Rotate piece
- **Swipe Down** - Soft drop
- **Double Tap** - Hard drop
- **Hold Button** - Hold piece

## 🏗️ Technical Stack

### Frontend Framework
- **Next.js 15.3.5** - React framework with App Router
- **React 19.0.0** - Latest React with modern hooks
- **Tailwind CSS 4.0** - Utility-first CSS framework

### Development Tools
- **ESLint** - Code linting and formatting
- **next-themes** - Dark/light theme management
- **Modern JavaScript** - ES2022+ features

### Architecture
- **Component-Based** - Modular React components
- **Custom Hooks** - Reusable game logic
- **Utils Library** - Pure functions for game mechanics
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tetris-game.git
cd tetris-game

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📁 Project Structure

```
tetris-game/
├── app/                    # Next.js App Router pages
│   ├── game/              # Game page
│   ├── leaderboard/       # Leaderboard page
│   ├── rules/             # Rules page
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GameBoard.js       # Main game board
│   ├── GameStats.js       # Score/level display
│   ├── GameControls.js    # Game control buttons
│   ├── AlertModal.js      # Custom modal system
│   ├── Navigation.js      # Site navigation
│   └── ...               # Other UI components
├── hooks/                 # Custom React hooks
│   ├── useGame.js         # Main game logic
│   ├── useGameState.js    # Game state management
│   ├── useLocalStorage.js # localStorage wrapper
│   └── ...               # Other hooks
├── utils/                 # Pure utility functions
│   ├── gameLogic.js       # Core game mechanics
│   ├── tetrominoes.js     # Piece definitions
│   ├── scoring.js         # Scoring system
│   └── constants.js       # Game constants
└── public/               # Static assets
```

## 🎮 Game Rules

### Objective
Arrange falling tetrominoes to create complete horizontal lines, which disappear and award points.

### Scoring System
- **Single Line**: 40 × level
- **Double Lines**: 100 × level  
- **Triple Lines**: 300 × level
- **Tetris (4 lines)**: 1200 × level
- **Soft Drop**: 1 point per cell
- **Hard Drop**: 2 points per cell

### Level Progression
- Start at Level 1
- Advance one level every 10 lines cleared
- Higher levels = faster piece falling speed

## 🤖 About Context Engineering

This Tetris game was developed using **Context Engineering** - a systematic approach to AI-assisted development that provides comprehensive context to coding assistants.

### What is Context Engineering?
Context Engineering goes beyond simple prompt engineering by providing:
- **Comprehensive Documentation** - Complete API references and examples
- **Implementation Patterns** - Proven code patterns and best practices  
- **Validation Loops** - Built-in testing and quality assurance
- **Progressive Complexity** - Incremental feature development

### Development Process
1. **Requirements Analysis** - Detailed feature specifications
2. **Architecture Planning** - System design and component structure
3. **Incremental Implementation** - Step-by-step feature development
4. **Continuous Validation** - Testing and refinement at each step
5. **Quality Assurance** - Code review and optimization

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

No environment variables required - the game runs entirely client-side.

### Browser Support

- **Chrome/Edge** - Full support
- **Firefox** - Full support  
- **Safari** - Full support
- **Mobile Browsers** - Optimized touch controls

## 📸 Screenshots

### Desktop View
![Desktop Screenshot](https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Desktop+Tetris+Game)

### Mobile View  
![Mobile Screenshot](https://via.placeholder.com/400x800/1a1a1a/ffffff?text=Mobile+Tetris+Game)

### Dark Theme
![Dark Theme](https://via.placeholder.com/800x600/000000/ffffff?text=Dark+Theme)

## 🤝 Contributing

This project demonstrates Context Engineering principles. Contributions that enhance the educational value are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Claude Code** - AI-assisted development platform
- **Context Engineering** - Systematic AI development methodology
- **Next.js Team** - Excellent React framework
- **Tailwind CSS** - Beautiful utility-first CSS
- **Tetris** - Classic game that inspired this implementation

## 📞 Support

If you have questions about the implementation or Context Engineering:

- Open an [Issue](https://github.com/yourusername/tetris-game/issues)
- Check the [Documentation](https://docs.anthropic.com/en/docs/claude-code)
- Review the [Context Engineering Guide](https://github.com/yourusername/tetris-game/wiki)

---

**Built with ❤️ using Context Engineering and Claude Code**