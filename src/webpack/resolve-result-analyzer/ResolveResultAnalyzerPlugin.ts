import { Compiler, WebpackPluginInstance } from 'webpack';
import { moduleOriginalImportPathMap, resolverMap, resolveTrackMap } from '../../share-data';

const thirdPartyLibResultCache = new Map<string, boolean>();

const PLUGIN_NAME = 'resolve-result-analyzer';
class ResolveResultAnalyzerPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      normalModuleFactory.hooks.resolve.tap(PLUGIN_NAME, (resolveData) => {
        console.log('normalModuleFactory.resolve', resolveData.request);
      });

      normalModuleFactory.hooks.afterResolve.tap(PLUGIN_NAME, (resolveData) => {
        console.log('normalModuleFactory.afterResolve', resolveData.request);
        const request = resolveData.createData.resourceResolveData;
        const resolveTrackInfo = resolveTrackMap.get(request.__RESOLVE_TRACK_ID__)!;
        const requestPath = request.path;
        // TODO request.path什么情况下是boolean类型
        if (typeof requestPath === 'string') {
          if (!moduleOriginalImportPathMap.has(requestPath)) {
            moduleOriginalImportPathMap.set(requestPath, []);
          }
          moduleOriginalImportPathMap.get(requestPath)!.push(resolveTrackInfo.originalImportPath);

          const resolver = resolverMap.get(resolveTrackInfo.resolverId)!;
          // TODO 什么情况下modules是二维数组？
          const thirdPartyLibPathArr = resolver.options.modules as string[];
          // 判断是否是第三方模块
          if (!thirdPartyLibResultCache.has(requestPath)) {
            thirdPartyLibResultCache.set(
              requestPath,
              thirdPartyLibPathArr.some(
                (thirdPartyLibPath) => requestPath.indexOf(thirdPartyLibPath) > -1,
              ),
            );
          }
          resolveTrackInfo.thirdPartyLibFlag = thirdPartyLibResultCache.get(requestPath);
        }
      });
    });
  }
}

export default ResolveResultAnalyzerPlugin;
