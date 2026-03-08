/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, X, Maximize2, Minimize2, Search, Info, Globe, ArrowRight, RotateCcw, Home } from 'lucide-react';
import gamesData from './games.json';

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  iframeUrl: string;
  isBrowser?: boolean;
  tag?: string;
}

export default function App() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com/search?igu=1');
  const [urlInput, setUrlInput] = useState('https://www.google.com/search?igu=1');

  const handleBrowserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}&igu=1`;
      }
    }
    
    // If it's not a search result with igu=1, we use our proxy
    const finalUrl = url.includes('google.com/search') && url.includes('igu=1') 
      ? url 
      : `/api/proxy?url=${encodeURIComponent(url)}`;
      
    setBrowserUrl(finalUrl);
    setUrlInput(url);
  };

  const filteredGames = gamesData.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-zinc-950" />
              </div>
              <span className="text-xl font-bold tracking-tight">GAMEHUB</span>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => {
                  const browserGame = gamesData.find(g => g.id === 'web-browser');
                  if (browserGame) setSelectedGame(browserGame);
                }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-emerald-500/50 transition-all"
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Web Browser</span>
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Games
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            A curated collection of the best web-based games. No downloads, no installs, just pure fun.
          </p>
        </motion.div>
      </header>

      {/* Search for Mobile */}
      <div className="px-4 sm:hidden mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Games Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedGame(game)}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all shadow-xl"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">
                  {game.title}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-2">
                  {game.description}
                </p>
                {game.tag && (
                  <div className="pt-2">
                    <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20">
                      {game.tag}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-emerald-500 text-zinc-950 p-2 rounded-full shadow-lg">
                  <Gamepad2 className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No games found matching your search.</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-zinc-950/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
                isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl aspect-video'
              }`}
            >
              {/* Modal Header */}
              <div className="flex flex-col border-b border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    {selectedGame.isBrowser ? (
                      <Globe className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Gamepad2 className="w-5 h-5 text-emerald-500" />
                    )}
                    <h2 className="text-lg font-bold truncate max-w-[200px] sm:max-w-md">
                      {selectedGame.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const iframe = document.querySelector('iframe');
                        if (iframe) {
                          const currentSrc = iframe.src;
                          iframe.src = 'about:blank';
                          setTimeout(() => {
                            iframe.src = currentSrc;
                          }, 50);
                        }
                      }}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                      title="Reload Game"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGame(null);
                        setIsFullscreen(false);
                      }}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {selectedGame.isBrowser && (
                  <div className="px-6 pb-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          const homeUrl = 'https://www.google.com/search?igu=1';
                          setBrowserUrl(homeUrl);
                          setUrlInput(homeUrl);
                        }}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      >
                        <Home className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const current = browserUrl;
                          setBrowserUrl('about:blank');
                          setTimeout(() => setBrowserUrl(current), 10);
                        }}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <form onSubmit={handleBrowserSubmit} className="flex-1 relative group">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Enter URL (e.g. example.com) or search..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-emerald-500 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Proxy Active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Game Iframe */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.isBrowser ? browserUrl : selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="autoplay; fullscreen; keyboard"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold">GAMEHUB</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Unblocked Games Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
