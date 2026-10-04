import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, readdirSync, statSync, rmSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Genera dist/sw.js con la lista de precache (todos los archivos del build).
function snapfitServiceWorker() {
  let outDir;
  let root;
  return {
    name: 'snapfit-sw',
    apply: 'build',
    configResolved(c) { outDir = c.build.outDir; root = c.root; },
    closeBundle(error) {
      if (error || !existsSync(join(root, outDir, '.vite/manifest.json'))) return; // deja ver el error real del build
      const dir = join(root, outDir);
      const files = [];
      const walk = (d) => {
        for (const f of readdirSync(d)) {
          const p = join(d, f);
          if (statSync(p).isDirectory()) walk(p);
          else files.push(relative(dir, p).split('\\').join('/'));
        }
      };
      walk(dir);
      // Precache = archivos de public/ + index.html + grafo ESTÁTICO de la entrada.
      // Los chunks dinámicos (Firebase, auth, sync) no se precachean: solo sirven con red
      // y así la primera instalación pesa ~700 KB menos (conectividad irregular).
      const manifest = JSON.parse(readFileSync(join(dir, '.vite/manifest.json'), 'utf8'));
      const entryGraph = new Set();
      const visit = (key) => {
        const m = manifest[key];
        if (!m || entryGraph.has(m.file)) return;
        entryGraph.add(m.file);
        (m.css || []).forEach((c) => entryGraph.add(c));
        (m.assets || []).forEach((c) => entryGraph.add(c));
        (m.imports || []).forEach(visit);
      };
      visit('index.html');
      // Textos de TODOS los paquetes de historia (chunks pequeños): se precachean para poder cambiar
      // de historia sin red. Sus assets (public/stories/**) NO: se cargan perezosamente y el SW
      // cachea solo los del paquete activo (mensaje CACHE_STORY).
      for (const key of Object.keys(manifest)) if (key.startsWith('content/stories/')) visit(key);
      rmSync(join(dir, '.vite'), { recursive: true, force: true }); // no publicar el manifest de Vite
      const list = files
        .filter((f) => f !== 'sw.js' && !f.startsWith('.vite/') && !f.endsWith('.map') && !f.endsWith('.txt'))
        .filter((f) => !f.startsWith('assets/') || entryGraph.has(f))
        .filter((f) => !f.startsWith('stories/'))
        .sort();
      const hash = createHash('sha256');
      for (const f of list) hash.update(f).update(readFileSync(join(dir, f)));
      const version = `${pkg.version}-${hash.digest('hex').slice(0, 10)}`;
      const sw = readFileSync(join(root, 'src/sw/sw.js'), 'utf8')
        .replace('__SW_VERSION__', version)
        .replace('__PRECACHE_MANIFEST__', JSON.stringify(list));
      writeFileSync(join(dir, 'sw.js'), sw);
      console.log(`[snapfit-sw] ${list.length} archivos en precache, versión ${version}`);
    },
  };
}

// Project Pages: https://jjmbrooks.github.io/snapfit/  → base DEBE ser '/snapfit/'.
export default defineConfig({
  base: '/snapfit/',
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 800,
    manifest: true,
  },
  plugins: [snapfitServiceWorker()],
  test: { include: ['tests/**/*.test.js'], environment: 'node' },
});
