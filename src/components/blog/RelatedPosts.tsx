import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { getCategoryBySlug } from '@/lib/constants';
import type { PostSummary, PostType } from '@/types/post';

export interface RelatedPostsProps {
  posts: readonly PostSummary[];
}

const POST_TYPE_BADGE_STYLES: Record<
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

export function RelatedPosts({
  posts,
}: RelatedPostsProps): React.JSX.Element | null {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-16 border-t border-[var(--border-subtle)] pt-12"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="related-posts-heading"
          className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
        >
          Bài viết kỹ thuật liên quan
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post) => {
          const categoryMeta = getCategoryBySlug(post.category);
          const badgeStyle = POST_TYPE_BADGE_STYLES[post.postType];

          return (
            <article
              key={post.slug}
              className="group flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: badgeStyle.bgVar,
                      color: badgeStyle.textVar,
                    }}
                  >
                    {badgeStyle.label}
                  </span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {categoryMeta?.shortLabel ?? post.category}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                  <Link
                    href={`/blog/${post.slug}`}
                    prefetch={false}
                    className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {post.summary}
                </p>

                {post.impact && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--accent-emerald)]/30 bg-[var(--accent-emerald)]/10 px-2.5 py-1 font-mono text-xs font-medium text-[var(--accent-emerald)]">
                    <TrendingUp
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden={true}
                    />
                    <span className="line-clamp-1">{post.impact}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 font-mono text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                  <span aria-hidden="true">•</span>
                  <span>{post.readingTimeMinutes} phút đọc</span>
                </div>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent-primary)]"
                  aria-hidden={true}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
