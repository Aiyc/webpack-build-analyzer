import { Compiler, WebpackPluginInstance } from 'webpack';
import type { NodeData, EdgeData } from '@antv/g6';

type moduleType = '' | 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'runtime';

const getNodeId = (moduleId?: string) => {
  if (moduleId && moduleId.startsWith('external var')) {
    return moduleId.replace('external var', '扩展（external）模块');
  } else {
    return moduleId;
  }
};

const nodeColor: Record<moduleType, string> = {
  'javascript/esm': 'red',
  'javascript/auto': 'red',
  'runtime': 'green',
  'javascript/dynamic': 'yellow',
  '': 'red',
};

const minSize = 10;
const maxSize = 30;

const PLUGIN_NAME = 'webpack-build-analyzer';
class AssetsResultAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      const statsJson = stats.toJson();

      let min = Infinity;
      let max = 0;
      statsJson.modules?.forEach((module) => {
        min = Math.min(min, module.size ?? 0);
        max = Math.max(max, module.size ?? 0);
      });

      const ratio = (maxSize - minSize) / (max - min);
      const nodes: NodeData[] = [];
      const edges: EdgeData[] = [];

      statsJson.chunks?.forEach((chunk) => {
        chunk.modules?.forEach((module) => {
          const id = getNodeId(module.identifier) ?? '';
          nodes.push({
            id: id,
            style: {
              fill: nodeColor[module.moduleType as moduleType],
              size: ratio * (module.size ?? 0),
              // 节点上显示的label
              label: true,
              labelText: id,
            },
            data: {
              chunk: {
                chunkFiles: chunk.files.join(';'),
              },
              moduleSize: module.size,
            },
          });
          if (module.issuer) {
            edges.push({
              source: getNodeId(module.issuer) ?? '',
              target: id,
            });
          }
        });
      });

      const data = {
        nodes,
        edges,
      };
      console.log(data);
    });
  }
}

export default AssetsResultAnalyzerPlugin;
