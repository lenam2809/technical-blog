import {
  AllowedTagSchema,
  CategorySchema,
  PostTypeSchema,
  type PostFilterCriteria,
  type PostSummary,
} from '@/types/post';

export interface SearchParamsGetter {
  get(name: string): string | null;
}

export type RawFilterParams =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | SearchParamsGetter;

function isSearchParamsGetter(
  params: RawFilterParams,
): params is URLSearchParams | SearchParamsGetter {
  return (
    params instanceof URLSearchParams ||
    ('get' in params && typeof params.get === 'function')
  );
}

function readSingleParam(
  params: RawFilterParams,
  key: string,
): string | undefined {
  if (isSearchParamsGetter(params)) {
    const val = params.get(key);
    return val ?? undefined;
  }

  const raw = params[key];
  if (Array.isArray(raw)) {
    return raw[0];
  }
  return raw;
}

/**
 * Chuẩn hóa chuỗi tìm kiếm tiếng Việt: bỏ dấu thanh/mũ, chuyển đ/Đ -> d, chữ thường và cắt khoảng trắng.
 */
export function normalizeSearchText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Phân tích an toàn các tham số lọc từ URL Query Parameters (BR-05).
 * Mọi giá trị không khớp Schema đều được bỏ qua an toàn thay vì ném lỗi.
 */
export function parseFilterParams(params: RawFilterParams): PostFilterCriteria {
  const criteria: PostFilterCriteria = {};

  const rawCategory = readSingleParam(params, 'category');
  if (rawCategory !== undefined) {
    const parsedCategory = CategorySchema.safeParse(rawCategory);
    if (parsedCategory.success) {
      criteria.category = parsedCategory.data;
    }
  }

  const rawTag = readSingleParam(params, 'tag');
  if (rawTag !== undefined) {
    const parsedTag = AllowedTagSchema.safeParse(rawTag);
    if (parsedTag.success) {
      criteria.tag = parsedTag.data;
    }
  }

  const rawType = readSingleParam(params, 'type');
  if (rawType !== undefined) {
    const parsedType = PostTypeSchema.safeParse(rawType);
    if (parsedType.success) {
      criteria.type = parsedType.data;
    }
  }

  const rawQuery = readSingleParam(params, 'q');
  if (typeof rawQuery === 'string') {
    const trimmedQuery = rawQuery.trim();
    if (trimmedQuery.length > 0) {
      criteria.q = trimmedQuery;
    }
  }

  return criteria;
}

/**
 * Lọc bài viết thuần khiết theo tổ hợp AND logic (BR-05):
 * category + tag + type + từ khóa không dấu q (trên title, summary, tags, environment, impact).
 */
export function filterPosts(
  posts: readonly PostSummary[],
  criteria: PostFilterCriteria,
): PostSummary[] {
  const normalizedQuery =
    criteria.q !== undefined ? normalizeSearchText(criteria.q) : '';

  return posts.filter((post) => {
    if (criteria.category && post.category !== criteria.category) {
      return false;
    }

    if (criteria.tag && !post.tags.includes(criteria.tag)) {
      return false;
    }

    if (criteria.type && post.postType !== criteria.type) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const searchableValues: string[] = [
        post.title,
        post.summary,
        ...post.tags,
        ...(post.environment ?? []),
        ...(post.impact ? [post.impact] : []),
      ];

      const matchesQuery = searchableValues.some((field) =>
        normalizeSearchText(field).includes(normalizedQuery),
      );

      if (!matchesQuery) {
        return false;
      }
    }

    return true;
  });
}
