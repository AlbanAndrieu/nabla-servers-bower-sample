import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: [
      "!**/.eslintrc.js",
      ".direnv/*",
      ".venv/*",
      ".bower/*",
      "__tests__/*",
      "test/*",
      "docs/*",
      "**/netsniff.js",
      "**/rasterize.js",
      "app/scripts/test/*",
      "report/*",
      "node_modules/*",
      "bower_components/*",
      "megalinter-reports/*",
      "target/*",
      "dist/*",
      "bin/*",
      "Gruntfile.js",
  ],
}, ...compat.extends("eslint:recommended"), {
  plugins: {
      "@typescript-eslint": typescriptEslint,
  },

  languageOptions: {
      globals: {
          ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
          ...globals.node,
          ...globals.commonjs,
          angular: true,
          _: "readonly",
      },

      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
          parser: "@typescript-eslint/parser",
      },
  },

  rules: {
      indent: ["error", 2],
      semi: ["error", "always"],
      quotes: ["error", "double"],
  },
}, {
  files: ["bin/*.js", "lib/*.js"],
  ignores: ["**/*.test.js"],

  rules: {
      indent: ["error", 2],

      quotes: ["error", "double", {
          avoidEscape: true,
      }],
  },
}];
