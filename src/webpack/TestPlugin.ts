import { Compiler, WebpackPluginInstance, Resolver } from 'webpack';

const PLUGIN_NAME = 'TestPlugin';
class TestPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      // 遍历
      stats.compilation.modules.forEach((module) => {
        // @ts-ignore resourceResolveData字段在ts类型中未暴露
        // console.log(module.identifier(), module.resourceResolveData);
      });
    });

    // compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
    //   compilation.hooks.statsFactory.tap(PLUGIN_NAME, (stats, options) => {
    //
    //   });
    // });
  }
}

export default TestPlugin;
