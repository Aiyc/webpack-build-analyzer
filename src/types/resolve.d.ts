declare interface ResolveTrackInfo {
  // 对应的解析器id
  resolverId: number;
  // 模块原始引入路径
  originalImportPath: string;
  // 是否是第三方模块
  thirdPartyLibFlag?: boolean;
}
