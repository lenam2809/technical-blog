'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({
  error,
  reset,
}: ErrorBoundaryProps): React.JSX.Element {
  React.useEffect(() => {
    console.error('[AppErrorBoundary]', error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <div
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--callout-symptom-border)] bg-[var(--callout-symptom-bg)] text-[var(--callout-symptom-border)]"
        aria-hidden="true"
      >
        <AlertOctagon className="h-6 w-6" />
      </div>

      <p className="mt-5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs font-medium text-[var(--text-muted)]">
        UNHANDLED_RUNTIME_ERROR
        {error.digest ? ` • digest:${error.digest}` : ''}
      </p>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
        Đã xảy ra sự cố không mong muốn khi hiển thị trang
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        Hệ thống gặp lỗi tạm thời trong quá trình kết xuất giao diện. Bạn có thể
        thử tải lại phân đoạn này hoặc quay về trang chủ.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Thử tải lại
        </button>

        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-[var(--border-strong)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Về Trang chủ
        </Link>
      </div>
    </div>
  );
}
