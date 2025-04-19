import { Compiler, WebpackPluginInstance } from 'webpack';
import AssetsResultAnalyzerPlugin from './assets-result-analyzer/AssetsResultAnalyzerPlugin';

class WebpackBuildAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    // 分析编译结果assets
    new AssetsResultAnalyzerPlugin().apply(compiler);
  }
}

export default WebpackBuildAnalyzerPlugin;
