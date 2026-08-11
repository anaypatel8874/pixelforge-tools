import { describe, it, expect } from 'vitest';
import { formatBytes, clamp, pct, uid } from './utils';


describe('utils', () => {
  it('formatBytes handles B / KB / MB', () => {
    expect(formatBytes(0)).toMatch(/B/);
    expect(formatBytes(500)).toMatch(/B/);
    expect(formatBytes(2048)).toMatch(/KB/);
    expect(formatBytes(5 * 1024 * 1024)).toMatch(/MB/);
  });

  it('clamp clamps to range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it('pct computes percentage', () => {
    expect(pct(50, 100)).toBe(50);
    expect(pct(0, 0)).toBe(0);
  });

  it('uid returns unique strings', () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });
});
