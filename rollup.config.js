import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

const { default: pkg } = await import("./package.json", {
  with: { type: "json" },
});

export default defineConfig([
  {
    input: "src/index.ts",
    external: Object.keys(pkg.dependencies),
    output: [
      {
        dir: "dist",
        format: "esm",
        sourcemap: true,
        entryFileNames: "esm/[name].js",
        chunkFileNames: "esm/chunks/[name]-[hash].js",
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        entryFileNames: "cjs/[name].js",
        chunkFileNames: "cjs/chunks/[name]-[hash].js",
        exports: "named",
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      json(),
      nodeResolve(),
      commonjs(),
      esbuild({
        tsconfig: "./tsconfig.json",
        minify: true,
      }),
    ],
  },
  {
    input: "src/index.ts",
    external: Object.keys(pkg.dependencies),
    output: {
      dir: "dist/types",
      format: "es",
    },
    plugins: [dts()],
  },
]);
