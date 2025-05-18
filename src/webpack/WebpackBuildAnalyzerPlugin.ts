import { Compiler, WebpackPluginInstance } from 'webpack';
import AssetsResultAnalyzerPlugin from './assets-result-analyzer/AssetsResultAnalyzerPlugin';
import AnalyzerTemplatesRun from './analyzer-templates-run/AnalyzerTemplatesRun';
import ResolveResultAnalyzerPlugin from './resolve-result-analyzer/ResolveResultAnalyzerPlugin';
import TestPlugin from './TestPlugin';
import ModulesSnapshotAnalyzerPlugin from './modules-snapshot-analyzer/ModulesSnapshotAnalyzerPlugin';

const PLUGIN_NAME = 'webpack-build-analyzer';
class WebpackBuildAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    // 测试
    new TestPlugin().apply(compiler);

    // 模块解析分析
    new ResolveResultAnalyzerPlugin().apply(compiler);

    new ModulesSnapshotAnalyzerPlugin().apply(compiler);

    // 分析编译结果assets
    new AssetsResultAnalyzerPlugin().apply(compiler);

    // 开启分析网页的服务器
    // new AnalyzerTemplatesRun().apply(compiler);
  }
}

export default WebpackBuildAnalyzerPlugin;
