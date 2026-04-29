import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Sparkles, Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#030014] overflow-hidden flex flex-col relative font-mono text-cyan-50">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-10 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Gamepad2 className="text-cyan-400 w-8 h-8 drop-shadow-[0_0_8px_#22d3ee]" />
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] uppercase tracking-wider">
            Retro.Grid
          </h1>
        </div>
        <div className="flex justify-end items-center space-x-2 text-pink-400 text-sm">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="opacity-80">AI Generated Beats</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 lg:gap-16 z-10">
        
        {/* Left/Top: Music Player */}
        <section className="flex flex-col items-center justify-center w-full lg:w-1/3 space-y-6">
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl font-black text-pink-500 neon-text-pink uppercase italic tracking-widest">
              Audio Link
            </h2>
            <p className="text-sm text-pink-200/60 max-w-xs mx-auto">
              Sync your brainwaves. Music plays automatically upon track skip.
            </p>
          </div>
          <MusicPlayer />
        </section>

        {/* Right/Bottom: Snake Game */}
        <section className="flex w-full lg:w-2/3 items-center justify-center">
          <SnakeGame />
        </section>

      </main>

      {/* Grid Overlay for CRT effect (subtle) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-50 opacity-20 mix-blend-overlay"></div>
    </div>
  );
}

