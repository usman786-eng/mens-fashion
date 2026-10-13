import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface CurvedMarqueeProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

export default function CurvedMarquee({
  marqueeText = 'CURVED MARQUEE • INTERACTIVE LOOP • 21ST.DEV • ',
  speed = 2,
  className,
  curveAmount = 250,
  direction = 'left',
  interactive = true,
}: CurvedMarqueeProps) {
  const text = useMemo(
    () => ((/\s|\u00a0$/.test(marqueeText) ? marqueeText.replace(/\s+$/, '') : marqueeText) + ' '),
    [marqueeText],
  );
  const measureRef = useRef<SVGTextElement | null>(null);
  const pathRef = useRef<SVGTextPathElement | null>(null);
  const defPathRef = useRef<SVGPathElement | null>(null);
  const [textLength, setTextLength] = useState(0);
  const [offset, setOffset] = useState(0);
  const curveId = `curve-${useId()}`;
  const d = `M-100,40 Q500,${40 + curveAmount} 1540,40`;
  const dragging = useRef(false);
  const lastX = useRef(0);
  const dirRef = useRef(direction);
  const lastDelta = useRef(0);
  const len = textLength;
  const loopText = len ? Array(Math.ceil(1800 / len) + 2).fill(text).join('') : text;
  const ready = len > 0;

  useEffect(() => {
    const measure = () => {
      if (measureRef.current) setTextLength(measureRef.current.getComputedTextLength());
    };
    measure();
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) measure();
    });
    return () => {
      live = false;
    };
  }, [text, className]);

  useEffect(() => {
    if (textLength && pathRef.current) {
      const start = -textLength;
      pathRef.current.setAttribute('startOffset', `${start}px`);
      setOffset(start);
    }
  }, [textLength]);

  useEffect(() => {
    if (!textLength || !ready) return;
    let raf = 0;
    const tick = () => {
      if (!dragging.current && pathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const cur = parseFloat(pathRef.current.getAttribute('startOffset') || '0') + delta;
        const total = textLength;
        let next = cur;
        if (next <= -total) next += total;
        if (next > 0) next -= total;
        pathRef.current.setAttribute('startOffset', `${next}px`);
        setOffset(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [textLength, speed, ready]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragging.current = true;
    lastX.current = e.clientX;
    lastDelta.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragging.current || !pathRef.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    lastDelta.current = dx;
    const cur = parseFloat(pathRef.current.getAttribute('startOffset') || '0') + dx;
    const total = textLength;
    let next = cur;
    if (next <= -total) next += total;
    if (next > 0) next -= total;
    pathRef.current.setAttribute('startOffset', `${next}px`);
    setOffset(next);
  };

  const onPointerUp = () => {
    if (!interactive) return;
    dragging.current = false;
    dirRef.current = lastDelta.current > 0 ? 'right' : 'left';
  };

  const cursor = interactive ? (dragging.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      className="relative flex items-center justify-center w-full overflow-hidden"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <svg
        className="select-none w-full overflow-visible block aspect-[100/18] text-[4rem] font-black uppercase tracking-tight"
        viewBox="0 0 1440 160"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          className={className}
          style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}
        >
          {text}
        </text>
        <defs>
          <path ref={defPathRef} id={curveId} d={d} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-white ${className ?? ''}`}>
            <textPath ref={pathRef} href={`#${curveId}`} startOffset={`${offset}px`} xmlSpace="preserve">
              {loopText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}
