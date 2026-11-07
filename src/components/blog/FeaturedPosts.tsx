import * as React from 'react';
import { Award } from 'lucide-react';
import { PostCard } from '@/components/blog/PostCard';
import type { PostSummary } from '@/types/post';

export interface FeaturedPostsProps {
  posts: readonly PostSummary[];
}

export function FeaturedPosts({
  posts,
}: FeaturedPostsProps): React.JSX.Element | null {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      id="case-studies"
      aria-labelledby="featured-posts-heading"
      className="mt-14 scroll-mt-20 border-t border-[var(--border-subtle)] pt-12"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[var(--accent-emerald)] uppercase">
            <Award className="h-4 w-4 shrink-0" aria-hidden={true} />
            <span>Featured Engineering Case Studies</span>
          </div>
          <h2
            id="featured-posts-heading"
            className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
          >
            Case Studies &amp; Bài viết Tiêu biểu
          </h2>
        </div>

        <p className="font-mono text-xs text-[var(--text-muted)]">
          Số liệu đo kiểm thực tế từ môi trường Production / Staging
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} variant="featured" />
        ))}
      </div>
    </section>
  );
}
