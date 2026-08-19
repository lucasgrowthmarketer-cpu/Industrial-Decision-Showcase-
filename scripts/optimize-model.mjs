#!/usr/bin/env node
// Passe Draco finale (a executer dans le Codespace, npm requis).
// Le GLB versionne est deja fusionne et quantize par le pipeline amont.
import { execSync } from "node:child_process";
const src = "public/models/cnc_vmc.glb";
const out = "public/models/cnc_vmc.draco.glb";
execSync(`npx @gltf-transform/cli optimize ${src} ${out} --compress draco --texture-compress false`, { stdio: "inherit" });
execSync(`node scripts/validate-model.mjs ${out}`, { stdio: "inherit" });
