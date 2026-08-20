"use client";
// Intro typographique francaise, skippable.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useStore } from "@/store/useStore";
import { track } from "@/lib/analytics";

const LINES = ["L'INDUSTRIE EST COMPLEXE.", "LE DIGITAL NE DEVRAIT PAS L'ÊTRE.", "INDUSTRIAL DECISION"];

export function IntroSequence() {
  const currentState = useStore((s) => s.currentState);
  const skipIntro = useStore((s) => s.skipIntro);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentState !== "intro" || !ref.current) return;
    const lines = ref.current.querySelectorAll(".intro-line");
    const tl = gsap.timeline({ onComplete: skipIntro });
    lines.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, i * 1.5)
        .to(el, { opacity: 0, duration: 0.5 }, i * 1.5 + (i === LINES.length - 1 ? 1.8 : 1.1));
    });
    return () => { tl.kill(); };
  }, [currentState, skipIntro]);

  if (currentState !== "intro") return null;
  return (
    <div className="intro-overlay" ref={ref}>
      {LINES.map((l) => (
        <div key={l} className={"intro-line" + (l === "INDUSTRIAL DECISION" ? " intro-brand" : "")}>{l}</div>
      ))}
      <button className="intro-skip" onClick={() => { track("intro_skipped"); skipIntro(); }}>PASSER</button>
    </div>
  );
}
