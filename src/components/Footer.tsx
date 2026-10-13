import type { ReactNode } from 'react';
import { footerNav } from '../data';

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

const Mn: Array<{ label: string; icon: ReactNode }> = [
  {
    label: 'Facebook',
    icon: (
      <path
        fill="currentColor"
        d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1Z"
      />
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x={4} y={4} width={16} height={16} rx={4.5} />
        <circle cx={12} cy={12} r={3.6} />
        <circle cx={16.9} cy={7.1} r={0.6} fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
        <rect x={3} y={6} width={18} height={12} rx={3.5} />
        <path d="m10.3 9.6 4.2 2.4-4.2 2.4V9.6Z" fill="currentColor" />
      </g>
    ),
  },
];

function Nn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="h-8 w-[3.25rem] overflow-hidden rounded-[5px] bg-white" title={label}>
      <svg viewBox="0 0 52 32" className="h-full w-full" role="img" aria-label={label}>
        {children}
      </svg>
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0b0b0b] px-5 pt-14 pb-8 text-white sm:px-8 sm:pt-20 sm:pb-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-0">
        <div className="flex flex-col gap-6 lg:border-r lg:border-white/15 lg:pr-12">
          <a href="#" className="flex items-center gap-2.5">
            <F className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="font-logo text-[1.9rem] leading-none tracking-[-0.02em] sm:text-[2.3rem]">
              AVANIO
            </span>
          </a>
          <p className="font-ui max-w-[36ch] text-[14px] leading-relaxed font-light text-white/65">
            <span className="font-normal text-white">AVANIO</span>
            {' makes menswear in small batches: pure linen, heavyweight jersey and relaxed modern fits, cut to be worn often and kept for years.'}
          </p>
          <ul className="flex gap-3">
            {Mn.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:pl-12">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="font-display mb-5 text-[1.05rem] tracking-[0.08em] uppercase sm:mb-6 sm:text-[1.15rem]">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-ui text-[14px] font-light text-white/65 transition-colors hover:text-white sm:text-[15px]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-12 flex flex-col gap-5 border-t border-white/15 pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-ui text-[13px] font-light text-white/55">
          © {year} AVANIO. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
          <Nn label="American Express">
            <>
              <rect width={52} height={32} rx={5} fill="#1f72cd" />
              <text
                x={26}
                y={20}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
                fontWeight={800}
                fontFamily="Arial, sans-serif"
                letterSpacing={0.5}
              >
                AMEX
              </text>
            </>
          </Nn>
          <Nn label="PayPal">
            <text
              x={26}
              y={20.5}
              textAnchor="middle"
              fontSize={11}
              fontWeight={800}
              fontStyle="italic"
              fontFamily="Arial, sans-serif"
            >
              <tspan fill="#003087">Pay</tspan>
              <tspan fill="#009cde">Pal</tspan>
            </text>
          </Nn>
          <Nn label="Mastercard">
            <>
              <circle cx={21} cy={16} r={8} fill="#eb001b" />
              <circle cx={31} cy={16} r={8} fill="#f79e1b" fillOpacity={0.9} />
            </>
          </Nn>
          <Nn label="Visa">
            <text
              x={26}
              y={21}
              textAnchor="middle"
              fill="#1a1f71"
              fontSize={13}
              fontWeight={900}
              fontStyle="italic"
              fontFamily="Arial, sans-serif"
            >
              VISA
            </text>
          </Nn>
          <Nn label="Discover">
            <>
              <text
                x={27}
                y={18.6}
                textAnchor="end"
                fill="#231f20"
                fontSize={7}
                fontWeight={800}
                fontFamily="Arial, sans-serif"
              >
                DISC
              </text>
              <circle cx={30.4} cy={16.1} r={3} fill="#f58220" />
              <text
                x={33.8}
                y={18.6}
                fill="#231f20"
                fontSize={7}
                fontWeight={800}
                fontFamily="Arial, sans-serif"
              >
                VER
              </text>
            </>
          </Nn>
        </ul>
      </div>
    </footer>
  );
}
