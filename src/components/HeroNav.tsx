import type { RefObject } from 'react';

export default function HeroNav({
  ref,
  onPrev,
  onNext,
}: {
  ref: RefObject<HTMLDivElement | null>;
  onPrev: () => void;
  onNext: () => void;
}) {
  const btn = (dir: -1 | 1) => (
    <button
      key={dir}
      type="button"
      onClick={dir < 0 ? onPrev : onNext}
      aria-label={dir < 0 ? 'Previous look' : 'Next look'}
      className="grid h-9 w-[3.2rem] place-items-center rounded-full border border-black/80 text-black transition-colors hover:bg-black hover:text-white"
    >
      <svg
        viewBox="0 0 32 12"
        className="h-3 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {dir < 0 ? (
          <path d="M31 6H1m5-5L1 6l5 5" />
        ) : (
          <path d="M1 6h30m-5-5 5 5-5 5" />
        )}
      </svg>
    </button>
  );
  return (
    <div ref={ref} className="arrows absolute right-5 z-20 flex gap-4 sm:right-8 sm:gap-5">
      {btn(-1)}
      {btn(1)}
    </div>
  );
}
