import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { STATS_DATA } from '../data/cafeData';
import { Users, Utensils, Star, CalendarHeart } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const icons = [
    <Users className="w-7 h-7 text-red-500" />,
    <Utensils className="w-7 h-7 text-red-500" />,
    <Star className="w-7 h-7 text-red-500" />,
    <CalendarHeart className="w-7 h-7 text-red-500" />
  ];

  return (
    <section ref={ref} className="py-20 bg-[#09090B] text-[#F8F5EE] border-y border-red-500/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS_DATA.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-6 rounded-3xl bg-[#121215] border border-red-500/25 backdrop-blur-md hover:border-red-500 transition-all duration-300 shadow-xl group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#09090B] border border-red-500/40 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                {icons[idx]}
              </div>

              <div className="text-3xl sm:text-5xl font-mono font-black text-red-500 tracking-tight">
                <Counter target={stat.value} isRating={stat.value === 4.9} start={isInView} />
                <span>{stat.suffix}</span>
              </div>

              <h3 className="mt-2 text-sm sm:text-base font-bold text-[#F8F5EE] uppercase tracking-wider">
                {stat.label}
              </h3>

              <p className="mt-1 text-xs text-[#CBD5E1]/70 font-sans">
                {stat.subtext}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Counter: React.FC<{ target: number; isRating?: boolean; start: boolean }> = ({ target, isRating, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startVal = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      startVal += increment;
      if (startVal >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(startVal);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, start]);

  if (isRating) {
    return <span>{count.toFixed(1)}</span>;
  }

  return <span>{Math.floor(count).toLocaleString()}</span>;
};
