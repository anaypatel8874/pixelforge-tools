'use client';

import {
  Crop,
  Sparkles,
  Wand2,
  Maximize2,
  IdCard,
  Share2,
  Repeat,
  FileText,
  Minimize2,
  Scaling,
  Printer,
  PenLine,
  Film,
  Info,
  LayoutGrid,
  Sliders,
  Wrench,
  LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  Crop,
  Sparkles,
  Wand2,
  Maximize2,
  IdCard,
  Share2,
  Repeat,
  FileText,
  Minimize2,
  Scaling,
  Printer,
  PenLine,
  Film,
  Info,
  LayoutGrid,
  Sliders,
  Wrench,
};

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Wrench;
  return <Icon className={className} />;
}
