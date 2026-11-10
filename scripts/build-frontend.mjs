// Replaces bower + compass: copies the npm runtime libraries to app/vendor and compiles the SCSS.
import { cpSync, rmSync, writeFileSync } from "node:fs";
import * as sass from "sass";

const vendored = [
  "angular/angular.js",
  "angular-animate/angular-animate.js",
  "angular-cookies/angular-cookies.js",
  "angular-resource/angular-resource.js",
  "angular-route/angular-route.js",
  "angular-sanitize/angular-sanitize.js",
  "angular-touch/angular-touch.js",
  // locales are loaded at runtime by angular-dynamic-locale
  "angular-i18n",
  "angular-translate/dist/angular-translate.js",
  "angular-translate-loader-static-files/angular-translate-loader-static-files.js",
  "angular-translate-storage-cookie/angular-translate-storage-cookie.js",
  "angular-translate-storage-local/angular-translate-storage-local.js",
  "angular-translate-handler-log/angular-translate-handler-log.js",
  "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
  "angular-gravatar/build/angular-gravatar.js",
  "angular-dynamic-locale/dist/tmhDynamicLocale.js",
  "jquery/dist/jquery.js",
  "jquery-ui/dist/jquery-ui.js",
  "bootstrap-sass/assets/javascripts/bootstrap.js",
  "bootstrap-sass/assets/fonts",
  "font-awesome/fonts",
  "github-fork-ribbon-css/gh-fork-ribbon.css",
];

rmSync("app/vendor", { recursive: true, force: true });
for (const path of vendored) {
  cpSync(`node_modules/${path}`, `app/vendor/${path}`, { recursive: true });
}

const { css } = sass.compile("app/styles/main.scss", {
  loadPaths: ["node_modules"],
  // bootstrap 3 and font-awesome 4 use @import and slash division
  silenceDeprecations: ["import", "global-builtin", "slash-div", "color-functions", "if-function"],
  quietDeps: true,
});
writeFileSync("app/styles/main.css", css);
console.log(`vendored ${vendored.length} paths into app/vendor, compiled app/styles/main.css`);
