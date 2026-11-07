import * as React from 'react';
import { History } from 'lucide-react';

export interface OutdatedBannerProps {
  isOutdated: boolean;
  publishedAt: string;
  updatedAt?: string;
  hasEnvironment?: boolean;
}

export function OutdatedBanner({
  isOutdated,
  publishedAt,
  updatedAt,
  hasEnvironment = false,
}: OutdatedBannerProps): React.JSX.Element | null {
  if (!isOutdated) {
    return null;
  }

  const referenceDate = updatedAt ?? publishedAt;

  return (
    <aside
      role="status"
      data-outdated-banner="true"
      className="rounded-xl border border-l-4 border-[var(--border-subtle)] p-4 sm:p-5"
      style={{
        borderLeftColor: 'var(--callout-investigation-border)',
        backgroundColor: 'var(--callout-investigation-bg)',
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 shrink-0"
          style={{ color: 'var(--callout-investigation-border)' }}
          aria-hidden="true"
        >
          <History className="h-5 w-5" aria-hidden={true} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Lưu ý ngữ cảnh thời gian & phiên bản kỹ thuật
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            Bài viết này được cập nhật lần cuối vào ngày{' '}
            <time
              dateTime={referenceDate}
              className="font-mono font-medium text-[var(--text-primary)]"
            >
              {referenceDate}
            </time>{' '}
            (hơn 24 tháng trước). Một số hành vi mặc định của runtime, trình
            biên dịch hoặc CSDL có thể đã thay đổi ở các bản phát hành mới
            {hasEnvironment
              ? ' — vui lòng đối chiếu kỹ với thanh thông số môi trường (Environment Badges) phía trên trước khi áp dụng cho Production.'
              : ' — vui lòng kiểm chứng trên môi trường Staging trước khi áp dụng cho Production.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
