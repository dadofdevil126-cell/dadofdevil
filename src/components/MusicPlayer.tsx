import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Nights',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Cybernetic Dreams',
    artist: 'AI Retrowave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'AI Chiptune',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-sm p-6 bg-gray-900 border border-pink-500 rounded-xl neon-border-pink flex flex-col items-center space-y-4">
      <div className="text-center w-full">
        <h2 className="text-xl font-bold text-pink-400 neon-text-pink mb-1 uppercase tracking-wider truncate">
          {currentTrack.title}
        </h2>
        <p className="text-sm text-pink-200 opacity-80">{currentTrack.artist}</p>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-pink-500 shadow-[0_0_10px_#ec4899] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={skipBackward}
          className="text-pink-400 hover:text-pink-300 transition-colors drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] focus:outline-none"
        >
          <SkipBack size={28} />
        </button>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-pink-500 rounded-full text-black hover:bg-pink-400 hover:shadow-[0_0_20px_#ec4899] shadow-[0_0_10px_#ec4899] transition-all focus:outline-none"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={skipForward}
          className="text-pink-400 hover:text-pink-300 transition-colors drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] focus:outline-none"
        >
          <SkipForward size={28} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center w-full space-x-3 text-pink-400">
        <button onClick={() => setIsMuted(!isMuted)} className="focus:outline-none hover:text-pink-300">
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
      </div>
    </div>
  );
}
