const PLUGIN_NAME = 'webpack-build-analyzer'

class WebpackBuildAnalyzerPlugin {

    nodeColor = {
        'javascript/auto': 'red',
        'runtime': 'green',
        'javascript/dynamic': 'yellow'
    }

    minSize = 10;
    maxSize = 30;

    apply(compiler) {
        const resolverCallback =  (resolver) => {
            // you can tap into resolver.hooks now
            resolver.hooks.parsedResolve.tap(PLUGIN_NAME, (request, resolveContext) => {
                const requestedPath = request.request;
                console.log(1111);
            });
        }
        compiler.resolverFactory.hooks.resolver
            .for('normal')
            .tap(PLUGIN_NAME, resolverCallback);
        // compiler.resolverFactory.hooks.resolver
        //     .for('context')
        //     .tap(PLUGIN_NAME, resolverCallback);
        // compiler.resolverFactory.hooks.resolver
        //     .for('loader')
        //     .tap(PLUGIN_NAME, resolverCallback);

        compiler.hooks.done.tap("WebpackBuildAnalyzerPlugin", (stats) => {
            const statsJson = stats.toJson();

            let min = Infinity;
            let max = 0;
            statsJson.modules.forEach(module => {
                min = Math.min(min, module.size);
                max = Math.max(max, module.size);
            });

            const ratio = (this.maxSize - this.minSize) / (max - min);
            const nodes = [];
            const edges = [];

            statsJson.chunks.forEach(chunk => {
                chunk.modules.forEach(module => {
                    const id = this.getNodeId(module.identifier);
                    nodes.push({
                        id: id,
                        style: {
                            fill: this.nodeColor[module.moduleType],
                            size: ratio * module.size,
                            // 节点上显示的label
                            label: true,
                            labelText: id,
                        },
                        data: {
                            chunk: {
                                chunkFiles: chunk.files.join(';'),
                            },
                            moduleSize: module.size,
                        }
                    });
                    if (module.issuer) {
                        edges.push({
                            source: module.issuer,
                            target: module.identifier,
                        });
                    }
                })
            })

            const data = {
                nodes, edges
            }
            // console.log(data);
        });
    }

    getNodeId(moduleId: string) {
        if (moduleId.startsWith('external var')) {
            return moduleId.replace('external var', '扩展（external）模块');
        } else {
            return moduleId;
        }
    }
}

module.exports = WebpackBuildAnalyzerPlugin;