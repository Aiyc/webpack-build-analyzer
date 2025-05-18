const path = require('node:path');

const webpack = require('webpack');
const { WebpackBuildAnalyzerPlugin, ResolvePlugin } = require('../../dist/index.cjs');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
    // index1: {
    //   import: path.resolve(__dirname, './src/index1.js'),
    //   dependOn: ['index']
    // }
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  mode: 'production',
  resolve: {
    alias: {
      '@depC': path.resolve(__dirname, './src/depC.js'),
    },
    plugins: [new ResolvePlugin()],
  },
  externals: {
    vue: 'Vue',
  },
  plugins: [
    new WebpackBuildAnalyzerPlugin(),
    // new BundleAnalyzerPlugin()
  ],
};

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  // console.log(stats.toString({ colors: true })); // 输出编译信息
});
