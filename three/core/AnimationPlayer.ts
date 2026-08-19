// AnimationPlayer : anime la machine en lisant les userData du GLB
// (pivot, slideOpen, travel, rotationAxis poses par le pipeline asset).
// Aucun clip Blender : durees et easings restent parametrables ici.
import * as THREE from "three";
import gsap from "gsap";

const find = (root: THREE.Object3D, name: string) => {
  const o = root.getObjectByName(name);
  if (!o) throw new Error(`Noeud ${name} introuvable dans le GLB`);
  return o;
};

export function doorOpen(root: THREE.Object3D, open = true) {
  const door = find(root, "grp_door");
  const dist = (door.userData.slideOpen?.distance ?? 0.85) as number;
  const base = (door.userData.__baseX ??= door.position.x) as number;
  return gsap.to(door.position, {
    x: open ? base + dist : base,
    duration: 1.2, ease: "power2.inOut",
  });
}

export function spindleRun(root: THREE.Object3D, on = true) {
  const rotor = find(root, "grp_spindle_rotor");
  gsap.killTweensOf(rotor.rotation);
  if (!on) return gsap.to(rotor.rotation, { z: 0, duration: 1.0, ease: "power2.out" });
  return gsap.to(rotor.rotation, {
    z: "+=" + Math.PI * 2, duration: 0.4, ease: "none", repeat: -1,
  });
}

export function magazineIndex(root: THREE.Object3D, steps = 1) {
  const rotor = find(root, "grp_magazine_rotor");
  return gsap.to(rotor.rotation, {
    z: "+=" + (Math.PI * 2 / 12) * steps, duration: 0.6, ease: "power3.inOut",
  });
}

export function tableTravel(root: THREE.Object3D, offset: number) {
  const table = find(root, "grp_table");
  const range = (table.userData.travel?.range ?? 0.45) as number;
  const base = (table.userData.__baseX ??= table.position.x) as number;
  return gsap.to(table.position, {
    x: base + THREE.MathUtils.clamp(offset, -range, range),
    duration: 1.4, ease: "power2.inOut",
  });
}

// Cycle de demonstration complet : porte, table, broche, magasin, retour.
export function cycleDemo(root: THREE.Object3D): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.add(doorOpen(root, true));
  tl.add(tableTravel(root, 0.3), "-=0.3");
  tl.add(spindleRun(root, true) as gsap.core.Tween, "-=0.2");
  tl.add(magazineIndex(root, 3), "+=0.8");
  tl.add(() => { spindleRun(root, false); }, "+=1.2");
  tl.add(tableTravel(root, 0), "+=0.4");
  tl.add(doorOpen(root, false), "-=0.5");
  return tl;
}

// Vue eclatee : applique les explodedOffset des userData (repere machine Z-up
// converti par la racine : offsets stockes en (x,y,z) machine, appliques tels quels
// sur les positions locales des groupes, la racine gere la conversion).
export function explodedView(root: THREE.Object3D, on: boolean) {
  const tl = gsap.timeline({ defaults: { duration: 1.4, ease: "power3.inOut" } });
  root.traverse((o) => {
    const off = o.userData.explodedOffset as { x: number; y: number; z: number } | undefined;
    if (!off || !o.name.startsWith("grp_")) return;
    const base = (o.userData.__basePos ??= o.position.clone()) as THREE.Vector3;
    tl.to(o.position, {
      x: base.x + (on ? off.x : 0),
      y: base.y + (on ? off.y : 0),
      z: base.z + (on ? off.z : 0),
    }, 0);
  });
  return tl;
}
