import Link from 'next/link';
import { Navigation } from '../components/Navigation.js';

export default function Home() {
  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                🧩 Tetris Game
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the classic puzzle game with modern features. 
                Play solo, compete on leaderboards, and enjoy responsive design across all devices.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/game"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              >
                🎮 Start Playing
              </Link>
              
              <Link
                href="/leaderboard"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 border border-border"
              >
                🏆 View Leaderboard
              </Link>
            </div>

            {/* Game Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-2">Classic Gameplay</h3>
                <p className="text-muted-foreground text-sm">
                  All the classic Tetris features you love: 7 piece types, line clearing, level progression, and scoring.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-lg font-semibold mb-2">Responsive Design</h3>
                <p className="text-muted-foreground text-sm">
                  Play on any device with touch controls for mobile and keyboard controls for desktop.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🌙</div>
                <h3 className="text-lg font-semibold mb-2">Dark/Light Theme</h3>
                <p className="text-muted-foreground text-sm">
                  Switch between dark and light themes or use system preference for optimal comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Game Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">🎮 Core Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Hold piece functionality</li>
                  <li>• Next piece preview</li>
                  <li>• Ghost piece shadow</li>
                  <li>• Pause and resume</li>
                  <li>• Level progression</li>
                  <li>• Score tracking</li>
                </ul>
              </div>

              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">🏆 Advanced Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Player name registration</li>
                  <li>• Top 10 leaderboard</li>
                  <li>• Game state persistence</li>
                  <li>• Responsive controls</li>
                  <li>• Theme switching</li>
                  <li>• Game statistics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/game"
                className="bg-card border border-border hover:border-primary/50 rounded-lg p-6 transition-all duration-200 hover:shadow-md group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
                <h3 className="text-lg font-semibold mb-2">Play Now</h3>
                <p className="text-muted-foreground text-sm">
                  Jump straight into the game
                </p>
              </Link>

              <Link
                href="/leaderboard"
                className="bg-card border border-border hover:border-primary/50 rounded-lg p-6 transition-all duration-200 hover:shadow-md group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
                <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
                <p className="text-muted-foreground text-sm">
                  View top scores and rankings
                </p>
              </Link>

              <Link
                href="/rules"
                className="bg-card border border-border hover:border-primary/50 rounded-lg p-6 transition-all duration-200 hover:shadow-md group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📖</div>
                <h3 className="text-lg font-semibold mb-2">How to Play</h3>
                <p className="text-muted-foreground text-sm">
                  Learn the rules and controls
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Development Attribution */}
        <section className="py-8 px-4 bg-muted/50 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">🤖</span>
                <h3 className="text-lg font-semibold text-foreground">Development Attribution</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This Tetris game was developed by <strong className="text-foreground">Claude Code</strong> through 
                <strong className="text-foreground"> Context Engineering</strong> for AI-assisted coding. 
                Context Engineering represents a systematic approach to providing comprehensive context to AI coding assistants, 
                enabling complex, production-quality implementations through structured documentation, examples, and validation loops.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Built with Next.js 15 • React 19 • Tailwind CSS 4 • Modern Web Standards
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
