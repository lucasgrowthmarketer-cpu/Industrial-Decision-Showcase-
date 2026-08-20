"use client";
// Neon Glow Button, base Originkit fournie par Industrial Decision,
// unifiee en un seul composant parametrable (un preset par label via props).
import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAnimate, useReducedMotion, type AnimationPlaybackControls, type Transition } from "framer-motion";

const radiusFromPercent = (w: number, h: number, pct: number) =>
  (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const DEFAULT_TRANSITION: Transition = { type: "tween", ease: "easeInOut", duration: 2 };

type RGBA = { r: number; g: number; b: number; a: number };
function parseColor(input: string | undefined, fallback: RGBA): RGBA {
  if (!input) return fallback;
  const c = String(input).trim();
  if (c[0] === "#") {
    let h = c.slice(1);
    if (h.length === 3) h = h.split("").map((ch) => ch + ch).join("");
    if (h.length !== 6) return fallback;
    const n = parseInt(h, 16);
    if (Number.isNaN(n)) return fallback;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  return fallback;
}
const css = (c: RGBA, a = c.a) => `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${a})`;
function shade(c: RGBA, t: number): RGBA {
  const target = t >= 0 ? 255 : 0, k = Math.abs(t);
  return { r: c.r + (target - c.r) * k, g: c.g + (target - c.g) * k, b: c.b + (target - c.b) * k, a: c.a };
}

type Ring = { inset: number; blur: number; cover: number; base: number; hover: number; gradient: string };
const OUTSIDE_MASK: React.CSSProperties = {
  maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  maskClip: "border-box, content-box",
  maskComposite: "exclude",
  WebkitMaskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  WebkitMaskClip: "border-box, content-box",
  WebkitMaskComposite: "xor",
} as React.CSSProperties;

export type NeonGlowButtonProps = {
  label: string;
  onClick?: () => void;
  href?: string;
  newTab?: boolean;
  active?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  glowColor?: string;
  fill?: string;
  textColor?: string;
  style?: React.CSSProperties;
};

const SIZES = {
  sm: { padding: "9px 16px", fontSize: 10.5, borderWidth: 1, glowSize: 4, glowBlur: 5 },
  md: { padding: "12px 22px", fontSize: 11.5, borderWidth: 1.5, glowSize: 5, glowBlur: 5 },
  lg: { padding: "16px 34px", fontSize: 13, borderWidth: 2, glowSize: 6, glowBlur: 6 },
};

export function NeonGlowButton({
  label, onClick, href, newTab, active = false, disabled = false,
  size = "md", glowColor = "#001FFF", fill = "#000000", textColor = "#FFFFFF", style,
}: NeonGlowButtonProps) {
  const S = SIZES[size];
  const [scope, animate] = useAnimate();
  const [box, setBox] = useState({ w: 0, h: 0 });
  useIsoLayoutEffect(() => {
    const el = scope.current as HTMLElement | null;
    if (!el) return;
    const read = () => setBox((p) => (p.w === el.offsetWidth && p.h === el.offsetHeight ? p : { w: el.offsetWidth, h: el.offsetHeight }));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);
  const radiusPx = radiusFromPercent(box.w, box.h, 100);
  const longest = Math.max(box.w, box.h, 1);

  const ringRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const runningRef = useRef<AnimationPlaybackControls[]>([]);
  const hovered = useRef(false);
  const reducedMotion = useReducedMotion();

  const g1 = parseColor(glowColor, { r: 0, g: 31, b: 255, a: 1 });
  const g2 = shade(g1, 0.35);
  const spread = S.glowSize, blurUnit = S.glowBlur;

  const rings: Ring[] = useMemo(() => {
    const f1 = css(g1, 0), f2 = css(g2, 0), F1 = css(g1, 1), F2 = css(g2, 1);
    const mid: Ring = { inset: Math.round(spread * 0.72), blur: blurUnit, cover: 1.9, base: 82, hover: -98,
      gradient: `conic-gradient(${f1}, ${css(g1, 0.75)}, ${f1} 10%, ${f2} 50%, ${css(g2, 0.75)}, ${f2} 60%)` };
    return [
      { inset: spread, blur: blurUnit, cover: 3.2, base: 60, hover: -120,
        gradient: `conic-gradient(${f1}, ${F1} 5%, ${f1} 38%, ${f2} 50%, ${F2} 60%, ${f2} 87%)` },
      mid, mid, mid,
      { inset: Math.round(spread * 0.43), blur: Math.max(0, blurUnit - 1), cover: 1.9, base: 83, hover: -97,
        gradient: `conic-gradient(${f1} 0%, ${F1}, ${f1} 8%, ${f2} 50%, ${F2}, ${f2} 58%)` },
      { inset: Math.round(spread * 0.21), blur: Math.max(0, Math.round(blurUnit * 0.17)), cover: 1.9, base: 70, hover: -110,
        gradient: `conic-gradient(${f1}, ${F1} 5%, ${f1} 14%, ${f2} 50%, ${F2} 60%, ${f2} 64%)` },
    ];
  }, [g1, g2, spread, blurUnit]);

  const syncRings = useCallback((instant: boolean) => {
    runningRef.current.forEach((c) => c.stop());
    runningRef.current = [];
    const t: Transition = instant || reducedMotion ? { duration: 0 } : DEFAULT_TRANSITION;
    rings.forEach((ring, i) => {
      const el = ringRefs.current[i];
      if (!el) return;
      const angle = hovered.current || active ? ring.hover : ring.base;
      runningRef.current.push(animate(el, { rotate: angle } as never, t as never));
    });
  }, [animate, rings, reducedMotion, active]);

  useEffect(() => { syncRings(true); }, [syncRings]);
  useEffect(() => () => runningRef.current.forEach((c) => c.stop()), []);

  const scaleTo = (s: number) => { if (scope.current) animate(scope.current, { scale: s }, { duration: 0.12 }); };
  const dim = disabled ? 0.4 : active ? 1 : 0.82;

  return (
    <div ref={scope} style={{ position: "relative", display: "inline-flex", boxSizing: "border-box",
      opacity: dim, pointerEvents: disabled ? "none" : "auto", transition: "opacity 0.3s", ...style }}>
      <div aria-hidden style={{ position: "absolute", top: -spread, right: -spread, bottom: -spread, left: -spread,
        boxSizing: "border-box", padding: spread, borderRadius: radiusPx + spread, pointerEvents: "none", zIndex: 0, ...OUTSIDE_MASK }}>
        {rings.map((ring, i) => {
          const cover = Math.ceil(longest * ring.cover);
          const off = spread - ring.inset;
          return (
            <span key={i} style={{ position: "absolute", top: off, right: off, bottom: off, left: off,
              borderRadius: radiusPx + ring.inset, overflow: "hidden", filter: `blur(${ring.blur}px)`, pointerEvents: "none" }}>
              <span ref={(el) => { ringRefs.current[i] = el; }}
                style={{ position: "absolute", top: "50%", left: "50%", display: "block", width: cover, height: cover,
                  marginTop: -cover / 2, marginLeft: -cover / 2, background: ring.gradient }} />
            </span>
          );
        })}
      </div>
      {(() => {
        const shared = {
          onClick,
          onPointerEnter: () => { hovered.current = true; syncRings(false); },
          onPointerLeave: () => { hovered.current = false; syncRings(false); scaleTo(1); },
          onPointerDown: () => scaleTo(0.97),
          onPointerUp: () => scaleTo(1),
          style: {
            position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: S.padding, borderStyle: "solid", borderColor: glowColor, borderWidth: S.borderWidth,
            outline: "none", borderRadius: radiusPx, backgroundColor: fill, cursor: disabled ? "default" : "pointer",
            textDecoration: "none", whiteSpace: "nowrap", userSelect: "none", boxSizing: "border-box",
            WebkitTapHighlightColor: "transparent",
            fontFamily: "var(--font-manrope), sans-serif", fontWeight: 600,
            fontSize: S.fontSize, letterSpacing: "0.18em", color: textColor,
          } as React.CSSProperties,
        };
        return href ? (
          <a href={href} target={newTab ? "_blank" : undefined}
             rel={newTab ? "noopener noreferrer" : undefined} {...shared}>{label}</a>
        ) : (
          <button type="button" {...shared}>{label}</button>
        );
      })()}
    </div>
  );
}
