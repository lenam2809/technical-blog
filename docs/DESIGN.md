# DESIGN SYSTEM & UI/UX SPECIFICATION (v2.0)
**Trạng thái hiện tại:** `BASELINE_READY` (Sẵn sàng để triển khai khung giao diện và đồng bộ thông số từ Google Stitch qua MCP).  
**Phong cách chủ đạo:** Engineering Documentation & Minimalist Technical Portfolio (Lấy cảm hứng từ Stripe Docs, Vercel Geist và Linear Blog — ưu tiên tốc độ quét thông tin, độ tương phản cao đạt chuẩn WCAG AA và trải nghiệm đọc code sắc nét).

---

## 1. Cơ Chế Đồng Bộ Với Google Stitch (Stitch MCP Sync Protocol)
1. **Giai đoạn Baseline (Khi bắt đầu `TASK-01`):** Agent sử dụng bộ CSS Variables, Typography và quy tắc bố cục định nghĩa sẵn trong tài liệu này để dựng khung ứng dụng không bị kẹt.
2. **Giai đoạn Đồng bộ Google Stitch (Khi chạy Stitch MCP):**
   - Khi Developer yêu cầu đồng bộ từ Google Stitch, Agent chỉ cập nhật các giá trị mã màu, bo góc (`border-radius`) và khoảng cách trong mục **2. Hệ thống Biến Màu (Design Tokens)** của file này và `src/app/globals.css`.
   - Tuyệt đối giữ nguyên tên các biến CSS (`--bg-primary`, `--callout-symptom-bg`, v.v.) để không phải sửa lại code trong các React Components.

---

## 2. Hệ Thống Biến Màu & Độ Tương Phản (Color Tokens — WCAG AA)
Toàn bộ màu sắc được khai báo qua CSS Variables trong `src/app/globals.css`, hỗ trợ chuyển đổi mượt mà giữa Light Mode (`:root`) và Dark Mode (`.dark`).

### 2.1. Bảng màu Nền, Văn bản & Đường viền (Surface & Text Tokens)

| Biến CSS | Light Mode (`:root`) | Dark Mode (`.dark`) | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#FFFFFF` | `#0B0F17` | Nền chính của toàn trang (tối ưu đọc lâu không mỏi mắt). |
| `--bg-secondary` | `#F8FAFC` | `#111827` | Nền thẻ bài viết (`PostCard`), thanh TOC, khối Author Bio. |
| `--bg-elevated` | `#F1F5F9` | `#1E293B` | Nền khi hover thẻ, nền nút bấm phụ, nền `EnvironmentBadges`. |
| `--bg-code` | `#0F172A` | `#090D16` | Nền khối code (`PreBlock`) — giữ nền tối chuyên biệt cho code ở cả 2 chế độ. |
| `--text-primary` | `#0F172A` | `#F8FAFC` | Tiêu đề, văn bản chính (Độ tương phản lớn hơn 14:1). |
| `--text-secondary` | `#334155` | `#CBD5E1` | Đoạn văn mô tả, nội dung trong Callout, mục lục TOC. |
| `--text-muted` | `#64748B` | `#94A3B8` | Ngày đăng, thời gian đọc, chú thích ảnh (Độ tương phản lớn hơn 4.6:1). |
| `--border-subtle` | `#E2E8F0` | `#1E293B` | Đường viền chia tách section, viền thẻ bài viết, viền bảng dữ liệu. |
| `--border-strong` | `#CBD5E1` | `#334155` | Đường viền khi focus ô tìm kiếm, viền thẻ Featured Case Study. |
| `--accent-primary` | `#2563EB` | `#3B82F6` | Liên kết, nút CTA chính, vạch đánh dấu mục TOC đang đọc. |
| `--accent-emerald` | `#059669` | `#10B981` | Nhãn chỉ số tác động (`impact` badge) trên các Featured Case Studies. |

### 2.2. Bảng màu 6 Khối Callout Kỹ thuật (`<Callout type="...">`)
Mỗi loại Callout có viền trái dày `4px` (`border-l-4`), nền pha màu nhẹ và biểu tượng (Lucide Icon) riêng biệt để người đọc nhận diện tức thì cấu trúc lập luận:

| Loại Callout (`type`) | Icon (`lucide-react`) | Nhãn mặc định | Màu chủ đạo (Light / Dark Border & Icon) | Nền (Light / Dark Background) |
| :--- | :--- | :--- | :--- | :--- |
| **`symptom`** | `AlertOctagon` | Triệu chứng & Biểu hiện lỗi | `#DC2626` / `#F87171` (Red) | `#FEF2F2` / `rgba(127, 29, 29, 0.2)` |
| **`investigation`** | `SearchCode` | Quá trình Điều tra & Truy vết | `#D97706` / `#FBBF24` (Amber) | `#FFFBEB` / `rgba(120, 53, 15, 0.2)` |
| **`root-cause`** | `Bug` | Nguyên nhân Gốc rễ (Root Cause) | `#9333EA` / `#C084FC` (Purple) | `#FAF5FF` / `rgba(88, 28, 135, 0.2)` |
| **`solution`** | `CheckCircle2` | Giải pháp Khắc phục | `#059669` / `#34D399` (Emerald) | `#ECFDF5` / `rgba(6, 78, 59, 0.2)` |
| **`benchmark`** | `Gauge` | Số liệu Đo kiểm (Benchmark) | `#0284C7` / `#38BDF8` (Sky Blue) | `#F0F9FF` / `rgba(12, 74, 110, 0.2)` |
| **`warning`** | `AlertTriangle` | Lưu ý & Đánh đổi (Trade-off) | `#EA580C` / `#FB923C` (Orange) | `#FFF7ED` / `rgba(124, 45, 18, 0.2)` |

### 2.3. Nhãn Khuôn mẫu Bài viết (`postType` Badges)
- **`post-mortem`**: Nền `#FEF2F2` (Dark: `rgba(220,38,38,0.15)`), chữ `#DC2626` (Dark: `#FCA5A5`), nhãn hiển thị: `POST-MORTEM`.
- **`deep-dive`**: Nền `#EFF6FF` (Dark: `rgba(37,99,235,0.15)`), chữ `#2563EB` (Dark: `#93C5FD`), nhãn hiển thị: `DEEP-DIVE`.
- **`reference`**: Nền `#F0FDF4` (Dark: `rgba(22,163,74,0.15)`), chữ `#16A34A` (Dark: `#86EFAC`), nhãn hiển thị: `REFERENCE`.

---

## 3. Hệ Thống Typography & Khả Năng Đọc Kỹ Thuật
- **Font Văn bản (`--font-sans`):** `Inter` (nạp qua `next/font/google` với `subsets: ['latin', 'vietnamese']`, `display: 'swap'`).
- **Font Kỹ thuật & Code (`--font-mono`):** `JetBrains Mono` (nạp qua `next/font/google` với `subsets: ['latin', 'vietnamese']`, `display: 'swap'`). Bắt buộc áp dụng `--font-mono` cho:
  - Khối code (`<pre>`, `<code>`), số thứ tự dòng.
  - Huy hiệu môi trường (`EnvironmentBadges`: `.NET 4.8`, `Oracle 19c`, `Docker 27`).
  - Huy hiệu chỉ số tác động (`impact`), thời gian đọc và ngày xuất bản.
- **Tỷ lệ chữ & Độ rộng dòng đọc (Reading Measure):**
  - Cột nội dung văn bản bài viết giới hạn tối đa `740px` (`max-w-[740px]`), cỡ chữ `1.0625rem` (`17px`), chiều cao dòng `1.75` (`leading-relaxed`) giúp đọc các bài phân tích dài không bị mỏi mắt.
  - Khối code có cỡ chữ `0.875rem` (`14px`), chiều cao dòng `1.6`, padding `16px`, có thanh tiêu đề chiều cao `40px` hiển thị tên ngôn ngữ/tên file ở góc trái và nút `CodeBlockCopyButton` ở góc phải.

---

## 4. Quy Chuẩn Bố Cục 3 Màn Hình Cốt Lõi (Screen Layouts)

### 4.1. Màn hình 1 — Trang Đọc Bài Viết Chi Tiết (`/blog/[slug]`)
- **Container tổng:** Rộng tối đa `1120px` (`max-w-6xl mx-auto px-4 sm:px-6`).
- **Header bài viết:**
  - Hàng 1: Nhãn `Category` + Nhãn `postType` + Nhãn `[BẢN NHÁP]` (nếu ở `development` và `draft: true`).
  - Hàng 2: Tiêu đề `h1` (`text-3xl sm:text-4xl font-bold tracking-tight`).
  - Hàng 3: Ngày xuất bản, Ngày cập nhật, Thời gian đọc (`BR-03`).
  - Hàng 4: Khung **Environment Badges** (hiển thị dạng các pill monospace nhỏ gọn có icon `Server`/`Database`) và huy hiệu **Impact** (nếu có).
  - Hàng 5 (Tùy điều kiện): `OutdatedBanner` (nếu bài viết quá 24 tháng) và `SeriesBanner` (nếu bài viết thuộc chuỗi bài nhiều kỳ).
- **Thân bài viết (2-Column Grid trên Desktop `lg:grid-cols-[minmax(0,740px)_260px] lg:gap-12`):**
  - Cột trái: Nội dung MDX, các khối `Callout`, bảng dữ liệu và khối code (`overflow-x-auto`).
  - Cột phải (Ẩn trên Mobile, cố định `sticky top-24` trên Desktop): `TableOfContents` hiển thị danh sách `h2`, `h3` và vạch dọc tô sáng mục đang đọc.
- **Chân bài viết:** Khối `AuthorCard` (kèm liên kết tới `/about` và GitHub) + Khối `RelatedPosts` (tối đa 3 thẻ theo `BR-04`).

### 4.2. Màn hình 2 — Trang Chủ & Kho Tài Liệu (`/`)
- **Hero Section:** Bố cục gọn gàng giới thiệu tên, vai trò kỹ sư, các nhóm công nghệ trọng tâm (`.NET`, `Oracle SQL`, `Web API`, `Docker`, `Next.js`) và 2 nút điều hướng: *"Hồ sơ Năng lực & Dịch vụ (/about)"* (Primary Button) và *"Tải RSS / GitHub"* (Secondary Button).
- **Khu vực Featured Case Studies (`BR-02`):** Lưới 3 cột trên Desktop (`grid-cols-1 md:grid-cols-3 gap-6`). Mỗi thẻ bài viết tiêu biểu có viền nổi bật, hiển thị rõ huy hiệu **Impact** màu xanh ngọc (`--accent-emerald`) để chứng minh kết quả thực tế ngay từ cái nhìn đầu tiên.
- **Khu vực Archive Explorer (`BR-05`):**
  - Thanh tìm kiếm (kèm nút mở tìm kiếm toàn văn Pagefind) + Bộ nút lọc nhanh theo 4 `Category`, `PostType` và danh sách `AllowedTag`.
  - Danh sách bài viết hiển thị dạng danh mục kỹ thuật (Technical Feed), có trạng thái rỗng (Empty State) kèm nút *"Xóa bộ lọc"* khi không tìm thấy kết quả.

### 4.3. Màn hình 3 — Trang Hồ Sơ Năng Lực Dual-Track (`/about`)
- **Phần 1 — Tóm tắt Chuyên môn (Executive Summary — Song ngữ Việt/Anh):** Định vị rõ kinh nghiệm kết hợp giữa hệ thống doanh nghiệp cốt lõi (.NET, Oracle, SQL) và quy trình hiện đại hóa (Docker, CI/CD, Next.js).
- **Phần 2 — Ma trận Năng lực Kỹ thuật (Bento Grid 3 Khối):**
  1. *Backend & Enterprise Systems (.NET Framework / .NET 8+, Web API, EF, RDLC).*
  2. *Database & Performance Tuning (Oracle PL/SQL, Execution Plan, Indexing, Deadlock).*
  3. *DevOps & Modern Web Architecture (Docker, Microservices, Outbox, Next.js, TypeScript).*
- **Phần 3 — Dự án & Case Studies Thực chứng:** Danh sách các bài toán thực tế đã giải quyết, kèm liên kết dẫn thẳng tới bài viết `post-mortem` hoặc `deep-dive` tương ứng trên blog.
- **Phần 4 — Dual-Track Call to Action (2 Thẻ đối xứng):**
  - **Thẻ 1 — Dành cho Nhà tuyển dụng & Tech Lead:** Tóm tắt giá trị đóng góp cho đội ngũ kỹ thuật, liên kết GitHub/LinkedIn và nút liên hệ.
  - **Thẻ 2 — Dành cho Khách hàng & Đối tác:** Liệt kê 4 hạng mục nhận tư vấn/triển khai (Tối ưu truy vấn Oracle/SQL, phát triển/nâng cấp .NET Web API, xây dựng web app Next.js, đóng gói Docker & CI/CD) kèm nút gửi Email trao đổi.

---

## 5. Tiêu Chuẩn Khả Năng Truy Cập (Accessibility — WCAG AA Checklist)
1. **Skip Link:** Thẻ `<a href="#main-content" class="sr-only focus:not-sr-only ...">Chuyển đến nội dung chính</a>` đặt đầu tiên trong `RootLayout`.
2. **Keyboard Navigation:** Mọi nút bấm (`ThemeToggle`, `CodeBlockCopyButton`, chip lọc) và vùng cuộn code (`<pre tabIndex={0}>`) đều có đường viền `focus-visible:ring-2 focus-visible:ring-blue-500` rõ nét.
3. **Responsive Safety:** Không có bất kỳ phần tử nào gây tràn ngang toàn trang (`horizontal overflow`) ở kích thước màn hình `375px`.
