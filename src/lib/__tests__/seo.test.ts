import { describe, expect, it } from 'vitest';
import { SITE_CONFIG } from '@/lib/constants';
import {
  buildArticleJsonLd,
  buildCanonicalUrl,
  buildPersonJsonLd,
} from '@/lib/seo';
import type { PostSummary } from '@/types/post';

const SAMPLE_POST: PostSummary = {
  title: 'Xử lý lỗi ORA-00060 Deadlock trên Oracle 19c và Web API',
  slug: 'oracle-deadlock-post-mortem',
  postType: 'post-mortem',
  category: 'database-sql',
  tags: ['oracle', 'deadlock', 'plsql'],
  publishedAt: '2026-05-10',
  summary:
    'Phân tích nguyên nhân gốc rễ gây khóa chéo ORA-00060 trên Oracle 19c khi gọi đồng thời từ ASP.NET Web API.',
  environment: ['Oracle 19c', '.NET 8'],
  impact: 'Giảm 100% lỗi ORA-00060 lúc cao điểm',
  featured: true,
  draft: false,
  sanitized: true,
  readingTimeMinutes: 7,
  isOutdated: false,
};

describe('buildCanonicalUrl (BR-06)', () => {
  it('trả về URL mặc định `${SITE_URL}/blog/${slug}` không có dấu gạch chéo dư ở cuối', () => {
    expect(
      buildCanonicalUrl(
        'oracle-deadlock-post-mortem',
        undefined,
        'https://namle.dev',
      ),
    ).toBe('https://namle.dev/blog/oracle-deadlock-post-mortem');
  });

  it('ưu tiên trả về customCanonicalUrl khi được khai báo trong Frontmatter và khử dấu / thừa', () => {
    expect(
      buildCanonicalUrl(
        'dotnet-memory-tuning',
        'https://viblo.asia/p/dotnet-memory-tuning/',
        'https://namle.dev',
      ),
    ).toBe('https://viblo.asia/p/dotnet-memory-tuning');
  });

  it('chuẩn hóa an toàn không sinh //blog khi siteUrl có dấu gạch chéo ở cuối', () => {
    expect(
      buildCanonicalUrl(
        '/oracle-deadlock-post-mortem/',
        undefined,
        'https://namle.dev/',
      ),
    ).toBe('https://namle.dev/blog/oracle-deadlock-post-mortem');
  });
});

describe('buildArticleJsonLd & buildPersonJsonLd (Schema.org)', () => {
  it('sinh đối tượng TechArticle chuẩn Schema.org với fallback dateModified = publishedAt', () => {
    const jsonLd = buildArticleJsonLd(SAMPLE_POST, 'https://namle.dev');

    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: SAMPLE_POST.title,
      description: SAMPLE_POST.summary,
      datePublished: '2026-05-10',
      dateModified: '2026-05-10',
      url: 'https://namle.dev/blog/oracle-deadlock-post-mortem',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://namle.dev/blog/oracle-deadlock-post-mortem',
      },
      image:
        'https://namle.dev/blog/oracle-deadlock-post-mortem/opengraph-image',
      inLanguage: 'vi-VN',
      articleSection: 'database-sql',
      keywords: 'oracle, deadlock, plsql',
      author: {
        '@type': 'Person',
        name: SITE_CONFIG.author.name,
        url: 'https://namle.dev/about',
        sameAs: [SITE_CONFIG.author.github],
      },
      publisher: {
        '@type': 'Person',
        name: SITE_CONFIG.author.name,
        url: 'https://namle.dev',
      },
    });
  });

  it('ưu tiên sử dụng updatedAt cho dateModified và phản ánh custom canonicalUrl vào mainEntityOfPage', () => {
    const updatedPost: PostSummary = {
      ...SAMPLE_POST,
      updatedAt: '2026-06-02',
      canonicalUrl: 'https://viblo.asia/p/oracle-deadlock',
    };

    const jsonLd = buildArticleJsonLd(updatedPost, 'https://namle.dev');

    expect(jsonLd.dateModified).toBe('2026-06-02');
    expect(jsonLd.mainEntityOfPage['@id']).toBe(
      'https://viblo.asia/p/oracle-deadlock',
    );
  });

  it('sinh đối tượng Person chuẩn Schema.org đồng bộ thông tin tác giả từ SITE_CONFIG', () => {
    const personJsonLd = buildPersonJsonLd('https://namle.dev/');

    expect(personJsonLd['@context']).toBe('https://schema.org');
    expect(personJsonLd['@type']).toBe('Person');
    expect(personJsonLd.name).toBe(SITE_CONFIG.author.name);
    expect(personJsonLd.jobTitle).toBe(SITE_CONFIG.author.role);
    expect(personJsonLd.url).toBe('https://namle.dev/about');
    expect(personJsonLd.email).toBe(SITE_CONFIG.author.email);
    expect(personJsonLd.sameAs).toContain(SITE_CONFIG.author.github);
    expect(personJsonLd.knowsAbout).toContain('Oracle Database');
  });
});
