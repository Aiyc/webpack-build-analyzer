(function (scope) {
  const UUID = Math.random().toString();
  // 静态资源分析
  scope.html = function () {
    return `
    <div id="${UUID}" style="width: 100%; height: 100%">
        暂无帮助
    </div>
  `;
  };
  scope.mount = function () {};
  scope.update = function (data) {};
  scope.destroy = function () {};
})(window.ANALYSER);
