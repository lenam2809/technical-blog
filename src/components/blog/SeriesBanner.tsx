import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, Layers } from 'lucide-react';
import type { PostSummary, SeriesInfo } from '@/types/post';

export interface SeriesBannerProps {
  series?: SeriesInfo;
  seriesPosts: readonly PostSummary[];
  currentSlug: string;
}

export function SeriesBanner({
  series,
  seriesPosts,
  currentSlug,
}: SeriesBannerProps): React.JSX.Element | null {
  if (!series) {
    return null;
  }

  const totalParts = Math.max(seriesPosts.length, series.order);

  return (
    <nav
      aria-label={`Chuỗi bài viết: ${series.name}`}
      className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Layers
            className="h-4 w-4 shrink-0 text-[var(--accent-primary)]"
            aria-hidden={true}
          />
          <span className="font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
            Chuỗi bài chuyên sâu
          </span>
        </div>
        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-0.5 font-mono text-xs font-medium text-[var(--text-secondary)]">
          Phần {series.order} / {totalParts}
        </span>
      </div>

      <p className="mt-3 text-base font-semibold tracking-tight text-[var(--text-primary)]">
        {series.name}
      </p>

      {seriesPosts.length > 0 && (
        <ol className="mt-3 space-y-2">
          {seriesPosts.map((item, idx) => {
            const partOrder = item.series?.order ?? idx + 1;
            const isCurrent = item.slug === currentSlug;

            if (isCurrent) {
              return (
                <li
                  key={item.slug}
                  aria-current="page"
                  className="flex items-start justify-between gap-3 rounded-lg border border-[var(--accent-primary)]/40 bg-[var(--bg-elevated)] px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-primary)]"
                      aria-hidden={true}
                    />
                    <span className="font-medium text-[var(--text-primary)]">
                      <span className="mr-1.5 font-mono text-xs text-[var(--accent-primary)]">
                        Phần {partOrder}:
                      </span>
                      {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 rounded bg-[var(--accent-primary)] px-2 py-0.5 font-mono text-[11px] font-medium text-white">
                    Đang đọc
                  </span>
                </li>
              );
            }

            return (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  prefetch={false}
                  className="group flex items-start justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-sm transition-colors hover:border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="min-w-0 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-primary)]">
                    <span className="mr-1.5 font-mono text-xs text-[var(--text-muted)]">
                      Phần {partOrder}:
                    </span>
                    {item.title}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-[var(--text-muted)]">
                    {item.readingTimeMinutes} phút
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
