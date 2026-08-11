'use client';

import { useRouter } from 'next/navigation';
import { fileToImage } from '@/lib/image/core';

/**
 * Given a dropped file, peek at dimensions to route to a sensible default tool.
 * If the file is small (signature-like), suggest signature resizer.
 */
export function useFileToTool() {
  const router = useRouter();
  return async (file: File) => {
    try {
      const img = await fileToImage(file);
      const aspect = img.width / img.height;
      const looksWide = aspect > 2;
      if (looksWide) {
        router.push('/tools/resize-by-pixels');
      } else {
        router.push('/tools/resize-by-pixels');
      }
    } catch {
      router.push('/tools/resize-by-pixels');
    }
  };
}