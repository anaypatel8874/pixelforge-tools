/**
 * Provider-agnostic AI adapter.
 *
 * Tools call `aiProvider.enhance(file)` and don't care whether the work is
 * done locally (the fallback) or sent to OpenAI / Replicate (when configured).
 *
 * To wire a real provider, set OPENAI_API_KEY (or REPLICATE_API_TOKEN) in env
 * and implement the corresponding branch in `dispatchRemote`.
 */

export interface AIProvider {
  enhance(file: File): Promise<Blob>;
  upscale(file: File, factor: number): Promise<Blob>;
  restore(file: File): Promise<Blob>;
}

class LocalAIProvider implements AIProvider {
  async enhance(file: File): Promise<Blob> {
    const mod = await import('./filters');
    return mod.enhance(file);
  }
  async upscale(file: File, factor: number): Promise<Blob> {
    const mod = await import('./resize');
    return mod.resizeImage(file, {
      width: 0,
      height: 0,
      fit: 'stretch',
      type: 'image/png',
    }).then(async () => {
      // Local fallback: re-encode at higher pixel count. Not real super-res.
      const core = await import('./core');
      const img = await core.fileToImage(file);
      const canvas = core.makeCanvas(Math.round(img.width * factor), Math.round(img.height * factor));
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return core.canvasToBlob(canvas, { type: 'image/png' });
    });
  }
  async restore(file: File): Promise<Blob> {
    // Local fallback: combination of denoise + sharpen + enhance.
    const { denoise, adjust, enhance } = await import('./filters');
    const core = await import('./core');
    const tmp = await denoise(file, 1);
    const blob = new Blob([tmp], { type: 'image/png' });
    const restored = await enhance(new File([blob], 'restored.png', { type: 'image/png' }));
    return restored;
  }
}

async function dispatchRemote(action: string, file: File): Promise<Blob | null> {
  const provider = process.env.AI_PROVIDER ?? '';
  if (!provider) return null;
  try {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/images/variations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: (() => {
          const f = new FormData();
          f.append('image', file);
          f.append('n', '1');
          f.append('size', '1024x1024');
          return f;
        })(),
      });
      if (!res.ok) throw new Error('openai failed');
      const json: any = await res.json();
      const url = json?.data?.[0]?.url;
      if (!url) return null;
      const r = await fetch(url);
      return await r.blob();
    }
  } catch (e) {
    console.warn('AI provider failed, falling back to local:', e);
  }
  return null;
}

class SmartAIProvider implements AIProvider {
  async enhance(file: File) {
    const remote = await dispatchRemote('enhance', file);
    if (remote) return remote;
    return new LocalAIProvider().enhance(file);
  }
  async upscale(file: File, factor: number) {
    const remote = await dispatchRemote('upscale', file);
    if (remote) return remote;
    return new LocalAIProvider().upscale(file, factor);
  }
  async restore(file: File) {
    const remote = await dispatchRemote('restore', file);
    if (remote) return remote;
    return new LocalAIProvider().restore(file);
  }
}

export const aiProvider: AIProvider = new SmartAIProvider();
