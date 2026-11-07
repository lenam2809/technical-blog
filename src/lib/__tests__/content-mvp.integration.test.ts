import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { extractCodeText } from '@/components/mdx/PreBlock';
import {
  compileMdxContent,
  SHIKI_SUPPORTED_LANGUAGES,
} from '@/lib/mdx';
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
} from '@/lib/posts';

const EXPECTED_MVP_SLUGS = [
  'so-tay-dong-goi-nextjs-va-dotnet-api-voi-docker-multi-stage',
  'toi-uu-hieu-nang-truy-van-bao-cao-lon-trong-dotnet-va-oracle',
  'xu-ly-deadlock-va-can-kiet-connection-pool-oracle-web-api',
] as const;

describe('MVP Content & Server MDX Compilation Integration (TASK-03)', () => {
  it('đọc thư mục thật content/posts/ thành công cả 3 bài viết MVP mà không vi phạm bất kỳ Fail-Fast Guard nào', () => {
    const posts = getAllPosts({ includeDrafts: false });

    expect(posts).toHaveLength(3);
    expect(posts.map((post) => post.slug)).toEqual([...EXPECTED_MVP_SLUGS]);

    for (const post of posts) {
      expect(post.draft).toBe(false);
      expect(post.sanitized).toBe(true);
      expect(post.featured).toBe(true);
      expect(post.readingTimeMinutes).toBeGreaterThanOrEqual(2);
    }
  });

  it('kết nối đúng Featured Case Studies (BR-02) kèm impact và chuỗi bài viết seriesPosts', () => {
    const featured = getFeaturedPosts(3, { includeDrafts: false });
    expect(featured).toHaveLength(3);
    for (const post of featured) {
      expect(post.impact).toBeDefined();
      expect((post.impact ?? '').length).toBeGreaterThanOrEqual(10);
    }

    const partOne = getPostBySlug(
      'xu-ly-deadlock-va-can-kiet-connection-pool-oracle-web-api',
      { includeDrafts: false },
    );
    expect(partOne?.seriesPosts.map((p) => p.slug)).toEqual([
      'xu-ly-deadlock-va-can-kiet-connection-pool-oracle-web-api',
      'toi-uu-hieu-nang-truy-van-bao-cao-lon-trong-dotnet-va-oracle',
    ]);
  });

  it('biên dịch toàn bộ 3 bài viết MVP qua compileMdxContent trên Server với đầy đủ Callout, PreBlock và bảng cuộn ngang', async () => {
    for (const slug of EXPECTED_MVP_SLUGS) {
      const detail = getPostBySlug(slug, { includeDrafts: false });
      expect(detail).not.toBeNull();
      if (!detail) continue;

      const element = await compileMdxContent(detail.content);
      const html = renderToStaticMarkup(element);

      expect(html).toContain('role="note"');
      expect(html).toContain('<pre');
      expect(html).toContain('tabindex="0"');
      expect(html).toContain('Sao chép');
      expect(html).toContain('<table');
      expect(html).not.toContain('data-rehype-pretty-code-title');
    }
  }, 20000);

  it('đồng bộ 100% ID tiếng Việt giữa extractTocFromMdx (AST TOC) và thẻ h2/h3 do rehype-slug sinh ra trên cả 3 bài MVP', async () => {
    for (const slug of EXPECTED_MVP_SLUGS) {
      const detail = getPostBySlug(slug, { includeDrafts: false });
      expect(detail).not.toBeNull();
      if (!detail) continue;

      expect(detail.toc.length).toBeGreaterThanOrEqual(4);

      const element = await compileMdxContent(detail.content);
      const html = renderToStaticMarkup(element);

      for (const item of detail.toc) {
        expect(html).toContain(`id="${item.id}"`);
      }
    }
  }, 20000);

  it('hỗ trợ tô màu cú pháp trên Server đầy đủ 15 ngôn ngữ bắt buộc của Shiki', async () => {
    expect(SHIKI_SUPPORTED_LANGUAGES).toHaveLength(15);

    const allLanguagesMdx = SHIKI_SUPPORTED_LANGUAGES.map(
      (lang) => `\`\`\`${lang} title="sample.${lang}"\nsample_token_${lang}\n\`\`\``,
    ).join('\n\n');

    const element = await compileMdxContent(allLanguagesMdx);
    const html = renderToStaticMarkup(element);

    for (const lang of SHIKI_SUPPORTED_LANGUAGES) {
      expect(html).toContain(`data-language="${lang}"`);
      expect(html).toContain(`sample.${lang}`);
    }
  }, 20000);

  it('extractCodeText trích xuất chính xác văn bản code nguyên bản từ cây ReactNode lồng nhau', () => {
    const nestedTree = React.createElement(
      'code',
      null,
      React.createElement(
        'span',
        { 'data-line': '' },
        React.createElement('span', null, 'SELECT '),
        React.createElement('span', null, '* FROM ORDERS;'),
      ),
      '\n',
      React.createElement(
        'span',
        { 'data-line': '' },
        React.createElement('span', null, 'COMMIT;'),
      ),
    );

    expect(extractCodeText(nestedTree)).toBe(
      'SELECT * FROM ORDERS;\nCOMMIT;',
    );
  });
});
