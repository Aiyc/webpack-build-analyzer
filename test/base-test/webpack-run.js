const path = require('node:path');

const webpack = require('webpack');
const { WebpackBuildAnalyzerPlugin } = require('../../dist/index.cjs');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  mode: 'development',
  resolve: {
    alias: {
      '@depC': path.resolve(__dirname, './src/depC.js'),
    },
    // plugins: [new ResolvePlugin()]
  },
  externals: {
    vue: 'Vue',
  },
  plugins: [new WebpackBuildAnalyzerPlugin()],
};

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stats.toString({ colors: true })); // 输出编译信息
});
