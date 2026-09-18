import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, 
  Maximize, Minimize, Settings, ArrowRight, ExternalLink, 
  FastForward, Lock, Unlock, Smartphone, Check
} from 'lucide-react';

export default function MxPlayerModal({ movie, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [decoderMode, setDecoderMode] = useState('HW+'); // HW, HW+, SW like MX Player
  const [aspectRatio, setAspectRatio] = useState('fit'); // fit, stretch, crop, 16:9
  const [copiedLink, setCopiedLink] = useState(false);

  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls
  const resetControlsTimer = () => {
    if (isLocked) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
      }
    }, 3500);
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, isLocked]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      resetControlsTimer();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const seek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
      resetControlsTimer();
    }
  };

  const handleSeekSlider = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
    resetControlsTimer();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedChange = (spd) => {
    setPlaybackSpeed(spd);
    if (videoRef.current) {
      videoRef.current.playbackRate = spd;
    }
    setShowSpeedMenu(false);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const openInNativeMxPlayer = () => {
    // MX Player custom Android intent URL
    const mxIntent = `intent:${movie.streamUrl}#Intent;package=com.mxtech.videoplayer.ad;type=video/*;title=${encodeURIComponent(movie.title)};end`;
    window.location.href = mxIntent;
  };

  const copyDirectStreamLink = () => {
    navigator.clipboard.writeText(movie.streamUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVideoObjectFit = () => {
    if (aspectRatio === 'stretch') return 'fill';
    if (aspectRatio === 'crop') return 'cover';
    return 'contain';
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={movie.streamUrl}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onClick={togglePlay}
        style={{ objectFit: getVideoObjectFit() }}
        className="w-full h-full cursor-pointer"
      />

      {/* Lock Indicator Floating Button */}
      {isLocked && (
        <button
          onClick={() => setIsLocked(false)}
          className="absolute top-6 left-6 z-50 p-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full shadow-lg backdrop-blur flex items-center gap-2 text-sm"
        >
          <Lock className="w-5 h-5" />
          <span>قفل لمس (کلیک برای باز کردن)</span>
        </button>
      )}

      {/* Full MX Player UI Overlay */}
      {!isLocked && (
        <div 
          className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 pointer-events-none ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Bar */}
          <div className="bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition text-white"
                title="بازگشت"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider">MX</span>
                  <h2 className="text-white font-bold text-sm md:text-base line-clamp-1">{movie.title}</h2>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{movie.genre} • کیفیت 1080p Full HD</p>
              </div>
            </div>

            {/* Top MX Player Mode Badges & Native Open */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const modes = ['HW', 'HW+', 'SW'];
                  const next = modes[(modes.indexOf(decoderMode) + 1) % modes.length];
                  setDecoderMode(next);
                }}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-neutral-800/80 hover:bg-neutral-700 text-cyan-400 border border-cyan-500/30 rounded"
                title="تغییر شتاب‌دهنده سخت‌افزاری MX Player"
              >
                {decoderMode}
              </button>

              <button
                onClick={() => {
                  const ratios = ['fit', 'crop', 'stretch'];
                  const next = ratios[(ratios.indexOf(aspectRatio) + 1) % ratios.length];
                  setAspectRatio(next);
                }}
                className="hidden sm:inline-block px-2 py-1 text-xs bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700"
              >
                نسبت: {aspectRatio === 'fit' ? 'اصلی' : aspectRatio === 'crop' ? 'برش تمام‌صفحه' : 'کشش'}
              </button>

              <button
                onClick={openInNativeMxPlayer}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-lg transition active:scale-95"
                title="باز کردن مستقیم در برنامه اندرویدی MX Player گوشی"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">باز کردن در MX Player گوشی</span>
                <span className="sm:hidden">MX Player</span>
              </button>

              <button
                onClick={() => setIsLocked(true)}
                className="p-2 hover:bg-white/20 rounded-full text-white"
                title="قفل کردن صفحه"
              >
                <Unlock className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Play/Pause Large Action */}
          <div className="flex items-center justify-center gap-10 pointer-events-auto">
            <button 
              onClick={() => seek(-10)} 
              className="p-3 bg-black/40 hover:bg-black/70 rounded-full text-white/90 hover:text-white transition transform active:scale-90"
              title="۱۰ ثانیه عقب"
            >
              <RotateCcw className="w-7 h-7" />
            </button>

            <button 
              onClick={togglePlay} 
              className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white border-2 border-white/40 shadow-2xl transition transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-9 h-9 fill-white" /> : <Play className="w-9 h-9 fill-white translate-x-0.5" />}
            </button>

            <button 
              onClick={() => seek(10)} 
              className="p-3 bg-black/40 hover:bg-black/70 rounded-full text-white/90 hover:text-white transition transform active:scale-90"
              title="۱۰ ثانیه جلو"
            >
              <RotateCw className="w-7 h-7" />
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 flex flex-col gap-2 pointer-events-auto">
            {/* Progress Slider */}
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
              <span className="w-12 text-left">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekSlider}
                className="flex-1 h-1.5 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-red-500 transition"
              />
              <span className="w-12 text-right">{formatTime(duration)}</span>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between mt-1">
              {/* Left group */}
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-blue-400">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-2 group">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-24 h-1 bg-neutral-600 rounded-lg appearance-none accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Speed selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="text-xs px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700"
                  >
                    {playbackSpeed}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-8 right-0 bg-neutral-900 border border-neutral-700 rounded-lg p-1.5 shadow-xl flex flex-col gap-1 z-50 text-xs">
                      {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-3 py-1 rounded text-right hover:bg-neutral-800 ${
                            playbackSpeed === spd ? 'text-blue-400 font-bold' : 'text-neutral-300'
                          }`}
                        >
                          {spd}x {playbackSpeed === spd ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right group */}
              <div className="flex items-center gap-3">
                <button
                  onClick={copyDirectStreamLink}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 bg-neutral-800/60 px-2.5 py-1 rounded border border-neutral-700/60"
                  title="کپی لینک استریم مستقیم"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'کپی شد' : 'لینک مستقیم'}</span>
                </button>

                <button 
                  onClick={toggleFullscreen} 
                  className="p-1 text-white hover:text-blue-400"
                  title="تمام صفحه"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
