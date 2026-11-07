import { SITE_CONFIG } from '@/lib/constants';
import type { Category, PostSummary } from '@/types/post';

export interface TechArticleJsonLd {
  '@context': 'https://schema.org';
  '@type': 'TechArticle';
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  image: string;
  inLanguage: 'vi-VN';
  articleSection: Category;
  keywords: string;
  author: {
    '@type': 'Person';
    name: string;
    url: string;
    sameAs: readonly string[];
  };
  publisher: {
    '@type': 'Person';
    name: string;
    url: string;
  };
}

export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  email: string;
  sameAs: readonly string[];
  knowsAbout: readonly string[];
}

const AUTHOR_COMPETENCIES = [
  '.NET Framework',
  '.NET Core',
  'C#',
  'ASP.NET Web API',
  'Entity Framework',
  'Oracle Database',
  'PL/SQL',
  'SQL Optimization',
  'System Architecture',
  'Docker',
  'Next.js',
  'TypeScript',
] as const;

function normalizeBaseUrl(siteUrl: string): string {
  return siteUrl.trim().replace(/\/+$/, '');
}

/**
 * Chuẩn hóa Canonical URL cho bài viết (BR-06):
 * Trả về customCanonicalUrl nếu được khai báo; ngược lại trả về `${SITE_URL}/blog/${slug}` không có dấu '/' dư ở cuối.
 */
export function buildCanonicalUrl(
  slug: string,
  customCanonicalUrl?: string,
  siteUrl: string = SITE_CONFIG.url,
): string {
  if (customCanonicalUrl && customCanonicalUrl.trim().length > 0) {
    return customCanonicalUrl.trim().replace(/\/+$/, '');
  }

  const cleanBaseUrl = normalizeBaseUrl(siteUrl);
  const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, '');
  return `${cleanBaseUrl}/blog/${cleanSlug}`;
}

/**
 * Sinh đối tượng JSON-LD chuẩn Schema.org kiểu TechArticle cho trang bài viết chi tiết.
 */
export function buildArticleJsonLd(
  post: PostSummary,
  siteUrl: string = SITE_CONFIG.url,
): TechArticleJsonLd {
  const cleanBaseUrl = normalizeBaseUrl(siteUrl);
  const articleUrl = `${cleanBaseUrl}/blog/${post.slug}`;
  const canonicalUrl = buildCanonicalUrl(post.slug, post.canonicalUrl, siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    image: `${articleUrl}/opengraph-image`,
    inLanguage: 'vi-VN',
    articleSection: post.category,
    keywords: post.tags.join(', '),
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      url: `${cleanBaseUrl}/about`,
      sameAs: [SITE_CONFIG.author.github],
    },
    publisher: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      url: cleanBaseUrl,
    },
  };
}

/**
 * Sinh đối tượng JSON-LD chuẩn Schema.org kiểu Person cho trang Hồ sơ Năng lực (/about).
 */
export function buildPersonJsonLd(
  siteUrl: string = SITE_CONFIG.url,
): PersonJsonLd {
  const cleanBaseUrl = normalizeBaseUrl(siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.role,
    description: SITE_CONFIG.description,
    url: `${cleanBaseUrl}/about`,
    email: SITE_CONFIG.author.email,
    sameAs: [SITE_CONFIG.author.github],
    knowsAbout: AUTHOR_COMPETENCIES,
  };
}
