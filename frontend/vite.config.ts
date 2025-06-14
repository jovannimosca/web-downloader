import { defineConfig } from "vite";
import { configDefaults, coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  envDir: "../",
  envPrefix: ["VITE_", "FE_"],
  test: {
    ...configDefaults,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setupTests.ts"],
    coverage: {
      provider: "v8",
      exclude: [
        "html/**",
        "**/main.tsx",
        "src/mocks/**",
        ...coverageConfigDefaults.exclude,
      ],
      reportsDirectory: "./tests/coverage",
      thresholds: {
        lines: 80,
      },
    },
  },
});
