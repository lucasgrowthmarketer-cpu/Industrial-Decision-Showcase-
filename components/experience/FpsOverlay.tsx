"use client";
// Compteur FPS active par ?debug=1 : moyenne glissante + 1% low approx.
// C'est lui qui prononce le gate Phase 1 (60 desktop / 30+ mobile).
import { useEffect, useRef, useState } from "react";

export function FpsOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [stats, setStats] = useState({ avg: 0, low: 0 });
  const frames = useRef<number[]>([]);
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("debug")) return;
    setEnabled(true);
    let last = performance.now(), raf = 0;
    const loop = (t: number) => {
      const dt = t - last; last = t;
      if (dt > 0 && dt < 500) {
        frames.current.push(1000 / dt);
        if (frames.current.length > 120) frames.current.shift();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const iv = setInterval(() => {
      const f = frames.current;
      if (!f.length) return;
      const sorted = [...f].sort((a, b) => a - b);
      setStats({
        avg: Math.round(f.reduce((s, v) => s + v, 0) / f.length),
        low: Math.round(sorted[Math.max(0, Math.floor(sorted.length * 0.01))]),
      });
    }, 500);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); };
  }, []);
  if (!enabled) return null;
  return (
    <div className="fps-overlay">
      {stats.avg} FPS · low {stats.low}
    </div>
  );
}
