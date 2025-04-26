import { Resolver } from 'webpack';
import { shareData } from '../share-data';

let resolverId = 1;
const normalResolverMap = new Map<number, Resolver>();

const PLUGIN_NAME = 'ResolvePlugin';
class ResolvePlugin {
  constructor() {}

  apply(resolver: Resolver) {
    const currentResolverId = resolverId++;
    // TODO 什么情况下modules是二维数组？
    const thirdPartyLibPath = resolver.options.modules as string[];
    normalResolverMap.set(currentResolverId, resolver);

    resolver.getHook('resolve').tapAsync(PLUGIN_NAME, (request, context, callback) => {
      console.log(request.request);
      // @ts-ignore
      request.__ANALYZER_META__ = {
        originalModuleName: request.request,
        thirdPartyLibPath,
        currentResolverId,
        // @ts-ignore
        parentModuleId: request.context!.issuer,
      };
      callback();
    });

    resolver.hooks.result.tapAsync(PLUGIN_NAME, (request, context, callback) => {
      // TODO request.path 有可能是boolean类型
      if (!shareData.moduleMap.has(request.path as string)) {
        shareData.moduleMap.set(request.path as string, []);
      }

      // @ts-ignore
      request.__ANALYZER_META__.thirdPartyLibFlag = thirdPartyLibPath.some(
        (path) => request.path.indexOf(path) > -1,
      );
      // @ts-ignore
      shareData.moduleMap.get(request.path as string).push(request.__ANALYZER_META__);

      callback();
    });
  }
}

export default ResolvePlugin;
