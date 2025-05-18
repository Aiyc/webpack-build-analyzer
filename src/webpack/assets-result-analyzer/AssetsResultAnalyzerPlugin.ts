import {
  Compiler,
  WebpackPluginInstance,
  StatsCompilation,
  StatsChunk,
  Compilation,
  Chunk,
  Module,
} from 'webpack';
import { moduleOriginalImportPathMap, resolverMap, resolveTrackMap } from '../../share-data';
import { sendMessage } from '../../socket';

const convertStatsJson = (statsJson: StatsCompilation, compilation: Compilation): AssetsResult => {
  // const chunkMap = new Map<string | number, Chunk>();
  // compilation.chunks.forEach((chunk) => {
  //   if (chunk.id !== null) {
  //     chunkMap.set(chunk.id, chunk);
  //   }
  // });
  // const moduleMap = new Map<string | number, Module>();
  // compilation.modules.forEach((module) => {
  //   if (module.type === 'runtime') {
  //     return;
  //   }
  //   moduleMap.set(module.identifier(), module);
  // });
  const assetsAssetMap = new Map<string, AssetsAsset>();
  for (const statsAsset of statsJson.assets ?? []) {
    assetsAssetMap.set(statsAsset.name, {
      uuid: statsAsset.name,
      size: statsAsset.size,
      type: statsAsset.type,
      connect: {
        chunks: new Set<string | number>(statsAsset.chunks ?? []),
      },
    });
  }

  const assetsChunkMap = new Map<string | number, AssetsChunk>();
  for (const statsChunk of statsJson.chunks ?? []) {
    assetsChunkMap.set(statsChunk.id!, {
      uuid: statsChunk.id!,
      size: statsChunk.size,
      chunkHash: statsChunk.hash,
      connect: {
        assets: new Set<string>(statsChunk.files),
        modules: new Set<string>(
          (statsChunk.modules ?? [])
            .filter((module) => module.moduleType !== 'runtime')
            .map((module) => module.identifier!),
        ),
      },
    });
  }

  const assetsModuleMap = new Map<string, AssetsModule>();
  for (const statsModule of statsJson.modules ?? []) {
    if (statsModule.moduleType === 'runtime') {
      continue;
    }
    assetsModuleMap.set(statsModule.identifier!, {
      uuid: statsModule.identifier!,
      moduleName: statsModule.name!,
      moduleType: statsModule.moduleType! as moduleType,
      moduleSize: statsModule.size!,
      connect: {
        parents: new Set<string>(),
        children: new Set<string>(),
        chunks: new Set<string | number>(statsModule.chunks ?? []),
        assets: (statsModule.chunks ?? []).reduce((set, chunkUUID) => {
          if (assetsChunkMap.has(chunkUUID)) {
            assetsChunkMap.get(chunkUUID)!.connect.assets.forEach((asset) => set.add(asset));
          }
          return set;
        }, new Set<string>()),
      },
    });
  }
  // 关联父子模块关系
  for (const statsModule of statsJson.modules ?? []) {
    if (statsModule.moduleType === 'runtime') {
      continue;
    }

    const assetsModule = assetsModuleMap.get(statsModule.identifier!)!;
    for (const { moduleIdentifier: parentUUID } of statsModule.reasons ?? []) {
      if (!parentUUID) {
        continue;
      }
      if (assetsModuleMap.has(parentUUID)) {
        const parentAssetsModule = assetsModuleMap.get(parentUUID);
        assetsModule.connect.parents.add(parentUUID);
        parentAssetsModule?.connect.children.add(assetsModule.uuid);
      }
    }
  }

  return {
    bundlerVersions: statsJson.version!,
    buildTotalTime: statsJson.time!,
    buildOutPath: statsJson.outputPath!,
    assets: assetsAssetMap,
    chunks: assetsChunkMap,
    modules: assetsModuleMap,
  };
};

const PLUGIN_NAME = 'webpack-build-analyzer';
class AssetsResultAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      const assetsResult = convertStatsJson(stats.toJson(), stats.compilation);

      // 发送websocket
      // sendMessage({
      //   type: 'assets_analyzer',
      //   data: assetsResult,
      // });

      // console.log(assetsResult);
      // console.log(resolverMap);
      // console.log(resolveTrackMap);
      // console.log(moduleOriginalImportPathMap);
    });
  }
}

export default AssetsResultAnalyzerPlugin;
