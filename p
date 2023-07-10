data.bodyTags = assetUrls.map((url, index) => {
          const source = compilation.assets[url.replace(compiler.options.output.publicPath, "")];
          return {
            tagName: "script",
            voidTag: false,
            attributes: { type : "text/javascript" },
            innerHTML: source.source(),
          };
        });
