import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  Database,
  Layers,
  Rss,
  Server,
} from 'lucide-react';
import { CATEGORIES, SITE_CONFIG, type CategoryMeta } from '@/lib/constants';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';
import { ArchiveExplorer } from '@/components/blog/ArchiveExplorer';
import { FeaturedPosts } from '@/components/blog/FeaturedPosts';

const CATEGORY_ICONS: Record<
  CategoryMeta['slug'],
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  'dotnet-backend': Code2,
  'database-sql': Database,
  'system-architecture': Layers,
  'devops-modern-web': Server,
};

const CORE_STACK_PILLS = [
  '.NET Framework / .NET 8+',
  'ASP.NET Web API',
  'Oracle Database & PL/SQL',
  'Execution Plan & Deadlock',
  'Docker & CI/CD',
  'Next.js & TypeScript',
] as const;

function ArchiveSkeleton(): React.JSX.Element {
  return (
    <section
      aria-label="Đang tải kho bài viết kỹ thuật"
      className="mt-14 border-t border-[var(--border-subtle)] pt-12"
    >
      <div className="h-8 w-64 animate-pulse rounded-lg bg-[var(--bg-elevated)]" />
      <div className="mt-6 h-44 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]" />
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]" />
        <div className="h-64 animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]" />
      </div>
    </section>
  );
}

export default function HomePage(): React.JSX.Element {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts(3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Hero Section theo mục 5.2 PRD.md & mục 4.2 DESIGN.md */}
      <section aria-labelledby="hero-heading" className="max-w-4xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]">
          <span
            className="h-2 w-2 rounded-full bg-[var(--accent-emerald)]"
            aria-hidden="true"
          />
          <span>{SITE_CONFIG.author.role}</span>
        </p>

        <h1
          id="hero-heading"
          className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl lg:leading-[1.15]"
        >
          {SITE_CONFIG.title}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          {SITE_CONFIG.description}
        </p>

        <ul
          aria-label="Nhóm công nghệ trọng tâm"
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          {CORE_STACK_PILLS.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--text-secondary)]"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/about"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <span>Hồ sơ Năng lực &amp; Dịch vụ</span>
            <ArrowRight className="h-4 w-4" aria-hidden={true} />
          </Link>

          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Khám phá Case Studies</span>
          </a>

          <Link
            href="/rss.xml"
            prefetch={false}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Rss className="h-3.5 w-3.5" aria-hidden={true} />
            <span>RSS</span>
          </Link>

          <a
            href={SITE_CONFIG.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>GitHub</span>
          </a>
        </div>
      </section>

      {/* Featured Case Studies theo BR-02 */}
      <FeaturedPosts posts={featuredPosts} />

      {/* Bốn Chuyên mục Công nghệ chuẩn SEO */}
      <section
        aria-labelledby="categories-heading"
        className="mt-14 border-t border-[var(--border-subtle)] pt-12"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2
            id="categories-heading"
            className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
          >
            Bốn Chuyên Mục Công Nghệ Trọng Tâm
          </h2>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            4 domains • Post-mortem / Deep-dive / Reference
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug];
            const count = allPosts.filter(
              (post) => post.category === category.slug,
            ).length;

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                prefetch={false}
                className="group flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--accent-primary)]">
                      <Icon className="h-4 w-4" aria-hidden={true} />
                    </span>
                    <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                      {count} bài
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                    {category.label}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Archive Explorer đồng bộ URL theo BR-05 (Bọc trong Suspense để giữ '/' là 100% Static RSC) */}
      <React.Suspense fallback={<ArchiveSkeleton />}>
        <ArchiveExplorer initialPosts={allPosts} />
      </React.Suspense>
    </div>
  );
}
