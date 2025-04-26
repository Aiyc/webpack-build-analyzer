import {
  Compiler,
  WebpackPluginInstance,
  StatsCompilation,
  StatsChunk,
  Compilation,
  Chunk,
} from 'webpack';
import { sendMessage } from '../../socket';
import { shareData } from '../../share-data';

const nodeColor: Record<moduleType, string> = {
  'javascript/esm': 'red',
  'javascript/auto': 'red',
  'runtime': 'green',
  'javascript/dynamic': 'yellow',
  '': 'red',
};

const convertStatsJson = (statsJson: StatsCompilation, compilation: Compilation): AssetsResult => {
  const chunkMap = new Map<string | number, Chunk>();
  compilation.chunks.forEach((chunk) => {
    if (chunk.id !== null) {
      chunkMap.set(chunk.id, chunk);
    }
  });

  return {
    chunks: (statsJson.chunks ?? []).map((statsChunk: StatsChunk): AssetsChunk => {
      const chunk = chunkMap.get(statsChunk.id!);
      let entryId: string | null = null;
      if (chunk && chunk.entryModule) {
        entryId = chunk.entryModule.identifier();
      }
      return {
        modules: (statsChunk.modules ?? [])
          .filter((module) => {
            // 去掉webpack runtime
            return module.moduleType !== 'runtime';
          })
          .map((statsModule) => {
            const __ANALYZER_EXTRA_DATA__ = shareData.moduleMap.get(statsModule.identifier!) || {
              externalFlag: true,
              originalModuleName: statsModule.identifier,
            };
            return {
              moduleName: statsModule.name!,
              moduleId: statsModule.identifier!,
              moduleType: statsModule.moduleType! as moduleType,
              moduleSize: statsModule.size!,
              parentModuleIds: (statsModule.issuerPath ?? []).map((issuer) => issuer.identifier),
              belongToChunks: statsModule.chunks!,
              extraMeta: {
                originalModuleName: __ANALYZER_EXTRA_DATA__.originalModuleName,
                thirdPartyLibFlag: __ANALYZER_EXTRA_DATA__.thirdPartyLibFlag,
                externalFlag: __ANALYZER_EXTRA_DATA__.externalFlag,
                entryFlag: entryId === statsModule.identifier!,
              },
            };
          }),
        chunkNames: statsChunk.names,
        chunkFileName: statsChunk.fileName,
        chunkFileSize: statsChunk.fileSize,
      };
    }),
    bundlerVersions: statsJson.version!,
    buildTotalTime: statsJson.time!,
    buildOutPath: statsJson.outputPath!,
  };
};

const PLUGIN_NAME = 'webpack-build-analyzer';
class AssetsResultAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      const assetsResult = convertStatsJson(stats.toJson(), stats.compilation);

      // 发送websocket
      sendMessage({
        type: 'assets_analyzer',
        data: assetsResult,
      });
    });
  }
}

export default AssetsResultAnalyzerPlugin;
