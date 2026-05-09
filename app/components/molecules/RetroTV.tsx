'use client';
import React from 'react';

// Renders a YouTube video embed inside a retro 80s/90s CRT TV design container.
// Accepts either a full YouTube URL or just a video ID.
interface RetroTVProps {
  youtubeUrl: string;
  className?: string;
}

function extractVideoId(url: string): string {
  // Handle youtu.be short links
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v=...
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) return longMatch[1];

  // Assume it's already an ID
  return url;
}

export const RetroTV: React.FC<RetroTVProps> = ({ youtubeUrl, className = '' }) => {
  const videoId = extractVideoId(youtubeUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* TV Outer Shell */}
      <div className="relative w-full"
        style={{
          background: 'linear-gradient(145deg, #3a3a3a, #1a1a1a)',
          borderRadius: '24px 24px 32px 32px',
          padding: '16px 16px 0px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 3px #111',
          border: '3px solid #555',
        }}
      >
        {/* TV Brand Tag */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.6)] animate-pulse" />
          <span className="text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase">DIGICRAFT</span>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.6)] animate-pulse" />
        </div>

        {/* Screen Bezel */}
        <div
          className="relative overflow-hidden mt-4"
          style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9), inset 0 0 6px rgba(100,100,255,0.1)',
            border: '2px solid #222',
          }}
        >
          {/* Scanline Overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none rounded-xl"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
            }}
          />
          {/* Screen Glare */}
          <div
            className="absolute top-0 left-0 right-0 h-1/3 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)',
              borderRadius: '12px 12px 0 0',
            }}
          />

          {/* The Actual Video */}
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={embedUrl}
              title="DIY Project Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg"
            />
          </div>
        </div>

        {/* TV Bottom Controls Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 mt-0"
          style={{
            background: 'linear-gradient(to bottom, #2a2a2a, #1a1a1a)',
            borderRadius: '0 0 28px 28px',
          }}
        >
          {/* Left: Knobs */}
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #555, #1a1a1a)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                  border: '1px solid #444',
                }}
              />
            ))}
          </div>

          {/* Center: Speaker grille */}
          <div className="flex gap-0.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-0.5 h-3 rounded-full bg-slate-600" />
            ))}
          </div>

          {/* Right: Power & Channel buttons */}
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #c0392b, #7b241c)',
                boxShadow: '0 0 6px rgba(192,57,43,0.5), 0 2px 4px rgba(0,0,0,0.5)',
                border: '1px solid #7b241c',
              }}
            />
            <div
              className="w-3 h-5 rounded-sm"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #666, #333)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                border: '1px solid #444',
              }}
            />
          </div>
        </div>
      </div>

      {/* Antenna */}
      <div className="relative w-full flex justify-center" style={{ height: '0px', marginTop: '-16px' }}>
        <div
          style={{
            position: 'absolute',
            top: '-48px',
            left: 'calc(50% - 30px)',
            width: '2px',
            height: '50px',
            background: 'linear-gradient(to top, #555, #333)',
            transformOrigin: 'bottom center',
            transform: 'rotate(-20deg)',
            borderRadius: '1px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-48px',
            left: 'calc(50% + 28px)',
            width: '2px',
            height: '50px',
            background: 'linear-gradient(to top, #555, #333)',
            transformOrigin: 'bottom center',
            transform: 'rotate(20deg)',
            borderRadius: '1px',
          }}
        />
      </div>
    </div>
  );
};
