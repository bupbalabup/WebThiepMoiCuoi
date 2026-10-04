import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

// Discover every album image at build time; refresh when files change in dev.
function weddingAlbum() {
  const id = "virtual:wedding-album";
  const folder = resolve("public/images/khoanhkhac");
  return {
    name: "wedding-album",
    resolveId(source) { if (source === id) return "\0" + id; },
    load(source) {
      if (source !== "\0" + id) return;
      const files = readdirSync(folder, { withFileTypes: true })
        .filter(file => file.isFile() && /\.(jpe?g|png)$/i.test(file.name))
        .map(file => {
          const optimized = file.name.replace(/\.[^.]+$/, "-optimized.webp");
          return { id: file.name, src: `/images/khoanhkhac/${encodeURIComponent(existsSync(resolve(folder, optimized)) ? optimized : file.name)}` };
        }).sort((a, b) => a.id.localeCompare(b.id, "vi", { numeric: true }));
      return `export default ${JSON.stringify(files)};`;
    },
    configureServer(server) {
      server.watcher.add(folder);
      const refresh = file => {
        if (resolve(file).startsWith(folder + "/") || resolve(file).startsWith(folder + "\\")) {
          const module = server.moduleGraph.getModuleById("\0" + id);
          if (module) server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: "full-reload" });
        }
      };
      server.watcher.on("add", refresh).on("unlink", refresh).on("change", refresh);
      server.httpServer?.once("close", () => {
        server.watcher.off("add", refresh).off("unlink", refresh).off("change", refresh);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), weddingAlbum()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
  },
});
