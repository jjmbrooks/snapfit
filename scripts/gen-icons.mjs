// Genera los íconos PNG de la PWA desde un patrón pixel 16×16 (sin dependencias).
// Procedencia: «generado por código, Codelius» (docs/ASSETS-PROVENANCE.md).
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const PAL = { '.': [15, 16, 32], Y: [255, 210, 63], K: [27, 19, 0], C: [92, 225, 230] };
// Carta pixel con una figura celebrando (brazos arriba).
const ART = [
  '................',
  '..YYYYYYYYYYYY..',
  '..Y..........Y..',
  '..Y.C..YY..C.Y..',
  '..Y.C..YY..C.Y..',
  '..Y..C.CC.C..Y..',
  '..Y...CCCC...Y..',
  '..Y....CC....Y..',
  '..Y....CC....Y..',
  '..Y...C..C...Y..',
  '..Y...C..C...Y..',
  '..Y..CC..CC..Y..',
  '..Y..........Y..',
  '..Y.YYYYYYYY.Y..',
  '..YYYYYYYYYYYY..',
  '................',
];

function png(size, padRatio) {
  const pad = Math.round(size * padRatio);
  const cell = Math.floor((size - pad * 2) / 16);
  const off = Math.floor((size - cell * 16) / 2);
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const gx = Math.floor((x - off) / cell), gy = Math.floor((y - off) / cell);
      const ch = gx >= 0 && gx < 16 && gy >= 0 && gy < 16 ? ART[gy][gx] : '.';
      const [r, g, b] = PAL[ch] || PAL['.'];
      const i = y * (size * 3 + 1) + 1 + x * 3;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b;
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', png(192, 0.0));
writeFileSync('public/icons/icon-512.png', png(512, 0.0));
writeFileSync('public/icons/icon-maskable-512.png', png(512, 0.12));
console.log('íconos generados en public/icons/');
