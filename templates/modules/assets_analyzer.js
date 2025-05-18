(function (scope) {
  const UUID = Math.random().toString();
  let graph = null;
  const getNodeStyle = function (extraMeta) {
    let color = '#5B8FF9';
    // 入口
    if (extraMeta.entryFlag) {
      color = '#F08BB4';
    }
    // 第三方依赖
    else if (extraMeta.thirdPartyLibFlag) {
      color = '#61DDAA';
    }
    // external
    else if (extraMeta.externalFlag) {
      color = '#F6BD16';
    }

    return {
      color,
    };
  };

  const getNodeSize = function (fileSize) {
    const size = Math.floor(fileSize / 1000);
    if (size < 15) {
      return 15;
    } else if (size > 200) {
      return 200;
    }
    return size;
  };

  const initG6 = (assetsResult) => {
    // 将数据处理成g6渲染的格式
    const nodes = [];
    const edges = [];
    assetsResult.chunks?.forEach((chunk) => {
      chunk.modules?.forEach((module) => {
        const id = module.moduleId ?? '';
        const style = getNodeStyle(module.extraMeta);
        nodes.push({
          id: id,
          style: {
            fill: style.color,
            // 节点上显示的label
            label: true,
            size: getNodeSize(module.moduleSize),
            labelText: module.moduleName,
          },
          data: module,
        });
        if (module.parentModuleIds) {
          module.parentModuleIds.forEach((parentModuleId) => {
            edges.push({
              source: parentModuleId,
              target: id,
            });
          });
        }
      });
    });

    // g6渲染
    const { Graph, NodeEvent } = G6;
    graph = new Graph({
      container: 'g6_container',
      autoFit: 'center',
      autoResize: true,
      data: {
        nodes,
        edges,
      },
      layout: {
        type: 'force',
        linkDistance: 50,
        clustering: true,
        nodeClusterBy: 'cluster',
        clusterNodeStrength: 70,
      },
      behaviors: ['zoom-canvas', 'click-select', 'fix-element-size'],
      plugins: ['minimap'],
    });

    graph.render();

    graph.on(NodeEvent.CLICK, (event) => {
      const { target } = event;
      // 获取节点数据
      const { data } = graph.getNodeData(target.id);
      // 打开抽屉
      window.DrawerModal.open(`
        <style>
        .key { color: #888; }

        .value { color: #222; }
        </style>
        <div>
          <p>
            <div class="key">模块原始引入路径：</div>
            <div class="value">${data.extraMeta.originalImportPath}</div>
          </p>
          <p>
            <div class="key">模块名称：</div>
            <div class="value">${data.moduleName}</div>
          </p>
          <p>
            <div class="key">模块大小：</div>
            <div class="value">${(data.moduleSize / 1024).toFixed(2)} KB</div>
          </p>
          <p>
            <div class="key">是否是编译入口（Entry）：</div>
            <div class="value">${data.extraMeta.entryFlag ? '是' : '否'}</div>
          </p>
           <p>
            <div class="key">是否是第三方依赖：</div>
            <div class="value">${data.extraMeta.thirdPartyLibFlag ? '是' : '否'}</div>
          </p>
          <p>
            <div class="key">是否是扩展依赖（External）：</div>
            <div class="value">${data.extraMeta.externalFlag ? '是' : '否'}</div>
          </p>
          <p>
            <div class="key">是否使用了别名（Alias）：</div>
            <div class="value">${data.extraMeta.aliasFlag ? '是' : '否'}</div>
          </p>
        </div>
      `);
    });
  };
  // 静态资源分析
  scope.html = function () {
    return `
    <div id="${UUID}" style="width: 100%; height: 100%">
        <div id="g6_container" style="width: 100%; height: 100%"></div>
        <script src="./lib/g6.min.js"></script>
    </div>
  `;
  };
  scope.mount = function (data) {
    if (graph) {
      graph.destroy();
      graph = null;
    }
    if (data) {
      initG6(data);
    }
  };
  scope.update = function (data) {
    if (graph) {
      graph.destroy();
      graph = null;
    }
    initG6(data);
  };
  scope.destroy = function () {
    if (graph) {
      graph.destroy();
    }
    window.DrawerModal.close();
  };
})(window.ANALYSER);
