const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const copy = ({ from, to }) => {
  return {
    name: 'copy',
    setup(build) {
      build.onEnd(() =>
        fs.cpSync(from, to, {
          recursive: true,
          force: true,
          dereference: true,
        }),
      );
    },
  };
};

const baseOptions = {
  entryPoints: ['src/index.ts'],
  sourcemap: true,
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  // TODO open包修复
  define: { 'import.meta.url': '_importMetaUrl' },
  banner: {
    js: "const _importMetaUrl=require('url').pathToFileURL(__filename)",
  },
};

// 构建 CommonJS 和 ESM 格式
esbuild
  .build({
    ...baseOptions,
    format: 'cjs',
    outExtension: { '.js': '.cjs' },
    plugins: [
      copy({
        from: path.resolve(__dirname, './templates'),
        to: path.resolve(__dirname, `./${baseOptions.outdir}/templates`),
      }),
    ],
  })
  .then((result) => {
    console.log('编译完成');
    // console.log(result);
  });
