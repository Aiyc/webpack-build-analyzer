declare interface AssetsParentModule {
  // 在父模块中的原始引入路径
  originalImportPath: string;
  // 模块
  module: AssetsModule;
}

declare interface AssetsChildModule {
  // 引用该子模块时候的原始引用路径
  originalImportPath: string;
  // 模块
  module: AssetsModule;
}

declare interface AssetsModule {
  // 唯一标识：模块文件全路径
  uuid: string;
  // 模块名
  moduleName: string;
  // 模块id
  // moduleId: string | number;
  // 模块类型
  moduleType: moduleType;
  // 模块大小
  moduleSize: number;
  // 模块哈希
  // moduleHash: string;
  connect: {
    parents: Set<string>;
    children: Set<string>;
    chunks: Set<string | number>;
    assets: Set<string>;
  };
  // 扩展数据
  // extraMeta: {
  //   // 是否是第三方库
  //   thirdPartyLibFlag?: boolean;
  //   // 是否是扩展依赖（external）
  //   externalFlag?: boolean;
  //   // 是否是入口（entry）
  //   // entryFlag?: boolean;
  //   // 是否使用了别名（alias）
  //   // aliasFlag?: boolean;
  // };
}

declare interface AssetsChunk {
  uuid: string | number;
  // chunk文件大小
  size: number;
  // chunk哈希
  chunkHash: string;
  // chunk类型
  chunkType?: string;
  connect: {
    modules: Set<string>;
    assets: Set<string>;
  };
}

declare interface AssetsAsset {
  uuid: string;
  size: number;
  type: string;
  connect: {
    chunks: Set<string | number>;
  };
}

declare interface AssetsResult {
  assets: Map<string, AssetsAsset>;
  chunks: Map<string | number, AssetsChunk>;
  modules: Map<string, AssetsModule>;
  // 捆绑器版本
  bundlerVersions: string;
  // 编译总耗时
  buildTotalTime: number;
  // 编译输出路径
  buildOutPath: string;
}
