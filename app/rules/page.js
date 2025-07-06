import React from 'react';
import Link from 'next/link';
import { Navigation } from '../../components/Navigation.js';

export default function RulesPage() {
  const controls = [
    { action: 'Move Left', key: '←', description: 'Move the falling piece to the left' },
    { action: 'Move Right', key: '→', description: 'Move the falling piece to the right' },
    { action: 'Soft Drop', key: '↓', description: 'Make the piece fall faster (1 point per cell)' },
    { action: 'Rotate', key: '↑', description: 'Rotate the piece clockwise by 90 degrees' },
    { action: 'Hard Drop', key: 'Space', description: 'Instantly drop the piece to the bottom (2 points per cell)' },
    { action: 'Hold Piece', key: 'C', description: 'Store the current piece for later use (once per piece)' },
    { action: 'Pause/Resume', key: 'P', description: 'Pause or resume the game' },
    { action: 'Reset Game', key: 'R', description: 'Start a new game' },
  ];

  const tetrominoes = [
    { name: 'I-Piece', shape: '🟦🟦🟦🟦', description: 'The line piece - perfect for Tetrises!' },
    { name: 'O-Piece', shape: '🟨🟨\n🟨🟨', description: 'The square piece - only piece that doesn&apos;t rotate' },
    { name: 'T-Piece', shape: ' 🟪 \n🟪🟪🟪', description: 'The T-shaped piece - very versatile' },
    { name: 'S-Piece', shape: ' 🟩🟩\n🟩🟩 ', description: 'The S-shaped piece' },
    { name: 'Z-Piece', shape: '🟥🟥 \n 🟥🟥', description: 'The Z-shaped piece' },
    { name: 'J-Piece', shape: '🟦  \n🟦🟦🟦', description: 'The J-shaped piece' },
    { name: 'L-Piece', shape: '  🟧\n🟧🟧🟧', description: 'The L-shaped piece' },
  ];

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">📖 How to Play Tetris</h1>
            <p className="text-muted-foreground">
              Learn the rules, controls, and strategies to master the game
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Game Objective */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🎯 Game Objective</h2>
              <p className="text-muted-foreground mb-4">
                The goal of Tetris is to score as many points as possible by clearing horizontal rows of blocks. 
                Arrange the falling tetromino pieces to completely fill horizontal lines, which will then disappear 
                and award you points.
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-medium">⚠️ Game Over Condition:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The game ends when pieces stack up to the top of the playing field and no new pieces can be spawned.
                </p>
              </div>
            </section>

            {/* Controls */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🎮 Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {controls.map(({ action, key, description }, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm font-mono">
                        {key}
                      </span>
                      <span className="font-medium">{action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tetromino Pieces */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🧩 Tetromino Pieces</h2>
              <p className="text-muted-foreground mb-6">
                There are 7 different tetromino shapes, each with a unique color and rotation pattern:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tetrominoes.map(({ name, shape, description }, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-mono text-lg leading-tight whitespace-pre-line">
                        {shape}
                      </div>
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-muted-foreground">{description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Scoring System */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">📊 Scoring System</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Line Clears</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-muted/30 rounded px-3 py-2">
                      <span>Single (1 line)</span>
                      <span className="font-mono">40 × level</span>
                    </div>
                    <div className="flex justify-between bg-muted/30 rounded px-3 py-2">
                      <span>Double (2 lines)</span>
                      <span className="font-mono">100 × level</span>
                    </div>
                    <div className="flex justify-between bg-muted/30 rounded px-3 py-2">
                      <span>Triple (3 lines)</span>
                      <span className="font-mono">300 × level</span>
                    </div>
                    <div className="flex justify-between bg-muted/30 rounded px-3 py-2">
                      <span className="font-semibold">Tetris (4 lines)</span>
                      <span className="font-mono font-semibold">1200 × level</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Drop Bonuses</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-muted/30 rounded px-3 py-2">
                      <span>Soft Drop (↓)</span>
                      <span className="font-mono">1 point per cell</span>
                    </div>
                    <div className="flex justify-between bg-muted/30 rounded px-3 py-2">
                      <span>Hard Drop (Space)</span>
                      <span className="font-mono">2 points per cell</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 mt-4">Level Progression</h3>
                  <div className="bg-muted/30 rounded px-3 py-2 text-sm">
                    <div className="flex justify-between">
                      <span>Level Up</span>
                      <span className="font-mono">Every 10 lines</span>
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Higher levels = faster piece drops
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Special Features */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">✨ Special Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hold Piece</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Press <kbd className="bg-secondary px-2 py-1 rounded text-xs">C</kbd> to store the current piece for later use. 
                    You can only hold one piece at a time and can only use the hold function once per piece.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Next Piece Preview</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The next piece is always shown so you can plan your moves in advance. 
                    Use this information to position your current piece optimally.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Ghost Piece</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    A semi-transparent preview shows where your piece will land if you hard drop. 
                    This helps you position pieces precisely.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your best scores are saved locally and displayed on the leaderboard. 
                    Compete with yourself and others for the highest score!
                  </p>
                </div>
              </div>
            </section>

            {/* Strategy Tips */}
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">💡 Strategy Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="font-medium mb-1">🏗️ Keep it Flat</h4>
                    <p className="text-sm text-muted-foreground">
                      Try to keep your stack relatively flat to avoid creating hard-to-fill gaps.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="font-medium mb-1">📏 Save I-Pieces</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the hold function to save I-pieces for Tetrises (4-line clears) - they give the most points!
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="font-medium mb-1">👀 Plan Ahead</h4>
                    <p className="text-sm text-muted-foreground">
                      Always check the next piece preview and plan your moves accordingly.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="font-medium mb-1">🕳️ Avoid Deep Wells</h4>
                    <p className="text-sm text-muted-foreground">
                      Don&apos;t create deep single-column wells unless you&apos;re specifically setting up for an I-piece.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="font-medium mb-1">⚡ T-Spins (Advanced)</h4>
                    <p className="text-sm text-muted-foreground">
                      T-pieces can fit into tight spots with proper rotation - practice T-spin setups for bonus points.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="font-medium mb-1">🚀 Stay Calm</h4>
                    <p className="text-sm text-muted-foreground">
                      As the game speeds up, focus on survival rather than perfect placement.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Play? 🎮</h2>
              <p className="text-muted-foreground mb-6">
                Now that you know the rules, it&apos;s time to put your skills to the test!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/game"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                >
                  🎮 Start Playing
                </Link>
                
                <Link
                  href="/leaderboard"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 border border-border"
                >
                  🏆 View Leaderboard
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}