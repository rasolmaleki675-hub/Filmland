import React, { useState } from 'react';
import { 
  Search, Bell, Play, Info, Flame, Film, Tv, 
  Smartphone, Download, Star, Filter, Menu, X
} from 'lucide-react';
import { MOVIES_DATABASE, CATEGORIES } from './data/movies';
import MxPlayerModal from './components/MxPlayerModal';
import MovieDetailModal from './components/MovieDetailModal';
import InstallPwaBanner from './components/InstallPwaBanner';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMovieForPlayer, setActiveMovieForPlayer] = useState(null);
  const [activeMovieForDetails, setActiveMovieForDetails] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter movies
  const filteredMovies = MOVIES_DATABASE.filter(movie => {
    const matchesSearch = 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'series') return movie.type === 'series';
    if (selectedCategory === 'movie') return movie.type === 'movie';
    if (selectedCategory === 'action') return movie.genre.includes('اکشن') || movie.genre.includes('هیجان‌انگیز');
    if (selectedCategory === 'scifi') return movie.genre.includes('علمی‌تخیلی') || movie.genre.includes('فانتزی');

    return true;
  });

  const heroMovie = MOVIES_DATABASE[0];

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col pb-16">
      {/* PWA Install Banner */}
      <InstallPwaBanner />

      {/* Netflix Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#141414]/90 backdrop-blur border-b border-neutral-900 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
            <span className="text-[#E50914] font-black text-2xl sm:text-3xl tracking-tighter uppercase font-mono">
              FILMLAND
            </span>
            <span className="text-[10px] bg-red-600/30 text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-500/30">
              NETFLIX FREE
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-neutral-300">
            <button 
              onClick={() => setSelectedCategory('all')} 
              className={`hover:text-white transition ${selectedCategory === 'all' ? 'text-white font-bold' : ''}`}
            >
              صفحه اصلی
            </button>
            <button 
              onClick={() => setSelectedCategory('series')} 
              className={`hover:text-white transition ${selectedCategory === 'series' ? 'text-white font-bold' : ''}`}
            >
              سریال‌ها
            </button>
            <button 
              onClick={() => setSelectedCategory('movie')} 
              className={`hover:text-white transition ${selectedCategory === 'movie' ? 'text-white font-bold' : ''}`}
            >
              فیلم‌های سینمایی
            </button>
            <button 
              onClick={() => setSelectedCategory('action')} 
              className={`hover:text-white transition ${selectedCategory === 'action' ? 'text-white font-bold' : ''}`}
            >
              اکشن
            </button>
            <a 
              href="/filmland-project.zip" 
              download="filmland-app.zip"
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1 border border-neutral-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل Zip</span>
            </a>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی فیلم یا سریال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 focus:border-red-600 rounded-full py-1.5 px-3 pr-8 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none w-36 sm:w-56 transition-all"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute right-2.5 top-2" />
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1.5 rounded-full font-mono">
            <span>پلیر:</span>
            <strong>MX Player HW+</strong>
          </div>
        </div>
      </header>

      {/* Hero Netflix Banner (Shown when no search query) */}
      {!searchQuery && selectedCategory === 'all' && heroMovie && (
        <section className="relative w-full h-[65vh] sm:h-[75vh] max-h-[700px] overflow-hidden">
          <img
            src={heroMovie.backdrop}
            alt={heroMovie.title}
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-12 right-6 sm:right-12 max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white font-extrabold text-xs px-2.5 py-0.5 rounded shadow">
                {heroMovie.badge}
              </span>
              <span className="text-neutral-300 text-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {heroMovie.rating} IMDb
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow-md">
              {heroMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-200 line-clamp-3 max-w-xl leading-relaxed drop-shadow">
              {heroMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveMovieForPlayer(heroMovie)}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-neutral-200 transition shadow-xl active:scale-95 text-sm sm:text-base"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>پخش رایگان (MX Player)</span>
              </button>

              <button
                onClick={() => setActiveMovieForDetails(heroMovie)}
                className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-lg font-bold backdrop-blur border border-neutral-700 transition active:scale-95 text-sm"
              >
                <Info className="w-5 h-5" />
                <span>اطلاعات و قسمت‌ها</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills Bar */}
      <section className="px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-[#E50914] text-white font-bold shadow'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Movies Grid / Rows */}
      <main className="px-4 sm:px-8 mt-6 flex-1 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span>محتواهای موجود نتفلیکس (پخش رایگان)</span>
            </h2>
            <span className="text-xs text-neutral-400">{filteredMovies.length} عنوان فیلم و سریال</span>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              موردی با عنوان «{searchQuery}» پیدا نشد.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="group relative bg-[#181818] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl flex flex-col"
                >
                  {/* Poster Image */}
                  <div 
                    className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer"
                    onClick={() => setActiveMovieForDetails(movie)}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] font-bold text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      {movie.rating}
                    </div>

                    <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      {movie.type === 'series' ? 'سریال' : 'سینمایی'}
                    </div>

                    {/* Hover Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMovieForPlayer(movie);
                        }}
                        className="p-3 bg-red-600 rounded-full text-white transform hover:scale-110 transition shadow-xl"
                        title="پخش با MX Player"
                      >
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 
                        onClick={() => setActiveMovieForDetails(movie)}
                        className="text-sm font-bold text-white group-hover:text-red-400 transition cursor-pointer line-clamp-1"
                      >
                        {movie.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono line-clamp-1 mt-0.5">{movie.originalTitle}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
                      <span>{movie.year}</span>
                      <span className="text-cyan-400 font-bold">MX HW+</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => setActiveMovieForPlayer(movie)}
                        className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1 transition"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>پخش</span>
                      </button>
                      <button
                        onClick={() => setActiveMovieForDetails(movie)}
                        className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-xs font-medium flex items-center justify-center gap-1 border border-neutral-800 transition"
                      >
                        <Info className="w-3 h-3" />
                        <span>جزئیات</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MX Player Modal */}
      {activeMovieForPlayer && (
        <MxPlayerModal
          movie={activeMovieForPlayer}
          onClose={() => setActiveMovieForPlayer(null)}
        />
      )}

      {/* Movie Details Modal */}
      {activeMovieForDetails && (
        <MovieDetailModal
          movie={activeMovieForDetails}
          onClose={() => setActiveMovieForDetails(null)}
          onPlay={(movie) => {
            setActiveMovieForDetails(null);
            setActiveMovieForPlayer(movie);
          }}
        />
      )}
    </div>
  );
}
