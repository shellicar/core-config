import { defineConfig } from 'tsup';

export default defineConfig((config) => ({
  entry: ['src/**/*.ts'],
  splitting: true,
  sourcemap: false,
  treeshake: true,
  dts: false,
  clean: true,
  minify: false,
  keepNames: true,
  bundle: true,
  tsconfig: 'tsconfig.json',
  target: 'node20',
  format: ['cjs'],
  outDir: 'dist',
}));
