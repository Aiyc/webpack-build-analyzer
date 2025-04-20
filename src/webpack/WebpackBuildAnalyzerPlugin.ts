import { Compiler, WebpackPluginInstance } from 'webpack';
import AssetsResultAnalyzerPlugin from './assets-result-analyzer/AssetsResultAnalyzerPlugin';
import AnalyzerTemplatesRun from './analyzer-templates-run/AnalyzerTemplatesRun';

const PLUGIN_NAME = 'webpack-build-analyzer';
class WebpackBuildAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    // 分析编译结果assets
    new AssetsResultAnalyzerPlugin().apply(compiler);

    // 开启分析网页的服务器
    new AnalyzerTemplatesRun().apply(compiler);
  }
}

export default WebpackBuildAnalyzerPlugin;
