"use client";
// Remplace les plaques 3D : chaque station (data, site, acquisition) est
// marquee par un halo de lumiere au sol. La scene reste pure, le contenu
// vit en verre au-dessus.
const STATIONS: [number, number, number][] = [
  [-3.6, 0.012, 1.1],
  [3.6, 0.012, 1.1],
  [0, 0.012, -3.9],
];

export function StationHalos() {
  return (
    <>
      {STATIONS.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.15, 1.22, 64]} />
            <meshBasicMaterial color="#207bff" transparent opacity={0.35} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.15, 64]} />
            <meshBasicMaterial color="#0f2a5e" transparent opacity={0.18} />
          </mesh>
          <pointLight position={[0, 1.4, 0]} intensity={2.2} distance={4.5} color="#2b6fff" />
        </group>
      ))}
    </>
  );
}
