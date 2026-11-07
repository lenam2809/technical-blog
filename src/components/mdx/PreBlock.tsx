import * as React from 'react';
import { CodeBlockCopyButton } from '@/components/mdx/CodeBlockCopyButton';

export interface PreBlockProps extends React.ComponentPropsWithoutRef<'pre'> {
  'data-language'?: string;
  'data-title'?: string;
  'data-theme'?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  csharp: 'C#',
  sql: 'SQL',
  plsql: 'PL/SQL',
  xml: 'XML',
  json: 'JSON',
  typescript: 'TypeScript',
  tsx: 'TSX',
  javascript: 'JavaScript',
  yaml: 'YAML',
  dockerfile: 'Dockerfile',
  bash: 'Bash',
  powershell: 'PowerShell',
  http: 'HTTP',
  diff: 'Diff',
  text: 'Plaintext',
};

/**
 * Hàm thuần trên Server: trích xuất văn bản code nguyên bản từ cây ReactNode do Shiki sinh ra
 * để truyền chuỗi string thuần xuống Client Island CodeBlockCopyButton.
 */
export function extractCodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => extractCodeText(child)).join('');
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractCodeText(node.props.children);
  }

  return '';
}

function formatLanguageLabel(rawLang?: string): string {
  if (!rawLang) {
    return 'Code';
  }
  const normalized = rawLang.trim().toLowerCase();
  return LANGUAGE_LABELS[normalized] ?? normalized.toUpperCase();
}

export function PreBlock({
  children,
  className,
  'data-language': dataLanguage,
  'data-title': dataTitle,
  ...restProps
}: PreBlockProps): React.JSX.Element {
  const rawCode = extractCodeText(children).replace(/\n$/, '');
  const languageLabel = formatLanguageLabel(dataLanguage);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-[var(--bg-code)] text-slate-100 shadow-sm">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-slate-800/90 bg-slate-900/75 px-4">
        <div className="flex min-w-0 items-center gap-2 font-mono text-xs">
          {dataTitle ? (
            <>
              <span className="truncate font-medium text-slate-200">
                {dataTitle}
              </span>
              <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-400">
                {languageLabel}
              </span>
            </>
          ) : (
            <span className="font-medium text-slate-300">{languageLabel}</span>
          )}
        </div>

        <CodeBlockCopyButton code={rawCode} />
      </div>

      <pre
        {...restProps}
        data-language={dataLanguage}
        tabIndex={0}
        className={[
          'overflow-x-auto py-4 font-mono text-[0.875rem] leading-[1.6] text-slate-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
          '[&_code]:grid [&_code]:min-w-full [&_code]:bg-transparent [&_code]:p-0',
          '[&_span[data-line]]:px-4',
          '[&_code[data-line-numbers]]:[counter-reset:line]',
          '[&_code[data-line-numbers]>[data-line]::before]:[counter-increment:line]',
          '[&_code[data-line-numbers]>[data-line]::before]:[content:counter(line)]',
          '[&_code[data-line-numbers]>[data-line]::before]:mr-4',
          '[&_code[data-line-numbers]>[data-line]::before]:inline-block',
          '[&_code[data-line-numbers]>[data-line]::before]:w-7',
          '[&_code[data-line-numbers]>[data-line]::before]:select-none',
          '[&_code[data-line-numbers]>[data-line]::before]:text-right',
          '[&_code[data-line-numbers]>[data-line]::before]:text-xs',
          '[&_code[data-line-numbers]>[data-line]::before]:text-slate-500',
          '[&_span[data-highlighted-line]]:border-l-2',
          '[&_span[data-highlighted-line]]:border-blue-400',
          '[&_span[data-highlighted-line]]:bg-blue-500/15',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </pre>
    </div>
  );
}
