import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import fsdPlugin from "eslint-plugin-fsd-lint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/shared/api/generated/**",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      fsd: fsdPlugin,
    },
    rules: {
      "fsd/forbidden-imports": [
        "error",
        {
          alias: "@",
          rootPath: "src",
        },
      ],
      "fsd/no-relative-imports": [
        "error",
        {
          allowSameSlice: true,
          allowTypeImports: true,
          ignoreImportPatterns: [
            "^\\.\\./model/",
            "^\\.\\./lib/",
            "^\\./",
          ],
        },
      ],
      "fsd/no-public-api-sidestep": [
        "warn",
        {
          publicApi: {
            allowSegmentImports: true,
            enforceShared: false,
          },
          ignoreImportPatterns: [
            "^@/shared/",
            "^@/components/",
            "^@/entities$",
            "^@/features$",
            "^@/widgets$",
            "^@/screens$",
            "^@/app$",
          ],
        },
      ],
      "fsd/no-cross-slice-dependency": [
        "error",
        {
          rootPath: "src",
          allowTypeImports: true,
          excludeLayers: ["shared"],
        },
      ],
      "fsd/no-ui-in-business-logic": [
        "warn",
        {
          rootPath: "src",
          allowTypeImports: true,
        },
      ],
      "fsd/no-global-store-imports": "off",
      "fsd/ordered-imports": "off",
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "fsd/no-relative-imports": "off",
      "fsd/no-public-api-sidestep": "off",
      "fsd/no-cross-slice-dependency": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
