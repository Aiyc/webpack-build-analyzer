import { Resolver } from 'webpack';
import { resolveTrackMap, resolverMap, moduleOriginalImportPathMap } from '../share-data';

let i = 1;
let t = 1;

const PLUGIN_NAME = 'ResolvePlugin';
class ResolvePlugin {
  constructor() {}

  apply(resolver: Resolver) {
    const resolverId = i++;
    resolverMap.set(resolverId, resolver);

    // 相同的原始引入路径不会被重复解析，路径不同即使引入的是相同的模块，也会被重新解析
    resolver.getHook('resolve').tapAsync(PLUGIN_NAME, (request, context, callback) => {
      // @ts-ignore
      request.__RESOLVE_TRACK_ID__ = t++;
      // @ts-ignore
      resolveTrackMap.set(request.__RESOLVE_TRACK_ID__, {
        resolverId,
      });
      console.log('resolve', request.request);
      callback();
    });

    // resolver.hooks.result.tapAsync(PLUGIN_NAME, (request, context, callback) => {
    //
    //   console.log('result', request.path)
    //   callback();
    // });
  }
}

export default ResolvePlugin;
