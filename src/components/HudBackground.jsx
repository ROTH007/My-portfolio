/* =====================================================================
   HUD BACKGROUND — drifting data particles linked by lines,
   a soft grid, and a glow that follows the mouse.
   ===================================================================== */
import { useEffect, useRef } from 'react';

export default function HudBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const cvs = ref.current;
    const ctx = cvs.getContext('2d');
    let w, h, dpr, raf;
    const mouse = { x: -999, y: -999 };
    let dots = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cvs.width = w * dpr; cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 18000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // grid
      ctx.strokeStyle = 'rgba(61,224,255,0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y < h; y += 60) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // mouse glow
      if (mouse.x > -999) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
        g.addColorStop(0, 'rgba(61,224,255,0.08)');
        g.addColorStop(1, 'rgba(61,224,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(mouse.x - 280, mouse.y - 280, 560, 560);
      }

      // particles
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        // push away from mouse a little
        const mx = d.x - mouse.x, my = d.y - mouse.y, md = Math.hypot(mx, my);
        if (md < 120) { d.x += (mx / md) * 0.8; d.y += (my / md) * 0.8; }
      }
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(61,224,255,${0.12 * (1 - dist / 130)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(158,239,255,0.6)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="hud-bg" />
      <div className="scanlines" />
      <div className="vignette" />
    </>
  );
}
