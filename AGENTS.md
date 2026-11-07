# HIẾN PHÁP ĐIỀU PHỐI AGENT (HUMAN-IN-THE-LOOP GOVERNANCE v2.0)

## 1. Nguồn Tham Chiếu Chuẩn Duy Nhất (Single Source of Truth)
Dự án **Technical Blog & Engineering Portfolio** được phát triển theo quy trình **Spec-Driven Agentic Development**. Trước khi lập kế hoạch (`/plan`) hoặc viết bất kỳ dòng code nào, Agent BẮT BUỘC đọc và đối chiếu với các tài liệu sau:
1. Đặc tả Nghiệp vụ & Yêu cầu Sản phẩm: `docs/PRD.md`
2. Kiến trúc Hệ thống & Hợp đồng Dữ liệu: `docs/ARCHITECTURE.md`
3. Quy tắc Kỹ thuật Next.js 16, Zod 4 & MDX: `.agents/rules/nextjs-mdx-rules.md`
4. Hệ thống Thiết kế UI/UX: `docs/DESIGN.md` *(Nếu đang ở trạng thái Baseline trước khi đồng bộ Google Stitch, sử dụng bộ token Baseline trong file này)*
5. Danh sách Nhiệm vụ Nguyên tử & Tiêu chí Nghiệm thu: `docs/TASKS.md`

**Quy tắc xử lý thiếu file hoặc mâu thuẫn:**
- Nếu `docs/DESIGN.md` hoặc `docs/TASKS.md` chưa tồn tại khi khởi tạo dự án, Agent phải thông báo ngay cho Developer và đề xuất tạo bản Baseline dựa trên `docs/PRD.md` và `docs/ARCHITECTURE.md` trước khi viết code ứng dụng.
- Nếu phát hiện bất kỳ mâu thuẫn nào giữa yêu cầu trong khung chat và hệ thống tài liệu trên, Agent BẮT BUỘC dừng lại và hỏi ý kiến Developer trước khi thực thi.

---

## 2. Vòng Lặp Thực Thi Nguyên Tử 5 Bước (5-Step Atomic Loop)
Với mỗi nhiệm vụ trong `docs/TASKS.md`, Agent phải tuân thủ nghiêm ngặt trình tự 5 bước:
1. **Khảo sát (Explore):** Đọc mô tả Task, kiểm tra các file hiện có trong codebase và đối chiếu với 6 quy tắc nghiệp vụ (`BR-01` đến `BR-06`) cùng 3 chốt chặn Fail-Fast Build Guards.
2. **Làm rõ (Clarify):** Nếu còn bất kỳ điểm mờ nào về logic, trạng thái rỗng (empty state) hoặc xử lý biên (edge cases), hãy đặt câu hỏi ngắn gọn cho Developer. Tuyệt đối không tự suy diễn.
3. **Lập kế hoạch (Plan):** Xuất **Implementation Plan Artifact** nêu rõ:
   - Danh sách chính xác các file sẽ tạo mới hoặc chỉnh sửa.
   - Chữ ký hàm (function signatures), luồng dữ liệu và cách xử lý lỗi.
   - Kịch bản kiểm thử tự động (Vitest / Typecheck / Lint / Build / Browser check) để chứng minh đạt 100% tiêu chí nghiệm thu.
4. **Thực thi trong phạm vi (Bounded Execution):** Chỉ viết code sau khi Developer phê duyệt Plan. Tuyệt đối không sửa đổi các file nằm ngoài phạm vi đã cam kết (No Scope Creep).
5. **Tự kiểm chứng (Self-Verification):** Chạy đầy đủ `npm run typecheck`, `npm run lint`, `npm run test` và `npm run build`. Xuất kết quả thực tế từ terminal trước khi báo cáo hoàn thành.

---

## 3. Ranh Giới Quyền Tự Chủ (Autonomy Boundaries)

### 3.1. Phạm vi Agent ĐƯỢC PHÉP chủ động thực hiện:
- Tạo mới hoặc chỉnh sửa các file mã nguồn nằm trong Implementation Plan đã được phê duyệt.
- **Ngoại lệ Khởi tạo (Bootstrap Exception cho `TASK-01`):** Trong khuôn khổ `TASK-01` (sau khi Implementation Plan của `TASK-01` được Developer duyệt), Agent được phép chạy lệnh cài đặt đúng danh sách thư viện và phiên bản đã ghim tại mục **1. Ngăn Xếp Công Nghệ Cố Định** trong `docs/ARCHITECTURE.md`.
- Viết bổ sung các hàm tiện ích thuần khiết (pure helper functions), dữ liệu kiểm thử trong `src/lib/__tests__/__fixtures__/` và các file test (`*.test.ts`) phục vụ trực tiếp cho Task đang làm.
- Chạy các lệnh kiểm tra không làm thay đổi trạng thái hệ thống (`typecheck`, `lint`, `test`, `build`).
- Sử dụng trình duyệt tích hợp (Integrated Browser), Next.js DevTools MCP hoặc Chrome DevTools MCP để đối chiếu giao diện và kiểm tra điểm Lighthouse/Accessibility theo `docs/DESIGN.md`.

### 3.2. Các Cổng Kiểm Duyệt BẮT BUỘC XIN PHÉP (Approval Gates):
Agent TUYỆT ĐỐI KHÔNG tự ý thực hiện 6 hành động sau nếu chưa có sự đồng ý rõ ràng từ Developer:
1. **Quản lý Thư viện ngoài danh mục gốc:** Cài đặt thêm, nâng cấp hoặc gỡ bỏ bất kỳ package nào nằm ngoài danh sách đã ghim trong `docs/ARCHITECTURE.md`.
2. **Ranh giới Client Component:** Đặt chỉ thị `'use client'` vào bất kỳ file nào ngoài **5 Client Components** đã được cấp phép trong `docs/ARCHITECTURE.md` (`ThemeProvider.tsx`, `ThemeToggle.tsx`, `ArchiveExplorer.tsx`, `TableOfContents.tsx`, `CodeBlockCopyButton.tsx`).
3. **Cấu trúc & Cấu hình Gốc:** Thay đổi cấu trúc thư mục gốc hoặc sửa đổi `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `Dockerfile` ngoài phạm vi Task đã duyệt.
4. **Hợp đồng Dữ liệu & Tài liệu Đặc tả:** Tự ý sửa đổi `PostFrontmatterSchema`, `AllowedTagSchema` hoặc chỉnh sửa nội dung trong `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`.
5. **Chuyển giao Nhiệm vụ:** Tự ý chuyển sang làm Task tiếp theo trong `docs/TASKS.md` khi Task hiện tại chưa được Developer nghiệm thu.
6. **Quản lý Phiên bản & Bảo mật Nội dung:** Tự ý chạy lệnh `git commit`, `git push`, `git reset`, xóa bài viết trong `content/posts/`, hoặc tự ý đặt cờ `sanitized: true` cho bài viết thực tế mà chưa có xác nhận kiểm duyệt NDA từ Developer.
