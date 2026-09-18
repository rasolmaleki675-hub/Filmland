import React, { useState } from 'react';
import { 
  Play, Info, Plus, Check, Star, Download, 
  ExternalLink, Smartphone, Share2, Film, Tv
} from 'lucide-react';

export default function MovieDetailModal({ movie, onClose, onPlay }) {
  const [inMyList, setInMyList] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);

  if (!movie) return null;

  const openInMx = () => {
    const mxIntent = `intent:${movie.streamUrl}#Intent;package=com.mxtech.videoplayer.ad;type=video/*;title=${encodeURIComponent(movie.title)};end`;
    window.location.href = mxIntent;
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#181818] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 relative my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition border border-white/20"
        >
          ✕
        </button>

        {/* Hero Banner Header */}
        <div className="relative h-64 sm:h-96 w-full">
          <img 
            src={movie.backdrop} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />
          
          <div className="absolute bottom-6 right-6 left-6 flex flex-col gap-3">
            <span className="bg-[#E50914] text-white text-xs font-bold px-2.5 py-1 rounded w-fit uppercase tracking-wider">
              {movie.badge || "نتفلیکس اورجینال"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">{movie.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-mono drop-shadow">{movie.originalTitle}</p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPlay(movie)}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-neutral-200 transition shadow-lg active:scale-95 text-sm sm:text-base"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>پخش در پلیر حرفه‌ای (MX)</span>
              </button>

              <button
                onClick={openInMx}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg active:scale-95 text-xs sm:text-sm border border-blue-400/40"
              >
                <Smartphone className="w-4 h-4" />
                <span>ارسال مستقیم به اپلیکیشن MX Player</span>
              </button>

              <button
                onClick={() => setInMyList(!inMyList)}
                className="p-2.5 bg-neutral-800/80 hover:bg-neutral-700 rounded-lg text-white border border-neutral-700 transition"
                title="افزودن به لیست علاقه‌مندی"
              >
                {inMyList ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-6 space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-green-400 font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-green-400" />
              {movie.rating} نمره IMDb
            </span>
            <span className="text-neutral-400">{movie.year}</span>
            <span className="border border-neutral-700 text-neutral-300 text-xs px-2 py-0.5 rounded">
              {movie.ageRating}
            </span>
            <span className="text-neutral-400">{movie.duration}</span>
            <span className="bg-neutral-800 text-cyan-400 text-xs px-2 py-0.5 rounded border border-cyan-800/40">
              کیفیت 4K Ultra HD
            </span>
            <span className="bg-neutral-800 text-yellow-400 text-xs px-2 py-0.5 rounded border border-yellow-800/40">
              دوبله فارسی اختصاصی + زیرنویس چسبیده
            </span>
          </div>

          {/* Overview text */}
          <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
            {movie.description}
          </p>

          <div className="text-xs text-neutral-400 space-y-1">
            <p><span className="text-neutral-500">ژانر:</span> {movie.genre}</p>
            <p><span className="text-neutral-500">پخش کننده پیش‌فرض:</span> شبیه‌ساز مککس پلیر (MX Player HW+ Decoder)</p>
          </div>

          {/* Episode List if Series */}
          {movie.episodes && movie.episodes.length > 0 && (
            <div className="border-t border-neutral-800 pt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white">فهرست قسمت‌ها</h3>
                <span className="text-xs text-neutral-400">{movie.episodes.length} قسمت آماده پخش رایگان</span>
              </div>

              <div className="space-y-2">
                {movie.episodes.map((ep, idx) => (
                  <div
                    key={idx}
                    onClick={() => onPlay(movie)}
                    className="flex items-center justify-between p-3.5 bg-neutral-900/80 hover:bg-neutral-800 rounded-xl cursor-pointer border border-neutral-800 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-800 group-hover:bg-[#E50914] text-white flex items-center justify-center transition">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-white group-hover:text-red-400 transition">{ep.title}</h4>
                        <span className="text-xs text-neutral-400">{ep.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded">رایگان</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
