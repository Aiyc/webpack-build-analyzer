import { WebpackPluginInstance, Compiler } from 'webpack';

const PLUGIN_NAME = 'modules-snapshot-analyzer';
class ModulesSnapshotAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.optimizeDependencies.tap(PLUGIN_NAME, (modules) => {
        const { moduleGraph } = compilation;
        for (const module of modules) {
          // const isEntryModule = module.isEntryModule();
          const result = moduleGraph.getOutgoingConnections(module);
          for (const r of result) {
            console.log(r);
          }
        }

        console.log(modules, moduleGraph);
      });

      // TODO
      compilation.hooks.afterOptimizeModules.tap(PLUGIN_NAME, (modules) => {
        const { moduleGraph } = compilation;
        for (const module of modules) {
          const isEntryModule = module.isEntryModule();
          if (isEntryModule) {
            const result = moduleGraph.getOutgoingConnections(module);
            for (const r of result) {
              console.log(r);
            }
          }
        }

        console.log(modules, moduleGraph);
      });

      compilation.hooks.afterSeal.tap(PLUGIN_NAME, () => {
        const { moduleGraph, modules } = compilation;
        for (const module of modules) {
          const isEntryModule = module.isEntryModule();
          if (isEntryModule) {
            const result = moduleGraph.getOutgoingConnections(module);
            for (const r of result) {
              console.log(r);
            }
          }
        }
      });
    });
  }
}

export default ModulesSnapshotAnalyzerPlugin;
