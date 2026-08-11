/**
 * Tiny class-name combiner. Avoids pulling in the full `cn` from shadcn.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1) return `${bytes.toFixed(decimals)} B`;
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const idx = Math.min(i, units.length - 1);
  return `${(bytes / Math.pow(1024, idx)).toFixed(decimals)} ${units[idx]}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function pct(num: number, denom: number): number {
  if (!denom) return 0;
  return Math.round((num / denom) * 100);
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}
