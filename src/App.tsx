import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden flex flex-col pt-8 sm:items-center sm:justify-center relative selection:bg-cyan-500/30">
      
      {/* Background Neon Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] sm:top-0 left-[-10%] sm:left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] sm:right-1/4 w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 hidden sm:block mb-8 text-center">
        <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-fuchsia-400 to-purple-600 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          NEON SNAKE
        </h1>
        <p className="text-gray-400 tracking-[0.3em] text-sm mt-2 font-mono">SYNTHWAVE EDITION</p>
      </div>

      <div className="relative z-10 w-full px-4 mb-24 sm:mb-32 flex justify-center">
        <SnakeGame />
      </div>

      <MusicPlayer />
    </div>
  );
}
