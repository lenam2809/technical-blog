import * as React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Gauge,
  SearchCode,
} from 'lucide-react';
import type { CalloutType } from '@/types/post';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

interface CalloutVisualConfig {
  defaultLabel: string;
  borderVar: string;
  bgVar: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const CALLOUT_CONFIG: Record<CalloutType, CalloutVisualConfig> = {
  symptom: {
    defaultLabel: 'Triệu chứng & Biểu hiện lỗi',
    borderVar: 'var(--callout-symptom-border)',
    bgVar: 'var(--callout-symptom-bg)',
    Icon: AlertOctagon,
  },
  investigation: {
    defaultLabel: 'Quá trình Điều tra & Truy vết',
    borderVar: 'var(--callout-investigation-border)',
    bgVar: 'var(--callout-investigation-bg)',
    Icon: SearchCode,
  },
  'root-cause': {
    defaultLabel: 'Nguyên nhân Gốc rễ (Root Cause)',
    borderVar: 'var(--callout-root-cause-border)',
    bgVar: 'var(--callout-root-cause-bg)',
    Icon: Bug,
  },
  solution: {
    defaultLabel: 'Giải pháp Khắc phục',
    borderVar: 'var(--callout-solution-border)',
    bgVar: 'var(--callout-solution-bg)',
    Icon: CheckCircle2,
  },
  benchmark: {
    defaultLabel: 'Số liệu Đo kiểm (Benchmark)',
    borderVar: 'var(--callout-benchmark-border)',
    bgVar: 'var(--callout-benchmark-bg)',
    Icon: Gauge,
  },
  warning: {
    defaultLabel: 'Lưu ý & Đánh đổi (Trade-off)',
    borderVar: 'var(--callout-warning-border)',
    bgVar: 'var(--callout-warning-bg)',
    Icon: AlertTriangle,
  },
};

export function Callout({
  type = 'warning',
  title,
  children,
}: CalloutProps): React.JSX.Element {
  const config = CALLOUT_CONFIG[type] ?? CALLOUT_CONFIG.warning;
  const { Icon } = config;
  const headingText = title?.trim() ? title.trim() : config.defaultLabel;

  return (
    <aside
      role="note"
      data-callout-type={type}
      className="my-6 rounded-r-xl border-l-4 p-4 sm:p-5"
      style={{
        borderLeftColor: config.borderVar,
        backgroundColor: config.bgVar,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 shrink-0"
          style={{ color: config.borderVar }}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" aria-hidden={true} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight text-[var(--text-primary)] sm:text-base">
            {headingText}
          </p>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px] [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
