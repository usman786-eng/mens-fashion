import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Header from './components/Header';
import HeroText from './components/HeroText';
import HeroNav from './components/HeroNav';
import Strip from './components/Strip';
import { HeroEngine, bf, xf, Tf, pe, type HeroFrame } from './three/heroEngine';
import Edit from './components/Edit';
import Highlights from './components/Highlights';
import NewIn from './components/NewIn';
import Trending from './components/Trending';
import StoreWalk from './components/StoreWalk';
import Footer from './components/Footer';
import { heroProducts, editProducts } from './data';

const Mf = [...heroProducts, ...editProducts].map((p) => p.name);
const Nf = 2400;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<HeroEngine | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085 });
    lenis.stop();
    const engine = new HeroEngine(canvasRef.current!);
    engineRef.current = engine;
    engine.onFrame = (f) => onFrame(f);
    engine.track = trackRef.current;
    let cancelled = false;
    let timer = 0;
    Promise.all([engine.load(), document.fonts.ready]).then(() => {
      if (cancelled) return;
      setReady(true);
      engine.start();
      timer = window.setTimeout(() => lenis.start(), Nf);
    });
    const onKey = (e: KeyboardEvent) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (rect && rect.bottom < window.innerHeight * 0.5) return;
      if (e.key === 'ArrowLeft') engine.step(-1);
      if (e.key === 'ArrowRight') engine.step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      lenis.destroy();
      engine.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lightRef = useRef(false);
  const onFrame = ({ paint, shop, offset, width, height }: HeroFrame) => {
    const track = trackRef.current;
    if (!track) return;
    const light = paint > 0.84;
    if (light !== lightRef.current) {
      lightRef.current = light;
      track.dataset.light = light ? '1' : '0';
    }
    if (heroTextRef.current)
      heroTextRef.current.style.opacity = String(1 - xf(paint, 0.62, 0.9));
    const f = Math.max(width / 5.35, 150);
    const p = Math.min(f * 1.02, height * 0.3);
    slotRefs.current.forEach((el, t) => {
      if (!el) return;
      const n = Tf(t - offset, pe);
      const r = Math.abs(n);
      const vis = r < width / f / 2 + 1 && shop > 0.001;
      el.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) return;
      const c = 1 - (1 - bf(shop * 1.7 - 0.12 - r * 0.13)) ** 3;
      const l = width / 2 + n * f - f / 2;
      el.style.width = `${f}px`;
      el.style.height = `${p}px`;
      el.style.transform = `translate3d(${l}px, ${(1 - c) * (p + 40)}px, 0)`;
      el.style.setProperty('--f', String(bf(1 - r)));
      el.style.zIndex = r < 0.5 ? '2' : '1';
    });
    if (navRef.current) {
      const e = xf(shop, 0.65, 1);
      navRef.current.style.opacity = String(e);
      navRef.current.style.bottom = `${p + 24}px`;
      navRef.current.style.transform = `translateY(${(1 - e) * 16}px)`;
      navRef.current.style.pointerEvents = e > 0.9 ? 'auto' : 'none';
    }
  };

  return (
    <>
      <div ref={trackRef} data-light="0" data-ready={ready ? '1' : '0'} className="app">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <Header />
          <HeroText ref={heroTextRef} ready={ready} />
          <HeroNav
            ref={navRef}
            onPrev={() => engineRef.current?.step(-1)}
            onNext={() => engineRef.current?.step(1)}
          />
          <Strip
            slotRefs={slotRefs}
            onSelect={(i) => {
              const t = engineRef.current;
              if (!t) return;
              const n = ((Math.round(Tf(i - t.target, pe)) % 5) + 7) % 5 - 2;
              if (n !== 0) t.step(n);
            }}
          />
          <div className={`loader ${ready ? 'loader-done' : ''}`}>
            <span className="font-logo text-2xl tracking-[0.3em] text-white/70">AVANIO</span>
          </div>
        </div>
        <div aria-hidden={true} className="h-[600vh]" />
      </div>
      <Edit />
      <Highlights pieces={Mf} />
      <NewIn />
      <Trending />
      <StoreWalk />
      <Footer />
    </>
  );
}
