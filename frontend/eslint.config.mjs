import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
  ignores: ["**/.next/**", "**/node_modules/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
