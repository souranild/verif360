"use client";

import React, { useRef, useEffect } from 'react';

export default function HeroAnimation({
  color = { r: 91, g: 79, b: 230 },
  countOverride,
  intensity = 1,
  pointer = true,
}: {
  color?: { r: number; g: number; b: number };
  countOverride?: number;
  intensity?: number;
  pointer?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const baseColor = color;

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; alpha: number };
    const particles: Particle[] = [];

    // adaptive particle count with optional override
    const count = countOverride ?? (window.innerWidth < 640 ? 28 : window.innerWidth < 1280 ? 60 : 80);

    let pointerState = { x: width / 2, y: height / 2, active: false };

    function init() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: (10 + Math.random() * 40) * Math.sqrt(intensity),
          vx: (Math.random() - 0.5) * 1.2 * intensity,
          vy: (Math.random() - 0.5) * 1.2 * intensity,
          alpha: 0.06 + Math.random() * 0.18,
        });
      }
    }

    init();

    // pointer handlers (attached to canvas to avoid cross-instance interference)
    function handlePointerMove(e: MouseEvent | TouchEvent) {
      if (!pointer) return;
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
      const rect = canvas.getBoundingClientRect();
      pointerState.x = px - rect.left;
      pointerState.y = py - rect.top;
      pointerState.active = true;
    }

    function handlePointerLeave() {
      pointerState.active = false;
    }

    // Listen on window so the animation remains interactive even when the pointer is over layered content
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchend', handlePointerLeave);

    // Keep canvas listeners as a fallback
    canvas.addEventListener('mousemove', handlePointerMove, { passive: true });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('touchend', handlePointerLeave);

    let rafId: number;
    function render() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // subtle pointer glow overlay
      if (pointerState.active) {
        const g = ctx.createRadialGradient(pointerState.x, pointerState.y, 0, pointerState.x, pointerState.y, Math.max(width, height) * 0.6);
        g.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${0.06 * intensity})`);
        g.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);
        ctx.fillStyle = g as any;
        ctx.fillRect(0, 0, width, height);
      }

      // draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // pointer interaction
        if (pointer && pointerState.active) {
          const dx = pointerState.x - p.x;
          const dy = pointerState.y - p.y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2) + 0.001;

          if (dist < 120 * intensity) {
            const repulse = -40000 / (dist2 + 100);
            p.vx += (dx / dist) * repulse * 0.08 * intensity;
            p.vy += (dy / dist) * repulse * 0.08 * intensity;
          } else if (dist < 450 * intensity) {
            const attract = 80000 / (dist2 + 200);
            p.vx += (dx / dist) * attract * 0.015 * intensity;
            p.vy += (dy / dist) * attract * 0.015 * intensity;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x > width + p.r) p.x = -p.r;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.y > height + p.r) p.y = -p.r;
        if (p.y < -p.r) p.y = height + p.r;

        // gradient and glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grd.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${Math.min(1, p.alpha * 1.6 * intensity)})`);
        grd.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${Math.min(1, p.alpha * 0.9 * intensity)})`);
        grd.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

        ctx.shadowBlur = p.r * 0.9 * intensity;
        ctx.shadowColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${Math.min(1, p.alpha * 0.9 * intensity)})`;
        ctx.fillStyle = grd as any;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // connection lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160 * (1 + intensity * 0.5);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.2 * intensity;
            ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(render);
    }

    render();

    function handleResize() {
      const c = canvasRef.current;
      if (!c) return;
      const context = c.getContext('2d');
      if (!context) return;
      const prevWidth = width;
      const prevHeight = height;
      width = c.clientWidth;
      height = c.clientHeight;
      c.width = width * dpr;
      c.height = height * dpr;
      context.scale(dpr, dpr);
      if (Math.abs(width - prevWidth) > 10 || Math.abs(height - prevHeight) > 10) init();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove as any);
      window.removeEventListener('touchmove', handlePointerMove as any);
      window.removeEventListener('mouseleave', handlePointerLeave as any);
      window.removeEventListener('touchend', handlePointerLeave as any);
      canvas.removeEventListener('mousemove', handlePointerMove as any);
      canvas.removeEventListener('touchmove', handlePointerMove as any);
      canvas.removeEventListener('mouseleave', handlePointerLeave as any);
      canvas.removeEventListener('touchend', handlePointerLeave as any);
    };
  }, [color.r, color.g, color.b, countOverride, intensity, pointer]);

  return (
    <div className="absolute inset-0 pointer-events-none -z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
