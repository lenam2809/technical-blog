import * as React from 'react';
import { compileMDX, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { createHighlighter, type Highlighter } from 'shiki';
import { Callout } from '@/components/mdx/Callout';
import { PreBlock } from '@/components/mdx/PreBlock';

export const SHIKI_SUPPORTED_LANGUAGES = [
  'csharp',
  'sql',
  'plsql',
  'xml',
  'json',
  'typescript',
  'tsx',
  'javascript',
  'yaml',
  'dockerfile',
  'bash',
  'powershell',
  'http',
  'diff',
  'text',
] as const;

export type SupportedCodeLanguage = (typeof SHIKI_SUPPORTED_LANGUAGES)[number];
export type MdxComponentMap = NonNullable<MDXRemoteProps['components']>;

let serverHighlighterPromise: Promise<Highlighter> | null = null;

function getServerShikiHighlighter(): Promise<Highlighter> {
  if (!serverHighlighterPromise) {
    serverHighlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: [...SHIKI_SUPPORTED_LANGUAGES],
    });
  }
  return serverHighlighterPromise;
}

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function collectHastText(node: HastNode): string {
  if (node.type === 'text' && typeof node.value === 'string') {
    return node.value;
  }
  if (!Array.isArray(node.children)) {
    return '';
  }
  return node.children.map((child) => collectHastText(child)).join('');
}

function hasHastProperty(
  props: Record<string, unknown> | undefined,
  kebabKey: string,
  camelKey: string,
): boolean {
  if (!props) return false;
  return kebabKey in props || camelKey in props;
}

/**
 * Plugin HAST hậu xử lý kết quả của rehype-pretty-code:
 * 1. Đưa tiêu đề từ <figcaption data-rehype-pretty-code-title> vào pre[data-title] và gỡ figcaption dư thừa.
 * 2. Tự động bật data-line-numbers trên các khối code nhiều dòng để hiển thị số dòng đồng nhất.
 */
function rehypeNormalizePrettyCode(): (tree: HastNode) => void {
  const walk = (node: HastNode): void => {
    if (!Array.isArray(node.children)) {
      return;
    }

    if (
      node.type === 'element' &&
      node.tagName === 'figure' &&
      hasHastProperty(
        node.properties,
        'data-rehype-pretty-code-figure',
        'dataRehypePrettyCodeFigure',
      )
    ) {
      let extractedTitle = '';
      const filteredChildren: HastNode[] = [];

      for (const child of node.children) {
        if (
          child.type === 'element' &&
          child.tagName === 'figcaption' &&
          hasHastProperty(
            child.properties,
            'data-rehype-pretty-code-title',
            'dataRehypePrettyCodeTitle',
          )
        ) {
          extractedTitle = collectHastText(child).trim();
          continue;
        }
        filteredChildren.push(child);
      }

      for (const child of filteredChildren) {
        if (child.type === 'element' && child.tagName === 'pre') {
          child.properties = child.properties ?? {};
          if (extractedTitle) {
            child.properties['data-title'] = extractedTitle;
          }

          const codeNode = child.children?.find(
            (grandChild) =>
              grandChild.type === 'element' && grandChild.tagName === 'code',
          );
          if (codeNode) {
            codeNode.properties = codeNode.properties ?? {};
            const lineSpans =
              codeNode.children?.filter(
                (line) =>
                  line.type === 'element' &&
                  hasHastProperty(line.properties, 'data-line', 'dataLine'),
              ) ?? [];
            if (
              lineSpans.length > 1 &&
              !hasHastProperty(
                codeNode.properties,
                'data-line-numbers',
                'dataLineNumbers',
              )
            ) {
              codeNode.properties['data-line-numbers'] = '';
            }
          }
        }
      }

      node.children = filteredChildren;
    }

    for (const child of node.children) {
      walk(child);
    }
  };

  return (tree: HastNode) => {
    walk(tree);
  };
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: false,
  defaultLang: 'text',
  getHighlighter: () => getServerShikiHighlighter(),
};

/**
 * Bảng ánh xạ các thành phần giao diện MDX hoàn toàn trên Server (RSC).
 * Sử dụng React.createElement để tương thích trực tiếp với file .ts dưới chế độ TypeScript strict.
 */
export function createMdxComponents(): MdxComponentMap {
  return {
    Callout,
    pre: PreBlock,
    table: (props: React.ComponentPropsWithoutRef<'table'>) =>
      React.createElement(
        'div',
        {
          tabIndex: 0,
          role: 'region',
          'aria-label': 'Bảng dữ liệu kỹ thuật',
          className:
            'my-6 overflow-x-auto rounded-xl border border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        },
        React.createElement('table', {
          ...props,
          className: [
            'w-full min-w-[520px] border-collapse text-left text-sm text-[var(--text-secondary)]',
            props.className ?? '',
          ]
            .filter(Boolean)
            .join(' '),
        }),
      ),
    thead: (props: React.ComponentPropsWithoutRef<'thead'>) =>
      React.createElement('thead', {
        ...props,
        className: [
          'border-b border-[var(--border-strong)] bg-[var(--bg-secondary)] text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    th: (props: React.ComponentPropsWithoutRef<'th'>) =>
      React.createElement('th', {
        ...props,
        className: ['px-4 py-3 font-semibold', props.className ?? '']
          .filter(Boolean)
          .join(' '),
      }),
    td: (props: React.ComponentPropsWithoutRef<'td'>) =>
      React.createElement('td', {
        ...props,
        className: [
          'border-t border-[var(--border-subtle)] px-4 py-3 align-top',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    code: (
      props: React.ComponentPropsWithoutRef<'code'> & {
        'data-language'?: string;
      },
    ) => {
      if (props['data-language'] !== undefined) {
        return React.createElement('code', props);
      }
      return React.createElement('code', {
        ...props,
        className: [
          'rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-[var(--text-primary)]',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      });
    },
    h2: (props: React.ComponentPropsWithoutRef<'h2'>) =>
      React.createElement('h2', {
        ...props,
        className: [
          'mt-11 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--text-primary)] [&_a]:no-underline [&_a:hover]:underline',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    h3: (props: React.ComponentPropsWithoutRef<'h3'>) =>
      React.createElement('h3', {
        ...props,
        className: [
          'mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight text-[var(--text-primary)] [&_a]:no-underline [&_a:hover]:underline',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    p: (props: React.ComponentPropsWithoutRef<'p'>) =>
      React.createElement('p', {
        ...props,
        className: [
          'my-4 text-[1.0625rem] leading-[1.75] text-[var(--text-secondary)]',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    ul: (props: React.ComponentPropsWithoutRef<'ul'>) =>
      React.createElement('ul', {
        ...props,
        className: [
          'my-4 list-disc space-y-2 pl-6 text-[1.0625rem] leading-[1.75] text-[var(--text-secondary)]',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    ol: (props: React.ComponentPropsWithoutRef<'ol'>) =>
      React.createElement('ol', {
        ...props,
        className: [
          'my-4 list-decimal space-y-2 pl-6 text-[1.0625rem] leading-[1.75] text-[var(--text-secondary)]',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) =>
      React.createElement('blockquote', {
        ...props,
        className: [
          'my-6 border-l-4 border-[var(--border-strong)] pl-4 italic text-[var(--text-muted)]',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    a: (props: React.ComponentPropsWithoutRef<'a'>) => {
      const isExternal =
        typeof props.href === 'string' && /^https?:\/\//i.test(props.href);
      return React.createElement('a', {
        ...props,
        ...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {}),
        className: [
          'font-medium text-[var(--accent-primary)] underline underline-offset-4 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          props.className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
      });
    },
    hr: (props: React.ComponentPropsWithoutRef<'hr'>) =>
      React.createElement('hr', {
        ...props,
        className: ['my-8 border-[var(--border-subtle)]', props.className ?? '']
          .filter(Boolean)
          .join(' '),
      }),
  };
}

/**
 * Biên dịch nội dung MDX thô sang React Server Element với đầy đủ GFM, Slug tiếng Việt và Shiki 15 ngôn ngữ.
 */
export async function compileMdxContent(
  source: string,
): Promise<React.ReactElement> {
  const { content } = await compileMDX({
    source,
    components: createMdxComponents(),
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypePrettyCode, prettyCodeOptions],
          rehypeNormalizePrettyCode,
        ],
      },
    },
  });

  return content;
}
