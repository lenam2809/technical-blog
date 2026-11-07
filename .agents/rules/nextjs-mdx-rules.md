---
description: Quy tắc kỹ thuật bắt buộc cho Next.js 16 App Router, React 19.2, TypeScript 5.8 Strict, Zod 4, MDX AST Pipeline và Ranh giới Server/Client
globs: "**/*.{ts,tsx,mdx}"
---

# QUY TẮC KỸ THUẬT NEXT.JS 16, TYPESCRIPT, ZOD 4 & MDX (v2.0)

## 1. Kỷ Luật Server-First, SSG & Ranh Giới 5 Client Islands
- Toàn bộ các trang nội dung (`/`, `/about`, `/blog/[slug]`, `/category/[category]`, `/tags/[tag]`) BẮT BUỘC được biên dịch tĩnh tại thời điểm build (**Static Site Generation - SSG**).
- **Cấm dùng `searchParams` ở `src/app/page.tsx`:** Để giữ trang chủ `/` là 100% Static RSC, `page.tsx` không được đọc prop `searchParams`. Thay vào đó, `page.tsx` đọc danh sách `PostSummary[]` lúc build và truyền xuống `<Suspense fallback={<ArchiveSkeleton />}><ArchiveExplorer initialPosts={posts} /></Suspense>`.
- Chỉ có đúng **5 Component lá (Client Islands)** sau đây được phép đặt chỉ thị `'use client'`:
  1. `src/components/layout/ThemeProvider.tsx` (Wrapper bọc `NextThemesProvider` của `next-themes`).
  2. `src/components/layout/ThemeToggle.tsx` (Nút chuyển đổi chế độ Sáng/Tối).
  3. `src/components/blog/ArchiveExplorer.tsx` (Quản lý ô tìm kiếm, bộ lọc Category/Tag/PostType và đồng bộ 2 chiều với URL qua `useSearchParams` + `useRouter`).
  4. `src/components/blog/TableOfContents.tsx` (Theo dõi vị trí cuộn trang bằng `IntersectionObserver`).
  5. `src/components/mdx/CodeBlockCopyButton.tsx` (Sao chép nội dung code vào Clipboard).
- **Quy tắc truyền dữ liệu qua ranh giới RSC -> Client:**
  - CẤM truyền đối tượng `PostDetail` (chứa nội dung MDX thô `content`) xuống bất kỳ Client Component nào.
  - ĐƯỢC PHÉP truyền mảng `PostSummary[]` (đã lược bỏ `content`) xuống `ArchiveExplorer.tsx`, mảng `TocItem[]` xuống `TableOfContents.tsx`, và chuỗi `code: string` xuống `CodeBlockCopyButton.tsx`.

## 2. Kỷ Luật Next.js 16, TypeScript Strict & Zod 4
- **TypeScript 5.8 (`strict: true`):** Cấm tuyệt đối kiểu `any`, ép kiểu mù `as unknown as X`, hoặc dùng `@ts-ignore` / `@ts-expect-error`.
- **Quy ước Next.js 16:**
  - `params` trong `page.tsx`, `layout.tsx`, `generateMetadata` hoặc `opengraph-image.tsx` là kiểu **Promise** — bắt buộc phải `await params` trước khi truy cập thuộc tính.
  - Sử dụng ESLint 9 Flat Config (`eslint .`) thay cho lệnh `next lint` đã bị loại bỏ trên Next.js 16.
- **Quy ước Zod 4 (`zod@^4.0.0`):**
  - Sử dụng cú pháp chuẩn của Zod 4: dùng `z.url({ error: '...' })` thay cho `z.string().url()`, dùng thuộc tính `{ error: '...' }` khi tùy biến thông báo lỗi, và dùng `z.prettifyError(result.error)` khi định dạng thông báo lỗi Fail-Fast lúc build.

## 3. Tiêu Chuẩn Biên Dịch MDX, AST TOC & 15 Ngôn Ngữ Code
- **Zero Client Syntax JS:** Quá trình biên dịch MDX và tô màu cú pháp bằng `rehype-pretty-code` + `shiki` bắt buộc thực hiện 100% trên Server lúc build.
- **Danh sách 15 ngôn ngữ code bắt buộc hỗ trợ:**
  `csharp`, `sql`, `plsql`, `xml`, `json`, `typescript`, `tsx`, `javascript`, `yaml`, `dockerfile`, `bash`, `powershell`, `http`, `diff`, `text`.
- **Đồng bộ ID Mục lục Tiếng Việt (TOC Synchronization):**
  - Cấm dùng Regex trên chuỗi Markdown thô để trích xuất mục lục (tránh bắt nhầm ký tự `##` bên trong khối code fence và tránh lệch dấu tiếng Việt).
  - `src/lib/toc.ts` BẮT BUỘC phân tích cây cú pháp (`unified` + `remark-parse` + `unist-util-visit`) để chỉ lấy các node `heading` cấp 2 và 3, đồng thời dùng trực tiếp `GitHubSlugger` từ package `github-slugger` (cùng thuật toán với `rehype-slug`) để sinh `id`.
- Mọi khối code (`<pre>`) và bảng dữ liệu (`<table>`) phải bọc trong vùng chứa có `overflow-x-auto` và hỗ trợ bàn phím (`tabIndex={0}`) để đảm bảo khả năng truy cập (WCAG AA) và không vỡ bố cục trên màn hình 375px.

## 4. Kiến Trúc Dễ Kiểm Thử (Testable Domain Logic & Fixtures)
- Mọi hàm trong `src/lib/posts.ts`, `src/lib/toc.ts`, `src/lib/filters.ts`, `src/lib/seo.ts` phải là hàm thuần khiết hoặc hỗ trợ Dependency Injection:
  `getAllPosts(options?: { postsDir?: string; includeDrafts?: boolean; now?: Date })`.
- **Quy tắc Môi trường (`BR-01`):** Mặc định `includeDrafts` chỉ bằng `true` khi `process.env.NODE_ENV === 'development'`. Khi chạy ở `production` hoặc `test` (`Vitest`), `includeDrafts` mặc định là `false`.
- **Cô lập dữ liệu kiểm thử:** Unit Test trong `src/lib/__tests__/` BẮT BUỘC đọc dữ liệu từ `src/lib/__tests__/__fixtures__/posts/`, tuyệt đối không phụ thuộc vào các bài viết thật trong `content/posts/`.
