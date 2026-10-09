import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".kilo/**",
    "packages/*/node_modules/**",
    "packages/*/dist/**",
    // Standalone package with its own tsconfig and react-native peers.
    "packages/runeicons-react-native/**",
  ]),
]);

export default eslintConfig;
