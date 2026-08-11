'use client';

import { createContext, useContext, useState } from 'react';
import { CommandPalette } from './CommandPalette';

type Ctx = { open: () => void; close: () => void; isOpen: boolean };
const CommandPaletteContext = createContext<Ctx>({ open: () => {}, close: () => {}, isOpen: false });

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <CommandPaletteContext.Provider
      value={{ open: () => setOpen(true), close: () => setOpen(false), isOpen }}
    >
      {children}
      {isOpen && <CommandPalette onClose={() => setOpen(false)} />}
    </CommandPaletteContext.Provider>
  );
}

export const useCommandPalette = () => useContext(CommandPaletteContext);
