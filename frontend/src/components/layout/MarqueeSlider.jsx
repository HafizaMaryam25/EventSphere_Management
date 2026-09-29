import React from 'react';

function MarqueeSlider({ words }) {
  return (
    <div className="w-full relative z-20 mt-20 mb-10 overflow-hidden py-10">
      <section className="py-6 border-y border-magenta-accent/20 bg-deep-bg-light/40 backdrop-blur-xl shadow-[0_0_40px_rgba(209,0,160,0.15)] whitespace-nowrap transform -rotate-2 scale-105 flex">
        <div className="animate-marquee flex items-center pr-8 hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {words.map((word, j) => (
                <div key={j} className="flex items-center">
                  <span 
                    style={{ WebkitTextStroke: '1px rgba(234, 194, 255, 0.4)', color: 'rgba(255,255,255,0.05)' }}
                    className="text-5xl md:text-7xl font-landing font-bold uppercase tracking-widest transition-all duration-300 hover:text-white/90 drop-shadow-sm"
                  >
                    {word}
                  </span>
                  <span className="mx-10 md:mx-14 text-2xl md:text-3xl text-magenta-accent/80 animate-pulse drop-shadow-[0_0_10px_rgba(209,0,160,0.6)]">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7"/>
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MarqueeSlider;
