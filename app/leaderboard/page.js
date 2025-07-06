'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '../../components/Navigation.js';
import { Leaderboard, LeaderboardStats, PersonalBest } from '../../components/Leaderboard.js';
import { useAlert, useConfirm } from '../../components/AlertModal.js';
import { useLeaderboard, usePlayerName } from '../../hooks/useLeaderboard.js';

export default function LeaderboardPage() {
  const { 
    leaderboard, 
    isLoading, 
    getLeaderboardStats, 
    getPlayerBest,
    clearLeaderboard 
  } = useLeaderboard();
  const { playerName } = usePlayerName();
  const { showAlert, AlertModal } = useAlert();
  const { showConfirm, ConfirmModal } = useConfirm();

  const stats = getLeaderboardStats();
  const personalBest = getPlayerBest(playerName);

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
            <p className="text-muted-foreground">
              Compete for the top spot and track your best scores
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Leaderboard */}
              <div className="lg:col-span-2">
                <Leaderboard
                  entries={leaderboard}
                  currentPlayerName={playerName}
                  isLoading={isLoading}
                  title="Top 5 Players"
                />

                {/* Action Buttons */}
                {!isLoading && leaderboard.length > 0 && (
                  <div className="mt-6 flex gap-4 justify-center">
                    <Link
                      href="/game"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      🎮 Play Now
                    </Link>
                    
                    <button
                      onClick={async () => {
                        const confirmed = await showConfirm({
                          title: 'Clear All Scores',
                          message: 'Are you sure you want to clear all scores? This action cannot be undone.',
                          confirmText: 'Clear All',
                          cancelText: 'Cancel',
                          type: 'error'
                        });
                        if (confirmed) {
                          clearLeaderboard();
                        }
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Personal Best */}
                {playerName && (
                  <PersonalBest
                    personalBest={personalBest}
                    playerName={playerName}
                  />
                )}

                {/* Statistics */}
                <LeaderboardStats stats={stats} />

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                  
                  <Link
                    href="/game"
                    className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-center"
                  >
                    🎮 Start New Game
                  </Link>
                  
                  <Link
                    href="/rules"
                    className="block w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-center border border-border"
                  >
                    📖 View Rules
                  </Link>
                  
                  <Link
                    href="/"
                    className="block w-full bg-accent text-accent-foreground hover:bg-accent/80 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-center"
                  >
                    🏠 Back to Home
                  </Link>
                </div>

                {/* Scoring Guide */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Scoring Guide</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">Line Clears</div>
                      <div className="text-muted-foreground space-y-1">
                        <div>• Single: 40 × level</div>
                        <div>• Double: 100 × level</div>
                        <div>• Triple: 300 × level</div>
                        <div>• Tetris: 1200 × level</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium">Drops</div>
                      <div className="text-muted-foreground space-y-1">
                        <div>• Soft drop: 1 point per cell</div>
                        <div>• Hard drop: 2 points per cell</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium">Level Up</div>
                      <div className="text-muted-foreground">
                        Every 10 lines cleared
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ConfirmModal />
    </>
  );
}