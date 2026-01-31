"use client";

import React, { useEffect, useRef } from 'react';

export default function FullBackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    // Particle system
    type P = { x: number; y: number; r: number; vx: number; vy: number; alpha: number };
    const particles: P[] = [];

    let baseColor = { r: 91, g: 79, b: 230 };

    function readParticleColorFromCSS() {
      try {
        const s = getComputedStyle(document.documentElement);
        const r = parseInt(s.getPropertyValue('--particle-r')) || baseColor.r;
        const g = parseInt(s.getPropertyValue('--particle-g')) || baseColor.g;
        const b = parseInt(s.getPropertyValue('--particle-b')) || baseColor.b;
        baseColor = { r, g, b };
      } catch (e) {
        // ignore
      }
    }

    // initial read
    readParticleColorFromCSS();

    // observe changes to html attributes (e.g., theme class) and update color
    const mo = new MutationObserver(() => {
      readParticleColorFromCSS();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    const count = window.innerWidth < 640 ? 60 : window.innerWidth < 1280 ? 120 : 160;

    function init() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 8 + Math.random() * 36,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
          alpha: Math.min(1, 0.022 + Math.random() * 0.088), // ~10% brighter
        });
      }
    }

    init();

    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

    function handlePointerMove(e: MouseEvent | TouchEvent) {
      let px: number, py: number;
      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        if (!t) return;
        px = t.clientX;
        py = t.clientY;
      } else {
        const m = e as MouseEvent;
        px = m.clientX;
        py = m.clientY;
      }
      pointer.x = px;
      pointer.y = py;
      pointer.active = true;
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchend', handlePointerLeave);
    window.addEventListener('resize', resize);

    let raf = 0;
    function render() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';

      // very subtle pointer radial glow (minimal)
      if (pointer.active) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, Math.max(window.innerWidth, window.innerHeight) * 0.6);
        g.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.011)`);
        g.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);
        ctx.fillStyle = g as any;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      // update and draw particles (very muted brightness)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2) + 0.001;

          if (dist < 180) {
            const repulse = -12000 / (dist2 + 200);
            p.vx += (dx / dist) * repulse * 0.03;
            p.vy += (dy / dist) * repulse * 0.03;
          } else if (dist < 520) {
            const attract = 22000 / (dist2 + 300);
            p.vx += (dx / dist) * attract * 0.003;
            p.vy += (dy / dist) * attract * 0.003;
          }
        }

        p.vx *= 0.995; // more damping for subtle motion
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x > window.innerWidth + p.r) p.x = -p.r;
        if (p.x < -p.r) p.x = window.innerWidth + p.r;
        if (p.y > window.innerHeight + p.r) p.y = -p.r;
        if (p.y < -p.r) p.y = window.innerHeight + p.r;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grd.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${Math.min(1, p.alpha * 0.77)})`);
        grd.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${Math.min(1, p.alpha * 0.385)})`);
        grd.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

        ctx.shadowBlur = p.r * 0.275; // slightly larger glow
        ctx.shadowColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${Math.min(1, p.alpha * 0.385)})`;
        ctx.fillStyle = grd as any;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // connecting lines for visibility (subtle)
      ctx.lineWidth = 0.39;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 100;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.055; // slightly brighter
            ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handlePointerMove as any);
      window.removeEventListener('touchmove', handlePointerMove as any);
      window.removeEventListener('mouseleave', handlePointerLeave as any);
      window.removeEventListener('touchend', handlePointerLeave as any);
      window.removeEventListener('resize', resize);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
  );
}
