'use client';

import * as React from 'react';
import { ListTree } from 'lucide-react';
import type { TocItem } from '@/types/post';

export interface TableOfContentsProps {
  items: readonly TocItem[];
}

export function TableOfContents({
  items,
}: TableOfContentsProps): React.JSX.Element | null {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id ?? '');
  const manualSelectionRef = React.useRef<{ id: string; until: number } | null>(
    null,
  );

  React.useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const initialHash = decodeURIComponent(
      window.location.hash.replace(/^#/, ''),
    );
    const matchingInitial = items.find((item) => item.id === initialHash);
    setActiveId(matchingInitial ? matchingInitial.id : items[0].id);
  }, [items]);

  React.useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) {
      return;
    }

    const resolveCurrentHeadingId = (): string => {
      const activationThresholdPx = 128;
      let candidateId = headingElements[0].id;

      for (const headingEl of headingElements) {
        if (headingEl.getBoundingClientRect().top <= activationThresholdPx) {
          candidateId = headingEl.id;
        } else {
          break;
        }
      }

      return candidateId;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          manualSelectionRef.current &&
          Date.now() < manualSelectionRef.current.until
        ) {
          return;
        }

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
          return;
        }

        setActiveId(resolveCurrentHeadingId());
      },
      {
        rootMargin: '-96px 0px -62% 0px',
        threshold: [0, 1],
      },
    );

    for (const element of headingElements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const handleTocClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ): void => {
    const targetElement = document.getElementById(id);
    if (!targetElement) {
      return;
    }

    event.preventDefault();
    manualSelectionRef.current = { id, until: Date.now() + 850 };
    setActiveId(id);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      aria-label="Mục lục bài viết"
      className="max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4"
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
        <ListTree className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
        <span>Mục lục bài viết</span>
      </div>

      <ul className="space-y-1 border-l border-[var(--border-subtle)] text-sm">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indentClass = item.level === 3 ? 'pl-6 text-[13px]' : 'pl-3.5';

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => handleTocClick(event, item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={[
                  '-ml-px block border-l-2 py-1.5 pr-2 leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
                  indentClass,
                  isActive
                    ? 'border-[var(--accent-primary)] font-medium text-[var(--accent-primary)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
