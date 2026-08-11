import { describe, it, expect } from 'vitest';
import { searchTools, getTool, ALL_TOOLS, CATEGORIES } from './tools';

describe('tools registry', () => {
  it('has unique slugs', () => {
    const slugs = ALL_TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every category page has at least one tool', () => {
    for (const c of CATEGORIES) {
      const tools = ALL_TOOLS.filter((t) => t.category === c.slug);
      expect(tools.length, `category ${c.slug} should have tools`).toBeGreaterThan(0);
    }
  });

  it('search by "kb" returns compression tools', () => {
    const hits = searchTools('kb');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((t) => t.slug.startsWith('compress-to'))).toBe(true);
  });

  it('search by "passport" returns passport tools', () => {
    const hits = searchTools('passport');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((t) => t.slug.includes('passport'))).toBe(true);
  });

  it('search by "signature" returns signature tools', () => {
    const hits = searchTools('signature');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((t) => t.slug.includes('signature'))).toBe(true);
  });

  it('every tool has a category that exists', () => {
    const valid = new Set(CATEGORIES.map((c) => c.slug));
    for (const t of ALL_TOOLS) {
      expect(valid.has(t.category), `tool ${t.slug} has unknown category`).toBe(true);
    }
  });

  it('getTool returns the right tool', () => {
    expect(getTool('rotate-image')?.title).toBe('Rotate Image');
  });
});
