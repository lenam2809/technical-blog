# ATOMIC TASK BACKLOG & ACCEPTANCE CRITERIA (v2.0)

**Quy ước trạng thái:** `[ ]` Chưa thực hiện | `[~]` Đang thực hiện | `[x]` Đã nghiệm thu  
**Nguyên tắc bắt buộc:** Agent chỉ thực hiện **duy nhất 1 Task** tại một thời điểm thông qua vòng lặp `/plan` 5 bước trong `AGENTS.md`. Không tự ý chuyển sang Task tiếp theo khi Developer chưa xác nhận nghiệm thu.

---

## [x] TASK-01: Khởi tạo Next.js 16, Cấu hình Công cụ Chất lượng, Design Tokens & Khung Layout
- **Mục tiêu:** Thiết lập nền móng dự án Next.js 16 App Router (TypeScript Strict, ESLint 9, Vitest, Tailwind CSS) cùng bộ giao diện khung (`RootLayout`, `Header`, `Footer`, Dark/Light mode, trang 404/Error) theo đúng `docs/DESIGN.md`.
- **Ngoại lệ áp dụng:** Áp dụng **Bootstrap Exception** tại mục 3.1 của `AGENTS.md` để cài đặt đúng danh sách thư viện đã ghim trong `docs/ARCHITECTURE.md`.
- **Phạm vi file cho phép:**
  - Cấu hình gốc: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `.gitignore`.
  - Mã nguồn: `src/lib/constants.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx` (bản giữ chỗ tối giản), `src/app/not-found.tsx`, `src/app/error.tsx`.
  - Layout Components: `src/components/layout/ThemeProvider.tsx` (**Client #1**), `src/components/layout/ThemeToggle.tsx` (**Client #2**), `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`.
- **Yêu cầu chi tiết:**
  1. Cấu hình `next.config.ts` với `output: 'standalone'`.
  2. Cấu hình scripts trong `package.json`: `"lint": "eslint ."`, `"typecheck": "tsc --noEmit"`, `"test": "vitest run"`.
  3. Khai báo đầy đủ biến màu CSS Variables (Light/Dark mode và 6 màu Callout) từ `docs/DESIGN.md` vào `src/app/globals.css`; nạp font `Inter` và `JetBrains Mono` hỗ trợ tiếng Việt.
  4. Đặt `<html lang="vi" suppressHydrationWarning>` và liên kết `Skip to content` trong `src/app/layout.tsx`.
- **Tiêu chí nghiệm thu & Kiểm chứng:**
  - Chạy `npm run typecheck`, `npm run lint`, `npm run build` đạt 0 lỗi.
  - Kiểm tra trên trình duyệt tích hợp: Chuyển đổi Sáng/Tối hoạt động mượt, không bị lỗi Hydration; trang 404 hiển thị đúng thiết kế.

---

## [x] TASK-02: Xây dựng Tầng Domain Repository, Zod 4 Schema, AST TOC, Bộ lọc & Unit Tests Cô lập
- **Mục tiêu:** Triển khai toàn bộ lõi nghiệp vụ xử lý bài viết, kiểm chứng 6 quy tắc nghiệp vụ (`BR-01` đến `BR-06`) và 3 chốt chặn Fail-Fast Build Guards (`Guard 1` đến `Guard 3`) bằng bộ kiểm thử Vitest đọc dữ liệu từ `__fixtures__`.
- **Phạm vi file cho phép:**
  - Hợp đồng & Nghiệp vụ: `src/types/post.ts`, `src/lib/toc.ts`, `src/lib/filters.ts`, `src/lib/seo.ts`, `src/lib/posts.ts`.
  - Dữ liệu kiểm thử cô lập: `src/lib/__tests__/__fixtures__/posts/*.mdx`.
  - Bộ Unit Tests: `src/lib/__tests__/posts.test.ts`, `src/lib/__tests__/toc.test.ts`, `src/lib/__tests__/filters.test.ts`, `src/lib/__tests__/seo.test.ts`.
- **Yêu cầu chi tiết:**
  1. Triển khai `PostFrontmatterSchema` bằng cú pháp **Zod 4** (`src/types/post.ts`): Kiểm tra ngày thực tế bằng hàm `isValidIsoDateString` (chặn `2026-02-31`), kiểm tra `updatedAt >= publishedAt`, bắt buộc mảng `environment` khi `postType === 'post-mortem'`, và bắt buộc `sanitized === true` khi `draft === false` (**Guard 3**).
  2. Triển khai `extractTocFromMdx` trong `src/lib/toc.ts` bằng `unified` + `remark-parse` + `unist-util-visit` + `GitHubSlugger` (bỏ qua hoàn toàn các dòng `##` nằm trong code fence và giữ nguyên quy tắc tạo ID tiếng Việt của `rehype-slug`) cùng hàm `calculateTechnicalReadingTime` (**BR-03**).
  3. Triển khai `normalizeSearchText`, `parseFilterParams`, `filterPosts` trong `src/lib/filters.ts` hỗ trợ tìm kiếm không dấu tiếng Việt (**BR-05**).
  4. Triển khai `buildCanonicalUrl` (**BR-06**) và `buildArticleJsonLd`, `buildPersonJsonLd` trong `src/lib/seo.ts`.
  5. Triển khai `getAllPosts`, `getPostBySlug`, `getFeaturedPosts` (**BR-02**), `getRelatedPosts` (**BR-04**) trong `src/lib/posts.ts` với cơ chế Dependency Injection (`{ postsDir, includeDrafts, now }`) và thực thi **Guard 1** (khớp tên file với `slug`), **Guard 2**, **Guard 3**.
- **Tiêu chí nghiệm thu & Kiểm chứng:**
  - Chạy `npm run test` vượt qua 100% các kịch bản kiểm thử cho `BR-01` -> `BR-06` và 3 Fail-Fast Guards (bao gồm test case ném lỗi khi `draft: false` mà `sanitized: false`, lỗi lệch tên file với `slug`, lỗi ngày `2026-02-31`, và test trích xuất TOC có dấu tiếng Việt + có code block chứa `##`).
  - Không có bất kỳ file test nào đọc dữ liệu từ thư mục `content/posts/`.

---

## [x] TASK-03: Xây dựng MDX Compilation Pipeline (15 Ngôn ngữ), 6 Callouts, Khối Code & 3 Bài viết Mẫu
- **Mục tiêu:** Xây dựng bộ biên dịch MDX trên Server với `rehype-pretty-code` + `shiki` (15 ngôn ngữ), 6 loại `<Callout>`, khung code kèm nút Copy, 3 file template và 3 bài viết MVP hoàn chỉnh.
- **Phạm vi file cho phép:**
  - MDX Pipeline & Components: `src/lib/mdx.ts`, `src/components/mdx/Callout.tsx`, `src/components/mdx/PreBlock.tsx`, `src/components/mdx/CodeBlockCopyButton.tsx` (**Client #5**).
  - Khuôn mẫu & Nội dung MVP:
    - `content/templates/post-mortem.mdx`, `content/templates/deep-dive.mdx`, `content/templates/reference.mdx`.
    - `content/posts/xu-ly-deadlock-va-can-kiet-connection-pool-oracle-web-api.mdx` (`post-mortem` / `database-sql`).
    - `content/posts/toi-uu-hieu-nang-truy-van-bao-cao-lon-trong-dotnet-va-oracle.mdx` (`deep-dive` / `dotnet-backend`).
    - `content/posts/so-tay-dong-goi-nextjs-va-dotnet-api-voi-docker-multi-stage.mdx` (`reference` / `devops-modern-web`).
- **Yêu cầu chi tiết:**
  1. Cấu hình `rehype-pretty-code` + `shiki` nạp sẵn 15 ngôn ngữ (`csharp`, `sql`, `plsql`, `xml`, `json`, `typescript`, `tsx`, `javascript`, `yaml`, `dockerfile`, `bash`, `powershell`, `http`, `diff`, `text`) hoàn toàn ở Server.
  2. Thiết kế `Callout.tsx` (RSC) hiển thị đúng màu sắc và icon của 6 chế độ: `symptom`, `investigation`, `root-cause`, `solution`, `benchmark`, `warning`.
  3. Thiết kế `PreBlock.tsx` (RSC) có `overflow-x-auto`, `tabIndex={0}` và truyền chuỗi code thô xuống `CodeBlockCopyButton.tsx` (**Client #5**).
  4. Soạn thảo 3 bài viết thật trong `content/posts/` tuân thủ nghiêm ngặt Checklist ẩn danh hóa (`sanitized: true`, `draft: false`), có chứa code C#, PL/SQL, Execution Plan dạng `text`, `xml` và `dockerfile`.
- **Tiêu chí nghiệm thu & Kiểm chứng:**
  - Chạy `npm run typecheck`, `npm run lint`, `npm run test` đạt 100%.
  - Toàn bộ 3 bài viết trong `content/posts/` vượt qua kiểm tra của 3 Fail-Fast Guards.

---

## [x] TASK-04: Xây dựng Trang Đọc Bài Viết (`/blog/[slug]`), Sticky TOC & Ảnh OG Động
- **Mục tiêu:** Hoàn thiện trải nghiệm đọc bài viết kỹ thuật chuyên sâu kèm mục lục cuộn tự động, huy hiệu môi trường, cảnh báo bài cũ, điều hướng chuỗi bài, JSON-LD và ảnh OpenGraph tự sinh.
- **Phạm vi file cho phép:**
  - Routes: `src/app/blog/[slug]/page.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`.
  - Blog Components: `src/components/blog/TableOfContents.tsx` (**Client #4**), `src/components/blog/EnvironmentBadges.tsx`, `src/components/blog/OutdatedBanner.tsx`, `src/components/blog/SeriesBanner.tsx`, `src/components/blog/AuthorCard.tsx`, `src/components/blog/RelatedPosts.tsx`.
- **Yêu cầu chi tiết:**
  1. Sử dụng `generateStaticParams` và `await params` chuẩn Next.js 16 trong `src/app/blog/[slug]/page.tsx`.
  2. Hiển thị đầy đủ Header bài viết (`Category`, `postType`, `EnvironmentBadges`, `impact`, `OutdatedBanner` khi bài quá 24 tháng, `SeriesBanner`), nội dung MDX, `TableOfContents` cố định bên phải trên Desktop, `AuthorCard`, `RelatedPosts` (`BR-04`) và thẻ `<script type="application/ld+json">` (`TechArticle`).
  3. Triển khai `opengraph-image.tsx` bằng `ImageResponse` (`next/og`) tạo ảnh kích thước `1200x630` hiển thị Tiêu đề bài viết, `postType`, `category`, các thẻ `environment` và thông tin tác giả.
- **Tiêu chí nghiệm thu & Kiểm chứng:**
  - `npm run build` biên dịch tĩnh thành công toàn bộ các trang `/blog/[slug]` và `/blog/[slug]/opengraph-image`.
  - Kiểm tra trên trình duyệt tích hợp ở độ rộng `375px` và `1440px`: Khối code cuộn ngang độc lập không làm vỡ trang; bấm vào mục lục trên `TableOfContents` cuộn mượt tới đúng tiêu đề tiếng Việt; nút Copy hoạt động chính xác.

---

## [x] TASK-05: Xây dựng Trang Chủ SSG (`/`), Featured Case Studies, Archive Explorer & Trang Taxonomy Tĩnh
- **Mục tiêu:** Hoàn thiện trang chủ tĩnh 100% kết hợp bộ lọc tức thì đồng bộ URL (`BR-05`) và các trang chuyên mục/thẻ tĩnh chuẩn SEO.
- **Phạm vi file cho phép:**
  - Routes: `src/app/page.tsx`, `src/app/category/[category]/page.tsx`, `src/app/tags/[tag]/page.tsx`.
  - Components: `src/components/blog/PostCard.tsx`, `src/components/blog/FeaturedPosts.tsx`, `src/components/blog/ArchiveExplorer.tsx` (**Client #3**).
- **Yêu cầu chi tiết:**
  1. Giữ `src/app/page.tsx` là Static RSC (tuyệt đối không đọc prop `searchParams`): Hiển thị Hero Section, khu vực `FeaturedPosts` (`BR-02` kèm huy hiệu `impact`), và bọc `<Suspense>` quanh `<ArchiveExplorer initialPosts={posts} />`.
  2. Trong `ArchiveExplorer.tsx` (**Client #3**), sử dụng `useSearchParams()`, `useRouter()` và hàm `filterPosts()` từ `src/lib/filters.ts` để lọc tức thì theo `category`, `tag`, `type`, `q` (hỗ trợ gõ tiếng Việt không dấu) và đồng bộ 2 chiều lên URL.
  3. Xây dựng 2 trang tĩnh `/category/[category]/page.tsx` và `/tags/[tag]/page.tsx` bằng `generateStaticParams` kèm metadata SEO riêng cho từng chuyên mục và thẻ.
- **Tiêu chí nghiệm thu & Kiểm chứng:**
  - Khi chạy `npm run build`, kết quả log của Next.js 16 phải đánh dấu route `/` là `○ (Static)` và `/category/[category]`, `/tags/[tag]` là `● (SSG)`.
  - Truy cập trực tiếp URL có sẵn query params (ví dụ: `/?category=database-sql&q=deadlock`) hiển thị đúng danh sách đã lọc và giữ nguyên trạng thái khi tải lại trang.

---

## [x] TASK-06: Xây dựng Trang Hồ Sơ Năng Lực Dual-Track (`/about`) & Hệ Thống Sitemap, Robots, RSS
- **Mục tiêu:** Hoàn thiện trang Portfolio kỹ thuật thuyết phục Nhà tuyển dụng & Khách hàng, đồng thời xuất bản Sitemap, Robots và RSS Feed tự động.
- **Phạm vi file cho phép:**
  - `src/app/about/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/rss.xml/route.ts`.
- **Yêu cầu chi tiết:**
  1. Xây dựng `/about` theo đúng cấu trúc **Dual-Track** trong `docs/PRD.md` và `docs/DESIGN.md`: Phần giới thiệu song ngữ Việt/Anh, Ma trận năng lực 3 trụ cột (.NET Backend, Oracle/SQL Tuning, DevOps & Modern Web), Danh sách dự án thực chứng liên kết thẳng tới các bài viết trên blog, và 2 khối CTA tách biệt cho **Nhà tuyển dụng / Tech Lead** và **Khách hàng / Đối tác**.
  2. Nhúng JSON-LD kiểu `Person` vào trang `/about`.
  3. Hoàn thiện `sitemap.ts`, `robots.ts` và `rss.xml/route.ts` (đảm bảo loại bỏ 100% bài nháp `draft: true` theo `BR-01`).
- **Tiêu chí nghiệm thu & Kiểm chứng:**
  - Truy cập `/about`, `/sitemap.xml`, `/robots.txt`, `/rss.xml` trả về HTTP 200 và định dạng chuẩn.
  - Kiểm tra đúng chỉ có **5 files** trong toàn bộ dự án có chứa chỉ thị `'use client'` (`grep -rn "'use client'" src/`).

---

## [x] TASK-07: Tích hợp Tìm Kiếm Toàn Văn Tĩnh (Pagefind), Đóng gói Docker & Thiết Lập CI/CD
- **Mục tiêu:** Tích hợp công cụ tìm kiếm toàn văn tĩnh Pagefind, đóng gói ứng dụng vào Multi-stage Docker image gọn nhẹ và thiết lập GitHub Actions CI kiểm tra chất lượng tự động.
- **Phạm vi file cho phép:**
  - `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `.github/workflows/ci.yml`, `package.json` (cập nhật script `postbuild` cho Pagefind nếu cần), cập nhật tích hợp giao diện tìm kiếm Pagefind trong `src/components/blog/ArchiveExplorer.tsx`.
- **Yêu cầu chi tiết:**
  1. Cấu hình lệnh build tự động chạy `npx pagefind --site .next/server/app --output-path public/pagefind` sau khi `next build` hoàn tất.
  2. Viết Multi-stage `Dockerfile` (dựa trên `node:22-alpine`) sử dụng thư mục `.next/standalone`, chạy dưới quyền non-root user (`nextjs`), mở cổng `3000`.
  3. Thiết lập `.github/workflows/ci.yml` tự động chạy: `npm ci` -> `npm run typecheck` -> `npm run lint` -> `npm run test` -> `npm run build` -> Kiểm tra build Docker image.
- **Tiêu chí nghiệm thu & Kiểm chứng:**
  - Toàn bộ pipeline `typecheck`, `lint`, `test`, `build` vượt qua 100% không có cảnh báo.
  - Build và khởi chạy thành công Docker container tại cổng 3000; kiểm tra điểm Lighthouse trên trình duyệt đạt từ 95 trở lên ở cả 4 hạng mục (Performance, Accessibility, Best Practices, SEO).
