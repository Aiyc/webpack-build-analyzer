import { ChunkGraph, Compilation, Compiler, WebpackPluginInstance } from 'webpack';

/**
 * 整理状态快照
 *
 * @param moduleGraph
 * @param chunkGraph
 * @param chunks
 * @param modules
 * @param chunkGroups
 */
const getStatsSnapshot = ({
  moduleGraph,
  chunkGraph,
  chunks,
  modules,
  chunkGroups,
}: Compilation): StatsSnapshot => {
  // 整理module
  const moduleMap = new Map<string | number, ModuleNode>();
  for (const module of modules) {
    if (module.type === 'runtime') {
      continue;
    }
    moduleMap.set(module.identifier(), {
      uuid: module.identifier(),
      connect: {
        parents: new Set<ModuleNode>(),
        children: new Set<ModuleNode>(),
        chunks: new Set<string | number>(),
      },
    });
  }

  // 整理chunk
  const chunkMap = new Map<string | number, ChunkNode>();
  for (const chunk of chunks.values()) {
    chunkMap.set(chunk.id!, {
      uuid: chunk.id!,
      name: chunk.name,
      connect: {
        parents: new Set<ChunkNode>(),
        children: new Set<ChunkNode>(),
        chunkGroup: new Set<string>(
          [...chunk.groupsIterable.values()].map((chunkGroup) => chunkGroup.id!),
        ),
        modules: new Set<string>(
          chunkGraph
            .getChunkModules(chunk)
            .filter((module) => module.type !== 'runtime')
            .map((module) => module.identifier()),
        ),
      },
    });
  }

  // const entryChunkGroup = new Set<ChunkGroupNode>();
  // 整理chunk group
  const chunkGroupMap = new Map<string, ChunkGroupNode>();
  for (const chunkGroup of chunkGroups) {
    chunkGroupMap.set(chunkGroup.id!, {
      uuid: chunkGroup.id,
      name: chunkGroup.name,
      connect: {
        chunk: new Set<string | number>(chunkGroup.chunks.map((chunk) => chunk.id!)),
        parents: new Set<ChunkGroupNode>(),
        children: new Set<ChunkGroupNode>(),
      },
    });
    // if (Object.getPrototypeOf(chunkGroup).constructor.name === 'Entrypoint') {
    //   entryChunkGroup.add(chunkGroupNode);
    // }
  }

  for (const chunkGroup of chunkGroups) {
    const chunkGroupNode = chunkGroupMap.get(chunkGroup.id)!;
    for (const parentChunkGroup of chunkGroup.getParents()) {
      if (!chunkGroupMap.has(parentChunkGroup.id)) {
        continue;
      }

      const parentChunkGroupNode = chunkGroupMap.get(parentChunkGroup.id)!;
      chunkGroupNode.connect.parents.add(parentChunkGroupNode);
      parentChunkGroupNode.connect.children.add(chunkGroupNode);
    }
  }

  return {
    moduleMap,
    chunkMap,
    chunkGroupMap,
  };
};

// const getStatsSnapshot1 = (compilation: Compilation) => {
//   compilation.moduleGraph.
// }

const PLUGIN_NAME = 'seal-module-analyzer';
class SealModuleAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    const statsSnapshotsCollection: StatsSnapshotsCollection = {};
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.optimizeDependencies.tap(PLUGIN_NAME, () => {
        statsSnapshotsCollection.afterSeal = getStatsSnapshot(compilation);
      });

      compilation.hooks.afterSeal.tap(PLUGIN_NAME, () => {
        statsSnapshotsCollection.afterSeal = getStatsSnapshot(compilation);
      });
    });

    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      statsSnapshotsCollection.afterEmit = getStatsSnapshot(compilation);
      console.log(statsSnapshotsCollection);
    });
  }
}

export default SealModuleAnalyzerPlugin;
