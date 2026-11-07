import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Server, TrendingUp } from 'lucide-react';
import { getCategoryBySlug } from '@/lib/constants';
import type { PostSummary, PostType } from '@/types/post';

export interface PostCardProps {
  post: PostSummary;
  variant?: 'default' | 'featured';
}

const POST_TYPE_BADGE: Record<
  PostType,
  { label: string; bgVar: string; textVar: string }
> = {
  'post-mortem': {
    label: 'POST-MORTEM',
    bgVar: 'var(--badge-post-mortem-bg)',
    textVar: 'var(--badge-post-mortem-text)',
  },
  'deep-dive': {
    label: 'DEEP-DIVE',
    bgVar: 'var(--badge-deep-dive-bg)',
    textVar: 'var(--badge-deep-dive-text)',
  },
  reference: {
    label: 'REFERENCE',
    bgVar: 'var(--badge-reference-bg)',
    textVar: 'var(--badge-reference-text)',
  },
};

export function PostCard({
  post,
  variant = 'default',
}: PostCardProps): React.JSX.Element {
  const categoryMeta = getCategoryBySlug(post.category);
  const typeBadge = POST_TYPE_BADGE[post.postType];
  const isFeatured = variant === 'featured';
  const displayedEnvironments = post.environment?.slice(0, 3) ?? [];

  return (
    <article
      data-post-card={post.slug}
      className={[
        'group flex h-full flex-col justify-between rounded-xl border p-5 transition-colors sm:p-6',
        isFeatured
          ? 'border-[var(--border-strong)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/60 hover:bg-[var(--bg-elevated)]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]',
      ].join(' ')}
    >
      <div>
        {/* Hàng 1: Nhãn postType, Category & [BẢN NHÁP] */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide"
            style={{
              backgroundColor: typeBadge.bgVar,
              color: typeBadge.textVar,
            }}
          >
            {typeBadge.label}
          </span>

          <Link
            href={`/category/${post.category}`}
            prefetch={false}
            className="inline-flex items-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {categoryMeta?.shortLabel ?? post.category}
          </Link>

          {post.draft && (
            <span className="inline-flex items-center rounded-md border border-amber-500/50 bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
              [BẢN NHÁP]
            </span>
          )}
        </div>

        {/* Hàng 2: Tiêu đề dẫn tới /blog/[slug] */}
        <h3 className="mt-3.5 text-lg font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
          <Link
            href={`/blog/${post.slug}`}
            prefetch={false}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {post.title}
          </Link>
        </h3>

        {/* Hàng 3: Huy hiệu Impact nổi bật theo BR-02 */}
        {post.impact && (
          <div className="mt-3">
            <span className="inline-flex items-start gap-1.5 rounded-lg border border-[var(--accent-emerald)]/35 bg-[var(--accent-emerald)]/10 px-2.5 py-1.5 font-mono text-xs font-semibold leading-snug text-[var(--accent-emerald)]">
              <TrendingUp
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden={true}
              />
              <span>{post.impact}</span>
            </span>
          </div>
        )}

        {/* Hàng 4: Tóm tắt */}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {post.summary}
        </p>

        {/* Hàng 5: Thông số môi trường rút gọn */}
        {displayedEnvironments.length > 0 && (
          <ul
            aria-label="Môi trường kỹ thuật"
            className="mt-3.5 flex flex-wrap items-center gap-1.5"
          >
            {displayedEnvironments.map((envItem) => (
              <li
                key={envItem}
                className="inline-flex items-center gap-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]"
              >
                <Server
                  className="h-3 w-3 shrink-0 text-[var(--text-muted)]"
                  aria-hidden={true}
                />
                <span>{envItem}</span>
              </li>
            ))}
            {post.environment && post.environment.length > 3 && (
              <li className="font-mono text-[11px] text-[var(--text-muted)]">
                +{post.environment.length - 3}
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Chân thẻ: Tags + Ngày xuất bản & Thời gian đọc (BR-03) */}
      <div className="mt-5 space-y-3 border-t border-[var(--border-subtle)] pt-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              prefetch={false}
              className="rounded px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 font-mono text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
              <span>{post.readingTimeMinutes} phút đọc</span>
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            prefetch={false}
            aria-label={`Đọc bài viết: ${post.title}`}
            className="inline-flex items-center gap-1 rounded-sm font-medium text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="hidden sm:inline">Đọc</span>
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
              aria-hidden={true}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
