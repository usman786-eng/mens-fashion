import CurvedMarquee from './CurvedMarquee';

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

const phrases = [
  'Tailored in small batches',
  'Pure linen & heavyweight jersey',
  'Relaxed modern fits',
  'Free shipping over €150',
  '30-day free returns',
  'Made to be worn often',
];

const joinPhrases = (items: string[]) => items.map((item) => `${item} ✦ `).join('');

export default function Highlights({ pieces }: { pieces: string[] }) {
  return (
    <section
      className="highlights relative overflow-hidden bg-[#0b0b0b] py-10 text-white sm:py-14"
      aria-label="Highlights"
    >
      <header className="mb-3 flex flex-col items-center gap-3 px-5 text-center">
        <span className="font-ui flex items-center gap-2 text-[11px] tracking-[0.32em] text-white/50 uppercase">
          <Sparkle className="h-3 w-3" /> Highlights
        </span>
      </header>
      <ul className="sr-only">
        {phrases.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden="true">
        <div className="mb-[-3.4vw] sm:mb-[-5.2vw]">
          <CurvedMarquee
            marqueeText={joinPhrases(phrases)}
            speed={1}
            curveAmount={70}
            direction="left"
            className="font-display font-normal text-[4rem] tracking-[0.04em] sm:text-[2.5rem]"
          />
        </div>
        <div className="mb-[-6vw] opacity-40 sm:mb-[-7.6vw]">
          <CurvedMarquee
            marqueeText={joinPhrases(pieces)}
            speed={0.7}
            curveAmount={-50}
            direction="right"
            className="font-display font-normal text-[2.8rem] tracking-[0.08em] sm:text-[1.6rem]"
          />
        </div>
      </div>
      <p className="font-ui mt-4 text-center text-[11px] tracking-[0.2em] text-white/35 uppercase">
        Drag to spin
      </p>
    </section>
  );
}
