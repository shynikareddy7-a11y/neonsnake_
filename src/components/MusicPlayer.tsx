import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, MusicIcon } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Dreams', artist: 'Auto-Gen 01', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Synthwave Circuit', artist: 'Auto-Gen 02', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Overdrive', artist: 'Auto-Gen 03', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Playback prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-fuchsia-500/30 bg-gray-950/80 backdrop-blur-md z-50">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        loop={false}
      />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-full md:w-1/3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            <MusicIcon className="text-white w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-cyan-400 font-bold tracking-wide drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">{currentTrack.title}</h3>
            <p className="text-fuchsia-400/80 text-sm">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 w-full md:w-1/3">
          <button 
            onClick={skipBack}
            className="text-gray-400 hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full border-2 border-fuchsia-500 flex items-center justify-center text-fuchsia-400 hover:bg-fuchsia-500/20 hover:shadow-[0_0_15px_rgba(217,70,239,0.6)] transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button 
            onClick={skipForward}
            className="text-gray-400 hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center justify-end gap-3 w-full md:w-1/3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}
