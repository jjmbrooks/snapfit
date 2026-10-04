// Genera docs/story/MICROCOPY.md: inventario de TODOS los textos visibles en español.
// Uso: npm run docs:microcopy  (córrelo cuando cambies content/copy/es.json, content/story/*.json o textos en código).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const copy = JSON.parse(readFileSync('content/copy/es.json', 'utf8'));
const active = JSON.parse(readFileSync('content/story/active.json', 'utf8')).active;
const story = JSON.parse(readFileSync(`content/story/${active}.json`, 'utf8'));
const cell = (v) => String(v).replace(/\|/g, '\\|').replace(/\n/g, ' ');

function flat(o, prefix = '', out = []) {
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('_') || k.startsWith('$')) continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') flat(v, key, out);
    else out.push([key, v]);
  }
  return out;
}

// Textos que siguen dentro del código (pendientes de migrar a content/copy/es.json).
const INLINE_FILES = ['index.html', 'src/main.js', 'src/ui/app.js', ...readdirSync('src/ui/views').map((f) => `src/ui/views/${f}`), ...readdirSync('src/ui/components').map((f) => `src/ui/components/${f}`)];
const inline = [];
for (const f of INLINE_FILES) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
    const stripped = line.replace(/\$\{[^}]*\}/g, ' ').replace(/<[^>]+>/g, ' ');
    for (const m of stripped.matchAll(/(?:^|[>'"`(])\s*([¡¿A-ZÁÉÍÓÚÑ][^<>'"`{}]*?[a-záéíóúñ.!?:)][^<>'"`{}]*)/g)) {
      const s = m[1].trim();
      if (s.length < 4 || !/[a-záéíóúñ]{3}/.test(s) || /^[A-Z_]+$/.test(s) || /^(Mazo|SnapFit)$/.test(s) && f !== 'index.html') continue;
      if (/\b(function|return|const|import|export|querySelector|class|Promise|Math|JSON|Error)\b/.test(s)) continue;
      inline.push([`${f}:${i + 1}`, s]);
    }
  });
}

const md = `# Microcopy (inventario generado)

> **v0 · borrador abierto a propuestas.** Archivo **generado** por \`npm run docs:microcopy\`: no lo edites a mano.
> Para cambiar un texto, edita la fuente indicada y regenera. Propuestas alternativas: \`docs/proposals/copy/<modelo>.md\`.
> Español neutro, frases cortas, sin culpa ni comentarios sobre el cuerpo (docs/00-VISION.md).

## 1. Interfaz — \`content/copy/es.json\`

Uso en código: \`t('clave', { variable })\`. Las \`{variables}\` deben conservarse. Se permite HTML simple (\`<b>\`, \`<a>\`) solo donde ya aparece.

| Clave | Texto |
|-------|-------|
${flat(copy).map(([k, v]) => `| \`${k}\` | ${cell(v)} |`).join('\n')}

## 2. Narrativa — \`content/story/${active}.json\` (historia activa)

| Clave | Texto |
|-------|-------|
${flat(story).filter(([k]) => !['id', 'version', 'status', 'author'].includes(k)).map(([k, v]) => `| \`${k}\` | ${cell(v)} |`).join('\n')}

## 3. Textos que siguen en código (pendientes de migrar)

Detección automática (heurística: puede incluir algún falso positivo). Migrarlos es un buen slice para el workstream *story-copy* + Codelius: mover a \`content/copy/es.json\` y usar \`t()\`.

| Ubicación | Texto |
|-----------|-------|
${inline.map(([w, s]) => `| \`${w}\` | ${cell(s)} |`).join('\n')}
`;
writeFileSync('docs/story/MICROCOPY.md', md);
console.log(`MICROCOPY.md: ${flat(copy).length} claves de interfaz, ${flat(story).length} de historia, ${inline.length} textos en código`);
