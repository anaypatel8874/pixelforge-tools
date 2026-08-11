'use client';

import { useState } from 'react';
import { Wand2, Download, RotateCcw } from 'lucide-react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { BeforeAfterSlider } from '@/components/tool/BeforeAfterSlider';
import { ToolLayout, Controls } from '@/components/tool/ToolLayout';
import { useProcessing } from '@/components/tool/useBlob';
import { useToast } from '@/components/ui/Toaster';
import { formatBytes } from '@/lib/utils';
import { downloadBlob, suggestFilename } from '@/lib/download';
import type { Tool } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ControlProps {
  state: ReturnType<typeof useProcessing>['state'];
  setProcessing: (b: boolean) => void;
  setOutput: (b: Blob, extra?: { width?: number; height?: number }) => void;
  setError: (m: string) => void;
}

export interface SingleToolProps {
  tool: Tool;
  related?: { slug: string; title: string }[];
  serverSide?: boolean;
  showSlider?: boolean;
  downloadSuffix: string;
  downloadExt?: string;
  accepts?: string;
  controls: (ctx: ControlProps) => React.ReactNode;
  run: (
    file: File,
    ctx: { setOutput: (b: Blob, extra?: { width?: number; height?: number }) => void; setProcessing: (b: boolean) => void; signal: { aborted: boolean }; signalRef: { current: boolean } }
  ) => Promise<void> | void;
  /** When true, the layout hides the standard "Process" button — controls include the run button. */
  noAutoRun?: boolean;
}

export function SingleTool({
  tool,
  related,
  serverSide,
  showSlider,
  downloadSuffix,
  downloadExt = 'png',
  controls,
  run,
  noAutoRun,
}: SingleToolProps) {
  const proc = useProcessing();
  const { state } = proc;
  const { push } = useToast();
  const [error, setError] = useState<string | undefined>();
  const [ctxAttached, setCtxAttached] = useState(false);

  const handleRun = async () => {
    if (!state.file) return;
    const signalRef = { current: false };
    try {
      proc.setProcessing(true);
      setError(undefined);
      await run(state.file, {
        setOutput: proc.setOutput,
        setProcessing: proc.setProcessing,
        signal: { aborted: false },
        signalRef,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Processing failed.';
      setError(message);
      push('error', message);
    } finally {
      proc.setProcessing(false);
    }
  };

  const onDownload = () => {
    if (!state.output || !state.file) return;
    const filename = suggestFilename(state.file.name, downloadSuffix, downloadExt);
    downloadBlob(state.output, filename);
    push('success', `Downloaded ${filename}`);
  };

  return (
    <ToolLayout
      tool={tool}
      related={related}
      privacyNotice={serverSide ? 'server' : 'client'}
      onReset={proc.reset}
      error={error}
      dirty={state.dirty}
      processing={state.processing}
    >
      {!state.file && (
        <ImageUploader
          onError={(m) => {
            setError(m);
            push('error', m);
          }}
          onFile={(files) => proc.loadFile(files[0])}
        />
      )}

      {state.file && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-3">
            {showSlider && state.outputUrl && state.originalUrl ? (
              <BeforeAfterSlider before={state.originalUrl} after={state.outputUrl} />
            ) : (
              <ImagePreview
                src={state.outputUrl ?? state.originalUrl}
                loading={state.processing}
                alt={state.file.name}
              />
            )}
            {state.file && (
              <p className="text-xs text-[rgb(var(--fg-muted))]">
                <strong>{state.file.name}</strong> · {state.originalWidth}×{state.originalHeight}px ·{' '}
                {formatBytes(state.file.size)}
                {state.output && (
                  <>
                    {' → '}
                    <strong>{formatBytes(state.output.size)}</strong>{' '}
                    ({Math.round((1 - state.output.size / state.file.size) * 100)}% {state.output.size < state.file.size ? 'smaller' : 'larger'})
                  </>
                )}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {!noAutoRun && (
                <button
                  className="btn-primary"
                  disabled={state.processing}
                  onClick={handleRun}
                >
                  <Wand2 className="h-4 w-4" /> Process
                </button>
              )}
              <button
                className="btn-secondary"
                disabled={state.processing}
                onClick={onDownload}
              >
                <Download className="h-4 w-4" /> Download
              </button>
              <button
                className="btn-ghost"
                onClick={proc.reset}
                disabled={state.processing}
                aria-label="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Controls>
            {controls({
              state,
              setProcessing: proc.setProcessing,
              setOutput: proc.setOutput,
              setError,
            })}
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}
