import { useEffect, useState, type CSSProperties, type RefObject } from 'react';

const ne = ['Tailored for', 'the modern man.'];
const re =
  'Avanio is menswear built on restraint — clean lines, honest fabrics and relaxed tailoring that carries you from the studio to the street. Pieces made to be worn often, and remembered always.';
const ie = re.split(' ');
const I = 750;
const ae = 70;

function Oe({ start }: { start: boolean }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!start) return;
    let iv = 0;
    const to = window.setTimeout(() => {
      iv = window.setInterval(() => {
        setT((e) => {
          if (e + 1 >= ie.length) clearInterval(iv);
          return Math.min(e + 1, ie.length);
        });
      }, ae);
    }, I);
    return () => {
      clearTimeout(to);
      clearInterval(iv);
    };
  }, [start]);
  const r = t >= ie.length;
  return (
    <p
      className="max-w-[34rem] text-[12px] leading-[1.35] italic opacity-90 sm:text-[13.5px]"
      aria-label={re}
    >
      {ie.map((e, n) => (
        <span key={n} aria-hidden={true} className={`typed-word ${n < t ? 'is-typed' : ''}`}>
          {e}
          {n === t - 1 && <span className={`caret ${r ? 'caret-idle' : ''}`} />}
          {n < ie.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}

export default function HeroText({
  ref,
  ready,
}: {
  ref: RefObject<HTMLDivElement | null>;
  ready: boolean;
}) {
  return (
    <div
      ref={ref}
      className="hero-text pointer-events-none absolute inset-x-0 top-[100px] z-20 flex flex-col-reverse gap-5 px-5 text-white mix-blend-difference sm:top-[150px] sm:px-8 md:flex-row md:items-start md:justify-between"
    >
      <Oe start={ready} />
      <h1 className="font-display text-[2rem] leading-[1.08] tracking-[0.02em] uppercase sm:text-[2.6rem] md:text-right lg:text-[3.1rem]">
        {ne.map((e, t) => (
          <span key={e} className="block overflow-hidden pb-1">
            {e.split(' ').map((e, n, r) => (
              <span key={n} className="inline-block overflow-hidden align-bottom">
                <span
                  className="reveal-up inline-block"
                  style={{ '--d': `${0.2 + t * 0.18 + n * 0.06}s` } as CSSProperties}
                >
                  {e}
                  {n < r.length - 1 ? ' ' : ''}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>
    </div>
  );
}
