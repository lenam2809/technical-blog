import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--accent-primary)]">
        <FileQuestion className="h-6 w-6" aria-hidden="true" />
      </div>

      <p className="mt-5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs font-medium text-[var(--text-muted)]">
        HTTP 404 — RESOURCE_NOT_FOUND
      </p>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
        Không tìm thấy trang hoặc bài viết kỹ thuật
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        Đường dẫn bạn vừa truy cập không tồn tại, đã được cập nhật sang địa chỉ
        mới hoặc bài viết hiện đang ở trạng thái bản nháp nội bộ.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Quay về Trang chủ
        </Link>
      </div>
    </div>
  );
}
