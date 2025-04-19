(function (scope) {
  const UUID = Math.random().toString();
  const initG6 = (data) => {
    const { Graph } = G6;

    const graph = new Graph({
      container: 'g6_container',
      autoFit: 'view',
      data,
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
    if (data) {
      initG6(data);
    }
  };
  scope.update = function (data) {
    console.log(data);
    initG6(data);
  };
  scope.destroy = function () {};
})(window.ANALYSER);
