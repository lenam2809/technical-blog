# TECHNICAL ARCHITECTURE SPECIFICATION (v2.0)

## 1. Ngăn Xếp Công Nghệ Cố Định & Phiên Bản Đã Ghim (Pinned Tech Stack)
Dự án chuẩn hóa trên môi trường **Node.js `>=22.0.0` LTS** với các phiên bản thư viện được khóa chặt như sau:

| Nhóm công nghệ | Package | Phiên bản ghim | Ghi chú kiến trúc (Tháng 11/2026) |
| :--- | :--- | :--- | :--- |
| **Core Framework** | `next`, `react`, `react-dom` | `^16.3.0`, `^19.2.0` | Sử dụng App Router, Turbopack mặc định, `output: 'standalone'`. |
| **Language & Validation** | `typescript`, `zod` | `^5.8.0`, `^4.0.0` | TypeScript `strict: true`; sử dụng cú pháp Zod 4 (`z.url()`, `z.prettifyError()`). |
| **Styling & Theme** | `tailwindcss`, `@tailwindcss/typography`, `next-themes`, `lucide-react` | `^4.0.0` (hoặc `^3.4.17`), `^0.5.16`, `^0.4.6`, `^1.0.0` | Sử dụng biến màu CSS (CSS Variables) đồng bộ từ `docs/DESIGN.md`. |
| **MDX & AST Pipeline** | `next-mdx-remote`, `gray-matter`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `shiki` | `^5.0.0`, `^4.0.3`, `^4.0.1`, `^6.0.0`, `^7.1.0`, `^0.14.0`, `^3.0.0` | Biên dịch MDX và tô màu 15 ngôn ngữ hoàn toàn trên Server lúc build. |
| **AST TOC Extractor** | `unified`, `remark-parse`, `unist-util-visit`, `mdast-util-to-string`, `github-slugger` | `^11.0.5`, `^11.0.0`, `^5.0.0`, `^4.0.0`, `^2.0.0` | Trích xuất mục lục từ cây AST, đồng bộ 100% ID tiếng Việt với `rehype-slug`. |
| **Static Search** | `pagefind` (devDependency) | `^1.3.0` | Đánh chỉ mục tìm kiếm toàn văn tĩnh sau khi chạy `next build`. |
| **Quality & Testing** | `vitest`, `eslint`, `@eslint/js`, `typescript-eslint` | `^3.0.0`, `^9.20.0` | Dùng ESLint 9 Flat Config (`"lint": "eslint ."`) thay cho `next lint`. |

**Danh sách 15 ngôn ngữ Shiki bắt buộc nạp sẵn trên Server:**
`csharp`, `sql`, `plsql`, `xml`, `json`, `typescript`, `tsx`, `javascript`, `yaml`, `dockerfile`, `bash`, `powershell`, `http`, `diff`, `text`.

---

## 2. Kiến Trúc Phân Tầng 4 Lớp (4-Layer Architecture)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ TẦNG 4: PRESENTATION & ROUTING LAYER (src/app/ & src/components/)        │
│ - Static RSC Pages: /, /about, /blog/[slug], /category/[cat], /tags/[tag]│
│ - Dynamic OG & SEO Routes: opengraph-image.tsx, sitemap.ts, rss.xml      │
│ - 5 Client Islands: ThemeProvider, ThemeToggle, ArchiveExplorer,         │
│                     TableOfContents, CodeBlockCopyButton                 │
└────────────────────────────────────▲─────────────────────────────────────┘
                                     │ Nhận PostSummary[], PostDetail, AST
┌────────────────────────────────────┴─────────────────────────────────────┐
│ TẦNG 3: MDX COMPILATION & AST PIPELINE (src/lib/mdx.ts & src/lib/toc.ts) │
│ - AST TOC Extractor: unified + remark-parse + github-slugger             │
│ - MDX Compiler: remark-gfm, rehype-slug, rehype-pretty-code + Shiki      │
│ - Technical Reading Time Calculator (BR-03): tách code, ảnh, văn bản     │
└────────────────────────────────────▲─────────────────────────────────────┘
                                     │ Cung cấp dữ liệu đã kiểm duyệt
┌────────────────────────────────────┴─────────────────────────────────────┐
│ TẦNG 2: DOMAIN REPOSITORY, FILTERS & SEO (src/lib/posts.ts, filters, seo)│
│ - Parse Frontmatter (gray-matter) + Kiểm tra hợp lệ bằng Zod 4           │
│ - Thực thi 3 Chốt chặn Fail-Fast Build Guards (Schema, Slug, NDA)        │
│ - Thực thi Business Rules: BR-01 -> BR-06 (hỗ trợ Dependency Injection)  │
└────────────────────────────────────▲─────────────────────────────────────┘
                                     │ Đọc từ đĩa cứng lúc Build / Test
┌────────────────────────────────────┴─────────────────────────────────────┐
│ TẦNG 1: CONTENT & FIXTURES STORAGE (content/posts/ & __fixtures__/posts/)│
│ - content/posts/*.mdx (Bài viết thật) & content/templates/*.mdx          │
│ - src/lib/__tests__/__fixtures__/posts/*.mdx (Dữ liệu cô lập cho Vitest) │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Cấu Trúc Thư Mục Chuẩn (Standard Directory Structure)

```text
tech-blog/
├── AGENTS.md
├── .agents/
│   └── rules/
│       └── nextjs-mdx-rules.md
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   └── TASKS.md
├── content/
│   ├── posts/                              # Chứa các bài viết chính thức (.mdx)
│   └── templates/                          # 3 khuôn mẫu: post-mortem.mdx, deep-dive.mdx, reference.mdx
├── public/
│   └── images/
│       └── posts/                          # Sơ đồ kiến trúc, ảnh chụp Execution Plan đã ẩn danh
├── src/
│   ├── app/
│   │   ├── globals.css                     # Khai báo CSS Variables từ docs/DESIGN.md
│   │   ├── layout.tsx                      # Root Layout (<html lang="vi">, SkipLink, Header, Footer)
│   │   ├── page.tsx                        # Trang chủ Static RSC (Hero + Featured + Suspense ArchiveExplorer)
│   │   ├── not-found.tsx                   # Trang 404 tùy chỉnh
│   │   ├── error.tsx                       # Trang bắt lỗi biên (Error Boundary)
│   │   ├── about/
│   │   │   └── page.tsx                    # Trang Engineering Profile Dual-Track + Person JSON-LD
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                # Trang đọc bài viết chi tiết + TechArticle JSON-LD
│   │   │       └── opengraph-image.tsx     # Sinh ảnh OG tự động bằng next/og (ImageResponse)
│   │   ├── category/
│   │   │   └── [category]/
│   │   │       └── page.tsx                # Trang danh mục tĩnh chuẩn SEO (generateStaticParams)
│   │   ├── tags/
│   │   │   └── [tag]/
│   │   │       └── page.tsx                # Trang thẻ kỹ thuật tĩnh chuẩn SEO (generateStaticParams)
│   │   ├── sitemap.ts                      # Sinh tự động /sitemap.xml
│   │   ├── robots.ts                       # Sinh tự động /robots.txt
│   │   └── rss.xml/
│   │       └── route.ts                    # Sinh tự động /rss.xml
│   ├── components/
│   │   ├── layout/
│   │   │   ├── ThemeProvider.tsx           # RCC ('use client' #1)
│   │   │   ├── ThemeToggle.tsx             # RCC ('use client' #2)
│   │   │   ├── Header.tsx                  # RSC
│   │   │   └── Footer.tsx                  # RSC
│   │   ├── blog/
│   │   │   ├── ArchiveExplorer.tsx         # RCC ('use client' #3 - Bộ lọc URL & Tìm kiếm)
│   │   │   ├── TableOfContents.tsx         # RCC ('use client' #4 - Sticky TOC)
│   │   │   ├── PostCard.tsx                # RSC
│   │   │   ├── FeaturedPosts.tsx           # RSC (Hiển thị Featured Case Studies + Impact badge)
│   │   │   ├── EnvironmentBadges.tsx       # RSC
│   │   │   ├── OutdatedBanner.tsx          # RSC (Cảnh báo bài viết trên 24 tháng)
│   │   │   ├── SeriesBanner.tsx            # RSC (Điều hướng chuỗi bài viết nhiều kỳ)
│   │   │   ├── AuthorCard.tsx              # RSC (Khối tác giả & CTA cuối bài)
│   │   │   └── RelatedPosts.tsx            # RSC
│   │   └── mdx/
│   │       ├── Callout.tsx                 # RSC (6 loại: symptom, investigation, root-cause, solution, benchmark, warning)
│   │       ├── PreBlock.tsx                # RSC (Khung bọc khối code)
│   │       └── CodeBlockCopyButton.tsx     # RCC ('use client' #5)
│   ├── lib/
│   │   ├── constants.ts                    # Cấu hình SITE_CONFIG, CATEGORIES, ALLOWED_TAGS
│   │   ├── posts.ts                        # Tầng Repository, 3 Fail-Fast Guards, BR-01, BR-02, BR-04
│   │   ├── toc.ts                          # Trích xuất AST TOC (github-slugger) & tính Reading Time (BR-03)
│   │   ├── filters.ts                      # Hàm thuần parseFilterParams & filterPosts không dấu (BR-05)
│   │   ├── seo.ts                          # Hàm buildCanonicalUrl (BR-06) & buildJsonLd
│   │   ├── mdx.ts                          # Cấu hình rehype-pretty-code, Shiki 15 ngôn ngữ & MDX mapping
│   │   └── __tests__/
│   │       ├── __fixtures__/
│   │       │   └── posts/                  # Các file .mdx giả lập phục vụ kiểm thử cô lập
│   │       ├── posts.test.ts               # Unit Tests cho Guards & BR-01, BR-02, BR-04
│   │       ├── toc.test.ts                 # Unit Tests cho AST TOC tiếng Việt, code fence & BR-03
│   │       ├── filters.test.ts             # Unit Tests cho BR-05 (lọc kết hợp & tìm kiếm không dấu)
│   │       └── seo.test.ts                 # Unit Tests cho BR-06 & JSON-LD
│   └── types/
│       └── post.ts                         # Hợp đồng dữ liệu Zod 4 Schema & TypeScript Interfaces
├── Dockerfile
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Hợp Đồng Dữ Liệu Cốt Lõi Với Zod 4 (`src/types/post.ts` & `src/lib/constants.ts`)

### 4.1. Danh mục Hằng số & Thẻ Chuẩn hóa (`src/lib/constants.ts`)
```typescript
export const SITE_CONFIG = {
  name: 'Nam Lê — Engineering Blog & Portfolio',
  title: 'Nam Lê | .NET, Oracle SQL, System Architecture & Modern Web',
  description:
    'Chia sẻ kinh nghiệm thực chiến về .NET, Web API, tối ưu hóa Oracle/SQL, phân tích sự cố (Post-mortem) và hành trình DevOps, Docker, Next.js.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://namle.dev',
  locale: 'vi_VN',
  author: {
    name: 'Nam Lê',
    role: 'Software Engineer (.NET, Oracle SQL & Modern Web)',
    github: 'https://github.com/namlvThienHoang',
    email: 'contact@namle.dev',
  },
} as const;

export const ALLOWED_TAGS = [
  // .NET & Backend
  'dotnet-framework',
  'dotnet',
  'csharp',
  'web-api',
  'entity-framework',
  'ef-core',
  'rdlc-report',
  'memory-management',
  'concurrency',
  // Database & SQL
  'oracle',
  'plsql',
  'sql-optimization',
  'execution-plan',
  'indexing',
  'deadlock',
  'connection-pool',
  // System Architecture
  'microservices',
  'rabbitmq',
  'outbox-pattern',
  'redis',
  'openiddict',
  'authentication',
  'observability',
  'security',
  // DevOps & Modern Web
  'docker',
  'docker-compose',
  'ci-cd',
  'linux',
  'nextjs',
  'react',
  'typescript',
] as const;
```

### 4.2. Schema Kiểm Tra Bằng Zod 4 (`src/types/post.ts`)
```typescript
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

const IsoDateSchema = z
  .string()
  .refine(isValidIsoDateString, {
    error: 'Ngày tháng phải đúng định dạng YYYY-MM-DD và tồn tại thực tế trên lịch.',
  });

export const SeriesSchema = z.object({
  name: z.string().min(5).max(100),
  order: z.number().int().positive(),
});

export const PostFrontmatterSchema = z
  .object({
    title: z.string().min(10, { error: 'Tiêu đề tối thiểu 10 ký tự' }).max(120, { error: 'Tiêu đề tối đa 120 ký tự' }),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: 'Slug phải ở định dạng kebab-case' }),
    postType: PostTypeSchema.default('deep-dive'),
    category: CategorySchema,
    tags: z
      .array(AllowedTagSchema)
      .min(1, { error: 'Phải gắn ít nhất 1 tag từ danh mục chuẩn ALLOWED_TAGS' })
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
    canonicalUrl: z.url({ error: 'canonicalUrl phải là một URL hợp lệ' }).optional(),
  })
  .refine(
    (data) => {
      if (!data.updatedAt) return true;
      return data.updatedAt >= data.publishedAt;
    },
    {
      path: ['updatedAt'],
      error: 'Ngày cập nhật (updatedAt) không được sớm hơn ngày xuất bản (publishedAt).',
    }
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
      error: 'Bài viết thuộc khuôn mẫu "post-mortem" bắt buộc phải khai báo mảng "environment".',
    }
  )
  .refine(
    (data) => {
      // Chốt chặn NDA: Nếu bài viết được xuất bản công khai (draft: false), bắt buộc phải xác nhận sanitized: true
      if (data.draft === false) {
        return data.sanitized === true;
      }
      return true;
    },
    {
      path: ['sanitized'],
      error: 'Bài viết xuất bản công khai (draft: false) bắt buộc phải qua kiểm duyệt ẩn danh hóa (sanitized: true).',
    }
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
  isOutdated: boolean; // True nếu (now - (updatedAt ?? publishedAt)) > 730 ngày
}

export interface PostDetail extends PostSummary {
  content: string;
  toc: TocItem[];
  relatedPosts: PostSummary[];
  seriesPosts: PostSummary[]; // Các bài viết cùng series được sắp xếp theo series.order tăng dần
}

export interface PostFilterCriteria {
  category?: Category;
  tag?: AllowedTag;
  type?: PostType;
  q?: string;
}
```

---

## 5. Đặc Tả Kỹ Thuật Cho Tầng Nghiệp Vụ (`toc.ts`, `filters.ts`, `seo.ts`)

### 5.1. Trích xuất Mục lục bằng AST & Đếm Thời gian đọc (`src/lib/toc.ts`)
1. **Hàm `extractTocFromMdx(rawMdx: string): TocItem[]`:**
   - Khởi tạo `const slugger = new GitHubSlugger()` mới cho mỗi bài viết.
   - Parse `rawMdx` thành cây AST bằng `unified().use(remarkParse).parse(rawMdx)`.
   - Duyệt cây AST bằng `visit(tree, 'heading', (node) => ...)`:
     - Chỉ lấy các node có `node.depth === 2 || node.depth === 3` (nhờ duyệt AST nên các dòng `##` nằm trong khối code fence ` ``` ` thuộc node `code` sẽ tự động bị bỏ qua 100%).
     - Trích xuất văn bản thuần bằng `toString(node).trim()`.
     - Tạo ID bằng `slugger.slug(text)` để khớp tuyệt đối với `rehype-slug` kể cả khi tiêu đề có dấu tiếng Việt.
2. **Hàm `calculateTechnicalReadingTime(rawMdx: string): ReadingTimeStats`:**
   - Tách toàn bộ khối fenced code (`/^```[\s\S]*?^```/gm`) để đếm `codeLines`, sau đó xóa chúng khỏi chuỗi tạm.
   - Đếm số lượng ảnh Markdown (`!\[.*?\]\(.*?\)`) và thẻ `<Image\b` / `<img\b` để lấy `imageCount`.
   - Trích xuất văn bản trong thuộc tính `title="..."` của `<Callout ...>` rồi loại bỏ các thẻ cú pháp JSX/HTML nhưng giữ nguyên nội dung bên trong để đếm `wordCount`.
   - Tính `readingTimeMinutes` theo đúng công thức `BR-03`.

### 5.2. Hàm Lọc Thuần Khiết Không Dấu (`src/lib/filters.ts`)
- Cung cấp hàm chuẩn hóa chuỗi tiếng Việt:
  ```typescript
  export function normalizeSearchText(input: string): string {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase()
      .trim();
  }
  ```
- Hàm `parseFilterParams(params: Record<string, string | string[] | undefined>): PostFilterCriteria`: Kiểm tra hợp lệ từng tham số với `CategorySchema.safeParse`, `AllowedTagSchema.safeParse`, `PostTypeSchema.safeParse`; nếu tham số trên URL không hợp lệ thì bỏ qua an toàn (không làm crash trang).
- Hàm `filterPosts(posts: PostSummary[], criteria: PostFilterCriteria): PostSummary[]`: Thực thi lọc kết hợp theo đúng `BR-05`.

### 5.3. Chuẩn hóa Canonical URL & JSON-LD (`src/lib/seo.ts`)
- Hàm `buildCanonicalUrl(slug: string, customCanonicalUrl?: string): string`: Thực thi `BR-06`.
- Hàm `buildArticleJsonLd(post: PostSummary)` và `buildPersonJsonLd()`: Sinh đối tượng JSON-LD chuẩn Schema.org.

---

## 6. Bản Đồ Ranh Giới Server / Client Component (Khóa Chặt 5 Client Islands)

| STT | Component | Đường dẫn file | Phân loại | Lý do & Dữ liệu được phép nhận |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `ThemeProvider` | `src/components/layout/ThemeProvider.tsx` | **Client (`'use client'`)** | Bọc `NextThemesProvider` của `next-themes` ở `RootLayout`. |
| 2 | `ThemeToggle` | `src/components/layout/ThemeToggle.tsx` | **Client (`'use client'`)** | Đổi giao diện Sáng/Tối qua hook `useTheme()`. |
| 3 | `ArchiveExplorer` | `src/components/blog/ArchiveExplorer.tsx` | **Client (`'use client'`)** | Nhận `initialPosts: PostSummary[]` từ Server; dùng `useSearchParams()` + `filterPosts()` lọc tức thì ở Client và đồng bộ URL. |
| 4 | `TableOfContents` | `src/components/blog/TableOfContents.tsx` | **Client (`'use client'`)** | Nhận `items: TocItem[]`; dùng `IntersectionObserver` tô sáng mục đang đọc. |
| 5 | `CodeBlockCopyButton` | `src/components/mdx/CodeBlockCopyButton.tsx` | **Client (`'use client'`)** | Nhận `code: string`; sao chép code vào Clipboard. |
| — | **Toàn bộ Pages, Layouts & Components còn lại** | `src/app/**`, `src/components/**` | **Server (RSC)** | Render tĩnh 100% lúc build, không phát sinh Client JS bundle. |

---

## 7. Ba Chốt Chặn Kiểm Tra Lúc Build (Fail-Fast Build Guards)
Tại `src/lib/posts.ts`, hàm đọc thư mục bài viết phải thực thi 3 chốt chặn sau (nếu vi phạm bất kỳ chốt chặn nào, ném `Error` làm dừng ngay lập tức `npm run build` hoặc `npm run test`):

1. **Guard 1 — File-Slug Parity & Uniqueness Guard:**
   - Chỉ đọc các file `.mdx` nằm trực tiếp trong thư mục `postsDir` (không duyệt đệ quy thư mục con).
   - Tên file vật lý (bỏ đuôi `.mdx`) bắt buộc phải khớp 100% với trường `slug` trong Frontmatter. Do tên file trong cùng một thư mục là duy nhất trên hệ điều hành, việc khóa chặt `filename === slug` đồng thời đảm bảo không bao giờ có 2 bài viết trùng `slug`.
2. **Guard 2 — Schema, Date & Post-Mortem Environment Guard:**
   - Gọi `PostFrontmatterSchema.safeParse(rawFrontmatter)`. Nếu thất bại, sử dụng `z.prettifyError(result.error)` của Zod 4 để in rõ tên file và trường bị lỗi (bao gồm kiểm tra ngày thực tế `isValidIsoDateString`, `updatedAt >= publishedAt`, danh mục thẻ `AllowedTagSchema` và bắt buộc có `environment` khi `postType === 'post-mortem'`).
3. **Guard 3 — NDA & Sanitization Publication Guard:**
   - Tích hợp trực tiếp trong `PostFrontmatterSchema`: Mọi bài viết có `draft: false` bắt buộc phải có `sanitized: true`. Nếu tác giả chuyển `draft: false` mà quên xác nhận `sanitized: true`, quá trình build sẽ bị chặn đứng ngay lập tức.

---

## 8. Quy Trình Đóng Gói Docker, Tìm Kiếm Tĩnh & Kiểm Chứng CI/CD
- **Scripts chuẩn trong `package.json`:**
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build && npx pagefind --site .next/server/app --output-path public/pagefind",
      "start": "next start",
      "typecheck": "tsc --noEmit",
      "lint": "eslint .",
      "test": "vitest run",
      "test:watch": "vitest"
    }
  }
  ```
- **GitHub Actions CI (`.github/workflows/ci.yml`):** Tự động chạy tuần tự `npm ci` -> `npm run typecheck` -> `npm run lint` -> `npm run test` -> `npm run build` -> Kiểm tra Docker build và đo điểm Lighthouse CI (đảm bảo Performance, Accessibility, Best Practices, SEO đều từ 95 trở lên).
