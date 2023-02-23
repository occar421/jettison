import ts from "rollup-plugin-ts";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    ts(),
    replace({
      preventAssignment: true,
      values: {
        "import.meta.vitest": "undefined",
      },
    }),
  ],
};
