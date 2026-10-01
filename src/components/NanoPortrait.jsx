/* =====================================================================
   NANO PORTRAIT — your nano-tech effect, now as a React component
   • Hover + swipe  → paint brush reveals the suit (when not suited)
   • Click          → nano-tech transform (suit spreads from the chest)
   • Opens with the suit, then powers down after INTRO_HOLD
   • Anything can toggle it:  window.dispatchEvent(new Event('nano:toggle'))
   ===================================================================== */
import { useEffect, useRef } from 'react';

/* ✏️ Settings */
const S = {
  BRUSH_SIZE: 0.16,      // brush thickness (part of photo width)
  LIFE: 900,             // how long brush paint stays (ms)
  RIM: 7,                // brush edge thickness
  GLOW: '#fff1b0',
  GLOW_SOFT: 'rgba(255, 200, 97, 0.9)',
  SMOOTH: 0.28,          // brush smoothness (0.1 slow → 0.5 fast)

  NANO_TIME: 2400,       // transform time (ms)
  NANO_ORIGIN: { x: 0.5, y: 0.78 },  // start point (chest) 0..1 of the photo
  NANO_COLOR: '#bdf3ff',
  NANO_GLOW: 'rgba(120, 220, 255, 0.9)',
  HEX_SIZE: 7,
  EDGE_BAND: 46,

  AURA_SCALE: 1,         // size of the suit image vs the photo
  AURA_X: 0, AURA_Y: 0,  // move the suit image (px)
  INTRO_HOLD: 1400,      // suit shows this long after the boot screen
};

export default function NanoPortrait({ photo, suit, active, onPaint, onSuitChange }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const baseRef = useRef(null);
  const auraRef = useRef(null);
  const api = useRef({});
  const cb = useRef({ onPaint, onSuitChange });
  cb.current = { onPaint, onSuitChange };

  useEffect(() => {
    const portrait = wrapRef.current;
    const canvas = canvasRef.current;
    const baseImg = baseRef.current;
    const auraImg = auraRef.current;
    const ctx = canvas.getContext('2d');
    const mk = () => { const c = document.createElement('canvas'); return [c, c.getContext('2d')]; };
    const [maskC, mask] = mk(), [glowC, glow] = mk(), [auraC, aura] = mk(), [silC, sil] = mk(), [hexC, hex] = mk();

    let W = 0, H = 0, dpr = 1, PW = 0, PH = 0, OX = 0, OY = 0;
    let points = [], strokeId = 0, particles = [];
    let nanoT = 1, nanoTarget = 1, lastNow = performance.now(), raf;
    let mouse = null, brush = null, inside = false, downAt = null, painted = 0, userTouched = false;

    const drawFitted = (c, img, scale = 1, sx = 0, sy = 0) => {
      if (!img.naturalWidth) return;
      const s = Math.min(PW / img.naturalWidth, PH / img.naturalHeight) * scale;
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      c.drawImage(img, OX + (PW - dw) / 2 + sx * dpr, OY + PH - dh + sy * dpr, dw, dh);
    };
    const drawAura = (c) => drawFitted(c, auraImg, S.AURA_SCALE, S.AURA_X, S.AURA_Y);

    const buildSil = () => { sil.clearRect(0, 0, W, H); drawFitted(sil, baseImg); drawAura(sil); };
    const buildHex = () => {
      hex.clearRect(0, 0, W, H);
      const s = S.HEX_SIZE * dpr, h = s * Math.sqrt(3);
      hex.strokeStyle = S.NANO_COLOR; hex.lineWidth = dpr; hex.beginPath();
      for (let col = 0, x = 0; x < W + s * 2; col++, x = col * s * 1.5) {
        for (let row = 0; row * h < H + h; row++) {
          const cy = row * h + (col % 2 ? h / 2 : 0);
          for (let k = 0; k <= 6; k++) {
            const a = k * Math.PI / 3, px = x + Math.cos(a) * s, py = cy + Math.sin(a) * s;
            k === 0 ? hex.moveTo(px, py) : hex.lineTo(px, py);
          }
        }
      }
      hex.stroke();
    };
    const resize = () => {
      const r = portrait.getBoundingClientRect(), c = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.round(c.width * dpr); H = Math.round(c.height * dpr);
      PW = r.width * dpr; PH = r.height * dpr;
      OX = (r.left - c.left) * dpr; OY = (r.top - c.top) * dpr;
      [canvas, maskC, glowC, auraC, silC, hexC].forEach(k => { k.width = W; k.height = H; });
      buildSil(); buildHex();
    };

    /* ---- brush ---- */
    const drawTrail = (c, extra, color, now) => {
      c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = color;
      const bw = PW * S.BRUSH_SIZE;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        if (a.id !== b.id) continue;
        const life = 1 - (now - b.t) / S.LIFE;
        if (life <= 0) continue;
        const k = 1 - Math.pow(1 - life, 3);
        c.lineWidth = bw * k + extra * dpr * k;
        c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      }
    };
    const clipToBody = (c) => {
      c.globalCompositeOperation = 'destination-in'; c.drawImage(silC, 0, 0);
      c.globalCompositeOperation = 'source-over';
    };
    const moveBrush = (now) => {
      if (!inside || !mouse || !brush) return;
      if (nanoTarget || nanoT > 0) { brush = { ...mouse }; return; }
      const nx = brush.x + (mouse.x - brush.x) * S.SMOOTH, ny = brush.y + (mouse.y - brush.y) * S.SMOOTH;
      const dist = Math.hypot(nx - brush.x, ny - brush.y);
      if (dist < 0.5) return;
      const step = 4 * dpr;
      for (let d = step; d < dist; d += step) {
        const t = d / dist;
        points.push({ x: brush.x + (nx - brush.x) * t, y: brush.y + (ny - brush.y) * t, t: now, id: strokeId });
      }
      points.push({ x: nx, y: ny, t: now, id: strokeId });
      brush = { x: nx, y: ny };
      painted += dist;
      if (painted > 1500 * dpr) { cb.current.onPaint?.(); painted = -1e9; }
    };

    /* ---- nano ---- */
    const ease = t => t * t * (3 - 2 * t) * 0.35 + t * t * 0.65;
    const edgeR = (r, a, time) => Math.max(0, r * (1
      + 0.10 * Math.sin(a * 6 + time * 0.004)
      + 0.06 * Math.sin(a * 11 - time * 0.006)
      + 0.04 * Math.sin(a * 17 + time * 0.009)
      + 0.10 * Math.pow(Math.max(0, Math.sin(a * 3 + time * 0.002)), 8)));
    const origin = () => [OX + S.NANO_ORIGIN.x * PW, OY + S.NANO_ORIGIN.y * PH];
    const nanoPath = (c, r, time) => {
      const [ox, oy] = origin(); c.beginPath();
      for (let i = 0; i <= 140; i++) {
        const a = i / 140 * Math.PI * 2, rr = edgeR(r, a, time);
        const x = ox + Math.cos(a) * rr, y = oy + Math.sin(a) * rr;
        i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
      }
      c.closePath();
    };
    const drawNano = (now, dt) => {
      if (nanoT >= 1) { drawAura(ctx); particles = []; return; }
      const [ox, oy] = origin();
      const far = Math.max(Math.hypot(ox, oy), Math.hypot(W - ox, oy), Math.hypot(ox, H - oy), Math.hypot(W - ox, H - oy));
      const e = ease(nanoT), R = e * far / 0.82, moving = nanoT !== nanoTarget;

      mask.clearRect(0, 0, W, H); mask.fillStyle = '#fff'; nanoPath(mask, R, now); mask.fill();
      aura.clearRect(0, 0, W, H); drawAura(aura);
      aura.globalCompositeOperation = 'destination-in'; aura.drawImage(maskC, 0, 0);
      aura.globalCompositeOperation = 'source-over'; ctx.drawImage(auraC, 0, 0);

      const band = S.EDGE_BAND * dpr;
      glow.clearRect(0, 0, W, H); glow.fillStyle = '#fff';
      nanoPath(glow, R, now); glow.fill();
      glow.globalCompositeOperation = 'destination-out'; nanoPath(glow, R - band, now); glow.fill();
      glow.globalCompositeOperation = 'source-in'; glow.drawImage(hexC, 0, 0);
      glow.globalCompositeOperation = 'source-over'; clipToBody(glow);
      ctx.globalAlpha = 0.55; ctx.drawImage(glowC, 0, 0); ctx.globalAlpha = 1;

      mask.clearRect(0, 0, W, H); mask.save();
      mask.strokeStyle = S.NANO_COLOR; mask.lineWidth = 2.5 * dpr;
      mask.shadowColor = S.NANO_GLOW; mask.shadowBlur = 14 * dpr;
      nanoPath(mask, R, now); mask.stroke(); mask.restore(); clipToBody(mask);
      ctx.drawImage(maskC, 0, 0);

      const dir = nanoTarget > nanoT ? 1 : -1;
      if (moving && R > 2) {
        for (let i = 0; i < 10; i++) {
          const a = Math.random() * Math.PI * 2, rr = edgeR(R, a, now), sp = (0.04 + Math.random() * 0.12) * dpr * dir;
          particles.push({ x: ox + Math.cos(a) * rr, y: oy + Math.sin(a) * rr,
            vx: Math.cos(a) * sp + (Math.random() - .5) * .03 * dpr, vy: Math.sin(a) * sp + (Math.random() - .5) * .03 * dpr,
            life: 1, size: (1 + Math.random() * 2.2) * dpr });
        }
      }
      glow.clearRect(0, 0, W, H); glow.save();
      glow.fillStyle = S.NANO_COLOR; glow.shadowColor = S.NANO_GLOW; glow.shadowBlur = 6 * dpr;
      particles = particles.filter(p => (p.life -= dt / 650) > 0);
      particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; glow.globalAlpha = p.life; glow.fillRect(p.x, p.y, p.size, p.size); });
      glow.restore(); clipToBody(glow); ctx.drawImage(glowC, 0, 0);

      const flash = moving ? Math.max(0, 1 - e / 0.22) : 0;
      if (flash > 0) {
        const r = (40 + 60 * (1 - flash)) * dpr, g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        g.addColorStop(0, `rgba(255,255,255,${flash})`);
        g.addColorStop(0.3, `rgba(160,235,255,${flash * 0.8})`);
        g.addColorStop(1, 'rgba(120,220,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.fill();
      }
    };

    /* ---- main loop ---- */
    const frame = (now) => {
      moveBrush(now);
      points = points.filter(p => now - p.t < S.LIFE);
      ctx.clearRect(0, 0, W, H);

      if (points.length > 1) {
        mask.clearRect(0, 0, W, H); drawTrail(mask, 0, '#fff', now);
        glow.clearRect(0, 0, W, H); glow.save();
        glow.shadowColor = S.GLOW_SOFT; glow.shadowBlur = 10 * dpr;
        drawTrail(glow, S.RIM, S.GLOW, now); glow.restore(); clipToBody(glow);
        aura.clearRect(0, 0, W, H); drawAura(aura);
        aura.globalCompositeOperation = 'destination-in'; aura.drawImage(maskC, 0, 0);
        aura.globalCompositeOperation = 'source-over';
        ctx.drawImage(glowC, 0, 0); ctx.drawImage(auraC, 0, 0);
      }

      const dt = Math.min(now - lastNow, 50); lastNow = now;
      const step = dt / S.NANO_TIME;
      if (nanoT < nanoTarget) nanoT = Math.min(nanoTarget, nanoT + step);
      if (nanoT > nanoTarget) nanoT = Math.max(nanoTarget, nanoT - step);
      if (nanoT > 0.001) drawNano(now, dt);

      const suited = nanoT >= 1;
      baseImg.style.visibility = suited ? 'hidden' : 'visible';
      canvas.classList.toggle('suited', suited);
      raf = requestAnimationFrame(frame);
    };

    const toggle = () => {
      nanoTarget = nanoTarget ? 0 : 1;
      points = [];
      cb.current.onSuitChange?.(!!nanoTarget);
    };
    api.current.toggle = toggle;
    api.current.powerDownIfSuited = () => { if (nanoTarget === 1 && !userTouched) toggle(); };

    /* ---- events ---- */
    const toCanvas = (e) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr }; };
    const onEnter = (e) => { inside = true; strokeId++; mouse = toCanvas(e); brush = { ...mouse }; };
    const onDown = (e) => { onEnter(e); downAt = { x: e.clientX, y: e.clientY }; };
    const onMove = (e) => { mouse = toCanvas(e); };
    const onLeave = () => { inside = false; };
    const onUp = (e) => { if (e.pointerType !== 'mouse') inside = false; };
    const onClick = (e) => {
      if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 10) return;
      userTouched = true;
      toggle();
    };
    const onToggleEvt = () => { userTouched = true; toggle(); };

    portrait.addEventListener('pointerenter', onEnter);
    portrait.addEventListener('pointerdown', onDown);
    portrait.addEventListener('pointermove', onMove);
    portrait.addEventListener('pointerleave', onLeave);
    portrait.addEventListener('pointerup', onUp);
    portrait.addEventListener('click', onClick);
    window.addEventListener('nano:toggle', onToggleEvt);
    window.addEventListener('resize', resize);
    const onLoad = () => { resize(); };
    baseImg.addEventListener('load', onLoad);
    auraImg.addEventListener('load', onLoad);

    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      portrait.removeEventListener('pointerenter', onEnter);
      portrait.removeEventListener('pointerdown', onDown);
      portrait.removeEventListener('pointermove', onMove);
      portrait.removeEventListener('pointerleave', onLeave);
      portrait.removeEventListener('pointerup', onUp);
      portrait.removeEventListener('click', onClick);
      window.removeEventListener('nano:toggle', onToggleEvt);
      window.removeEventListener('resize', resize);
      baseImg.removeEventListener('load', onLoad);
      auraImg.removeEventListener('load', onLoad);
    };
  }, []);

  /* Intro: after the boot screen closes, hold the suit, then power down */
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => api.current.powerDownIfSuited?.(), S.INTRO_HOLD);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div className="portrait" ref={wrapRef} data-hover>
      <img ref={baseRef} className="p-base" src={photo} alt="Portrait" />
      <img ref={auraRef} className="p-suit" src={suit} alt="" />
      <canvas ref={canvasRef} />
      <div className="scan-line" />
    </div>
  );
}
