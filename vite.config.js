import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
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
    closeBundle() {
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
      const list = files.filter((f) => f !== 'sw.js' && !f.endsWith('.map') && !f.endsWith('.txt') && !/^assets\/firebase-/.test(f)).sort();
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
    rollupOptions: {
      output: {
        // Firebase en chunks con nombre fijo: se cargan bajo demanda y NO se precachean
        // (ahorra ~700 KB en la primera instalación con conectividad irregular).
        manualChunks(id) {
          const m = id.match(/node_modules\/@firebase\/(app|auth|firestore|analytics|installations)\//);
          if (m) return `firebase-${m[1] === 'installations' ? 'analytics' : m[1]}`;
          if (id.includes('node_modules/@firebase/') || id.includes('node_modules/firebase/')) return 'firebase-util';
        },
      },
    },
  },
  plugins: [snapfitServiceWorker()],
  test: { include: ['tests/**/*.test.js'], environment: 'node' },
});
