import { useEffect, useRef, useState } from 'react';
import { de } from '../data';

function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

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

function HeartIcon({ className = '', strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`lucide lucide-heart ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function PlusIcon({ className = '', strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`lucide lucide-plus ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function CheckIcon({ className = '', strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`lucide lucide-check ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const bn = 1600;

function Xn({
  dir,
  onClick,
  disabled,
}: {
  dir: number;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir < 0 ? 'Scroll back' : 'Scroll forward'}
      className="grid h-9 w-[3.2rem] place-items-center rounded-full border border-black/80 text-black transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-25"
    >
      <svg
        viewBox="0 0 32 12"
        className="h-3 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        aria-hidden="true"
      >
        {dir < 0 ? (
          <path d="M31 6H1m5-5L1 6l5 5" />
        ) : (
          <path d="M1 6h30m-5-5 5 5-5 5" />
        )}
      </svg>
    </button>
  );
}

export default function NewIn() {
  const e = useRef<HTMLUListElement>(null);
  const [t, n] = useState<Set<string>>(() => new Set());
  const [r, i] = useState<string | null>(null);
  const [a, o] = useState('');
  const [s, c] = useState<Record<string, number>>({});
  const [l, u] = useState({ start: true, end: false });
  const d = useRef<number>(0);

  const f = (id: string) =>
    n((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const p = (id: string, label: string) => {
    i(id);
    o(label);
    clearTimeout(d.current);
    d.current = window.setTimeout(() => i(null), bn);
  };

  const m = (dir: number) => {
    const list = e.current;
    const first = list?.firstElementChild as HTMLElement | null | undefined;
    if (!list || !first) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    list.scrollBy({ left: dir * (first.offsetWidth + gap), behavior: 'smooth' });
  };

  useEffect(() => {
    const list = e.current;
    if (!list) return;
    const onScroll = () =>
      u({
        start: list.scrollLeft < 4,
        end: list.scrollLeft + list.clientWidth > list.scrollWidth - 4,
      });
    onScroll();
    list.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      list.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(d.current);
    };
  }, []);

  return (
    <section className="new-in bg-white py-16 text-foreground sm:py-24" aria-labelledby="new-in-title">
      <header className="mb-8 flex items-end justify-between gap-6 px-5 sm:mb-10 sm:px-8">
        <div className="flex flex-col gap-3">
          <span className="font-ui flex items-center gap-2 text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
            <F className="h-3 w-3" /> New in
          </span>
          <h2
            id="new-in-title"
            className="font-display text-[2rem] leading-none tracking-[0.02em] uppercase sm:text-[2.8rem]"
          >
            Fresh on the rail
          </h2>
        </div>
        <div className="hidden gap-4 sm:flex">
          <Xn dir={-1} onClick={() => m(-1)} disabled={l.start} />
          <Xn dir={1} onClick={() => m(1)} disabled={l.end} />
        </div>
      </header>
      <ul
        ref={e}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:scroll-px-8 sm:gap-6 sm:px-8"
      >
        {de.map((item) => {
          const isFav = t.has(item.id);
          const isAdded = r === item.id;
          const color = item.colors[s[item.id] ?? 0];
          const label = `${item.name} ${color.name}`;
          return (
            <li key={item.id} className="group w-[clamp(240px,27vw,400px)] shrink-0 snap-start">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f2f1ee]">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover object-top transition-[scale] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
                />
                <button
                  type="button"
                  onClick={() => f(item.id)}
                  aria-pressed={isFav}
                  aria-label={isFav ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
                  className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-105 active:scale-95"
                >
                  <HeartIcon
                    className={cn(
                      'h-[17px] w-[17px] transition-colors',
                      isFav ? 'fill-black stroke-black' : 'stroke-black',
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[13px] italic sm:text-[14px]">{label}</p>
                  <p className="mt-0.5 text-[13px] font-bold italic sm:text-[14px]">
                    €{item.price}
                  </p>
                  <div
                    role="radiogroup"
                    aria-label={`${item.name} colour`}
                    className="mt-2.5 flex gap-2"
                  >
                    {item.colors.map((swatch, idx) => {
                      const selected = swatch === color;
                      return (
                        <button
                          key={swatch.name}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          aria-label={swatch.name}
                          title={swatch.name}
                          onClick={() => c((prev) => ({ ...prev, [item.id]: idx }))}
                          className={cn(
                            'grid h-[22px] w-[22px] place-items-center rounded-full border transition-colors',
                            selected ? 'border-black' : 'border-transparent hover:border-black/30',
                          )}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15 ring-inset"
                            style={{ background: swatch.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => p(item.id, label)}
                  aria-label={`Add ${label} to bag`}
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors',
                    isAdded
                      ? 'border-black bg-black text-white'
                      : 'border-black/80 text-black hover:bg-black hover:text-white',
                  )}
                >
                  {isAdded ? (
                    <CheckIcon className="h-4 w-4" strokeWidth={1.6} />
                  ) : (
                    <PlusIcon className="h-4 w-4" strokeWidth={1.6} />
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-10 flex justify-end px-5 sm:px-8">
        <a
          href="#"
          className="font-ui rounded-full bg-black px-6 py-3 text-[14px] font-light text-white transition-transform hover:-translate-y-0.5"
        >
          Shop now
        </a>
      </div>
      <p className="sr-only" aria-live="polite">
        {r ? `${a} added to bag` : ''}
      </p>
    </section>
  );
}
