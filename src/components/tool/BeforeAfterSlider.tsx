'use client';

import { useEffect, useRef, useState } from 'react';

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const onUp = () => (dragging.current = false);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const updatePos = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-alt))]"
      onMouseMove={(e) => dragging.current && updatePos(e.clientX)}
      onTouchMove={(e) => dragging.current && updatePos(e.touches[0].clientX)}
    >
      <img src={before} alt={beforeLabel} className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img src={after} alt={afterLabel} className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-medium uppercase tracking-wide text-white">
        <span className="rounded-full bg-black/60 px-2 py-0.5">{beforeLabel}</span>
        <span className="rounded-full bg-black/60 px-2 py-0.5">{afterLabel}</span>
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white shadow"
        style={{ left: `calc(${pos}% - 2px)` }}
        onMouseDown={() => (dragging.current = true)}
        onTouchStart={() => (dragging.current = true)}
        role="slider"
        aria-label="Before/After slider"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
