import { SITE_CONFIG } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

/**
 * Thoát triệt để 5 ký tự đặc biệt XML (&, <, >, ", ') để bảo vệ tính hợp lệ của tài liệu RSS 2.0
 * đối với tiêu đề và tóm tắt bài viết kỹ thuật tiếng Việt (ví dụ: "Oracle 19c & Web API").
 */
export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET(): Response {
  const baseUrl = SITE_CONFIG.url.replace(/\/+$/, '');
  const feedUrl = `${baseUrl}/rss.xml`;

  // BR-01: Loại bỏ tuyệt đối 100% bài nháp (draft: true) khỏi RSS Feed ở mọi môi trường
  const publishedPosts = getAllPosts({ includeDrafts: false });

  const latestIsoDate = publishedPosts.reduce<string>((latest, post) => {
    const candidate = post.updatedAt ?? post.publishedAt;
    return candidate > latest ? candidate : latest;
  }, '2026-01-01');

  const lastBuildDateRfc822 = new Date(
    `${latestIsoDate}T00:00:00.000Z`,
  ).toUTCString();

  const itemsXml = publishedPosts
    .map((post) => {
      const articleUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDateRfc822 = new Date(
        `${post.publishedAt}T00:00:00.000Z`,
      ).toUTCString();
      const authorLabel = `${SITE_CONFIG.author.email} (${SITE_CONFIG.author.name})`;
      const categoryElements = [post.category, ...post.tags]
        .map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join('\n');

      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(articleUrl)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
        `      <pubDate>${pubDateRfc822}</pubDate>`,
        `      <author>${escapeXml(authorLabel)}</author>`,
        `      <description>${escapeXml(post.summary)}</description>`,
        categoryElements,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const rssXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(SITE_CONFIG.name)}</title>`,
    `    <link>${escapeXml(baseUrl)}</link>`,
    `    <description>${escapeXml(SITE_CONFIG.description)}</description>`,
    '    <language>vi-VN</language>',
    `    <lastBuildDate>${lastBuildDateRfc822}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    itemsXml,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
