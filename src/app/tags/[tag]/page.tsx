import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Tag } from 'lucide-react';
import { ALLOWED_TAGS, SITE_CONFIG } from '@/lib/constants';
import { getAllPosts, getPostsByTag } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { AllowedTagSchema } from '@/types/post';

export const dynamicParams = false;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams(): Array<{ tag: string }> {
  return ALLOWED_TAGS.map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const parsed = AllowedTagSchema.safeParse(tag);

  if (!parsed.success) {
    return {
      title: 'Không tìm thấy thẻ kỹ thuật',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const validTag = parsed.data;
  const posts = getPostsByTag(validTag);
  const canonicalUrl = `${SITE_CONFIG.url.replace(/\/+$/, '')}/tags/${validTag}`;
  const description = `Tổng hợp bài viết thực chiến, phân tích sự cố (Post-mortem) và sổ tay kỹ thuật gắn thẻ #${validTag} bởi ${SITE_CONFIG.author.name}.`;

  return {
    title: `Thẻ kỹ thuật #${validTag}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: posts.length > 0,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: `Bài viết gắn thẻ #${validTag} | ${SITE_CONFIG.author.name}`,
      description,
    },
  };
}

export default async function TagPage({
  params,
}: TagPageProps): Promise<React.JSX.Element> {
  const { tag } = await params;
  const parsed = AllowedTagSchema.safeParse(tag);

  if (!parsed.success) {
    notFound();
  }

  const validTag = parsed.data;
  const posts = getPostsByTag(validTag);
  const allPosts = getAllPosts();

  // Lấy danh sách các thẻ đang có bài xuất bản để tiện chuyển đổi nhanh
  const activeTags = ALLOWED_TAGS.filter((candidate) =>
    allPosts.some((post) => post.tags.includes(candidate)),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Điều hướng quay lại">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex items-center gap-1.5 rounded-md font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden={true} />
          <span>Quay về Kho bài viết &amp; Bộ lọc</span>
        </Link>
      </nav>

      <header className="mt-6 border-b border-[var(--border-subtle)] pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--accent-primary)]">
          <Tag className="h-3.5 w-3.5" aria-hidden={true} />
          <span>Controlled Tag Vocabulary</span>
        </div>

        <h1 className="mt-4 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          #{validTag}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          Danh sách các báo cáo sự cố, phân tích chuyên sâu và cấu hình tham
          chiếu liên quan trực tiếp tới chủ đề{' '}
          <span className="font-mono font-semibold text-[var(--text-primary)]">
            #{validTag}
          </span>
          .
        </p>

        <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">
          Tìm thấy{' '}
          <span className="font-semibold text-[var(--text-primary)]">
            {posts.length}
          </span>{' '}
          bài viết đã xuất bản
        </p>

        {activeTags.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {activeTags.map((item) => {
              const isCurrent = item === validTag;
              return (
                <Link
                  key={item}
                  href={`/tags/${item}`}
                  prefetch={false}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={[
                    'rounded-md border px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isCurrent
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] font-semibold text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  #{item}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {posts.length > 0 ? (
        <section aria-label={`Bài viết gắn thẻ #${validTag}`} className="mt-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <section
          role="status"
          className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)] px-6 py-14 text-center"
        >
          <p className="font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
            #{validTag}
          </p>
          <h2 className="mt-2 text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Chưa có bài viết xuất bản gắn thẻ #{validTag}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Thẻ này nằm trong danh mục từ vựng kiểm soát chuẩn của hệ thống và
            sẽ tự động cập nhật ngay khi bài viết mới hoàn tất kiểm duyệt ẩn
            danh hóa.
          </p>
          <Link
            href="/#archive-explorer"
            prefetch={false}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden={true} />
            <span>Tra cứu các bài viết hiện có</span>
          </Link>
        </section>
      )}
    </div>
  );
}
