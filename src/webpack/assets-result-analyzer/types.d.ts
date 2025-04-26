declare type moduleType =
  | ''
  | 'javascript/auto'
  | 'javascript/dynamic'
  | 'javascript/esm'
  | 'runtime';

declare interface AssetsModule {
  // 模块名
  moduleName: string;
  // 模块id（全路径）
  moduleId: string | number;
  // 模块类型
  moduleType: moduleType;
  // 模块大小
  moduleSize: number;
  // 父模块id
  parentModuleIds: string[];
  // 属于的chunks
  belongToChunks: (string | number)[];
  // 解析
  extraMeta: {
    // 原始的模块名（代码中导入使用的原始名称）
    originalModuleName: string;
    // 是否是第三方库
    thirdPartyLibFlag?: boolean;
    // 是否是扩展依赖（external）
    externalFlag?: boolean;
    // 是否是入口（entry）
    entryFlag?: boolean;
    // 是否使用了别名（alias）
    aliasFlag?: boolean;
  };
}

declare interface AssetsChunk {
  modules: AssetsModule[];
  // chunk名称
  chunkNames: string[];
  // chunk文件名称
  chunkFileName: string;
  // chunk文件大小
  chunkFileSize: number;
}

declare interface AssetsResult {
  chunks: AssetsChunks[];
  // 捆绑器版本
  bundlerVersions: string;
  // 编译总耗时
  buildTotalTime: number;
  // 编译输出路径
  buildOutPath: string;
}
