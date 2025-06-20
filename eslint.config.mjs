import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Add a rules object to override or disable specific rules
    rules: {
      "@next/next/no-img-element": "off",          // disables warning for <img>
      "react/no-unescaped-entities": "off",        // disables warning for unescaped '
      '@typescript-eslint/no-require-imports': 0,
    }
  },
];

export default eslintConfig;
