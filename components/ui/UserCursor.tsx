"use client";
// UserCursor, reconstruit depuis le composant Originkit fourni (arrive
// tronque) : fleche a ressort vif + pilule label trainante qui s'incline
// selon la vitesse et se comprime au clic. Adapte plein ecran.
// Preset Industrial Decision : size 25, label "Industrial Decision".
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

const SIZE = 25;
const NAME = "Industrial Decision";
const COLOR = "#FFFFFF";
const TEXT_COLOR = "#000000";
const PRESS_SCALE = 0.92;
const TILT_STRENGTH = 25;

export function UserCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const arrowX = useSpring(mouseX, { stiffness: 380, damping: 32, mass: 0.6 });
  const arrowY = useSpring(mouseY, { stiffness: 380, damping: 32, mass: 0.6 });
  const labelX = useSpring(mouseX, { stiffness: 220, damping: 26, mass: 0.7 });
  const labelY = useSpring(mouseY, { stiffness: 220, damping: 26, mass: 0.7 });
  const tiltTarget = useMotionValue(0);
  const labelRotation = useSpring(tiltTarget, { stiffness: 300, damping: 24, mass: 0.6 });
  const scale = useMotionValue(1);
  const labelTx = useTransform(labelX, (v) => v + SIZE * 0.9);
  const labelTy = useTransform(labelY, (v) => v + SIZE * 0.2 + 6);

  const lastSample = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const last = lastSample.current;
      let vx = 0;
      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((e.clientX - last.x) / dt) * 1000;
        const vy = ((e.clientY - last.y) / dt) * 1000;
        const speed = Math.hypot(vx, vy);
        const norm = Math.min(1, speed / 1500);
        tiltTarget.set((vx === 0 ? 0 : vx > 0 ? 1 : -1) * norm * TILT_STRENGTH);
      }
      lastSample.current = { x: e.clientX, y: e.clientY, t: now };
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setHovering(true);
    };
    const onDown = () => animate(scale, PRESS_SCALE, { duration: 0.12 });
    const onUp = () => animate(scale, 1, { duration: 0.15 });
    const onLeaveDoc = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setHovering(false);
        lastSample.current = null;
        tiltTarget.set(0);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseout", onLeaveDoc);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseout", onLeaveDoc);
      document.documentElement.classList.remove("has-custom-cursor");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arrow = useMemo(() => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none"
         xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible" }}>
      <path d="M5 3 L23 14 L14 16 L11 24 Z" fill={COLOR}
            stroke="rgba(0,0,0,0.18)" strokeWidth={0.6} strokeLinejoin="round" />
    </svg>
  ), []);

  if (!enabled) return null;
  return (
    <div aria-hidden="true"
         style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none",
                  opacity: hovering ? 1 : 0, transition: "opacity 0.2s" }}>
      <motion.div style={{ position: "absolute", top: 0, left: 0, x: labelTx, y: labelTy,
                           rotate: labelRotation, scale }}>
        <div style={{ background: COLOR, color: TEXT_COLOR, borderRadius: 999,
                      padding: `${Math.max(3, SIZE * 0.16)}px ${Math.max(7, SIZE * 0.38)}px`,
                      fontSize: Math.max(7, SIZE * 0.43), lineHeight: 1.1, fontWeight: 600,
                      fontFamily: "var(--font-manrope), system-ui, sans-serif",
                      whiteSpace: "nowrap", letterSpacing: 0.1,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}>
          {NAME}
        </div>
      </motion.div>
      <motion.div style={{ position: "absolute", top: 0, left: 0, x: arrowX, y: arrowY, scale,
                           width: SIZE, height: SIZE }}>
        {arrow}
      </motion.div>
    </div>
  );
}
