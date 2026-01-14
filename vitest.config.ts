/// <reference types="vitest" />
import { loadEnvConfig } from '@next/env';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

loadEnvConfig(process.cwd());

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
  },
});
