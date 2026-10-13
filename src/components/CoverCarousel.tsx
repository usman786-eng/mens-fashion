import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';

export interface CoverSlideMeta {
  label: string;
  value: string;
}

export interface CoverSlide {
  src: string;
  alt: string;
  background?: string;
  title?: string;
  subtitle?: string;
  meta?: CoverSlideMeta[];
}

interface CoverCarouselProps {
  slides: CoverSlide[];
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  cardWidth?: string;
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  renderCaption?: (slide: CoverSlide, index: number) => ReactNode;
  label?: string;
  className?: string;
  cardClassName?: string;
}

function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function CoverCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = 'clamp(148px, 22vw, 260px)',
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  renderCaption,
  label = 'Cover carousel',
  className,
  cardClassName,
}: CoverCarouselProps) {
  const count = slides.length;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pos = useRef(0);
  const target = useRef(0);
  const cardW = useRef(0);
  const raf = useRef<number | null>(null);
  const drag = useRef<{ id: number; x: number; pos: number; v: number; t: number } | null>(null);
  const [active, setActive] = useState(0);

  const normalize = useCallback((v: number) => ((Math.round(v) % count) + count) % count, [count]);

  const layout = useCallback(() => {
    const w = cardW.current;
    if (!w) return;
    const step = w * (1 + gap);
    const cur = pos.current;
    slideRefs.current.forEach((el, idx) => {
      if (!el) return;
      let off = idx - cur;
      if (loop) {
        off = ((off % count) + count) % count;
        if (off > count / 2) off -= count;
      }
      const d = Math.abs(off);
      const f = d ** +falloff;
      const rot = Math.min(rotate * f, 82) * Math.sign(off);
      el.style.transform = `translateX(calc(-50% + ${off * step}px)) translateZ(${-depth * w * f}px) rotateY(${-rot}deg)`;
      const m = loop ? Math.min(1, Math.max(0, count / 2 - d)) : 1;
      el.style.opacity = String(Math.max(0, 1 - fade * d) * m);
      el.style.zIndex = String(100 - Math.round(d));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const goTo = useCallback(
    (v: number) => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      target.current = v;
      setActive(normalize(v));
      const tick = () => {
        const n = v - pos.current;
        if (Math.abs(n) < 4e-4) {
          pos.current = v;
          layout();
          raf.current = null;
          return;
        }
        pos.current += n * 0.16;
        layout();
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    },
    [normalize, layout],
  );

  const clamp = useCallback(
    (v: number) => (loop ? v : Math.max(0, Math.min(count - 1, v))),
    [count, loop],
  );

  const goToIndex = useCallback(
    (idx: number) => {
      const t = loop ? idx + Math.round((target.current - idx) / count) * count : idx;
      goTo(clamp(t));
    },
    [clamp, count, loop, goTo],
  );

  const step = useCallback(
    (dir: number) => goTo(clamp(Math.round(target.current) + dir)),
    [clamp, goTo],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    target.current = pos.current;
    drag.current = { id: e.pointerId, x: e.clientX, pos: pos.current, v: 0, t: performance.now() };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const dr = drag.current;
    if (!dr || dr.id !== e.pointerId) return;
    const stepPx = cardW.current * (1 + gap);
    if (!stepPx) return;
    const now = performance.now();
    const prev = pos.current;
    pos.current = clamp(dr.pos - (e.clientX - dr.x) / stepPx);
    dr.v = ((pos.current - prev) / Math.max(now - dr.t, 1)) * 1e3;
    dr.t = now;
    const a = normalize(pos.current);
    if (a !== active) setActive(a);
    layout();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const dr = drag.current;
    if (!dr || dr.id !== e.pointerId) return;
    drag.current = null;
    const flick = Math.max(-2, Math.min(2, dr.v * 0.18));
    goTo(clamp(Math.round(pos.current + flick)));
  };

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const first = slideRefs.current[0];
      if (first) {
        cardW.current = first.offsetWidth;
        layout();
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const current = slides[active];

  return (
    <div
      className={cn('w-full', className)}
      style={{ '--cf-card': cardWidth } as CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={viewportRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              step(-1);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              step(1);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{ perspective: `calc(var(--cf-card) * ${perspective})`, touchAction: 'pan-y' }}
        >
          <div className="relative select-none" style={{ height: 'var(--cf-card)', transformStyle: 'preserve-3d' }}>
            {slides.map((s, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  slideRefs.current[idx] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${count}`}
                className={cn(
                  'absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl bg-muted shadow-xl will-change-transform',
                  cardClassName,
                )}
                style={{ width: 'var(--cf-card)', background: s.background }}
              >
                <img src={s.src} alt={s.alt} draggable={false} className="h-full w-full select-none object-cover" />
              </div>
            ))}
          </div>
        </div>
        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => step(-1)}
              className="absolute left-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => step(1)}
              className="absolute right-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
      {showCaption && current && renderCaption && (
        <div key={active} className="mt-2 duration-300 animate-in fade-in">
          {renderCaption(current, active)}
        </div>
      )}
      {showCaption && current?.title && !renderCaption && (
        <div key={active} className="mt-2 flex flex-col items-center px-6 duration-300 animate-in fade-in">
          <p className="text-[15px] font-semibold tracking-tight text-foreground">{current.title}</p>
          {current.subtitle && <p className="mt-1 text-[13px] text-muted-foreground">{current.subtitle}</p>}
          {current.meta && current.meta.length > 0 && (
            <dl className="mt-10 w-full max-w-[230px] text-[12px]">
              {current.meta.map((item) => (
                <div key={item.label} className="flex justify-between py-[5px]">
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="font-medium text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === active}
              onClick={() => goToIndex(idx)}
              className={cn(
                'size-2 rounded-full bg-foreground transition-opacity',
                idx === active ? 'opacity-100' : 'opacity-30',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
