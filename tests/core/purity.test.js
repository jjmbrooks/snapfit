// src/core debe ser JS puro: sin DOM, sin Firebase, sin imports de UI/adaptadores.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('../../src/core/', import.meta.url);
describe('pureza del core', () => {
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.js'))) {
    it(f, () => {
      const src = readFileSync(new URL(f, dir), 'utf8').replace(/\/\/.*$/gm, '');
      expect(src).not.toMatch(/\b(window|document|localStorage|indexedDB|navigator)\b/);
      expect(src).not.toMatch(/from ['"](firebase|\.\.\/ui|\.\.\/adapters)/);
    });
  }
});
