"use client";
// Cadres 3D des trois panneaux : le panneau existe dans l'espace (TDD Phase 3),
// son contenu est du HTML en overlay (robuste, net, mobile-friendly).
import { Edges } from "@react-three/drei";

const FRAMES: { pos: [number, number, number]; rotY: number }[] = [
  { pos: [-3.6, 1.55, 1.1], rotY: -0.76 },
  { pos: [3.6, 1.55, 1.1], rotY: 0.74 },
  { pos: [0, 1.7, -3.9], rotY: Math.PI },
];

export function PanelFrames() {
  return (
    <>
      {FRAMES.map((f, i) => (
        <group key={i} position={f.pos} rotation={[0, f.rotY, 0]}>
          <mesh>
            <planeGeometry args={[3.4, 2.0]} />
            <meshStandardMaterial color="#0d1524" metalness={0.2} roughness={0.5} />
            <Edges color="#207bff" lineWidth={1} />
          </mesh>
          <mesh position={[0, -1.08, 0.02]}>
            <boxGeometry args={[3.5, 0.06, 0.1]} />
            <meshStandardMaterial color="#16233d" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </>
  );
}
