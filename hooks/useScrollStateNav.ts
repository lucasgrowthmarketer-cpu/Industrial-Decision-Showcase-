"use client";
import { useEffect, useRef } from "react";
import { useStore, SceneState } from "@/store/useStore";
import xp from "@/config/experience.json";

const ORDER: SceneState[] = ["world", "product", "data", "website", "acquisition", "final"];

export function useScrollStateNav() {
  const lock = useRef(0);
  const touchY = useRef(0);
  useEffect(() => {
    const advance = (dir: 1 | -1) => {
      const { currentState, isTransitioning, setState, activeHotspot } = useStore.getState();
      if (currentState === "intro" || currentState === "product") return;
      if (isTransitioning || activeHotspot) return;
      const now = Date.now();
      if (now - lock.current < xp.scrollCooldown) return;
      const i = ORDER.indexOf(currentState);
      const next = ORDER[i + dir];
      if (!next) return;
      lock.current = now;
      setState(next);
    };
    const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaY) > xp.wheelThreshold) advance(e.deltaY > 0 ? 1 : -1); };
    const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > xp.swipeThreshold) advance(dy > 0 ? 1 : -1);
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
