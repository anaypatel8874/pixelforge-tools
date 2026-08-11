'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fileToImage } from '@/lib/image/core';
import { downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';

export interface ProcessState {
  file?: File;
  originalUrl?: string;
  originalWidth?: number;
  originalHeight?: number;
  output?: Blob;
  outputUrl?: string;
  outputWidth?: number;
  outputHeight?: number;
  dirty: boolean;
  processing: boolean;
}

/**
 * Manages the lifecycle of one input file + one output blob for a tool.
 *
 * On unmount, every Object URL we created is revoked so we don't leak memory.
 */
export function useProcessing() {
  const [state, setState] = useState<ProcessState>({ dirty: false, processing: false });
  const urls = useRef<string[]>([]);
  const { push } = useToast();

  const track = useCallback((url: string) => {
    urls.current.push(url);
    return url;
  }, []);

  const loadFile = useCallback(async (file: File) => {
    try {
      const img = await fileToImage(file);
      const url = URL.createObjectURL(file);
      track(url);
      setState({
        file,
        originalUrl: url,
        originalWidth: img.width,
        originalHeight: img.height,
        dirty: false,
        processing: false,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not load image.';
      push('error', message);
    }
  }, [push, track]);

  const setOutput = useCallback(
    (blob: Blob, extra?: { width?: number; height?: number }) => {
      const url = URL.createObjectURL(blob);
      track(url);
      setState((s) => ({
        ...s,
        output: blob,
        outputUrl: url,
        outputWidth: extra?.width ?? s.outputWidth,
        outputHeight: extra?.height ?? s.outputHeight,
        dirty: true,
      }));
    },
    [track]
  );

  const reset = useCallback(() => {
    setState({ dirty: false, processing: false });
  }, []);

  const setProcessing = useCallback((v: boolean) => {
    setState((s) => ({ ...s, processing: v }));
  }, []);

  const download = useCallback(
    (suffix = 'processed', ext = 'png') => {
      if (!state.output || !state.file) return;
      const filename = suggestFilename(state.file.name, suffix, ext);
      downloadBlob(state.output, filename);
      push('success', `Downloaded ${filename}`);
    },
    [state, push]
  );

  useEffect(() => {
    return () => {
      urls.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  return { state, loadFile, setOutput, reset, setProcessing, download };
}
