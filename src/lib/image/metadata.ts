/**
 * Read raw metadata from a file — currently best-effort inspect for the
 * "common" JPEG APP segments. We extract a few EXIF fields when present.
 * No external library needed.
 */
export interface RawMetadata {
  file: {
    name: string;
    size: number;
    type: string;
  };
  dimensions?: { width: number; height: number };
  exif?: Record<string, string | number>;
  raw?: Record<string, string>;
}

const TAG_NAMES: Record<number, string> = {
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x011a: 'XResolution',
  0x011b: 'YResolution',
  0x0128: 'ResolutionUnit',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x013b: 'Artist',
  0x8298: 'Copyright',
  0x8825: 'GPSIFD',
  0x9003: 'DateTimeOriginal',
  0x920a: 'FocalLength',
  0xa002: 'PixelXDimension',
  0xa003: 'PixelYDimension',
  0x8827: 'ISO',
  0x9201: 'ShutterSpeed',
  0x9202: 'Aperture',
};

export async function readExif(file: File): Promise<RawMetadata> {
  const out: RawMetadata = {
    file: { name: file.name, size: file.size, type: file.type },
  };
  if (file.type !== 'image/jpeg' && !file.name.toLowerCase().endsWith('.jpg')) {
    return out;
  }
  const buf = new DataView(await file.arrayBuffer());
  if (buf.byteLength < 4) return out;
  if (buf.getUint16(0) !== 0xffd8) return out; // not a JPEG

  const exif: Record<string, string | number> = {};
  let offset = 2;
  while (offset < buf.byteLength) {
    if (buf.getUint8(offset) !== 0xff) break;
    const marker = buf.getUint8(offset + 1);
    const size = buf.getUint16(offset + 2);
    if (marker === 0xe1) {
      // APP1 / EXIF
      if (buf.getUint32(offset + 4) === 0x45786966) {
        // 'Exif'
        const tiffStart = offset + 10;
        const little = buf.getUint16(tiffStart) === 0x4949;
        const ifd0 = tiffStart + buf.getUint32(tiffStart + 4, little);
        parseIfd(buf, ifd0, little, tiffStart, exif);
      }
    }
    offset += 2 + size;
  }
  if (Object.keys(exif).length) out.exif = exif;
  return out;
}

function parseIfd(
  buf: DataView,
  ifd: number,
  little: boolean,
  tiffStart: number,
  out: Record<string, string | number>
) {
  const count = buf.getUint16(ifd, little);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    const tag = buf.getUint16(entry, little);
    const type = buf.getUint16(entry + 2, little);
    const count = buf.getUint32(entry + 4, little);
    const valueOffset = buf.getUint32(entry + 8, little) + tiffStart;
    const name = TAG_NAMES[tag];
    if (!name) continue;
    if (type === 2 /* ASCII */) {
      let s = '';
      for (let j = 0; j < count - 1; j++) {
        s += String.fromCharCode(buf.getUint8(valueOffset + j));
      }
      out[name] = s;
    } else if (type === 3 /* SHORT */) {
      out[name] = buf.getUint16(valueOffset, little);
    } else if (type === 4 /* LONG */) {
      out[name] = buf.getUint32(valueOffset, little);
    } else if (type === 5 /* RATIONAL */ && count > 0) {
      out[name] = `${buf.getUint32(valueOffset, little)}/${buf.getUint32(valueOffset + 4, little)}`;
    }
  }
}

export function detectDpi(file: File): Promise<number | null> {
  return readExif(file).then((m) => {
    if (!m.exif) return null;
    const x = m.exif['XResolution'] as string | undefined;
    if (!x) return null;
    const [num, den] = x.split('/').map(Number);
    if (!den) return null;
    return Math.round(num / den);
  });
}
