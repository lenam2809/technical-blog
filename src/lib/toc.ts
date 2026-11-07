import GitHubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { ReadingTimeStats, TocItem } from '@/types/post';

function stripOptionalFrontmatter(rawMdx: string): string {
  const normalized = rawMdx.replace(/\r\n/g, '\n');
  if (/^---\n[\s\S]*?\n---(?:\n|$)/.test(normalized)) {
    return matter(normalized).content.replace(/\r\n/g, '\n');
  }
  return normalized;
}

/**
 * Trích xuất mục lục (h2, h3) từ cây cú pháp AST Markdown/MDX.
 * Bỏ qua 100% các dòng ## bên trong khối code fence và đồng bộ ID tiếng Việt với rehype-slug.
 */
export function extractTocFromMdx(rawMdx: string): TocItem[] {
  const content = stripOptionalFrontmatter(rawMdx);
  const slugger = new GitHubSlugger();
  const tree = unified().use(remarkParse).parse(content);
  const items: TocItem[] = [];

  visit(tree, 'heading', (node) => {
    if (node.depth !== 2 && node.depth !== 3) {
      return;
    }

    const text = toString(node).trim();
    if (!text) {
      return;
    }

    items.push({
      id: slugger.slug(text),
      text,
      level: node.depth,
    });
  });

  return items;
}

const FENCED_CODE_REGEX = /^(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^\1[ \t]*$/gm;
const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\([^)]+\)/g;
const JSX_IMAGE_REGEX = /<(?:Image|img)\b[\s\S]*?\/?>/g;
const CALLOUT_OPEN_TAG_REGEX = /<Callout\b([\s\S]*?)>/g;
const JSX_OR_HTML_TAG_REGEX = /<\/?[A-Za-z][A-Za-z0-9._-]*\b[^>]*\/?>/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\([^)]+\)/g;
const WORD_TOKEN_REGEX = /[\p{L}\p{N}]/u;

function extractCalloutTitle(attributesRaw: string): string {
  const patterns = [
    /\btitle\s*=\s*"([^"]*)"/,
    /\btitle\s*=\s*'([^']*)'/,
    /\btitle\s*=\s*\{\s*"([^"]*)"\s*\}/,
    /\btitle\s*=\s*\{\s*'([^']*)'\s*\}/,
    /\btitle\s*=\s*\{\s*`([^`]*)`\s*\}/,
  ];

  for (const pattern of patterns) {
    const match = attributesRaw.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return '';
}

/**
 * Thực thi công thức tính thời gian đọc kỹ thuật chính xác (BR-03):
 * readingTimeMinutes = max(1, ceil(wordCount / 200 + codeLines / 25 + (imageCount * 12) / 60))
 */
export function calculateTechnicalReadingTime(rawMdx: string): ReadingTimeStats {
  const content = stripOptionalFrontmatter(rawMdx);

  // 1. Đếm số dòng code bên trong các khối fenced code và xóa chúng khỏi văn bản
  let codeLines = 0;
  const withoutCode = content.replace(
    FENCED_CODE_REGEX,
    (_fullMatch, _fence: string, codeBody: string) => {
      if (codeBody.length > 0) {
        const trimmedTrailingNewline = codeBody.replace(/\n$/, '');
        if (trimmedTrailingNewline.length > 0) {
          codeLines += trimmedTrailingNewline.split('\n').length;
        }
      }
      return '\n';
    },
  );

  // 2. Đếm số lượng hình ảnh Markdown và thẻ <Image /> / <img />
  const markdownImages = withoutCode.match(MARKDOWN_IMAGE_REGEX) ?? [];
  const withoutMarkdownImages = withoutCode.replace(MARKDOWN_IMAGE_REGEX, ' ');

  const jsxImages = withoutMarkdownImages.match(JSX_IMAGE_REGEX) ?? [];
  const withoutImages = withoutMarkdownImages.replace(JSX_IMAGE_REGEX, ' ');

  const imageCount = markdownImages.length + jsxImages.length;

  // 3. Bảo toàn thuộc tính title của <Callout ...>, loại bỏ thẻ mở/đóng JSX nhưng giữ nguyên nội dung bên trong
  const withCalloutTitles = withoutImages.replace(
    CALLOUT_OPEN_TAG_REGEX,
    (_fullMatch, attrs: string) => {
      const title = extractCalloutTitle(attrs);
      return title ? ` ${title} ` : ' ';
    },
  );

  const withoutCommentsAndTags = withCalloutTitles
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(JSX_OR_HTML_TAG_REGEX, ' ');

  const proseWithLinkLabels = withoutCommentsAndTags.replace(
    MARKDOWN_LINK_REGEX,
    ' $1 ',
  );

  const tokens = proseWithLinkLabels
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0 && WORD_TOKEN_REGEX.test(token));

  const wordCount = tokens.length;

  // 4. Quy đồng mẫu số chung 200 để triệt tiêu sai số dấu phẩy động IEEE-754 trước khi Math.ceil:
  // wordCount / 200 + codeLines / 25 + (imageCount * 12) / 60 === (wordCount + codeLines * 8 + imageCount * 40) / 200
  const readingTimeMinutes = Math.max(
    1,
    Math.ceil((wordCount + codeLines * 8 + imageCount * 40) / 200),
  );

  return {
    readingTimeMinutes,
    wordCount,
    codeLines,
    imageCount,
  };
}
