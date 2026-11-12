// Replaces bower + compass: copies the npm runtime libraries to app/vendor and compiles the SCSS.
import { cpSync, rmSync, writeFileSync } from "node:fs";
import * as sass from "sass";

const vendored = [
  "bootstrap/dist/js/bootstrap.bundle.min.js",
  "font-awesome/fonts",
  "github-fork-ribbon-css/gh-fork-ribbon.css",
  "social-likes-next/dist",
];

rmSync("app/vendor", { recursive: true, force: true });
for (const path of vendored) {
  cpSync(`node_modules/${path}`, `app/vendor/${path}`, { recursive: true });
}

const { css } = sass.compile("app/styles/main.scss", {
  loadPaths: ["node_modules"],
  // bootstrap 5.3 and font-awesome 4 use @import, global functions and slash division
  silenceDeprecations: ["import", "global-builtin", "slash-div", "color-functions", "if-function"],
  quietDeps: true,
});
writeFileSync("app/styles/main.css", css);
console.log(`vendored ${vendored.length} paths into app/vendor, compiled app/styles/main.css`);
