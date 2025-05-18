declare interface ChunkGroupNode {
  uuid: string;
  name: string | null | undefined;
  // TODO 判断是entry / 还是动态
  connect: {
    parents: Set<ChunkGroupNode>;
    children: Set<ChunkGroupNode>;
    chunk: Set<string | number>;
  };
}

declare interface ChunkNode {
  uuid: string | number;
  name: string | null | undefined;
  connect: {
    parents: Set<ChunkNode>;
    children: Set<ChunkNode>;
    chunkGroup: Set<string>;
    modules: Set<string>;
  };
}

declare interface ModuleNode {
  uuid: string;
  connect: {
    parents: Set<ModuleNode>;
    children: Set<ModuleNode>;
    chunks: Set<string | number>;
  };
}

declare interface StatsSnapshot {
  moduleMap: Map<string | number, ModuleNode>;
  chunkMap: Map<string | number, ChunkNode>;
  chunkGroupMap: Map<string, ChunkGroupNode>;
}

declare interface StatsSnapshotsCollection {
  afterSeal?: StatsSnapshot;
  afterEmit?: StatsSnapshot;
}
