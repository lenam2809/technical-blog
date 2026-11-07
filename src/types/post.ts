import { z } from 'zod';
import { ALLOWED_TAGS } from '@/lib/constants';

export const CategorySchema = z.enum([
  'dotnet-backend',
  'database-sql',
  'system-architecture',
  'devops-modern-web',
]);
export type Category = z.infer<typeof CategorySchema>;

export const PostTypeSchema = z.enum([
  'post-mortem',
  'deep-dive',
  'reference',
]);
export type PostType = z.infer<typeof PostTypeSchema>;

export const CalloutTypeSchema = z.enum([
  'symptom',
  'investigation',
  'root-cause',
  'solution',
  'benchmark',
  'warning',
]);
export type CalloutType = z.infer<typeof CalloutTypeSchema>;

export const AllowedTagSchema = z.enum(ALLOWED_TAGS);
export type AllowedTag = z.infer<typeof AllowedTagSchema>;

/**
 * Kiểm tra ngày chuẩn YYYY-MM-DD bằng phép đối chiếu vòng tròn (Round-trip ISO check)
 * để chặn triệt để các ngày không tồn tại trên lịch như 2026-02-31.
 */
export function isValidIsoDateString(val: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
  const date = new Date(`${val}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;
  return date.toISOString().slice(0, 10) === val;
}

export const IsoDateSchema = z.string().refine(isValidIsoDateString, {
  error:
    'Ngày tháng phải đúng định dạng YYYY-MM-DD và tồn tại thực tế trên lịch.',
});

export const SeriesSchema = z.object({
  name: z.string().min(5).max(100),
  order: z.number().int().positive(),
});
export type SeriesInfo = z.infer<typeof SeriesSchema>;

export const PostFrontmatterSchema = z
  .object({
    title: z
      .string()
      .min(10, { error: 'Tiêu đề tối thiểu 10 ký tự' })
      .max(120, { error: 'Tiêu đề tối đa 120 ký tự' }),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        error: 'Slug phải ở định dạng kebab-case',
      }),
    postType: PostTypeSchema.default('deep-dive'),
    category: CategorySchema,
    tags: z
      .array(AllowedTagSchema)
      .min(1, {
        error: 'Phải gắn ít nhất 1 tag từ danh mục chuẩn ALLOWED_TAGS',
      })
      .max(6, { error: 'Tối đa 6 tags cho mỗi bài viết' })
      .refine((items) => new Set(items).size === items.length, {
        error: 'Danh sách tags không được chứa thẻ trùng lặp',
      }),
    publishedAt: IsoDateSchema,
    updatedAt: IsoDateSchema.optional(),
    summary: z
      .string()
      .min(50, { error: 'Tóm tắt tối thiểu 50 ký tự để đảm bảo chuẩn SEO' })
      .max(220, { error: 'Tóm tắt tối đa 220 ký tự' }),
    environment: z.array(z.string().min(2).max(40)).max(6).optional(),
    impact: z.string().min(10).max(80).optional(),
    series: SeriesSchema.optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    sanitized: z.boolean().default(false),
    canonicalUrl: z
      .url({ error: 'canonicalUrl phải là một URL hợp lệ' })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.updatedAt) return true;
      return data.updatedAt >= data.publishedAt;
    },
    {
      path: ['updatedAt'],
      error:
        'Ngày cập nhật (updatedAt) không được sớm hơn ngày xuất bản (publishedAt).',
    },
  )
  .refine(
    (data) => {
      if (data.postType === 'post-mortem') {
        return Array.isArray(data.environment) && data.environment.length > 0;
      }
      return true;
    },
    {
      path: ['environment'],
      error:
        'Bài viết thuộc khuôn mẫu "post-mortem" bắt buộc phải khai báo mảng "environment".',
    },
  )
  .refine(
    (data) => {
      // Chốt chặn NDA (Guard 3): Nếu bài viết được xuất bản công khai (draft: false), bắt buộc phải xác nhận sanitized: true
      if (data.draft === false) {
        return data.sanitized === true;
      }
      return true;
    },
    {
      path: ['sanitized'],
      error:
        'Bài viết xuất bản công khai (draft: false) bắt buộc phải qua kiểm duyệt ẩn danh hóa (sanitized: true).',
    },
  );

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ReadingTimeStats {
  readingTimeMinutes: number;
  wordCount: number;
  codeLines: number;
  imageCount: number;
}

export interface PostSummary extends PostFrontmatter {
  readingTimeMinutes: number;
  isOutdated: boolean;
}

export interface PostDetail extends PostSummary {
  content: string;
  toc: TocItem[];
  relatedPosts: PostSummary[];
  seriesPosts: PostSummary[];
}

export interface PostFilterCriteria {
  category?: Category;
  tag?: AllowedTag;
  type?: PostType;
  q?: string;
}
