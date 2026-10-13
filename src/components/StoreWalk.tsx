import { useEffect, useRef } from 'react';
import { storeCaptions, frameUrl, FRAME_COUNT } from '../data';

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

const wn = FRAME_COUNT;
const Tn = frameUrl;
const En: number[] = (() => {
  const seen = new Set<number>();
  const out: number[] = [];
  for (let step = 32; step >= 1; step /= 2)
    for (let idx = 0; idx < wn; idx += step)
      if (!seen.has(idx)) {
        seen.add(idx);
        out.push(idx);
      }
  if (!seen.has(191)) out.push(191);
  return out;
})();
const Dn = storeCaptions;
const On = 0.035;
const kn = (v: number): number => Math.min(1, Math.max(0, v));

export default function StoreWalk() {
  const e = useRef<HTMLElement>(null);
  const t = useRef<HTMLCanvasElement>(null);
  const n = useRef<HTMLDivElement>(null);
  const r = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const i = e.current;
    const a = t.current;
    if (!i || !a) return;
    const o = a.getContext('2d');
    if (!o) return;
    const s: Array<HTMLImageElement | null> = Array(wn).fill(null);
    let c = false;
    let l = 0;
    let u = false;
    let d = -1;
    let f = 0;
    let p = true;

    const m = () => {
      if (c) return;
      c = true;
      let q = 0;
      const pump = () => {
        if (q >= En.length) return;
        const idx = En[q++];
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          s[idx] = img;
          p = true;
          pump();
        };
        img.onerror = pump;
        img.src = Tn(idx);
      };
      for (let k = 0; k < 6; k++) pump();
    };

    const h = (frame: number): number => {
      for (let off = 0; off < wn; off++) {
        if (s[frame - off]) return frame - off;
        if (s[frame + off]) return frame + off;
      }
      return -1;
    };

    const g = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      a.width = Math.round(a.clientWidth * ratio);
      a.height = Math.round(a.clientHeight * ratio);
      p = true;
    };

    const draw = (frame: number) => {
      const img = s[frame];
      if (!img) return;
      const cw = a.width;
      const ch = a.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const hh = img.naturalHeight * scale;
      o.drawImage(img, (cw - w) / 2, (ch - hh) / 2, w, hh);
    };

    const v = () => {
      l = requestAnimationFrame(v);
      const rect = i.getBoundingClientRect();
      const progress = kn(-rect.top / (rect.height - window.innerHeight));
      f += (progress * 191 - f) * 0.2;
      const frame = h(Math.round(f));
      if (frame >= 0 && (frame !== d || p)) {
        draw(frame);
        d = frame;
        p = false;
      }
      if (n.current) n.current.style.transform = `scaleX(${progress})`;
      Dn.forEach((cap, idx) => {
        const el = r.current[idx];
        if (!el) return;
        const [from, to] = cap.at;
        const vis = Math.min(kn((progress - from) / On), kn((to - progress) / On));
        el.style.opacity = String(vis);
        el.style.transform = `translateY(${(1 - vis) * 28}px)`;
        el.style.filter = vis < 1 ? `blur(${(1 - vis) * 8}px)` : '';
        el.style.visibility = vis > 0 ? 'visible' : 'hidden';
      });
    };

    const y = new IntersectionObserver(([entry]) => entry.isIntersecting && m(), {
      rootMargin: '150% 0px',
    });
    const b = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !u) {
        u = true;
        l = requestAnimationFrame(v);
      } else if (!entry.isIntersecting && u) {
        u = false;
        cancelAnimationFrame(l);
      }
    });

    y.observe(i);
    b.observe(i);
    g();
    window.addEventListener('resize', g);
    return () => {
      y.disconnect();
      b.disconnect();
      cancelAnimationFrame(l);
      window.removeEventListener('resize', g);
    };
  }, []);

  return (
    <section
      ref={e}
      className="store-walk relative h-[520vh] bg-[#0b0b0b] text-white"
      aria-label="Store walkthrough"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <canvas ref={t} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.45))]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"
        />
        <span className="font-ui absolute top-8 left-5 flex items-center gap-2 text-[11px] tracking-[0.32em] text-white/70 uppercase sm:top-10 sm:left-8">
          <F className="h-3 w-3" /> Store walkthrough
        </span>
        {Dn.map((cap, idx) => (
          <div
            key={cap.title}
            ref={(el) => {
              r.current[idx] = el;
            }}
            className={cn(
              'invisible absolute inset-x-5 bottom-20 flex flex-col gap-3 opacity-0 will-change-[opacity,transform] sm:inset-x-8 sm:bottom-24',
              cap.align === 'center' && 'items-center text-center',
              cap.align === 'right' && 'items-end text-right',
            )}
          >
            <span className="font-ui text-[11px] tracking-[0.32em] text-white/70 uppercase">
              {cap.kicker}
            </span>
            <h3 className="font-display max-w-[14ch] text-[2.4rem] leading-[0.95] tracking-[0.02em] uppercase sm:text-[4.2rem]">
              {cap.title}
            </h3>
            {cap.body && (
              <p className="font-ui max-w-[34ch] text-[15px] leading-relaxed font-light text-white/80 sm:text-[17px]">
                {cap.body}
              </p>
            )}
            {idx === Dn.length - 1 && (
              <a
                href="#"
                className="font-ui mt-2 rounded-full bg-white px-6 py-3 text-[14px] font-light text-black transition-transform hover:-translate-y-0.5"
              >
                Find a store
              </a>
            )}
          </div>
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-x-5 bottom-8 h-px bg-white/20 sm:inset-x-8 sm:bottom-10"
        >
          <div ref={n} className="h-full origin-left scale-x-0 bg-white" />
        </div>
      </div>
    </section>
  );
}
