/**
 * Type definitions used across tools.
 *
 * Keep this file authoritative: components import these and never re-declare them.
 */

export type CategorySlug =
  | 'basic'
  | 'effects'
  | 'ai'
  | 'resize'
  | 'gov'
  | 'social'
  | 'convert'
  | 'pdf'
  | 'compress'
  | 'size'
  | 'dpi'
  | 'signature'
  | 'gif'
  | 'metadata'
  | 'collage'
  | 'advanced';

export type ToolStatus = 'ready' | 'coming-soon';

export interface Category {
  slug: CategorySlug;
  title: string;
  description: string;
  icon: string; // lucide icon name
  accent: string;
}

export interface Tool {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: CategorySlug;
  icon: string; // lucide icon name
  keywords: string[];
  popular?: boolean;
  status: ToolStatus;
  /** Does this tool accept multiple images for batch processing? */
  acceptsBatch?: boolean;
  /** Tools that need server-side processing. Defaults to client. */
  serverSide?: boolean;
  /** Tips shown at the bottom of tool pages. */
  tips?: string[];
  /** FAQ items rendered under each tool page. */
  faq?: { q: string; a: string }[];
}

export interface UploadedImage {
  id: string;
  file: File;
  /** Object URL; managed via `revokeObjectURL` after use. */
  url: string;
  width: number;
  height: number;
  size: number;
  name: string;
}

export interface ProcessResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  mime: string;
}
