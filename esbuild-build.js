const esbuild = require('esbuild');

const baseOptions = {
  entryPoints: ['src/index.ts'],
  sourcemap: true,
  bundle: true,
  platform: 'node',
  outdir: 'dist',
};

// 构建 CommonJS 和 ESM 格式
esbuild.build({
  ...baseOptions,
  format: 'cjs',
  outExtension: { '.js': '.cjs' },
});

esbuild.build({
  ...baseOptions,
  format: 'esm',
  outExtension: { '.js': '.mjs' },
});
