// Analytics GA4 tranche 1 (TDD section 18). No-op total sans NEXT_PUBLIC_GA_ID :
// aucun script charge, aucune erreur console.
type Params = Record<string, string | number | boolean>;

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

export function track(event: string, params?: Params) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params ?? {});
}
