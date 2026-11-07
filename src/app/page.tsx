import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Database, Layers, Server } from 'lucide-react';
import { CATEGORIES, SITE_CONFIG, type CategoryMeta } from '@/lib/constants';

const CATEGORY_ICONS: Record<CategoryMeta['slug'], React.ComponentType<{ className?: string }>> = {
  'dotnet-backend': Code2,
  'database-sql': Database,
  'system-architecture': Layers,
  'devops-modern-web': Server,
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section aria-labelledby="hero-heading" className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]">
          <span
            className="h-2 w-2 rounded-full bg-[var(--accent-emerald)]"
            aria-hidden="true"
          />
          {SITE_CONFIG.name}
        </p>

        <h1
          id="hero-heading"
          className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
        >
          {SITE_CONFIG.title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          {SITE_CONFIG.description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/about"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Hồ sơ Năng lực & Dịch vụ
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={SITE_CONFIG.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-secondary)] px-4 py-2.5 font-mono text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            GitHub Profile
          </a>
        </div>
      </section>

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

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug];
            return (
              <article
                key={category.slug}
                className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--accent-primary)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-xs text-[var(--text-muted)]">
                      {category.slug}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                    {category.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {category.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
