import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Navigation is deliberately a full page load, as it was on WordPress: Tag Manager,
      // StatCounter, Alli AI and the Trustindex widget all initialise once per document.
      "@next/next/no-html-link-for-pages": "off",
      // Images keep the exact src/srcset WordPress generated, so their URLs do not change.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".import-cache/**", "public/**", "src/styles/vendor/**"]),
]);

export default eslintConfig;
