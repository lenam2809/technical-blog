import { describe, expect, it } from 'vitest';
import {
  filterPosts,
  normalizeSearchText,
  parseFilterParams,
} from '@/lib/filters';
import type { PostSummary } from '@/types/post';

const MOCK_POSTS: readonly PostSummary[] = [
  {
    title: 'Xử lý lỗi ORA-00060 Deadlock trên Oracle 19c và Web API',
    slug: 'oracle-deadlock-post-mortem',
    postType: 'post-mortem',
    category: 'database-sql',
    tags: ['oracle', 'deadlock', 'plsql'],
    publishedAt: '2026-05-10',
    summary:
      'Phân tích nguyên nhân gốc rễ gây khóa chéo ORA-00060 trên Oracle 19c khi gọi đồng thời từ ASP.NET Web API.',
    environment: ['Oracle 19c', '.NET 8', 'Linux RHEL 9'],
    impact: 'Giảm 100% lỗi ORA-00060 lúc cao điểm',
    featured: true,
    draft: false,
    sanitized: true,
    readingTimeMinutes: 6,
    isOutdated: false,
  },
  {
    title: 'Tối ưu cấp phát bộ nhớ Large Object Heap trong .NET',
    slug: 'dotnet-memory-tuning',
    postType: 'deep-dive',
    category: 'dotnet-backend',
    tags: ['dotnet', 'csharp', 'memory-management'],
    publishedAt: '2026-04-20',
    summary:
      'Kinh nghiệm giảm áp lực Garbage Collection Gen 2 và phân mảnh bộ nhớ khi xuất báo cáo RDLC lớn.',
    environment: ['.NET Framework 4.8', 'IIS 10'],
    impact: 'Giảm 68% lượng RAM tiêu thụ trên mỗi tiến trình',
    featured: true,
    draft: false,
    sanitized: true,
    readingTimeMinutes: 8,
    isOutdated: false,
  },
  {
    title: 'Sổ tay đóng gói ứng dụng Next.js với Docker Multi-stage',
    slug: 'docker-multi-stage-reference',
    postType: 'reference',
    category: 'devops-modern-web',
    tags: ['docker', 'nextjs', 'ci-cd'],
    publishedAt: '2026-03-15',
    summary:
      'Cấu hình chuẩn Dockerfile chạy dưới quyền non-root user giúp giảm kích thước image xuống dưới 150MB.',
    featured: false,
    draft: false,
    sanitized: true,
    readingTimeMinutes: 4,
    isOutdated: false,
  },
];

describe('normalizeSearchText (BR-05)', () => {
  it('loại bỏ dấu tiếng Việt tổ hợp, chuyển đ/Đ thành d, chữ thường và cắt khoảng trắng thừa', () => {
    expect(
      normalizeSearchText('  Đường dẫn Tối ưu Hóa Hệ thống Đồng bộ  '),
    ).toBe('duong dan toi uu hoa he thong dong bo');
  });
});

describe('parseFilterParams (BR-05)', () => {
  it('phân tích đúng tham số hợp lệ từ cả Record object lẫn URLSearchParams', () => {
    const fromRecord = parseFilterParams({
      category: 'database-sql',
      tag: 'oracle',
      type: 'post-mortem',
      q: '  deadlock  ',
    });

    const urlParams = new URLSearchParams(
      'category=dotnet-backend&tag=csharp&type=deep-dive&q=bo+nho',
    );
    const fromSearchParams = parseFilterParams(urlParams);

    expect(fromRecord).toEqual({
      category: 'database-sql',
      tag: 'oracle',
      type: 'post-mortem',
      q: 'deadlock',
    });

    expect(fromSearchParams).toEqual({
      category: 'dotnet-backend',
      tag: 'csharp',
      type: 'deep-dive',
      q: 'bo nho',
    });
  });

  it('bỏ qua an toàn mọi giá trị không hợp lệ trên URL mà không ném lỗi', () => {
    const result = parseFilterParams({
      category: 'mobile-flutter',
      tag: 'unregistered-tag',
      type: 'tutorial-video',
      q: '    ',
    });

    expect(result).toEqual({});
  });

  it('lấy phần tử đầu tiên hợp lệ khi tham số trên query string truyền dạng mảng', () => {
    const result = parseFilterParams({
      tag: ['docker', 'nextjs'],
      category: ['devops-modern-web', 'database-sql'],
    });

    expect(result).toEqual({
      tag: 'docker',
      category: 'devops-modern-web',
    });
  });
});

describe('filterPosts (BR-05)', () => {
  it('trả về nguyên vẹn toàn bộ danh sách khi criteria rỗng', () => {
    const results = filterPosts(MOCK_POSTS, {});
    expect(results).toHaveLength(3);
    expect(results.map((p) => p.slug)).toEqual(MOCK_POSTS.map((p) => p.slug));
  });

  it('lọc chính xác từng điều kiện đơn lẻ theo category, tag và postType', () => {
    expect(
      filterPosts(MOCK_POSTS, { category: 'dotnet-backend' }).map(
        (p) => p.slug,
      ),
    ).toEqual(['dotnet-memory-tuning']);

    expect(
      filterPosts(MOCK_POSTS, { tag: 'ci-cd' }).map((p) => p.slug),
    ).toEqual(['docker-multi-stage-reference']);

    expect(
      filterPosts(MOCK_POSTS, { type: 'post-mortem' }).map((p) => p.slug),
    ).toEqual(['oracle-deadlock-post-mortem']);
  });

  it('tìm kiếm từ khóa q không dấu & không phân biệt hoa thường trên cả 5 trường: title, summary, tags, environment, impact', () => {
    // Khớp title không dấu ("Xu ly loi" -> "Xử lý lỗi")
    expect(filterPosts(MOCK_POSTS, { q: 'xu ly loi' }).map((p) => p.slug)).toEqual([
      'oracle-deadlock-post-mortem',
    ]);

    // Khớp summary không dấu ("bao cao rdlc" -> "báo cáo RDLC")
    expect(
      filterPosts(MOCK_POSTS, { q: 'BAO CAO RDLC' }).map((p) => p.slug),
    ).toEqual(['dotnet-memory-tuning']);

    // Khớp tags ("memory-management")
    expect(
      filterPosts(MOCK_POSTS, { q: 'memory-management' }).map((p) => p.slug),
    ).toEqual(['dotnet-memory-tuning']);

    // Khớp environment ("Linux RHEL 9")
    expect(
      filterPosts(MOCK_POSTS, { q: 'rhel 9' }).map((p) => p.slug),
    ).toEqual(['oracle-deadlock-post-mortem']);

    // Khớp impact không dấu ("giam 68% luong ram")
    expect(
      filterPosts(MOCK_POSTS, { q: 'giam 68% luong ram' }).map((p) => p.slug),
    ).toEqual(['dotnet-memory-tuning']);
  });

  it('kết hợp đồng thời nhiều điều kiện lọc theo phép giao AND logic', () => {
    const matched = filterPosts(MOCK_POSTS, {
      category: 'database-sql',
      tag: 'oracle',
      type: 'post-mortem',
      q: 'khoa cheo',
    });

    expect(matched).toHaveLength(1);
    expect(matched[0]?.slug).toBe('oracle-deadlock-post-mortem');
  });

  it('trả về mảng rỗng khi không có bài viết nào thỏa mãn tổ hợp bộ lọc', () => {
    const empty = filterPosts(MOCK_POSTS, {
      category: 'database-sql',
      tag: 'docker',
    });

    expect(empty).toEqual([]);
  });
});
