const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const source = path.join(__dirname, "data", "phases.json");
const target = path.join(root, "assets", "map-data", "phases.json");
const sourceFlags = path.join(__dirname, "public", "assets", "flags");
const targetFlags = path.join(root, "assets", "kingdom-map", "flags");

const store = JSON.parse(fs.readFileSync(source, "utf8"));
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.mkdirSync(targetFlags, { recursive: true });

for (const phase of (store.phases || [])) {
  const name = path.basename(String(phase.flag_image || ""));
  phase.flag_image = name ? `../../assets/kingdom-map/flags/${name}` : "../../assets/kingdom-map/flags/flag-default.svg";
  if (!Number.isFinite(Number(phase.width_px))) phase.width_px = 210;
  if (!Number.isFinite(Number(phase.height_px))) phase.height_px = 118;
}

fs.writeFileSync(target, JSON.stringify(store, null, 2), "utf8");
for (const name of fs.readdirSync(sourceFlags)) {
  const from = path.join(sourceFlags, name);
  const to = path.join(targetFlags, name);
  if (fs.statSync(from).isFile()) fs.copyFileSync(from, to);
}
console.log("Mapa sincronizado para assets/map-data/phases.json");
