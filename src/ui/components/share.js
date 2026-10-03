// Imagen PNG pixel-art de un logro + Web Share API (o descarga como alternativa). Sin datos personales.
import { drawBadge } from './sprite.js';

export async function shareBadge(id, name, desc) {
  const W = 480, H = 480;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const cs = getComputedStyle(document.documentElement);
  const v = (k) => cs.getPropertyValue(k).trim();
  g.imageSmoothingEnabled = false;
  g.fillStyle = v('--bg'); g.fillRect(0, 0, W, H);
  g.strokeStyle = v('--border'); g.lineWidth = 12; g.strokeRect(6, 6, W - 12, H - 12);
  const b = document.createElement('canvas');
  document.body.appendChild(b);
  drawBadge(b, id, true);
  b.remove();
  g.drawImage(b, W / 2 - 96, 70, 192, 192);
  try { await document.fonts.load('16px "Press Start 2P"'); } catch {}
  g.textAlign = 'center';
  g.fillStyle = v('--primary'); g.font = '20px "Press Start 2P", monospace';
  g.fillText(name, W / 2, 320, W - 40);
  g.fillStyle = v('--text'); g.font = '16px system-ui, sans-serif';
  g.fillText(desc, W / 2, 360, W - 40);
  g.fillStyle = v('--accent'); g.font = '14px "Press Start 2P", monospace';
  g.fillText('SnapFit', W / 2, 430);
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  const file = new File([blob], `snapfit-${id}.png`, { type: 'image/png' });
  const text = `¡Desbloqueé «${name}» en SnapFit! 🕹️💪`;
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], text, title: 'SnapFit' }); return 'shared'; } catch (e) { if (e?.name === 'AbortError') return 'cancel'; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'downloaded';
}
