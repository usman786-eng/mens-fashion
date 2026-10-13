import type { CSSProperties, RefObject } from 'react';
import { heroProducts as L } from '../data';
import { pe } from '../three/heroEngine';

export { pe };

export default function Strip({
  slotRefs,
  onSelect,
}: {
  slotRefs: RefObject<(HTMLDivElement | null)[]>;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="strip absolute inset-x-0 bottom-0 z-20" aria-label="Collection">
      {Array.from({ length: pe }, (_, r) => {
        const i = L[r % L.length];
        return (
          <div
            key={r}
            ref={(el) => {
              slotRefs.current[r] = el;
            }}
            className="strip-slot absolute bottom-0 left-0 will-change-transform"
            style={{ '--f': 0 } as CSSProperties}
          >
            <button
              type="button"
              onClick={() => onSelect(r)}
              className="strip-card group block h-full w-full cursor-pointer overflow-hidden bg-white text-left"
              aria-label={`${i.name}, €${i.price}`}
            >
              <div
                className="relative h-[72%] overflow-hidden"
                style={{ background: `linear-gradient(to bottom, ${i.top}, ${i.bottom})` }}
              >
                <img
                  src={i.image}
                  alt=""
                  draggable={false}
                  className="strip-img absolute left-1/2 top-[4%] h-[210%] w-auto max-w-none -translate-x-1/2 select-none"
                />
                <svg
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-3 h-[18px] w-[18px] text-white drop-shadow"
                  fill="currentColor"
                >
                  <path d="M12 20.6s-7.6-4.6-9.3-9.2C1.5 8 3.6 4.6 7 4.6c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.4 4.3 6.8-1.7 4.6-9.3 9.2-9.3 9.2Z" />
                </svg>
              </div>
              <div className="strip-info flex h-[28%] flex-col justify-center px-3 sm:px-3.5">
                <div className="flex items-baseline justify-between gap-2 font-sans italic">
                  <span className="truncate text-[12px] sm:text-[14px]">{i.name}</span>
                  <span className="shrink-0 text-[15px] font-bold sm:text-[19px]">
                    €{i.price}
                  </span>
                </div>
                <span className="mt-0.5 text-[10px] sm:text-[11px]">
                  ★ {i.rating.toFixed(1)}
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
