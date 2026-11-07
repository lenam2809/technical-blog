import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import {
  calculateTechnicalReadingTime,
  extractTocFromMdx,
} from '@/lib/toc';
import {
  PostFrontmatterSchema,
  type AllowedTag,
  type Category,
  type PostDetail,
  type PostSummary,
} from '@/types/post';

export interface PostRepositoryOptions {
  postsDir?: string;
  includeDrafts?: boolean;
  now?: Date;
}

interface ValidatedPostRecord {
  summary: PostSummary;
  content: string;
}

const DEFAULT_POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const MS_PER_DAY = 86_400_000;
const OUTDATED_THRESHOLD_DAYS = 730;

function resolveOptions(options?: PostRepositoryOptions): {
  postsDir: string;
  includeDrafts: boolean;
  now: Date;
} {
  return {
    postsDir: options?.postsDir ?? DEFAULT_POSTS_DIR,
    includeDrafts:
      options?.includeDrafts ?? process.env.NODE_ENV === 'development',
    now: options?.now ?? new Date(),
  };
}

function computeIsOutdated(referenceIsoDate: string, now: Date): boolean {
  const referenceUtcMs = new Date(`${referenceIsoDate}T00:00:00.000Z`).getTime();
  const nowUtcMidnightMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const ageInDays = Math.floor((nowUtcMidnightMs - referenceUtcMs) / MS_PER_DAY);
  return ageInDays > OUTDATED_THRESHOLD_DAYS;
}

function comparePostsDesc(a: PostSummary, b: PostSummary): number {
  const dateCompare = b.publishedAt.localeCompare(a.publishedAt);
  if (dateCompare !== 0) {
    return dateCompare;
  }
  return a.slug.localeCompare(b.slug);
}

function scoreRelatedCandidate(
  currentPost: PostSummary,
  candidate: PostSummary,
): number {
  const sharedTagsCount = candidate.tags.filter((tag) =>
    currentPost.tags.includes(tag),
  ).length;
  const sameCategoryBonus =
    candidate.category === currentPost.category ? 2 : 0;
  const sameSeriesBonus =
    currentPost.series &&
    candidate.series &&
    candidate.series.name === currentPost.series.name
      ? 5
      : 0;

  return sharedTagsCount * 3 + sameCategoryBonus + sameSeriesBonus;
}

function computeRelatedSummaries(
  currentPost: PostSummary,
  visibleSummaries: readonly PostSummary[],
  limit: number,
): PostSummary[] {
  if (limit <= 0) {
    return [];
  }

  return visibleSummaries
    .filter((candidate) => candidate.slug !== currentPost.slug)
    .map((candidate) => ({
      post: candidate,
      score: scoreRelatedCandidate(currentPost, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return comparePostsDesc(a.post, b.post);
    })
    .slice(0, limit)
    .map((entry) => entry.post);
}

function loadValidatedRecords(
  options?: PostRepositoryOptions,
): ValidatedPostRecord[] {
  const { postsDir, includeDrafts, now } = resolveOptions(options);

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  // Guard 1 (phần 1): Chỉ đọc các file .mdx trực tiếp trong postsDir, không duyệt đệ quy thư mục con
  const mdxEntries = fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const records: ValidatedPostRecord[] = [];

  for (const entry of mdxEntries) {
    const filePath = path.join(postsDir, entry.name);
    const rawFileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(rawFileContent);
    const expectedSlug = entry.name.slice(0, -4);

    // Guard 1 (phần 2): Khóa chặt tên file vật lý khớp 100% với trường slug trong Frontmatter
    const rawDataRecord =
      typeof data === 'object' && data !== null
        ? (data as Record<string, unknown>)
        : {};
    if (
      typeof rawDataRecord.slug === 'string' &&
      rawDataRecord.slug.length > 0 &&
      rawDataRecord.slug !== expectedSlug
    ) {
      throw new Error(
        `[Guard 1 - FileSlugParity] File "${entry.name}" có slug "${rawDataRecord.slug}" không khớp với tên file vật lý "${expectedSlug}".`,
      );
    }

    // Guard 2 & Guard 3: Kiểm tra hợp đồng dữ liệu Zod 4 + ngày lịch thực tế + environment post-mortem + NDA sanitized
    const parsed = PostFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const formattedIssues = z.prettifyError(parsed.error);
      throw new Error(
        `[Guard 2/3 - FrontmatterValidation] File "${entry.name}" vi phạm hợp đồng dữ liệu:\n${formattedIssues}`,
      );
    }

    if (parsed.data.slug !== expectedSlug) {
      throw new Error(
        `[Guard 1 - FileSlugParity] File "${entry.name}" có slug "${parsed.data.slug}" không khớp với tên file vật lý "${expectedSlug}".`,
      );
    }

    const { readingTimeMinutes } = calculateTechnicalReadingTime(content);
    const referenceDate = parsed.data.updatedAt ?? parsed.data.publishedAt;
    const isOutdated = computeIsOutdated(referenceDate, now);

    records.push({
      summary: {
        ...parsed.data,
        readingTimeMinutes,
        isOutdated,
      },
      content,
    });
  }

  // BR-01: Loại bỏ tuyệt đối bài nháp (draft: true) khi includeDrafts === false
  return records
    .filter((record) => includeDrafts || !record.summary.draft)
    .sort((a, b) => comparePostsDesc(a.summary, b.summary));
}

/**
 * Trả về danh sách PostSummary[] đã qua kiểm duyệt 3 Fail-Fast Guards và lọc theo BR-01,
 * sắp xếp theo publishedAt giảm dần (tie-break theo slug A-Z).
 */
export function getAllPosts(options?: PostRepositoryOptions): PostSummary[] {
  return loadValidatedRecords(options).map((record) => record.summary);
}

/**
 * Lấy chi tiết một bài viết theo slug kèm nội dung MDX thô, mục lục AST, bài liên quan (BR-04) và chuỗi bài viết.
 * Trả về null nếu không tìm thấy hoặc bài viết là bản nháp khi includeDrafts === false (BR-01).
 */
export function getPostBySlug(
  slug: string,
  options?: PostRepositoryOptions,
): PostDetail | null {
  const visibleRecords = loadValidatedRecords(options);
  const targetRecord = visibleRecords.find(
    (record) => record.summary.slug === slug,
  );

  if (!targetRecord) {
    return null;
  }

  const visibleSummaries = visibleRecords.map((record) => record.summary);
  const toc = extractTocFromMdx(targetRecord.content);
  const relatedPosts = computeRelatedSummaries(
    targetRecord.summary,
    visibleSummaries,
    3,
  );

  const seriesName = targetRecord.summary.series?.name;
  const seriesPosts = seriesName
    ? visibleSummaries
        .filter((post) => post.series?.name === seriesName)
        .sort((a, b) => {
          const orderDiff = (a.series?.order ?? 0) - (b.series?.order ?? 0);
          if (orderDiff !== 0) {
            return orderDiff;
          }
          return a.slug.localeCompare(b.slug);
        })
    : [];

  return {
    ...targetRecord.summary,
    content: targetRecord.content,
    toc,
    relatedPosts,
    seriesPosts,
  };
}

/**
 * Trả về tối đa `limit` (mặc định 3) bài viết tiêu biểu (featured: true) mới nhất theo BR-02.
 */
export function getFeaturedPosts(
  limit = 3,
  options?: PostRepositoryOptions,
): PostSummary[] {
  if (limit <= 0) {
    return [];
  }

  return getAllPosts(options)
    .filter((post) => post.featured)
    .slice(0, limit);
}

/**
 * Gợi ý tối đa `limit` (mặc định 3) bài viết liên quan tất định theo công thức chấm điểm BR-04.
 */
export function getRelatedPosts(
  currentSlug: string,
  limit = 3,
  options?: PostRepositoryOptions,
): PostSummary[] {
  const visibleSummaries = getAllPosts(options);
  const currentPost = visibleSummaries.find(
    (post) => post.slug === currentSlug,
  );

  if (!currentPost) {
    return [];
  }

  return computeRelatedSummaries(currentPost, visibleSummaries, limit);
}

/**
 * Lọc danh sách bài viết theo chuyên mục công nghệ (category).
 */
export function getPostsByCategory(
  category: Category,
  options?: PostRepositoryOptions,
): PostSummary[] {
  return getAllPosts(options).filter((post) => post.category === category);
}

/**
 * Lọc danh sách bài viết theo thẻ chuẩn hóa (AllowedTag).
 */
export function getPostsByTag(
  tag: AllowedTag,
  options?: PostRepositoryOptions,
): PostSummary[] {
  return getAllPosts(options).filter((post) => post.tags.includes(tag));
}
