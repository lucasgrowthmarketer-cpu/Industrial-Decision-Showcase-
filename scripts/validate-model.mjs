#!/usr/bin/env node
// Validation des conventions du GLB machine (TDD section 9).
// Node pur, zero dependance. Echec du process si une convention est violee.
import { readFileSync } from "node:fs";

const path = process.argv[2] ?? "public/models/cnc_vmc.glb";
const buf = readFileSync(path);
if (buf.readUInt32LE(0) !== 0x46546c67) fail("Pas un GLB");
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString());
const names = new Set((gltf.nodes ?? []).map((n) => n.name));

const REQUIRED = [
  "grp_body", "grp_door", "grp_spindle", "grp_spindle_rotor",
  "grp_table", "workpiece_block", "grp_toolmagazine", "grp_magazine_rotor",
  "grp_controlpanel", "grp_electrical",
  "anchor_spindle", "anchor_toolmagazine", "anchor_controlpanel",
  "anchor_table", "anchor_electrical",
];
const EXTRAS = { grp_door: "slideOpen", grp_table: "travel", grp_toolmagazine: "rotationAxis" };

let errors = 0;
for (const r of REQUIRED) if (!names.has(r)) err(`Noeud manquant: ${r}`);
for (const [node, key] of Object.entries(EXTRAS)) {
  const n = gltf.nodes.find((x) => x.name === node);
  if (n && !(n.extras && key in n.extras)) err(`extras.${key} manquant sur ${node}`);
}
const tris = totalTris(gltf);
if (tris < 5000 || tris > 160000) err(`Triangles hors budget: ${tris}`);
const mats = (gltf.materials ?? []).map((m) => m.name);
for (const m of ["mat_frame", "mat_steel", "mat_glass", "mat_accent"])
  if (!mats.includes(m)) err(`Materiau manquant: ${m}`);

console.log(errors ? `ECHEC: ${errors} violation(s)` :
  `OK · ${gltf.nodes.length} noeuds · ${tris} triangles · ${mats.length} materiaux · ${(buf.length / 1024).toFixed(0)} Ko`);
process.exit(errors ? 1 : 0);

function totalTris(g) {
  let t = 0;
  for (const m of g.meshes ?? [])
    for (const p of m.primitives ?? []) {
      const n = p.indices !== undefined
        ? g.accessors[p.indices].count
        : g.accessors[p.attributes.POSITION].count;
      if ((p.mode ?? 4) === 4) t += Math.floor(n / 3);
    }
  return t;
}
function err(m) { console.error("VIOLATION:", m); errors++; }
function fail(m) { console.error(m); process.exit(1); }
