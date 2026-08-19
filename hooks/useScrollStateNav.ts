"use client";
// Scroll/swipe = declencheur de transition d'etat (TDD section 11), pas de
// scrubbing. Un geste franc = un etat. Desactive en etat product : la molette
// y appartient au zoom OrbitControls, la sortie se fait par le menu.
import { useEffect, useRef } from "react";
import { useStore, SceneState } from "@/store/useStore";

const ORDER: SceneState[] = ["world", "product", "data", "website", "acquisition", "final"];
const COOLDOWN = 1600;

export function useScrollStateNav() {
  const lock = useRef(0);
  const touchY = useRef(0);
  useEffect(() => {
    const advance = (dir: 1 | -1) => {
      const { currentState, isTransitioning, setState, activeHotspot } = useStore.getState();
      if (currentState === "intro" || currentState === "product") return;
      if (isTransitioning || activeHotspot) return;
      const now = Date.now();
      if (now - lock.current < COOLDOWN) return;
      const i = ORDER.indexOf(currentState);
      const next = ORDER[i + dir];
      if (!next) return;
      lock.current = now;
      setState(next);
    };
    const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaY) > 24) advance(e.deltaY > 0 ? 1 : -1); };
    const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 60) advance(dy > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
}
