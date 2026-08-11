'use client';

import { useEffect, useState } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

export function ImagePreview({
  src,
  alt,
  loading,
  error,
  className,
}: {
  src?: string;
  alt?: string;
  loading?: boolean;
  error?: string;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    setImgError(false);
  }, [src]);

  if (loading) {
    return (
      <div className={`flex aspect-video items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-alt))] ${className ?? ''}`}>
        <Loader2 className="h-6 w-6 animate-spin text-[rgb(var(--fg-muted))]" />
      </div>
    );
  }
  if (error || imgError || !src) {
    return (
      <div className={`flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--bg-alt))]/40 text-[rgb(var(--fg-muted))] ${className ?? ''}`}>
        <ImageOff className="h-6 w-6" />
        <p className="text-sm">{error || 'No image yet'}</p>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || 'preview'}
      onError={() => setImgError(true)}
      className={`max-h-[60vh] w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-alt))] object-contain ${className ?? ''}`}
    />
  );
}
