'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn, uid } from '@/lib/utils';

type Toast = { id: string; tone: 'success' | 'error' | 'info'; message: string };
type Ctx = { push: (tone: Toast['tone'], message: string) => void };
const ToastContext = createContext<Ctx>({ push: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((tone: Toast['tone'], message: string) => {
    const id = uid('toast');
    setToasts((t) => [...t, { id, tone, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto card flex items-center gap-3 px-3 py-2.5 text-sm shadow-md animate-slide-up',
                t.tone === 'success' && 'border-emerald-500/40',
                t.tone === 'error' && 'border-red-500/40',
                t.tone === 'info' && 'border-brand-500/40'
              )}
            >
              {t.tone === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {t.tone === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
              {t.tone === 'info' && <Info className="h-4 w-4 text-brand-500" />}
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/**
 * Bare rendered-only component used in layout.tsx so `useToast()` works
 * across the tree.
 */
export function Toaster() {
  return null;
}
