import dts from "vite-plugin-dts";
import path from "path";
import sassGlobImports from "vite-plugin-sass-glob-import";
import { defineConfig, UserConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: "./",
  plugins: [
    dts({ rollupTypes: true }), sassGlobImports(),
    viteStaticCopy({
      targets: [
        {
          src: 'assets/*.scss',
          dest: '', // Copies to the root of the dist folder
        },
      ],
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "truecropper",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format) => {
        return format === "umd" ? `truecropper.js` : `truecropper.${format}.js`;
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "truecropper.css";
          return assetInfo.name;
        },
        // entryFileNames: (ChunkInfo) => {
        //   console.log(ChunkInfo);
        //   return ChunkInfo.name;
        // },
      },
    },
  },
} satisfies UserConfig);
