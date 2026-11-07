import { ImageResponse } from 'next/og';
import { SITE_CONFIG, getCategoryBySlug } from '@/lib/constants';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import type { PostType } from '@/types/post';

export const alt = 'Ảnh đại diện bài viết kỹ thuật — Nam Lê';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface OgImageRouteProps {
  params: Promise<{ slug: string }>;
}

const OG_ARCHETYPE_PALETTE: Record<
  PostType,
  {
    label: string;
    accentHex: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  'post-mortem': {
    label: 'POST-MORTEM',
    accentHex: '#EF4444',
    badgeBg: 'rgba(239, 68, 68, 0.18)',
    badgeText: '#FCA5A5',
  },
  'deep-dive': {
    label: 'DEEP-DIVE',
    accentHex: '#3B82F6',
    badgeBg: 'rgba(59, 130, 246, 0.2)',
    badgeText: '#93C5FD',
  },
  reference: {
    label: 'REFERENCE',
    accentHex: '#22C55E',
    badgeBg: 'rgba(34, 197, 94, 0.18)',
    badgeText: '#86EFAC',
  },
};

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export default async function OpenGraphImage({
  params,
}: OgImageRouteProps): Promise<ImageResponse> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            height: '100%',
            backgroundColor: '#0B0F17',
            color: '#F8FAFC',
            padding: '64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#3B82F6',
              marginBottom: 16,
            }}
          >
            {SITE_CONFIG.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            {SITE_CONFIG.title}
          </div>
        </div>
      ),
      size,
    );
  }

  const categoryMeta = getCategoryBySlug(post.category);
  const archetype = OG_ARCHETYPE_PALETTE[post.postType];
  const titleFontSize = post.title.length > 74 ? 42 : 48;
  const environmentPills =
    post.environment && post.environment.length > 0
      ? post.environment.slice(0, 5)
      : post.tags.slice(0, 5).map((tag) => `#${tag}`);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#0B0F17',
          color: '#F8FAFC',
          padding: '52px 60px',
          borderTop: `8px solid ${archetype.accentHex}`,
        }}
      >
        {/* Hàng trên: Chuyên mục & Khuôn mẫu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: archetype.badgeBg,
                color: archetype.badgeText,
                border: `1px solid ${archetype.accentHex}`,
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              {archetype.label}
            </div>

            <div
              style={{
                display: 'flex',
                backgroundColor: '#111827',
                color: '#CBD5E1',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {categoryMeta?.label ?? post.category}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 18,
              color: '#94A3B8',
            }}
          >
            namle.dev
          </div>
        </div>

        {/* Khu vực trung tâm: Tiêu đề, Impact & Environment Pills */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            marginTop: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: titleFontSize,
              fontWeight: 700,
              lineHeight: 1.24,
              color: '#F8FAFC',
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </div>

          {post.impact ? (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                alignItems: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                color: '#34D399',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: 21,
                fontWeight: 600,
              }}
            >
              {`Kết quả thực chứng: ${post.impact}`}
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {environmentPills.map((pill) => (
              <div
                key={pill}
                style={{
                  display: 'flex',
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#E2E8F0',
                  borderRadius: '6px',
                  padding: '5px 14px',
                  fontSize: 17,
                  fontWeight: 500,
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        </div>

        {/* Hàng chân ảnh: Tác giả & Thời lượng đọc */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1E293B',
            paddingTop: '22px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#1E293B',
                border: '1px solid #3B82F6',
                color: '#60A5FA',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              NL
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#F8FAFC',
                }}
              >
                {SITE_CONFIG.author.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 17,
                  color: '#94A3B8',
                }}
              >
                {SITE_CONFIG.author.role}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: 19,
              color: '#CBD5E1',
            }}
          >
            <div style={{ display: 'flex' }}>{post.publishedAt}</div>
            <div style={{ display: 'flex', color: '#64748B' }}>•</div>
            <div style={{ display: 'flex' }}>
              {`${post.readingTimeMinutes} phút đọc`}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
