import { Resolver } from 'webpack';

// 解析器Map
export const resolverMap = new Map<number, Resolver>();

export const resolveTrackMap = new Map<number, ResolveTrackInfo>();

// 模块原始的引入路径的方式
export const moduleOriginalImportPathMap = new Map<string, string[]>();
