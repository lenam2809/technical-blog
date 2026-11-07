import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getRelatedPosts,
} from '@/lib/posts';
import { isValidIsoDateString, PostFrontmatterSchema } from '@/types/post';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const VALID_POSTS_FIXTURE_DIR = path.join(TEST_DIR, '__fixtures__', 'posts');
const GUARDS_FIXTURE_DIR = path.join(TEST_DIR, '__fixtures__', 'guards');
const FIXED_NOW = new Date('2026-11-07T08:00:00.000Z');

describe('Fail-Fast Build Guards (Guard 1, Guard 2, Guard 3)', () => {
  it('Guard 1: ném lỗi ngay lập tức khi tên file .mdx không khớp 100% với trường slug', () => {
    const mismatchDir = path.join(GUARDS_FIXTURE_DIR, 'slug-mismatch');

    expect(() => getAllPosts({ postsDir: mismatchDir, now: FIXED_NOW })).toThrow(
      /Guard 1 - FileSlugParity.*wrong-filename\.mdx.*actual-different-slug/,
    );
  });

  it('Guard 1: không duyệt đệ quy thư mục con bên trong postsDir', () => {
    const posts = getAllPosts({
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });

    expect(posts.some((p) => p.slug === 'mismatched-on-purpose')).toBe(false);
  });

  it('Guard 2: chặn đứng các ngày không tồn tại trên lịch thực tế như 2026-02-31 và chấp nhận năm nhuận hợp lệ', () => {
    expect(isValidIsoDateString('2026-02-31')).toBe(false);
    expect(isValidIsoDateString('2025-02-29')).toBe(false);
    expect(isValidIsoDateString('2024-02-29')).toBe(true);

    const badDateDir = path.join(GUARDS_FIXTURE_DIR, 'invalid-calendar-date');
    expect(() => getAllPosts({ postsDir: badDateDir, now: FIXED_NOW })).toThrow(
      /bad-date-post\.mdx[\s\S]*YYYY-MM-DD/,
    );
  });

  it('Guard 2: ném lỗi khi updatedAt sớm hơn publishedAt', () => {
    const badUpdateDir = path.join(
      GUARDS_FIXTURE_DIR,
      'updated-before-published',
    );

    expect(() =>
      getAllPosts({ postsDir: badUpdateDir, now: FIXED_NOW }),
    ).toThrow(/invalid-update\.mdx[\s\S]*updatedAt/);
  });

  it('Guard 2: ném lỗi khi bài viết post-mortem thiếu trường environment hoặc mảng environment rỗng', () => {
    const missingEnvDir = path.join(
      GUARDS_FIXTURE_DIR,
      'post-mortem-missing-env',
    );

    expect(() =>
      getAllPosts({ postsDir: missingEnvDir, now: FIXED_NOW }),
    ).toThrow(/no-env-incident\.mdx[\s\S]*environment/);

    const emptyEnvCheck = PostFrontmatterSchema.safeParse({
      title: 'Sự cố kết nối cơ sở dữ liệu với mảng environment rỗng',
      slug: 'empty-env-check',
      postType: 'post-mortem',
      category: 'database-sql',
      tags: ['oracle'],
      publishedAt: '2026-05-10',
      summary:
        'Tóm tắt đủ năm mươi ký tự phục vụ kiểm tra trường hợp mảng environment rỗng.',
      environment: [],
      draft: false,
      sanitized: true,
    });
    expect(emptyEnvCheck.success).toBe(false);
  });

  it('Guard 2: chặn tag nằm ngoài ALLOWED_TAGS, vượt quá 6 tags hoặc chứa tag trùng lặp', () => {
    const invalidTagDir = path.join(GUARDS_FIXTURE_DIR, 'invalid-tag');
    expect(() =>
      getAllPosts({ postsDir: invalidTagDir, now: FIXED_NOW }),
    ).toThrow(/unknown-tag-post\.mdx/);

    const duplicateTagCheck = PostFrontmatterSchema.safeParse({
      title: 'Bài viết chứa hai thẻ trùng lặp trong danh sách tags',
      slug: 'duplicate-tags-check',
      postType: 'deep-dive',
      category: 'database-sql',
      tags: ['oracle', 'oracle'],
      publishedAt: '2026-05-10',
      summary:
        'Tóm tắt đủ năm mươi ký tự phục vụ kiểm tra ràng buộc không trùng lặp thẻ.',
      draft: false,
      sanitized: true,
    });
    expect(duplicateTagCheck.success).toBe(false);

    const sevenTagsCheck = PostFrontmatterSchema.safeParse({
      title: 'Bài viết gắn bảy thẻ vượt quá giới hạn tối đa sáu thẻ',
      slug: 'seven-tags-check',
      postType: 'deep-dive',
      category: 'database-sql',
      tags: [
        'oracle',
        'plsql',
        'sql-optimization',
        'execution-plan',
        'indexing',
        'deadlock',
        'connection-pool',
      ],
      publishedAt: '2026-05-10',
      summary:
        'Tóm tắt đủ năm mươi ký tự phục vụ kiểm tra giới hạn tối đa sáu thẻ mỗi bài.',
      draft: false,
      sanitized: true,
    });
    expect(sevenTagsCheck.success).toBe(false);
  });

  it('Guard 3 (NDA & Sanitization): chặn đứng bài xuất bản công khai (draft: false) mà chưa xác nhận sanitized: true', () => {
    const unsanitizedDir = path.join(GUARDS_FIXTURE_DIR, 'unsanitized-public');

    expect(() =>
      getAllPosts({ postsDir: unsanitizedDir, now: FIXED_NOW }),
    ).toThrow(/leaked-post\.mdx[\s\S]*sanitized/);
  });
});

describe('Domain Repository & Business Rules (BR-01, BR-02, BR-04)', () => {
  it('BR-01: mặc định ở môi trường test/production loại bỏ 100% bài nháp khỏi mọi truy vấn', () => {
    const allPublished = getAllPosts({
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const featured = getFeaturedPosts(10, {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const related = getRelatedPosts('oracle-deadlock-post-mortem', 10, {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const dbPosts = getPostsByCategory('database-sql', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const oracleTagPosts = getPostsByTag('oracle', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const draftDetail = getPostBySlug('internal-draft-investigation', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const oracleDetail = getPostBySlug('oracle-deadlock-post-mortem', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });

    expect(allPublished).toHaveLength(7);
    expect(
      allPublished.some((p) => p.slug === 'internal-draft-investigation'),
    ).toBe(false);
    expect(
      featured.some((p) => p.slug === 'internal-draft-investigation'),
    ).toBe(false);
    expect(
      related.some((p) => p.slug === 'internal-draft-investigation'),
    ).toBe(false);
    expect(
      dbPosts.some((p) => p.slug === 'internal-draft-investigation'),
    ).toBe(false);
    expect(
      oracleTagPosts.some((p) => p.slug === 'internal-draft-investigation'),
    ).toBe(false);
    expect(draftDetail).toBeNull();
    expect(
      oracleDetail?.seriesPosts.some(
        (p) => p.slug === 'internal-draft-investigation',
      ),
    ).toBe(false);
  });

  it('BR-01: khi includeDrafts = true (development), bản nháp xuất hiện ở đầu danh sách theo ngày mới nhất và đọc được qua getPostBySlug', () => {
    const withDrafts = getAllPosts({
      postsDir: VALID_POSTS_FIXTURE_DIR,
      includeDrafts: true,
      now: FIXED_NOW,
    });
    const draftDetail = getPostBySlug('internal-draft-investigation', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      includeDrafts: true,
      now: FIXED_NOW,
    });

    expect(withDrafts).toHaveLength(8);
    expect(withDrafts[0]?.slug).toBe('internal-draft-investigation');
    expect(draftDetail).not.toBeNull();
    expect(draftDetail?.draft).toBe(true);
  });

  it('đảm bảo ranh giới dữ liệu: getAllPosts không rò rỉ trường content MDX thô, trong khi getPostBySlug trả về đủ PostDetail', () => {
    const summaries = getAllPosts({
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    for (const summary of summaries) {
      expect('content' in summary).toBe(false);
    }

    const detail = getPostBySlug('oracle-deadlock-post-mortem', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    expect(detail).not.toBeNull();
    expect(detail?.content).toContain('ORA-00060');
    // Kiểm chứng AST TOC trên bài viết thực tế bỏ qua dòng ## bên trong khối SQL
    expect(detail?.toc.map((item) => item.text)).toEqual([
      'Bối cảnh & Triệu chứng',
      'Phân tích Execution Plan',
    ]);
  });

  it('BR-02: getFeaturedPosts lấy tối đa 3 bài featured đã xuất bản mới nhất theo publishedAt giảm dần và giữ nguyên impact', () => {
    const featured = getFeaturedPosts(3, {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });

    expect(featured).toHaveLength(3);
    expect(featured.map((p) => p.slug)).toEqual([
      'oracle-execution-plan-deep-dive', // 2026-06-15
      'oracle-deadlock-post-mortem', // 2026-05-10
      'dotnet-memory-tuning', // 2026-04-20 (docker-multi-stage-reference 2024-11-06 bị đẩy ra ngoài top 3)
    ]);
    expect(featured[1]?.impact).toBe('Giảm 100% lỗi ORA-00060 lúc cao điểm');
  });

  it('BR-04: tính đúng điểm gợi ý bài liên quan, loại bỏ bài Score = 0 và không gợi ý lại bài đang đọc', () => {
    const related = getRelatedPosts('oracle-deadlock-post-mortem', 10, {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });

    // Không chứa chính bài đang đọc
    expect(related.some((p) => p.slug === 'oracle-deadlock-post-mortem')).toBe(
      false,
    );
    // Không chứa các bài có Score = 0 (dotnet-memory-tuning và docker-multi-stage-reference không trùng tag/category/series)
    expect(related.some((p) => p.slug === 'dotnet-memory-tuning')).toBe(false);
    expect(related.some((p) => p.slug === 'docker-multi-stage-reference')).toBe(
      false,
    );
    // Hạng 1 phải là oracle-execution-plan-deep-dive (1 tag trùng * 3 + cùng category 2 + cùng series 5 = 10 điểm)
    expect(related[0]?.slug).toBe('oracle-execution-plan-deep-dive');
  });

  it('BR-04: sắp xếp tất định khi bằng điểm Score (ưu tiên publishedAt mới hơn, sau đó tie-break theo slug A-Z) và giới hạn mặc định 3 bài', () => {
    // Với oracle-deadlock-post-mortem:
    // #1: oracle-execution-plan-deep-dive (Score 10, 2026-06-15)
    // #2: sql-tuning-checklist (Score 5, 2026-04-01) -> mới hơn nhóm 2026-03-01
    // #3: tie-break-alpha (Score 5, 2026-03-01) -> thắng tie-break-beta (Score 5, 2026-03-01) nhờ slug A-Z
    const topThree = getRelatedPosts('oracle-deadlock-post-mortem', undefined, {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const topFour = getRelatedPosts('oracle-deadlock-post-mortem', 4, {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });

    expect(topThree.map((p) => p.slug)).toEqual([
      'oracle-execution-plan-deep-dive',
      'sql-tuning-checklist',
      'tie-break-alpha',
    ]);
    expect(topFour.map((p) => p.slug)).toEqual([
      'oracle-execution-plan-deep-dive',
      'sql-tuning-checklist',
      'tie-break-alpha',
      'tie-break-beta',
    ]);
  });

  it('sắp xếp seriesPosts tăng dần theo series.order và lọc đúng theo getPostsByCategory / getPostsByTag', () => {
    const secondPartDetail = getPostBySlug('oracle-execution-plan-deep-dive', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });

    expect(secondPartDetail?.seriesPosts.map((p) => p.slug)).toEqual([
      'oracle-deadlock-post-mortem', // order: 1
      'oracle-execution-plan-deep-dive', // order: 2
    ]);

    const dotnetPosts = getPostsByCategory('dotnet-backend', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    expect(dotnetPosts.map((p) => p.slug)).toEqual(['dotnet-memory-tuning']);

    const dockerTagPosts = getPostsByTag('docker', {
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    expect(dockerTagPosts.map((p) => p.slug)).toEqual([
      'docker-multi-stage-reference',
    ]);
  });

  it('tính chính xác biên cờ isOutdated (> 730 ngày) và xử lý an toàn khi postsDir chưa tồn tại trên đĩa', () => {
    // docker-multi-stage-reference có publishedAt: "2024-11-06"
    // Tại mốc 2026-11-06 (đúng 730 ngày): isOutdated phải là false
    const atExact730Days = getAllPosts({
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: new Date('2026-11-06T20:30:00.000Z'),
    });
    const dockerAt730 = atExact730Days.find(
      (p) => p.slug === 'docker-multi-stage-reference',
    );
    expect(dockerAt730?.isOutdated).toBe(false);

    // Tại mốc 2026-11-07 (731 ngày > 730): isOutdated phải là true
    const at731Days = getAllPosts({
      postsDir: VALID_POSTS_FIXTURE_DIR,
      now: FIXED_NOW,
    });
    const dockerAt731 = at731Days.find(
      (p) => p.slug === 'docker-multi-stage-reference',
    );
    expect(dockerAt731?.isOutdated).toBe(true);

    // Khi thư mục không tồn tại: trả về [] và null an toàn
    const nonExistentDir = path.join(TEST_DIR, '__fixtures__', 'does-not-exist');
    expect(getAllPosts({ postsDir: nonExistentDir })).toEqual([]);
    expect(getPostBySlug('any-slug', { postsDir: nonExistentDir })).toBeNull();
  });
});
