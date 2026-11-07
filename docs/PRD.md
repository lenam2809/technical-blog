# PRODUCT REQUIREMENTS DOCUMENT (PRD v2.0)
**Tên dự án:** Technical Blog & Engineering Portfolio  
**Ngôn ngữ chính:** Tiếng Việt (`lang="vi"`), giữ nguyên thuật ngữ chuyên ngành tiếng Anh chuẩn; trang Hồ sơ năng lực (`/about`) hỗ trợ tóm tắt song ngữ Việt – Anh.  
**Giấy phép nội dung:** Mã nguồn minh họa trong bài viết theo giấy phép **MIT License**; nội dung bài viết và sơ đồ phân tích theo giấy phép **CC BY-NC-SA 4.0**.

---

## 1. Năm Mục Tiêu Cốt Lõi & Thước Đo Thành Công
1. **Chia sẻ kinh nghiệm lập trình thực tế:** Đúc kết các bài toán tối ưu hiệu năng, thiết kế kiến trúc và tích hợp hệ thống (.NET Framework, .NET Core/8+, ASP.NET Web API, Oracle Database, SQL) qua 3 khuôn mẫu bài viết chuẩn hóa.
2. **Ghi lại quá trình phân tích và xử lý lỗi:** Chuẩn hóa quy trình viết báo cáo sự cố (Post-mortem) từ triệu chứng, giả thuyết điều tra, nguyên nhân gốc rễ đến giải pháp và số liệu đo kiểm.
3. **Xây dựng thương hiệu cá nhân:** Tối ưu hóa nhận diện chuyên gia qua ảnh OpenGraph tự động cho từng bài, dữ liệu có cấu trúc JSON-LD (`TechArticle`, `Person`), chuỗi bài viết chuyên sâu (`series`) và thẻ tác giả.
4. **Tạo nguồn tài liệu tham khảo lâu dài:** Hỗ trợ tìm kiếm nhanh không dấu và tìm kiếm toàn văn tĩnh (Pagefind), phân loại theo danh mục thẻ kiểm soát chặt chẽ, tự động cảnh báo bài viết cũ (trên 24 tháng) kèm ngữ cảnh phiên bản môi trường.
5. **Chứng minh năng lực với Nhà tuyển dụng & Khách hàng:** Trưng bày các **Featured Case Studies** có chỉ số tác động định lượng (`impact`) ngay tại trang chủ và thiết kế trang `/about` theo mô hình **Dual-Track** (phục vụ riêng cho Nhà tuyển dụng/Tech Lead và Khách hàng thuê tư vấn/triển khai).

---

## 2. Mô Hình Miền Nội Dung (Content Domain Model)

### 2.1. Ba Khuôn Mẫu Bài Viết (`postType` Archetypes — Hình thức trình bày)
Trường `postType` định nghĩa **cấu trúc trình bày** của bài viết (trực giao hoàn toàn với miền công nghệ `category`):

| Mã khuôn mẫu (`postType`) | Mục đích cốt lõi | Đặc điểm hiển thị & Cấu trúc bắt buộc |
| :--- | :--- | :--- |
| **`post-mortem`** *(Nhật ký xử lý sự cố)* | Ghi lại quá trình điều tra, truy vết nguyên nhân gốc rễ và khắc phục lỗi thực tế. | Bắt buộc khai báo và hiển thị thanh **Environment Badges** (VD: `[".NET Framework 4.8", "Oracle 19c", "IIS 10"]`) ngay dưới tiêu đề. Khuyến nghị sử dụng chuỗi Callout: `symptom` -> `investigation` -> `root-cause` -> `solution` -> `benchmark`. |
| **`deep-dive`** *(Phân tích chuyên sâu)* | Phân tích kiến trúc hệ thống, tối ưu hóa truy vấn SQL/PL-SQL hoặc đánh giá giải pháp kỹ thuật. | Bố cục đọc chuyên sâu (Long-form), hiển thị **Sticky Table of Contents (TOC)** tới cấp `h3`, nhấn mạnh các bảng so sánh đánh đổi (Trade-offs) và khối `benchmark`. |
| **`reference`** *(Sổ tay tra cứu nhanh)* | Lưu trữ cấu hình chuẩn (Dockerfile, script PL/SQL, mẫu cấu hình Web API, lệnh CLI) để tra cứu trong 30 giây. | Giao diện cô đọng, thu gọn phần dẫn nhập, ưu tiên không gian cho các khối code kèm nút Copy nhanh và ghi chú `warning`. |

### 2.2. Bốn Chuyên Mục Công Nghệ (`category` — Miền chuyên môn)
Mỗi bài viết thuộc duy nhất **1 trong 4 chuyên mục công nghệ** (không chồng chéo với `postType`):
1. **`dotnet-backend`**: .NET Framework / .NET Core, C#, ASP.NET Web API, Entity Framework, quản lý bộ nhớ, bất đồng bộ, xử lý báo cáo (RDLC/ReportViewer) và hiệu năng tầng ứng dụng.
2. **`database-sql`**: Oracle Database, PL/SQL, tối ưu hóa câu truy vấn SQL, phân tích Execution Plan, chiến lược Indexing, xử lý Locking/Deadlock và thiết kế CSDL.
3. **`system-architecture`**: Thiết kế hệ thống phân tán, Microservices, tích hợp hệ thống (Outbox Pattern, Message Queue, Caching), bảo mật API (OpenIddict/OAuth2) và Observability/Logging.
4. **`devops-modern-web`**: Đóng gói ứng dụng với Docker & Docker Compose, thiết lập đường ống CI/CD, quản trị VPS/Linux và phát triển giao diện hiện đại với Next.js, React, TypeScript.

*(Ví dụ phân loại trực giao: Bài viết "Truy vết lỗi Deadlock trên Oracle 19c khi gọi từ Web API" sẽ có `postType: "post-mortem"` và `category: "database-sql"`).*

### 2.3. Danh Mục Thẻ Kiểm Soát (`tags` — Controlled Vocabulary)
- Mỗi bài viết gắn từ **1 đến 6 thẻ** nằm trong danh mục thẻ chuẩn hóa (`AllowedTagSchema` tại `src/lib/constants.ts`) nhằm ngăn chặn tình trạng phân mảnh thẻ (ví dụ: chỉ dùng thẻ chuẩn `oracle`, còn thông tin phiên bản cụ thể `Oracle 19c` được đặt trong trường `environment`).
- Hỗ trợ gom nhóm các bài viết dài kỳ thông qua trường tùy chọn `series: { name: string; order: number }`.

---

## 3. Sáu Quy Tắc Nghiệp Vụ Bất Biến (Invariant Business Rules)

### BR-01: Quản lý vòng đời Bản nháp theo Cơ chế Allow-list (Draft Visibility)
- Tầng Repository nhận tham số `includeDrafts: boolean` (mặc định là `process.env.NODE_ENV === 'development'`).
- Khi `includeDrafts === true` (chỉ ở môi trường `development`): Bài viết có `draft: true` được hiển thị kèm nhãn cảnh báo `[BẢN NHÁP]` màu vàng cam.
- Khi `includeDrafts === false` (mặc định ở môi trường `production` và `test`): Bài viết có `draft: true` bị loại bỏ tuyệt đối khỏi mọi danh sách, bộ lọc, kết quả tìm kiếm, gợi ý bài liên quan, trang chuyên mục/tag, `sitemap.xml`, `rss.xml`, và trả về `404` nếu truy cập đường dẫn tĩnh.

### BR-02: Trưng bày Case Study tiêu biểu & Chỉ số Tác động (Featured Posts & Impact)
- Các bài viết đã xuất bản có `featured: true` được chọn vào khu vực **"Case Studies & Bài viết Tiêu biểu"** ở đầu trang chủ (tối đa **3 bài mới nhất** theo `publishedAt` giảm dần).
- Nếu bài viết có khai báo trường `impact` (ví dụ: `"Giảm thời gian chạy báo cáo từ 45s xuống 320ms (-99.3%)"`), thẻ Featured Post sẽ hiển thị nổi bật huy hiệu kết quả này để thu hút nhà tuyển dụng và khách hàng.

### BR-03: Công thức tính Thời gian đọc Kỹ thuật Chính xác (Technical Reading Time)
- Trước khi tính toán trên nội dung MDX thô:
  1. **Đếm số dòng code (`codeLines`):** Trích xuất toàn bộ các khối fenced code (` ```...``` `), tính tổng số dòng bên trong các khối này, sau đó loại bỏ các khối code khỏi chuỗi văn bản.
  2. **Đếm số lượng hình ảnh (`imageCount`):** Đếm tổng số cú pháp ảnh Markdown (`![alt](url)`) và thẻ `<Image ... />` hoặc `<img ... />`.
  3. **Đếm số từ văn bản (`wordCount`):** Loại bỏ các thẻ mở/đóng JSX (như `<Callout type="symptom" title="...">` và `</Callout>`), nhưng **giữ nguyên toàn bộ phần văn bản nằm bên trong `<Callout>`** và tiêu đề `title` của Callout để đếm tổng số từ (tách theo khoảng trắng).
- Áp dụng công thức:
  $$\text{readingTimeMinutes} = \max\left(1, \left\lceil \frac{\text{wordCount}}{200} + \frac{\text{codeLines}}{25} + \frac{\text{imageCount} \times 12}{60} \right\rceil\right)$$

### BR-04: Thuật toán gợi ý Bài viết Liên quan Tất định (Deterministic Related Posts)
- Với bài viết hiện tại $P_{\text{current}}$, tính điểm tương đồng cho mọi bài viết đã xuất bản khác ($P_i \neq P_{\text{current}}$):
  $$\text{Score}(P_i) = (\text{Số tags trùng với } P_{\text{current}} \times 3) + (\text{Cùng category với } P_{\text{current}} \text{ ? } 2 : 0) + (\text{Cùng series.name với } P_{\text{current}} \text{ ? } 5 : 0)$$
- Loại bỏ các bài có $\text{Score}(P_i) = 0$. Sắp xếp theo $\text{Score}(P_i)$ giảm dần; nếu bằng điểm thì ưu tiên bài có `publishedAt` mới hơn (nếu cùng `publishedAt` thì sắp xếp theo `slug` tăng dần A-Z để đảm bảo tính tất định 100%). Lấy tối đa **3 bài đầu tiên**.

### BR-05: Kiến trúc Lọc Tĩnh – Động Kết Hợp & Đồng bộ URL (Hybrid SSG + URL Filter State)
- **Giữ trang `/` tĩnh 100% (SSG):** `src/app/page.tsx` biên dịch tĩnh lúc build và truyền danh sách `PostSummary[]` xuống Client Island `ArchiveExplorer`.
- **Hàm lọc thuần khiết (`src/lib/filters.ts`):** Cung cấp hàm `parseFilterParams(searchParams)` và `filterPosts(posts, criteria)` hỗ trợ lọc kết hợp (AND logic) theo:
  - `category` (khớp chính xác mã chuyên mục)
  - `tag` (bài viết có chứa tag được chọn)
  - `type` (khớp chính xác `postType`)
  - `q` (tìm kiếm chuỗi con **không phân biệt hoa thường và không phân biệt dấu tiếng Việt** trên các trường: `title`, `summary`, `tags`, `environment`, `impact`).
- Mọi thay đổi trên thanh bộ lọc cập nhật tức thì URL Query Parameters (`/?category=...&tag=...&type=...&q=...`) qua `router.replace(..., { scroll: false })` để người dùng có thể sao chép link chia sẻ.
- **Đường dẫn Taxonomy Tĩnh chuẩn SEO:** Bên cạnh bộ lọc tại `/`, hệ thống cung cấp các trang tĩnh `/category/[category]` và `/tags/[tag]` được sinh qua `generateStaticParams` để phục vụ máy tìm kiếm (Googlebot).

### BR-06: Quy tắc Canonical URL & Bảo vệ SEO Đa kênh
- Hàm `buildCanonicalUrl(slug, canonicalUrl?)` trong `src/lib/seo.ts` trả về `canonicalUrl` nếu được khai báo trong Frontmatter; ngược lại trả về `${SITE_URL}/blog/${slug}` (không có dấu gạch chéo dư ở cuối).

---

## 4. Quy Trình Bảo Mật Nội Dung & Ẩn Danh Hóa Bắt Buộc (NDA & Sanitization Policy)
Mọi bài viết đúc kết từ kinh nghiệm làm việc thực tế bắt buộc trải qua **Checklist 5 bước ẩn danh hóa** trước khi chuyển trạng thái `sanitized: true` và `draft: false`:
1. **Ẩn danh Thực thể & Nghiệp vụ:** Tuyệt đối không nêu tên công ty, tên khách hàng, tên dự án nội bộ hoặc tên miền thật. Đổi toàn bộ tên bảng/cột đặc thù sang miền dữ liệu trung lập (ví dụ: hệ thống thương mại điện tử `ORDERS`, `INVENTORY`, `PAYMENTS`).
2. **Làm sạch Thông tin Hạ tầng:** Thay thế mọi địa chỉ IP, hostname, chuỗi kết nối (Connection Strings), ARN, hoặc đường dẫn thư mục máy chủ nội bộ bằng giá trị chuẩn RFC (`10.0.0.1`, `db.internal.example.com`, `User Id=app_user;`).
3. **Làm sạch Log & Execution Plan:** Xóa hoặc bôi mờ thông tin tài khoản, token, dữ liệu cá nhân (PII) và tên schema thật trong ảnh chụp màn hình hoặc văn bản Stack Trace / Oracle AWR / Execution Plan.
4. **Chuẩn hóa Số liệu Nhạy cảm:** Chỉ công bố số liệu kỹ thuật (thời gian phản hồi ms, thông lượng RPS, CPU/RAM, số dòng bản ghi làm tròn) hoặc tỷ lệ phần trăm cải thiện (`-98% latency`), tuyệt đối không đưa số liệu tài chính hay doanh thu của khách hàng.
5. **Tái tạo Mã nguồn Độc lập (Minimal Reproducible Example):** Viết lại các đoạn code C#, PL/SQL, cấu hình dưới dạng ví dụ tối giản tái hiện đúng bản chất kỹ thuật, không sao chép nguyên văn mã nguồn thuộc sở hữu trí tuệ của tổ chức.

---

## 5. Yêu Cầu Chức Năng Chi Tiết (Functional Requirements)

### FR-01: Trình đọc bài viết kỹ thuật chuyên sâu (`/blog/[slug]`)
- **Header bài viết:** Hiển thị Chuyên mục, Khuôn mẫu (`postType`), Tiêu đề, Ngày đăng, Ngày cập nhật, Thời gian đọc (`BR-03`), chỉ số `impact` (nếu có) và thanh **Environment Badges**.
- **Cảnh báo bài viết cũ (Outdated Content Notice):** Nếu khoảng thời gian từ `updatedAt ?? publishedAt` đến thời điểm hiện tại lớn hơn **24 tháng (730 ngày)**, tự động hiển thị khung lưu ý đầu bài提醒 độc giả đối chiếu với phiên bản trong `environment`.
- **Điều hướng Chuỗi bài viết (Series Banner):** Nếu bài viết thuộc một `series`, hiển thị hộp danh sách các phần trong chuỗi bài đó và đánh dấu phần đang đọc.
- **Khối Code 15 Ngôn ngữ:** Hỗ trợ tô màu cú pháp trên Server cho 15 ngôn ngữ (`csharp`, `sql`, `plsql`, `xml`, `json`, `typescript`, `tsx`, `javascript`, `yaml`, `dockerfile`, `bash`, `powershell`, `http`, `diff`, `text`), kèm tên file/ngôn ngữ, số dòng, đánh dấu dòng quan trọng và nút Copy.
- **Sáu loại Callout Kỹ thuật (`<Callout type="..." title="...">`):**
  1. `symptom`: Triệu chứng lỗi, thông báo ngoại lệ hoặc suy giảm hiệu năng ban đầu.
  2. `investigation`: Quá trình phân tích log, đọc Execution Plan, kiểm tra giả thuyết.
  3. `root-cause`: Kết luận nguyên nhân gốc rễ gây ra sự cố.
  4. `solution`: Giải pháp khắc phục triệt để và lý do lựa chọn.
  5. `benchmark`: Số liệu đo kiểm thực tế Trước và Sau khi tối ưu.
  6. `warning`: Cảnh báo rủi ro, đánh đổi kiến trúc (Trade-offs) hoặc các bẫy kỹ thuật.
- **Chân bài viết (Article Footer):** Khối giới thiệu ngắn về Tác giả (Author Bio), thông tin giấy phép (MIT / CC BY-NC-SA 4.0), nút chia sẻ bài viết và danh sách 3 bài viết liên quan (`BR-04`).

### FR-02: Trang chủ & Hệ thống Khám phá Nội dung (`/`, `/category/[category]`, `/tags/[tag]`)
- **Hero Section:** Định vị rõ nét hồ sơ Kỹ sư Phần mềm (.NET, Oracle/SQL, Web API & DevOps, Next.js), kèm 2 nút điều hướng: *"Xem Hồ sơ Năng lực"* và *"Khám phá Case Studies"*.
- **Featured Case Studies:** Trưng bày tối đa 3 bài viết tiêu biểu (`BR-02`) kèm huy hiệu kết quả `impact`.
- **Archive Explorer & Pagefind Search:** Bộ lọc tức thì theo `BR-05` kết hợp tìm kiếm toàn văn tĩnh (Pagefind) cho phép tìm sâu vào nội dung code và bài viết.

### FR-03: Trang Hồ sơ Năng lực Dual-Track (`/about` — Engineering Profile)
Thiết kế phục vụ đồng thời 2 nhóm đối tượng mục tiêu:
1. **Bản đồ Năng lực Kỹ thuật (Technical Competency Matrix):**
   - *Backend & Enterprise Core:* .NET Framework / .NET 8+, C#, ASP.NET Web API, Entity Framework, tối ưu hóa báo cáo RDLC.
   - *Database & High-Performance SQL:* Oracle Database, PL/SQL, phân tích Execution Plan, xử lý Deadlock & tối ưu truy vấn dữ liệu lớn.
   - *DevOps & Modern Web Stack:* Docker, Docker Compose, CI/CD, kiến trúc Microservices (RabbitMQ, Redis, Outbox) và Next.js / TypeScript.
2. **Danh mục Dự án & Case Studies Thực chứng:** Liên kết trực tiếp từ mô tả dự án sang các bài viết phân tích kỹ thuật tương ứng trên blog.
3. **Hai Luồng Kêu gọi Hành động (Dual-Track CTA):**
   - **Dành cho Nhà tuyển dụng & Tech Lead:** Tóm tắt định hướng phát triển, kinh nghiệm làm việc nhóm (BA, QA, Dev) và nút tải CV.
   - **Dành cho Khách hàng & Đối tác:** Liệt kê rõ các hạng mục nhận tư vấn/triển khai (Tối ưu hóa hiệu năng CSDL Oracle/SQL, bảo trì & hiện đại hóa hệ thống .NET Web API, xây dựng web app Next.js và đóng gói Docker/CI-CD).

### FR-04: SEO Chuyên sâu, Ảnh OG Động & Dữ liệu Cấu trúc
- Tự động sinh ảnh OpenGraph riêng cho từng bài viết tại `/blog/[slug]/opengraph-image` (hiển thị Tiêu đề, Chuyên mục, `postType`, `environment` và tên tác giả).
- Nhúng thẻ `<script type="application/ld+json">` chuẩn Schema.org (`TechArticle` cho bài viết và `Person` cho trang `/about`).
- Tự động xuất `/sitemap.xml`, `/robots.txt` và `/rss.xml`.

---

## 6. Yêu Cầu Phi Chức Năng, Khả Năng Truy Cập & Hạ Tầng
- **Hiệu năng & Chất lượng:** Điểm Google Lighthouse (Performance, Accessibility, Best Practices, SEO) đạt từ 95 trở lên trên cả Desktop và Mobile.
- **Khả năng truy cập (Accessibility - WCAG AA):** Có liên kết `Skip to content`, độ tương phản màu đạt chuẩn ở cả chế độ Sáng/Tối, điều hướng đầy đủ bằng bàn phím, có trang `not-found.tsx` (404) và `error.tsx` thân thiện.
- **Hạ tầng triển khai:** Đóng gói bằng Multi-stage `Dockerfile` (`output: 'standalone'`), tích hợp GitHub Actions tự động kiểm tra chất lượng trước khi triển khai lên VPS/Railway.
