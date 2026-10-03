// Falla si algún asset de public/ no aparece en docs/ASSETS-PROVENANCE.md (regla de CONTRIBUTING).
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const EXT = /\.(png|jpe?g|gif|webp|svg|ttf|otf|woff2?|mp3|ogg|wav|opus|m4a)$/i;
const table = readFileSync('docs/ASSETS-PROVENANCE.md', 'utf8');
const missing = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.test(f) && !table.includes('`' + p.split('\\').join('/') + '`')) missing.push(p);
  }
};
walk('public');
if (missing.length) {
  console.error('Assets sin fila en docs/ASSETS-PROVENANCE.md:\n' + missing.map((m) => ' - ' + m).join('\n'));
  process.exit(1);
}
console.log('procedencia OK');
