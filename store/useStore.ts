import { create } from "zustand";

export type SceneState =
  | "intro" | "world" | "product" | "data" | "website" | "acquisition" | "final";

export type MachineMode = "idle" | "running" | "exploded";

interface Store {
  // scene
  currentState: SceneState;
  isTransitioning: boolean;
  setState: (s: SceneState) => void;
  setTransitioning: (v: boolean) => void;
  // machine
  activeHotspot: string | null;
  machineMode: MachineMode;
  setHotspot: (id: string | null) => void;
  setMachineMode: (m: MachineMode) => void;
  // device
  webglAvailable: boolean;
  isMobile: boolean;
  setDevice: (d: { webglAvailable: boolean; isMobile: boolean }) => void;
  // ui
  introSkipped: boolean;
  skipIntro: () => void;
}

export const useStore = create<Store>((set) => ({
  currentState: "intro",
  isTransitioning: false,
  setState: (s) => set({ currentState: s, activeHotspot: null }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  activeHotspot: null,
  machineMode: "idle",
  setHotspot: (id) => set({ activeHotspot: id }),
  setMachineMode: (m) => set({ machineMode: m }),
  webglAvailable: true,
  isMobile: false,
  setDevice: (d) => set(d),
  introSkipped: false,
  skipIntro: () => set({ introSkipped: true, currentState: "world" }),
}));
