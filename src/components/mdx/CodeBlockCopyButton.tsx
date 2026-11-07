'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

export interface CodeBlockCopyButtonProps {
  code: string;
}

export function CodeBlockCopyButton({
  code,
}: CodeBlockCopyButtonProps): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void handleCopy();
      }}
      aria-label={copied ? 'Đã sao chép mã nguồn' : 'Sao chép mã nguồn'}
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-800/80 px-2.5 font-mono text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-emerald-300" aria-live="polite">
            Đã sao chép
          </span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sao chép</span>
        </>
      )}
    </button>
  );
}
