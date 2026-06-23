import fs from "fs";
import path from "path";

// Cloudflare Pages needs _worker.js inside pages_build_output_dir
// opennextjs-cloudflare puts worker.js in .open-next/ root
// This script copies it to .open-next/assets/_worker.js

const src = path.resolve(".open-next/worker.js");
const dest = path.resolve(".open-next/assets/_worker.js");

fs.copyFileSync(src, dest);
console.log("✓ Copied worker.js → assets/_worker.js");

// Also copy all cloudflare helper files needed by worker.js imports
const dirs = ["cloudflare", "cloudflare-templates", "middleware", "server-functions", ".build"];
for (const dir of dirs) {
  const srcDir = path.resolve(`.open-next/${dir}`);
  const destDir = path.resolve(`.open-next/assets/${dir}`);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`✓ Copied ${dir}/`);
  }
}
