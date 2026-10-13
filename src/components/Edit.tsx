import { useEffect, useRef, useState } from 'react';
import CoverCarousel from './CoverCarousel';
import type { CoverSlide } from './CoverCarousel';
import { editProducts } from '../data';

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
      />
    </svg>
  );
}

const slides: CoverSlide[] = editProducts.map((p) => ({
  src: p.image,
  alt: `${p.name} — ${p.category}`,
  title: p.name,
  subtitle: p.category,
  meta: [
    { label: 'Fabric', value: p.fabric },
    { label: 'Fit', value: p.fit },
    { label: 'Rating', value: `★ ${p.rating.toFixed(1)}` },
    { label: 'Price', value: `€${p.price}` },
  ],
}));

export default function Edit() {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), {
      threshold: 0.3,
    });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-inview={inView ? '1' : '0'}
      className="coverflow relative overflow-hidden bg-background py-16 text-foreground sm:py-20"
    >
      <header className="cf-reveal mb-4 flex flex-col items-center gap-3 px-5 text-center">
        <span className="font-ui flex items-center gap-2 text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
          <Sparkle className="h-3 w-3" /> The Edit
        </span>
        <h2 className="font-display text-[2rem] leading-none tracking-[0.02em] uppercase sm:text-[2.8rem]">
          Pieces worth keeping
        </h2>
      </header>
      <CoverCarousel
        slides={slides}
        label="The Edit"
        cardWidth="clamp(210px, 25vw, 360px)"
        className="cf-reveal"
        cardClassName="shadow-[0_30px_60px_-28px_rgb(0_0_0/0.4)] [&>img]:object-top"
        showCaption
        showPagination
        renderCaption={(slide) => (
          <div className="mx-auto flex w-[min(360px,86vw)] flex-col items-center">
            <h3 className="font-display text-center text-[1.6rem] leading-tight tracking-[0.02em] uppercase sm:text-[1.9rem]">
              {slide.title}
            </h3>
            <p className="mt-1.5 text-[13px] text-muted-foreground italic">{slide.subtitle}</p>
            <dl className="mt-6 w-full space-y-2 text-[12.5px]">
              {slide.meta?.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-6">
                  <dt className="font-ui font-light text-muted-foreground">{item.label}</dt>
                  <dd className="font-sans font-bold italic">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      />
    </section>
  );
}
