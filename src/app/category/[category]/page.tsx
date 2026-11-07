import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FolderKanban } from 'lucide-react';
import {
  CATEGORIES,
  SITE_CONFIG,
  getCategoryBySlug,
} from '@/lib/constants';
import { getPostsByCategory } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { CategorySchema } from '@/types/post';

export const dynamicParams = false;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams(): Array<{ category: string }> {
  return CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const parsed = CategorySchema.safeParse(category);
  const categoryMeta = parsed.success
    ? getCategoryBySlug(parsed.data)
    : undefined;

  if (!parsed.success || !categoryMeta) {
    return {
      title: 'Không tìm thấy chuyên mục',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const posts = getPostsByCategory(parsed.data);
  const canonicalUrl = `${SITE_CONFIG.url.replace(/\/+$/, '')}/category/${categoryMeta.slug}`;

  return {
    title: `Chuyên mục: ${categoryMeta.label}`,
    description: categoryMeta.description,
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
      title: `${categoryMeta.label} | ${SITE_CONFIG.author.name}`,
      description: categoryMeta.description,
    },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps): Promise<React.JSX.Element> {
  const { category } = await params;
  const parsed = CategorySchema.safeParse(category);
  const categoryMeta = parsed.success
    ? getCategoryBySlug(parsed.data)
    : undefined;

  if (!parsed.success || !categoryMeta) {
    notFound();
  }

  const posts = getPostsByCategory(parsed.data);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Điều hướng quay lại">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex items-center gap-1.5 rounded-md font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden={true} />
          <span>Tất cả bài viết kỹ thuật</span>
        </Link>
      </nav>

      <header className="mt-6 border-b border-[var(--border-subtle)] pb-8">
        <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--accent-primary)]">
          <FolderKanban className="h-3.5 w-3.5" aria-hidden={true} />
          <span>{categoryMeta.slug}</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          {categoryMeta.label}
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
          {categoryMeta.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Tổng cộng{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {posts.length}
            </span>{' '}
            bài viết đã xuất bản
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((item) => {
              const isCurrent = item.slug === categoryMeta.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  prefetch={false}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={[
                    'rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isCurrent
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {item.shortLabel}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {posts.length > 0 ? (
        <section aria-label={`Danh sách bài viết thuộc ${categoryMeta.label}`} className="mt-10">
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
            Đang biên tập nội dung
          </p>
          <h2 className="mt-2 text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Chuyên mục này chưa có bài viết xuất bản công khai
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Các bài phân tích chuyên sâu thuộc miền {categoryMeta.shortLabel}{' '}
            đang trong quá trình rà soát ẩn danh hóa trước khi xuất bản.
          </p>
          <Link
            href="/"
            prefetch={false}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden={true} />
            <span>Khám phá các chuyên mục khác</span>
          </Link>
        </section>
      )}
    </div>
  );
}
