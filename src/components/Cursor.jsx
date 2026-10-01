/* =====================================================================
   TARGETING CURSOR — a dot + a ring that follows smoothly.
   The ring grows (gold) over links, buttons and cards.
   Hidden automatically on phones / touch screens.
   ===================================================================== */
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.body.classList.add('custom-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf;

    const move = (e) => {
      x = e.clientX; y = e.clientY;
      const hot = e.target.closest('a, button, input, textarea, [data-hover]');
      ring.current?.classList.toggle('hover', !!hot);
    };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
