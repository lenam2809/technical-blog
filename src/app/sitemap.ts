import type { MetadataRoute } from 'next';
import { ALLOWED_TAGS, CATEGORIES, SITE_CONFIG } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url.replace(/\/+$/, '');

  // BR-01: Khóa cứng includeDrafts: false để loại bỏ tuyệt đối 100% bài nháp khỏi sitemap.xml ở mọi môi trường
  const publishedPosts = getAllPosts({ includeDrafts: false });

  const latestIsoDate = publishedPosts.reduce<string>((latest, post) => {
    const candidate = post.updatedAt ?? post.publishedAt;
    return candidate > latest ? candidate : latest;
  }, '2026-01-01');

  const latestModifiedDate = new Date(`${latestIsoDate}T00:00:00.000Z`);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestModifiedDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: latestModifiedDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => {
    const categoryPosts = publishedPosts.filter(
      (post) => post.category === category.slug,
    );
    const categoryLatestIso = categoryPosts.reduce<string>((latest, post) => {
      const candidate = post.updatedAt ?? post.publishedAt;
      return candidate > latest ? candidate : latest;
    }, latestIsoDate);

    return {
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(`${categoryLatestIso}T00:00:00.000Z`),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const activeTags = ALLOWED_TAGS.filter((tag) =>
    publishedPosts.some((post) => post.tags.includes(tag)),
  );

  const tagRoutes: MetadataRoute.Sitemap = activeTags.map((tag) => {
    const taggedPosts = publishedPosts.filter((post) =>
      post.tags.includes(tag),
    );
    const tagLatestIso = taggedPosts.reduce<string>((latest, post) => {
      const candidate = post.updatedAt ?? post.publishedAt;
      return candidate > latest ? candidate : latest;
    }, latestIsoDate);

    return {
      url: `${baseUrl}/tags/${tag}`,
      lastModified: new Date(`${tagLatestIso}T00:00:00.000Z`),
      changeFrequency: 'weekly',
      priority: 0.6,
    };
  });

  const postRoutes: MetadataRoute.Sitemap = publishedPosts
    .filter(
      (post) => !post.canonicalUrl || post.canonicalUrl.startsWith(baseUrl),
    )
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(
        `${post.updatedAt ?? post.publishedAt}T00:00:00.000Z`,
      ),
      changeFrequency: 'monthly',
      priority: 0.9,
    }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...postRoutes];
}
