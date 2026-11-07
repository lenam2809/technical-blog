'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ALLOWED_TAGS, CATEGORIES } from '@/lib/constants';
import { filterPosts, parseFilterParams } from '@/lib/filters';
import { PostCard } from '@/components/blog/PostCard';
import type {
  AllowedTag,
  Category,
  PostFilterCriteria,
  PostSummary,
  PostType,
} from '@/types/post';

export interface ArchiveExplorerProps {
  initialPosts: readonly PostSummary[];
}

const POST_TYPE_OPTIONS: ReadonlyArray<{ value: PostType; label: string }> = [
  { value: 'post-mortem', label: 'POST-MORTEM' },
  { value: 'deep-dive', label: 'DEEP-DIVE' },
  { value: 'reference', label: 'REFERENCE' },
];

function buildFilterHref(
  pathname: string,
  criteria: PostFilterCriteria,
): string {
  const params = new URLSearchParams();

  if (criteria.category) {
    params.set('category', criteria.category);
  }
  if (criteria.tag) {
    params.set('tag', criteria.tag);
  }
  if (criteria.type) {
    params.set('type', criteria.type);
  }
  if (criteria.q && criteria.q.trim().length > 0) {
    params.set('q', criteria.q.trim());
  }

  const queryString = params.toString();
  return queryString.length > 0 ? `${pathname}?${queryString}` : pathname;
}

export function ArchiveExplorer({
  initialPosts,
}: ArchiveExplorerProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlCriteria = React.useMemo(
    () => parseFilterParams(searchParams),
    [searchParams],
  );

  const [queryInput, setQueryInput] = React.useState<string>(
    urlCriteria.q ?? '',
  );
  const [showAllTags, setShowAllTags] = React.useState<boolean>(false);

  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isTypingRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!isTypingRef.current) {
      setQueryInput(urlCriteria.q ?? '');
    }
  }, [urlCriteria.q]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const activeCriteria: PostFilterCriteria = React.useMemo(
    () => ({
      category: urlCriteria.category,
      tag: urlCriteria.tag,
      type: urlCriteria.type,
      q: queryInput.trim().length > 0 ? queryInput.trim() : undefined,
    }),
    [urlCriteria.category, urlCriteria.tag, urlCriteria.type, queryInput],
  );

  const filteredPosts = React.useMemo(
    () => filterPosts(initialPosts, activeCriteria),
    [initialPosts, activeCriteria],
  );

  const hasAnyFilter = Boolean(
    activeCriteria.category ||
      activeCriteria.tag ||
      activeCriteria.type ||
      activeCriteria.q,
  );

  // Thống kê số bài viết theo từng Category và Tag trên tập initialPosts
  const categoryCounts = React.useMemo(() => {
    const counts = new Map<Category, number>();
    for (const post of initialPosts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return counts;
  }, [initialPosts]);

  const tagCounts = React.useMemo(() => {
    const counts = new Map<AllowedTag, number>();
    for (const post of initialPosts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return counts;
  }, [initialPosts]);

  const visibleTags = React.useMemo(() => {
    if (showAllTags) {
      return [...ALLOWED_TAGS];
    }
    const activeTagsWithPosts = ALLOWED_TAGS.filter(
      (tag) => (tagCounts.get(tag) ?? 0) > 0 || tag === urlCriteria.tag,
    );
    return activeTagsWithPosts.length > 0
      ? activeTagsWithPosts
      : ALLOWED_TAGS.slice(0, 12);
  }, [showAllTags, tagCounts, urlCriteria.tag]);

  const applyCriteriaImmediately = (nextCriteria: PostFilterCriteria): void => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    isTypingRef.current = false;
    const nextHref = buildFilterHref(pathname, nextCriteria);
    router.replace(nextHref, { scroll: false });
  };

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const nextValue = event.target.value;
    isTypingRef.current = true;
    setQueryInput(nextValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      const nextHref = buildFilterHref(pathname, {
        category: urlCriteria.category,
        tag: urlCriteria.tag,
        type: urlCriteria.type,
        q: nextValue.trim().length > 0 ? nextValue.trim() : undefined,
      });
      router.replace(nextHref, { scroll: false });
    }, 150);
  };

  const handleClearQueryOnly = (): void => {
    setQueryInput('');
    applyCriteriaImmediately({
      category: urlCriteria.category,
      tag: urlCriteria.tag,
      type: urlCriteria.type,
      q: undefined,
    });
  };

  const handleResetAllFilters = (): void => {
    setQueryInput('');
    applyCriteriaImmediately({});
  };

  const handleToggleCategory = (category?: Category): void => {
    const nextCategory =
      category && urlCriteria.category === category ? undefined : category;
    applyCriteriaImmediately({
      ...activeCriteria,
      category: nextCategory,
    });
  };

  const handleTogglePostType = (type?: PostType): void => {
    const nextType = type && urlCriteria.type === type ? undefined : type;
    applyCriteriaImmediately({
      ...activeCriteria,
      type: nextType,
    });
  };

  const handleToggleTag = (tag: AllowedTag): void => {
    const nextTag = urlCriteria.tag === tag ? undefined : tag;
    applyCriteriaImmediately({
      ...activeCriteria,
      tag: nextTag,
    });
  };

  return (
    <section
      id="archive-explorer"
      aria-labelledby="archive-explorer-heading"
      className="mt-14 scroll-mt-20 border-t border-[var(--border-subtle)] pt-12"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[var(--accent-primary)] uppercase">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden={true} />
            <span>Technical Knowledge Archive</span>
          </div>
          <h2
            id="archive-explorer-heading"
            className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
          >
            Kho Bài Viết &amp; Tra Cứu Kỹ Thuật
          </h2>
        </div>

        <p
          aria-live="polite"
          className="font-mono text-xs font-medium text-[var(--text-secondary)]"
        >
          Hiển thị{' '}
          <span className="font-bold text-[var(--text-primary)]">
            {filteredPosts.length}
          </span>{' '}
          / {initialPosts.length} bài viết kỹ thuật
        </p>
      </div>

      {/* Khung điều khiển Bộ lọc & Tìm kiếm không dấu (BR-05) */}
      <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 sm:p-6">
        {/* Ô tìm kiếm tức thì hỗ trợ tiếng Việt không dấu */}
        <div className="relative">
          <label htmlFor="archive-search-input" className="sr-only">
            Tìm kiếm bài viết kỹ thuật theo từ khóa có dấu hoặc không dấu
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
            aria-hidden={true}
          />
          <input
            id="archive-search-input"
            type="search"
            value={queryInput}
            onChange={handleQueryChange}
            placeholder="Tìm nhanh không dấu theo tiêu đề, môi trường, chỉ số (VD: deadlock, bao cao, oracle 19c, docker)..."
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-primary)] py-2.5 pr-10 pl-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {queryInput.length > 0 && (
            <button
              type="button"
              onClick={handleClearQueryOnly}
              aria-label="Xóa từ khóa tìm kiếm"
              className="absolute top-1/2 right-2.5 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="h-4 w-4" aria-hidden={true} />
            </button>
          )}
        </div>

        {/* Hàng lọc Chuyên mục (Category) */}
        <div className="mt-4">
          <p className="mb-2 font-mono text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
            Chuyên mục công nghệ
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleCategory(undefined)}
              aria-pressed={!activeCriteria.category}
              className={[
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                !activeCriteria.category
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              Tất cả ({initialPosts.length})
            </button>

            {CATEGORIES.map((category) => {
              const isSelected = activeCriteria.category === category.slug;
              const count = categoryCounts.get(category.slug) ?? 0;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => handleToggleCategory(category.slug)}
                  aria-pressed={isSelected}
                  className={[
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isSelected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {category.shortLabel}{' '}
                  <span className="font-mono opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hàng lọc Khuôn mẫu bài viết (PostType) */}
        <div className="mt-4">
          <p className="mb-2 font-mono text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
            Khuôn mẫu trình bày
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleTogglePostType(undefined)}
              aria-pressed={!activeCriteria.type}
              className={[
                'rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                !activeCriteria.type
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              Mọi khuôn mẫu
            </button>

            {POST_TYPE_OPTIONS.map((option) => {
              const isSelected = activeCriteria.type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTogglePostType(option.value)}
                  aria-pressed={isSelected}
                  className={[
                    'rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isSelected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hàng lọc Thẻ chuẩn hóa (AllowedTag) */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-mono text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Thẻ kỹ thuật chuẩn hóa
            </p>
            <button
              type="button"
              onClick={() => setShowAllTags((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs text-[var(--accent-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>
                {showAllTags
                  ? 'Thu gọn thẻ'
                  : `Hiện đủ ${ALLOWED_TAGS.length} thẻ chuẩn`}
              </span>
              {showAllTags ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden={true} />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden={true} />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => {
              const isSelected = activeCriteria.tag === tag;
              const count = tagCounts.get(tag) ?? 0;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  aria-pressed={isSelected}
                  className={[
                    'rounded-md border px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isSelected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] font-semibold text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  #{tag}
                  {count > 0 ? ` (${count})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thanh tóm tắt điều kiện đang lọc */}
        {hasAnyFilter && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
              <span className="font-mono text-[var(--text-muted)]">
                Đang áp dụng:
              </span>
              {activeCriteria.category && (
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono">
                  category={activeCriteria.category}
                </span>
              )}
              {activeCriteria.type && (
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono">
                  type={activeCriteria.type}
                </span>
              )}
              {activeCriteria.tag && (
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono">
                  #{activeCriteria.tag}
                </span>
              )}
              {activeCriteria.q && (
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono">
                  q=&ldquo;{activeCriteria.q}&rdquo;
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetAllFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden={true} />
              <span>Xóa toàn bộ bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* Kết quả lọc hoặc Trạng thái rỗng (Empty State) */}
      {filteredPosts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div
          role="status"
          data-archive-empty="true"
          className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)] px-6 py-14 text-center"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            <SearchX className="h-6 w-6" aria-hidden={true} />
          </span>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Không tìm thấy bài viết phù hợp
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Không có bài viết nào khớp đồng thời với tổ hợp chuyên mục, khuôn
            mẫu, thẻ kỹ thuật và từ khóa bạn đang chọn. Hãy thử từ khóa ngắn hơn
            hoặc đặt lại bộ lọc.
          </p>
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" aria-hidden={true} />
            <span>Xóa toàn bộ bộ lọc</span>
          </button>
        </div>
      )}
    </section>
  );
}
