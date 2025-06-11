import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({ audioUrl, isPlaying, onPlayToggle }) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update audio element when URL changes
    audio.src = audioUrl;
    audio.load();

    // Event listeners
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    
    if (!progressBar || !audio) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <audio ref={audioRef} onEnded={onPlayToggle} />
      
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={onPlayToggle}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        
        <div className="text-xs text-gray-600 font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        <button
          onClick={toggleMute}
          className="text-gray-600 hover:text-blue-600 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
      
      <div 
        ref={progressBarRef}
        className="w-full h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        ></div>
      </div>
      
      <div className="mt-2 flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 accent-blue-500"
          aria-label="Volume"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;