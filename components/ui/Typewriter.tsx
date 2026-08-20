"use client";
// Typewriter, adapte du composant Originkit fourni par Industrial Decision :
// machine a etats setTimeout conservee, partie Framer retiree, props simplifiees.
import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  texts: string[];
  prefix?: string;
  typeMs?: number;
  holdMs?: number;
  deleteMs?: number;
  loop?: boolean;
  color?: string;
  typedColor?: string;
  cursorColor?: string;
  cursorChar?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function Typewriter({
  texts, prefix = "", typeMs = 55, holdMs = 1400, deleteMs = 28, loop = true,
  color = "#e8ecf2", typedColor = "#207bff", cursorColor, cursorChar = "_",
  className, style,
}: Props) {
  const list = (texts ?? []).filter((t): t is string => typeof t === "string");
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!list.length) return;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const currentText = list[textIndex] ?? "";
    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setTextIndex((p) => (p + 1) % list.length);
        setCurrentIndex(0);
      } else {
        timeout = setTimeout(() => setDisplayText((p) => p.slice(0, -1)), deleteMs);
      }
    } else {
      if (currentIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText((p) => p + currentText[currentIndex]);
          setCurrentIndex((p) => p + 1);
        }, typeMs);
      } else if (list.length > 1 && (loop || textIndex < list.length - 1)) {
        timeout = setTimeout(() => setIsDeleting(true), holdMs);
      }
    }
    return () => { if (timeout) clearTimeout(timeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, displayText, isDeleting, textIndex, typeMs, holdMs, deleteMs, loop]);

  const textsKey = list.join("");
  useEffect(() => {
    setDisplayText(""); setCurrentIndex(0); setIsDeleting(false); setTextIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textsKey]);

  return (
    <span className={className} style={{ whiteSpace: "pre-wrap", color, ...style }}>
      {prefix ? <span>{prefix}</span> : null}
      <span style={{ color: typedColor }}>{displayText}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.01, repeat: Infinity, repeatDelay: 0.4, repeatType: "reverse" } }}
        style={{ color: cursorColor ?? typedColor, marginLeft: "0.25rem" }}>
        {cursorChar}
      </motion.span>
    </span>
  );
}
