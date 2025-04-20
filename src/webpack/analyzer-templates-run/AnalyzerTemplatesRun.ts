import { Compiler, WebpackPluginInstance } from 'webpack';
import fs from 'fs-extra';
import path from 'path';
import open from 'open';
import express from 'express';

// TODO 统一配置端口
const port = 9999;

const PLUGIN_NAME = 'analyzer-templates-run';
class AnalyzerTemplatesRun implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    // 复制模板
    compiler.hooks.done.tap(PLUGIN_NAME, async () => {
      const fromDir = path.resolve(__dirname, './templates');
      // TODO compiler.options.output.path 是否会为undefined
      const toDir = path.resolve(compiler.options.output.path!, '../analyzer_templates');
      await fs.copy(fromDir, toDir);

      const app = express();
      app.use(express.static(toDir));
      const server = app.listen(port, async () => {
        await open(`http://localhost:${port}`);
      });
    });
  }
}

export default AnalyzerTemplatesRun;
