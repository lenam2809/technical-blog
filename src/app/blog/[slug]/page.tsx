import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { SITE_CONFIG, getCategoryBySlug } from '@/lib/constants';
import { compileMdxContent } from '@/lib/mdx';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { buildArticleJsonLd, buildCanonicalUrl } from '@/lib/seo';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { EnvironmentBadges } from '@/components/blog/EnvironmentBadges';
import { OutdatedBanner } from '@/components/blog/OutdatedBanner';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { SeriesBanner } from '@/components/blog/SeriesBanner';
import { TableOfContents } from '@/components/blog/TableOfContents';
import type { PostType } from '@/types/post';

export const dynamicParams = false;

interface BlogPostRouteProps {
  params: Promise<{ slug: string }>;
}

const POST_TYPE_DISPLAY: Record<
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

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Không tìm thấy bài viết',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = buildCanonicalUrl(post.slug, post.canonicalUrl);
  const categoryMeta = getCategoryBySlug(post.category);
  const publishedIso = `${post.publishedAt}T00:00:00.000Z`;
  const modifiedIso = `${post.updatedAt ?? post.publishedAt}T00:00:00.000Z`;

  return {
    title: post.title,
    description: post.summary,
    keywords: [...post.tags],
    authors: [
      {
        name: SITE_CONFIG.author.name,
        url: `${SITE_CONFIG.url}/about`,
      },
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: post.title,
      description: post.summary,
      publishedTime: publishedIso,
      modifiedTime: modifiedIso,
      authors: [SITE_CONFIG.author.name],
      section: categoryMeta?.label ?? post.category,
      tags: [...post.tags],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({
  params,
}: BlogPostRouteProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [mdxContent] = await Promise.all([compileMdxContent(post.content)]);
  const canonicalUrl = buildCanonicalUrl(post.slug, post.canonicalUrl);
  const articleJsonLd = buildArticleJsonLd(post);
  const safeJsonLd = JSON.stringify(articleJsonLd).replace(/</g, '\\u003c');

  const categoryMeta = getCategoryBySlug(post.category);
  const postTypeMeta = POST_TYPE_DISPLAY[post.postType];
  const hasEnvironment = Boolean(post.environment && post.environment.length > 0);
  const hasBanners = post.isOutdated || Boolean(post.series);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

      {/* Header bài viết theo mục 4.1 docs/DESIGN.md */}
      <header className="border-b border-[var(--border-subtle)] pb-8">
        {/* Hàng 1: Category + postType + [BẢN NHÁP] */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/category/${post.category}`}
            prefetch={false}
            className="inline-flex items-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {categoryMeta?.label ?? post.category}
          </Link>

          <span
            className="inline-flex items-center rounded-md px-2.5 py-1 font-mono text-xs font-semibold tracking-wide"
            style={{
              backgroundColor: postTypeMeta.bgVar,
              color: postTypeMeta.textVar,
            }}
          >
            {postTypeMeta.label}
          </span>

          {post.draft && (
            <span className="inline-flex items-center rounded-md border border-amber-500/50 bg-amber-500/15 px-2.5 py-1 font-mono text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400">
              [BẢN NHÁP]
            </span>
          )}
        </div>

        {/* Hàng 2: Tiêu đề h1 */}
        <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl sm:leading-[1.2]">
          {post.title}
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          {post.summary}
        </p>

        {/* Hàng 3: Ngày xuất bản, Ngày cập nhật, Thời gian đọc (BR-03) */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-[var(--text-muted)] sm:text-[13px]">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
            <span>
              Đăng ngày{' '}
              <time
                dateTime={post.publishedAt}
                className="font-medium text-[var(--text-secondary)]"
              >
                {post.publishedAt}
              </time>
            </span>
          </span>

          {post.updatedAt && (
            <span>
              • Cập nhật{' '}
              <time
                dateTime={post.updatedAt}
                className="font-medium text-[var(--text-secondary)]"
              >
                {post.updatedAt}
              </time>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
            <span className="font-medium text-[var(--text-secondary)]">
              {post.readingTimeMinutes} phút đọc
            </span>
          </span>
        </div>

        {/* Hàng 4: Huy hiệu Impact & Environment Badges */}
        {(post.impact || hasEnvironment) && (
          <div className="mt-5 space-y-3">
            {post.impact && (
              <div>
                <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-emerald)]/35 bg-[var(--accent-emerald)]/10 px-3 py-1.5 font-mono text-xs font-semibold text-[var(--accent-emerald)] sm:text-[13px]">
                  <TrendingUp
                    className="h-4 w-4 shrink-0"
                    aria-hidden={true}
                  />
                  <span>Tác động thực tế: {post.impact}</span>
                </span>
              </div>
            )}

            <EnvironmentBadges environments={post.environment} />
          </div>
        )}

        {/* Hàng 5: OutdatedBanner & SeriesBanner */}
        {hasBanners && (
          <div className="mt-6 space-y-4">
            <OutdatedBanner
              isOutdated={post.isOutdated}
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
              hasEnvironment={hasEnvironment}
            />
            <SeriesBanner
              series={post.series}
              seriesPosts={post.seriesPosts}
              currentSlug={post.slug}
            />
          </div>
        )}
      </header>

      {/* Thân bài viết: Lưới 2 cột trên Desktop (740px nội dung + 260px Sticky TOC) */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,740px)_260px] lg:justify-between lg:gap-12">
        <article className="min-w-0">
          <div className="max-w-none">{mdxContent}</div>

          {/* Danh mục Thẻ kiểm soát (AllowedTag) */}
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-6">
            <span className="mr-1 font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Thẻ kỹ thuật:
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                prefetch={false}
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <AuthorCard canonicalUrl={canonicalUrl} articleTitle={post.title} />
        </article>

        <aside
          aria-label="Thanh bên mục lục"
          className="hidden lg:block"
        >
          <div className="sticky top-24">
            <TableOfContents items={post.toc} />
          </div>
        </aside>
      </div>

      {/* Chân trang: Tối đa 3 bài viết liên quan theo BR-04 */}
      <RelatedPosts posts={post.relatedPosts} />
    </div>
  );
}
