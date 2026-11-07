import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Mail, Share2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export interface AuthorCardProps {
  canonicalUrl: string;
  articleTitle: string;
}

export function AuthorCard({
  canonicalUrl,
  articleTitle,
}: AuthorCardProps): React.JSX.Element {
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedTitle = encodeURIComponent(articleTitle);
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const mailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
    `${articleTitle}\n\nĐọc chi tiết tại: ${canonicalUrl}`,
  )}`;

  return (
    <section
      aria-label="Thông tin tác giả và bản quyền nội dung"
      className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-7"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] font-mono text-base font-bold text-[var(--accent-primary)]"
        >
          NL
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                {SITE_CONFIG.author.name}
              </p>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                {SITE_CONFIG.author.role}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Kỹ sư phần mềm chuyên sâu về hệ thống Backend doanh nghiệp (.NET
            Framework / .NET 8+, ASP.NET Web API), tối ưu hóa hiệu năng Oracle
            Database &amp; SQL trên tập dữ liệu lớn, kết hợp đóng gói hạ tầng
            Docker, CI/CD và phát triển ứng dụng web hiện đại với Next.js.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Link
              href="/about"
              prefetch={false}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <span>Hồ sơ Năng lực &amp; Dịch vụ</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden={true} />
            </Link>

            <a
              href={SITE_CONFIG.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden={true} />
            </a>

            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chia sẻ bài viết lên LinkedIn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden={true} />
              <span>Chia sẻ LinkedIn</span>
            </a>

            <a
              href={mailShareUrl}
              aria-label="Gửi liên kết bài viết qua Email"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden={true} />
              <span>Gửi Email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4 text-xs leading-relaxed text-[var(--text-muted)]">
        <strong className="font-semibold text-[var(--text-secondary)]">
          Giấy phép nội dung kép:
        </strong>{' '}
        Toàn bộ đoạn mã nguồn minh họa trong bài viết được phát hành theo giấy
        phép{' '}
        <span className="font-mono text-[var(--text-secondary)]">
          MIT License
        </span>
        ; phần nội dung phân tích kỹ thuật và sơ đồ kiến trúc thuộc giấy phép{' '}
        <span className="font-mono text-[var(--text-secondary)]">
          CC BY-NC-SA 4.0
        </span>
        .
      </div>
    </section>
  );
}
