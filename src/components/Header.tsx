import type { CSSProperties } from 'react';

function F({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden={true}>
      <path
        fill="currentColor"
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="header pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
      <a
        href="#"
        className="reveal-down pointer-events-auto flex items-center gap-2.5"
        style={{ '--d': '0.05s' } as CSSProperties}
      >
        <F className="logo-mark h-7 w-7 sm:h-8 sm:w-8" />
        <span className="logo font-logo text-[1.9rem] leading-none tracking-[-0.02em] sm:text-[2.3rem]">
          AVANIO
        </span>
      </a>
      <nav className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <button
          aria-label="Search"
          className="hbtn reveal-down grid h-11 w-11 place-items-center rounded-full sm:h-[52px] sm:w-[52px]"
          style={{ '--d': '0.15s' } as CSSProperties}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" strokeLinecap="round" />
          </svg>
        </button>
        <button
          aria-label="Favourites"
          className="hbtn reveal-down grid h-11 w-11 place-items-center rounded-full sm:h-[52px] sm:w-[52px]"
          style={{ '--d': '0.22s' } as CSSProperties}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          >
            <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
          </svg>
        </button>
        <button
          aria-label="Bag"
          className="hbtn reveal-down grid h-11 w-11 place-items-center rounded-full sm:h-[52px] sm:w-[52px]"
          style={{ '--d': '0.29s' } as CSSProperties}
        >
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor">
            <path d="M8 8V7a4 4 0 1 1 8 0v1h2.2a1 1 0 0 1 1 .9l.9 11a2 2 0 0 1-2 2.1H5.9a2 2 0 0 1-2-2.1l.9-11a1 1 0 0 1 1-.9H8Zm1.6 0h4.8V7a2.4 2.4 0 1 0-4.8 0v1Zm-.1 3.2a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm5 0a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" />
          </svg>
        </button>
        <button
          aria-label="Contact"
          className="hbtn hbtn-pill reveal-down flex h-11 items-center gap-2.5 rounded-full p-1 sm:h-[52px] sm:gap-3 sm:pr-6"
          style={{ '--d': '0.36s' } as CSSProperties}
        >
          <span className="pill-icon grid h-9 w-9 place-items-center rounded-full sm:h-11 sm:w-11">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm.6 2.6 6.4 4.3 6.4-4.3-.7-1-5.7 3.8-5.7-3.8-.7 1Z" />
            </svg>
          </span>
          <span className="font-ui hidden text-[15px] font-light sm:inline">Contact</span>
        </button>
      </nav>
    </header>
  );
}
