import GitHubSlugger from 'github-slugger';
import { describe, expect, it } from 'vitest';
import {
  calculateTechnicalReadingTime,
  extractTocFromMdx,
} from '@/lib/toc';

describe('extractTocFromMdx (AST TOC Extractor)', () => {
  it('trích xuất đúng h2 và h3, đồng thời bỏ qua h1 và h4..h6', () => {
    const mdx = [
      '# Tiêu đề cấp 1 không đưa vào mục lục',
      '## Tổng quan kiến trúc hệ thống',
      '### Luồng xử lý Outbox Pattern',
      '#### Chi tiết nhỏ cấp 4 bị bỏ qua',
      '##### Cấp 5 bị bỏ qua',
      '###### Cấp 6 bị bỏ qua',
    ].join('\n\n');

    const toc = extractTocFromMdx(mdx);

    expect(toc).toEqual([
      {
        id: 'tổng-quan-kiến-trúc-hệ-thống',
        text: 'Tổng quan kiến trúc hệ thống',
        level: 2,
      },
      {
        id: 'luồng-xử-lý-outbox-pattern',
        text: 'Luồng xử lý Outbox Pattern',
        level: 3,
      },
    ]);
  });

  it('sinh ID tiếng Việt có dấu, ký tự đặc biệt và inline code đồng bộ 100% với GitHubSlugger (rehype-slug)', () => {
    const mdx = [
      '## Tối ưu hóa Oracle 19c & xử lý lỗi Deadlock',
      '### Phân tích `DBMS_XPLAN` trên .NET 8 / PL-SQL',
    ].join('\n\n');

    const referenceSlugger = new GitHubSlugger();
    const expectedFirstId = referenceSlugger.slug(
      'Tối ưu hóa Oracle 19c & xử lý lỗi Deadlock',
    );
    const expectedSecondId = referenceSlugger.slug(
      'Phân tích DBMS_XPLAN trên .NET 8 / PL-SQL',
    );

    const toc = extractTocFromMdx(mdx);

    expect(toc).toEqual([
      {
        id: expectedFirstId,
        text: 'Tối ưu hóa Oracle 19c & xử lý lỗi Deadlock',
        level: 2,
      },
      {
        id: expectedSecondId,
        text: 'Phân tích DBMS_XPLAN trên .NET 8 / PL-SQL',
        level: 3,
      },
    ]);
  });

  it('bỏ qua 100% các dòng bắt đầu bằng ## hoặc ### nằm bên trong khối fenced code', () => {
    const mdx = [
      '## Triệu chứng ban đầu',
      '```sql',
      '## Dòng comment giả dạng h2 trong khối SQL',
      '### Dòng comment giả dạng h3 trong khối SQL',
      'SELECT * FROM ORDERS;',
      '```',
      '~~~bash',
      '## Ghi chú bash trong khối tilde fence',
      'docker compose up -d',
      '~~~',
      '### Kết luận nguyên nhân gốc rễ',
    ].join('\n');

    const toc = extractTocFromMdx(mdx);

    expect(toc).toHaveLength(2);
    expect(toc.map((item) => item.text)).toEqual([
      'Triệu chứng ban đầu',
      'Kết luận nguyên nhân gốc rễ',
    ]);
  });

  it('đánh hậu tố khử trùng lặp (-1, -2) trong cùng bài và reset trạng thái giữa các lần gọi', () => {
    const mdx = [
      '## Đo kiểm hiệu năng',
      '### Kết quả thực tế',
      '## Đo kiểm hiệu năng',
      '### Kết quả thực tế',
    ].join('\n\n');

    const firstRun = extractTocFromMdx(mdx);
    const secondRun = extractTocFromMdx('## Đo kiểm hiệu năng');

    expect(firstRun.map((item) => item.id)).toEqual([
      'đo-kiểm-hiệu-năng',
      'kết-quả-thực-tế',
      'đo-kiểm-hiệu-năng-1',
      'kết-quả-thực-tế-1',
    ]);
    expect(secondRun[0]?.id).toBe('đo-kiểm-hiệu-năng');
  });
});

describe('calculateTechnicalReadingTime (BR-03)', () => {
  it('trả về tối thiểu 1 phút cho nội dung rỗng hoặc rất ngắn', () => {
    expect(calculateTechnicalReadingTime('')).toEqual({
      readingTimeMinutes: 1,
      wordCount: 0,
      codeLines: 0,
      imageCount: 0,
    });

    const shortStats = calculateTechnicalReadingTime('Ghi chú ngắn gọn.');
    expect(shortStats.readingTimeMinutes).toBe(1);
    expect(shortStats.wordCount).toBe(4);
  });

  it('tách riêng số dòng code (codeLines / 25) và không đếm code vào wordCount', () => {
    const fiftyCodeLines = Array.from(
      { length: 50 },
      (_, idx) => `var record${idx} = await repository.LoadAsync(${idx});`,
    ).join('\n');

    const mdx = ['```csharp', fiftyCodeLines, '```'].join('\n');
    const stats = calculateTechnicalReadingTime(mdx);

    expect(stats.codeLines).toBe(50);
    expect(stats.wordCount).toBe(0);
    expect(stats.imageCount).toBe(0);
    expect(stats.readingTimeMinutes).toBe(2);
  });

  it('đếm chính xác số lượng ảnh từ cả Markdown ![alt](url) và thẻ JSX <Image /> / <img />', () => {
    const mdx = [
      '![Execution Plan trước tối ưu](/images/posts/plan-before.png)',
      '![Execution Plan sau tối ưu](/images/posts/plan-after.png)',
      '<Image src="/images/posts/arch.png" alt="Kiến trúc" width={800} height={450} />',
      '<img src="/images/posts/metrics.png" alt="Metrics" />',
      '![Biểu đồ độ trễ P99](/images/posts/p99.png)',
    ].join('\n\n');

    const stats = calculateTechnicalReadingTime(mdx);

    expect(stats.imageCount).toBe(5);
    expect(stats.wordCount).toBe(0);
    // 5 * 12 / 60 = 1.0 phút
    expect(stats.readingTimeMinutes).toBe(1);
  });

  it('giữ nguyên thuộc tính title và văn bản bên trong <Callout> nhưng loại bỏ tên thẻ và prop kỹ thuật', () => {
    const mdx = [
      '<Callout type="root-cause" title="Nguyên nhân gây khóa chéo">',
      'Hai giao dịch cập nhật ngược thứ tự khóa chính.',
      '</Callout>',
    ].join('\n');

    const stats = calculateTechnicalReadingTime(mdx);

    // "Nguyên nhân gây khóa chéo" (5 từ) + "Hai giao dịch cập nhật ngược thứ tự khóa chính." (10 từ) = 15 từ
    expect(stats.wordCount).toBe(15);
    expect(stats.codeLines).toBe(0);
    expect(stats.imageCount).toBe(0);
  });

  it('tính chính xác tổ hợp công thức BR-03 mà không bị sai số dấu phẩy động IEEE-754', () => {
    // 120/200 (0.6) + 5/25 (0.2) + 1*12/60 (0.2) = đúng 1.0 (trong IEEE-754 0.6+0.2+0.2 = 1.0000000000000002)
    const words120 = Array.from({ length: 120 }, () => 'tối').join(' ');
    const code5 = Array.from({ length: 5 }, (_, i) => `SELECT ${i} FROM DUAL;`).join('\n');
    const exactOneMinuteMdx = `${words120}\n\n\`\`\`sql\n${code5}\n\`\`\`\n\n![Chart](/img/a.png)`;

    const exactStats = calculateTechnicalReadingTime(exactOneMinuteMdx);
    expect(exactStats).toEqual({
      readingTimeMinutes: 1,
      wordCount: 120,
      codeLines: 5,
      imageCount: 1,
    });

    // Thêm đúng 1 từ (121 từ) -> tổng > 1.0 -> làm tròn trần lên 2 phút
    const ceilTwoMinutesStats = calculateTechnicalReadingTime(
      `${exactOneMinuteMdx}\nthêm`,
    );
    expect(ceilTwoMinutesStats.wordCount).toBe(121);
    expect(ceilTwoMinutesStats.readingTimeMinutes).toBe(2);
  });

  it('xử lý ổn định chuỗi đầu vào dùng ký tự xuống dòng Windows CRLF (\\r\\n)', () => {
    const crlfMdx = [
      '## Kiểm tra CRLF',
      '```powershell',
      'Get-Process dotnet',
      'Get-Service OracleServiceXE',
      '```',
      'Đoạn văn bản gồm sáu từ chuẩn.',
    ].join('\r\n');

    const toc = extractTocFromMdx(crlfMdx);
    const stats = calculateTechnicalReadingTime(crlfMdx);

    expect(toc).toHaveLength(1);
    expect(stats.codeLines).toBe(2);
    expect(stats.wordCount).toBe(10);
  });
});
