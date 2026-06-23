import fs from "fs";
import path from "path";

// Copy worker.js → _worker.js inside assets dir
const src = path.resolve(".open-next/worker.js");
const dest = path.resolve(".open-next/assets/_worker.js");
fs.copyFileSync(src, dest);
console.log("✓ Copied worker.js → assets/_worker.js");

// Copy all runtime dirs needed by worker imports
const dirs = ["cloudflare", "cloudflare-templates", "middleware", "server-functions", ".build"];
for (const dir of dirs) {
  const srcDir = path.resolve(`.open-next/${dir}`);
  const destDir = path.resolve(`.open-next/assets/${dir}`);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`✓ Copied ${dir}/`);
  }
}

// _routes.json: worker handles all dynamic routes,
// CF Pages serves static assets directly (no worker overhead)
const routes = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/_next/static/*",
    "/favicon.ico",
    "/robots.txt",
  ],
};
fs.writeFileSync(
  path.resolve(".open-next/assets/_routes.json"),
  JSON.stringify(routes, null, 2)
);
console.log("✓ Written _routes.json");
