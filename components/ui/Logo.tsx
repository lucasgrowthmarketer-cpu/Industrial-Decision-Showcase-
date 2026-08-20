"use client";
// Monogramme ID, SVG fourni par Industrial Decision, fill pilote par CSS.
const D = "M0 2815 l0 -2815 2770 0 2770 0 0 2815 0 2815 -2770 0 -2770 0 0 -2815z m1718 75 l-2 -1920 -308 0 -308 0 -2 1920 -3 1920 312 0 312 0 -1 -1920z m1682 1897 c419 -63 696 -175 956 -388 258 -211 451 -555 528 -941 101 -503 39 -1081 -158 -1483 -271 -551 -769 -874 -1511 -981 -99 -15 -217 -18 -672 -21 l-553 -4 0 345 0 346 455 0 c469 0 575 6 754 41 507 101 802 392 913 902 20 90 22 131 22 347 0 217 -2 257 -22 348 -67 308 -211 535 -428 675 -184 119 -412 173 -776 184 l-188 6 0 -1152 0 -1151 -365 0 -365 0 0 1476 0 1475 653 -4 c527 -3 672 -7 757 -20z";

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * (563 / 554))} viewBox="0 0 554 563"
         fill="currentColor" aria-label="Industrial Decision" role="img">
      <g transform="translate(0,563) scale(0.1,-0.1)" stroke="none">
        <path d={D} />
      </g>
    </svg>
  );
}
