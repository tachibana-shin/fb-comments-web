import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./main.ts"],
  dts: true,
  format: ["esm", "cjs"],
  target: "es2017",
});
