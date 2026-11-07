import * as React from 'react';
import Link from 'next/link';
import { CATEGORIES, SITE_CONFIG } from '@/lib/constants';

export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
              {SITE_CONFIG.author.name}
            </p>
            <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
              {SITE_CONFIG.author.role}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div className="md:col-span-4">
            <h2 className="font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Chuyên mục kỹ thuật
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    prefetch={false}
                    className="rounded-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Liên kết & Tích hợp
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  prefetch={false}
                  className="rounded-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Hồ sơ Năng lực & Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/rss.xml"
                  prefetch={false}
                  className="rounded-sm font-mono text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  RSS Feed (/rss.xml)
                </Link>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  GitHub (@namlvThienHoang)
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.author.email}`}
                  className="rounded-sm font-mono text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {SITE_CONFIG.author.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center">
          <p>
            © {currentYear} {SITE_CONFIG.author.name}. Xây dựng với Next.js &
            TypeScript Strict.
          </p>
          <p>
            Mã nguồn minh họa theo{' '}
            <span className="font-mono text-[var(--text-secondary)]">
              MIT License
            </span>
            ; nội dung bài viết & sơ đồ theo{' '}
            <span className="font-mono text-[var(--text-secondary)]">
              CC BY-NC-SA 4.0
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
