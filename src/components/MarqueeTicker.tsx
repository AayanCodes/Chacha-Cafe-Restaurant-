import React from 'react';

interface MarqueeTickerProps {
  items?: string[];
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items = [
    '🌿 BOTANICAL AMBIENCE',
    '☕ GOLD DUST CAPPUCCINO',
    '🍕 WOODFIRED SOURDOUGH PIZZA',
    '🍗 HIMALAYAN SPICES',
    '🍹 BOTANICAL MOCKTAILS',
    '🍰 BELGIAN LAVA SPHERE',
    '⭐ 4.9 GOOGLE RATED',
    '🍃 FARM FRESH ORGANIC'
  ]
}) => {
  return (
    <div className="w-full overflow-hidden bg-red-600 text-white py-3.5 border-y border-red-500/50 shadow-xl select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-8 text-xs sm:text-sm font-extrabold tracking-widest uppercase font-mono px-4">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-2 hover:scale-105 transition-transform cursor-default">
                {item}
              </span>
              <span className="text-white/40">•</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-8 text-xs sm:text-sm font-extrabold tracking-widest uppercase font-mono px-4">
          {items.map((item, idx) => (
            <React.Fragment key={`dup-${idx}`}>
              <span className="flex items-center gap-2 hover:scale-105 transition-transform cursor-default">
                {item}
              </span>
              <span className="text-white/40">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
