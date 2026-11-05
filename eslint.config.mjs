import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Routes and components reach content only through the server-only facade
    // ("@/content") or type-only exports ("@/content/types"). The loader,
    // policy internals and the banned-term list are off limits, as is direct
    // filesystem access.
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "fs", message: "Read content through @/content, not the filesystem." },
            { name: "node:fs", message: "Read content through @/content, not the filesystem." },
          ],
          patterns: [
            {
              regex: "^@/content/(?!types$).+",
              message: 'Import content via "@/content" (server-only facade) or types via "@/content/types".',
            },
          ],
        },
      ],
    },
  },
  {
    // Unused-variable convention: a leading underscore marks an intentional discard.
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local platform and generated output
    ".netlify/**",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
