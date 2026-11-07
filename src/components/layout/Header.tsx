import * as React from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Header(): React.JSX.Element {
  return (
    <header className="header-backdrop sticky top-0 z-40 border-b border-[var(--border-subtle)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-2.5 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--accent-primary)] transition-colors group-hover:border-[var(--border-strong)] group-hover:bg-[var(--bg-elevated)]">
            <Terminal className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold tracking-tight text-[var(--text-primary)] sm:text-base">
              {SITE_CONFIG.author.name}
            </span>
            <span className="hidden font-mono text-[11px] text-[var(--text-muted)] sm:block">
              engineering.notes
            </span>
          </span>
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="flex shrink-0 items-center gap-1 sm:gap-2"
        >
          <Link
            href="/"
            className="rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-3"
          >
            Bài viết
          </Link>
          <Link
            href="/about"
            prefetch={false}
            className="rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-3"
          >
            Hồ sơ
          </Link>
          <a
            href={SITE_CONFIG.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md px-3 py-1.5 font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:inline-flex"
          >
            GitHub
          </a>
          <div className="ml-1 pl-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
