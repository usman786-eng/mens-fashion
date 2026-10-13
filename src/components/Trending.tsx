import { useEffect, useRef, useState } from 'react';
import { fe } from '../data';

function F({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
      />
    </svg>
  );
}

export default function Trending() {
  const e = useRef<HTMLElement>(null);
  const [t, n] = useState(false);

  useEffect(() => {
    const el = e.current;
    if (!el) return;
    const r = new IntersectionObserver(([entry]) => entry.isIntersecting && n(true), {
      threshold: 0.15,
    });
    r.observe(el);
    return () => r.disconnect();
  }, []);

  return (
    <section
      ref={e}
      data-inview={t ? '1' : '0'}
      className="trending bg-background py-16 text-foreground sm:py-24"
      aria-labelledby="trending-title"
    >
      <header className="cf-reveal mb-8 flex flex-col gap-3 px-5 sm:mb-10 sm:px-8">
        <span className="font-ui flex items-center gap-2 text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
          <F className="h-3 w-3" /> Shop by category
        </span>
        <h2
          id="trending-title"
          className="font-display text-[2rem] leading-none tracking-[0.02em] uppercase sm:text-[2.8rem]"
        >
          Trending categories
        </h2>
      </header>
      <ul className="grid grid-cols-2 gap-2 px-5 sm:gap-3 sm:px-8 lg:grid-cols-4 lg:gap-4">
        {fe.map((item, idx) => (
          <li
            key={item.id}
            className="cat-tile cf-reveal"
            style={{ transitionDelay: `${0.1 + idx * 0.06}s` }}
          >
            <a href="#" className="group relative block aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black from-5% via-black/60 via-40% to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 px-3 pb-5 text-white sm:pb-7">
                <span className="font-display text-[1.15rem] leading-none tracking-[0.12em] uppercase sm:text-[1.6rem]">
                  {item.name}
                </span>
                <span className="cat-cta font-ui text-[10px] tracking-[0.28em] text-white/80 uppercase sm:text-[11px]">
                  Shop now
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
