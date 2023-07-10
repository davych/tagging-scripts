class InlineAllJsWebpackPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap('InlineAllJsWebpackPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'InlineAllJsWebpackPlugin',
        (data, cb) => {
          data.bodyTags = data.bodyTags.map((tag) => {
            if (tag.tagName === 'script' && tag.attributes.src) {
              const path = tag.attributes.src;
              const asset = compilation.assets[path];
              compilation.assets[path] = null;

              // 把生成的 JS 文件内联到 <script> 行内
              return {
                tagName: 'script',
                closeTag: true,
                innerHTML: asset.source(),
              };
            }
            return tag;
          });

          cb(null, data);
        }
      );
    });
  }
}
