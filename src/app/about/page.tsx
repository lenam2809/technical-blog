import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Server,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';
import { buildPersonJsonLd } from '@/lib/seo';
import type { PostType } from '@/types/post';

const BASE_URL = SITE_CONFIG.url.replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Hồ sơ Năng lực & Dịch vụ Kỹ thuật',
  description:
    'Hồ sơ năng lực kỹ thuật Dual-Track của kỹ sư phần mềm Nam Lê (Hanoi, Vietnam): Hệ thống Backend .NET Framework / .NET 8+, tối ưu hóa Oracle Database & PL/SQL, Docker, CI/CD, Microservices và Next.js.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    type: 'profile',
    locale: SITE_CONFIG.locale,
    url: `${BASE_URL}/about`,
    siteName: SITE_CONFIG.name,
    title: `Hồ sơ Năng lực & Dịch vụ Kỹ thuật | ${SITE_CONFIG.author.name}`,
    description:
      'Software Engineer chuyên sâu .NET Framework / .NET 8+, ASP.NET Web API, Oracle Database / PL/SQL Performance Tuning, Docker & Next.js.',
  },
  twitter: {
    card: 'summary',
    title: `Hồ sơ Năng lực & Dịch vụ Kỹ thuật | ${SITE_CONFIG.author.name}`,
    description:
      'Software Engineer chuyên sâu .NET Backend, Oracle SQL Performance Tuning, Docker & Modern Web.',
  },
};

interface CompetencyPillar {
  id: string;
  badge: string;
  title: string;
  summary: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  items: readonly string[];
  categoryLinks: ReadonlyArray<{ href: string; label: string }>;
}

const COMPETENCY_PILLARS: readonly CompetencyPillar[] = [
  {
    id: 'pillar-backend',
    badge: 'PILLAR 01',
    title: 'Backend & Enterprise Systems',
    summary:
      'Thiết kế, bảo trì và nâng cấp các hệ thống giao dịch lõi đòi hỏi tính ổn định cao, kiểm soát chặt bộ nhớ, đồng thời hóa và tích hợp xác thực chuẩn doanh nghiệp.',
    Icon: Code2,
    items: [
      '.NET Framework 4.8 & .NET 8+',
      'C# & Bất đồng bộ / Quản lý bộ nhớ CLR',
      'ASP.NET Web API 2 & Minimal API',
      'Entity Framework 6 & EF Core',
      'OpenIddict / OAuth2 Authentication',
      'ReportViewer & Báo cáo RDLC quy mô lớn',
    ],
    categoryLinks: [
      { href: '/category/dotnet-backend', label: '.NET Backend' },
    ],
  },
  {
    id: 'pillar-database',
    badge: 'PILLAR 02',
    title: 'Database & High-Performance SQL',
    summary:
      'Truy vết nghẽn cổ chai tầng dữ liệu từ AWR / Trace, đọc sâu Execution Plan và thiết kế chiến lược chỉ mục giúp xử lý mượt các tập dữ liệu hàng chục triệu bản ghi.',
    Icon: Database,
    items: [
      'Oracle Database 19c & ODP.NET',
      'PL/SQL Packages & Stored Procedures',
      'Phân tích Execution Plan (DBMS_XPLAN)',
      'Chiến lược Covering & Composite Indexing',
      'Xử lý Locking & ORA-00060 Deadlock',
      'Tối ưu hóa truy vấn báo cáo dữ liệu lớn',
    ],
    categoryLinks: [
      { href: '/category/database-sql', label: 'Database & SQL' },
    ],
  },
  {
    id: 'pillar-devops-web',
    badge: 'PILLAR 03',
    title: 'DevOps, Distributed Architecture & Modern Web',
    summary:
      'Hiện đại hóa quy trình đóng gói, tự động hóa kiểm định CI/CD, thiết kế giao tiếp bất đồng bộ tin cậy và xây dựng ứng dụng Web tốc độ cao chuẩn SEO/WCAG.',
    Icon: Server,
    items: [
      'Docker Multi-stage & Docker Compose',
      'CI/CD tự động hóa với GitHub Actions',
      'Microservices: RabbitMQ & Outbox Pattern',
      'Redis Distributed Caching',
      'Next.js App Router (SSG / RSC) & React 19',
      'TypeScript Strict & Kiến trúc dễ kiểm thử',
    ],
    categoryLinks: [
      { href: '/category/system-architecture', label: 'System Architecture' },
      { href: '/category/devops-modern-web', label: 'DevOps & Modern Web' },
    ],
  },
];

interface ProofCaseStudy {
  slug: string;
  problemDomain: string;
  challengeSummary: string;
  fallbackTitle: string;
  fallbackImpact: string;
  fallbackPostType: PostType;
  fallbackEnv: readonly string[];
}

const PROOF_OF_WORK_CASES: readonly ProofCaseStudy[] = [
  {
    slug: 'xu-ly-deadlock-va-can-kiet-connection-pool-oracle-web-api',
    problemDomain: 'High-Concurrency Transaction & Connection Pool Stability',
    challengeSummary:
      'Điều tra sự cố khóa chéo thứ tự cập nhật dòng trên Oracle 19c kết hợp rò rỉ phiên ODP.NET làm cạn kiệt Connection Pool (HTTP 503) dưới tải cao điểm; tái cấu trúc khóa tất định và thu hẹp phạm vi Transaction.',
    fallbackTitle:
      'Xử lý ORA-00060 Deadlock và cạn kiệt Connection Pool trên Oracle 19c & Web API',
    fallbackImpact:
      'Loại bỏ 100% lỗi ORA-00060 Deadlock & giảm 85% thời gian giữ kết nối',
    fallbackPostType: 'post-mortem',
    fallbackEnv: [
      '.NET Framework 4.8',
      'ASP.NET Web API 2',
      'Oracle 19c',
      'ODP.NET',
      'IIS 10',
    ],
  },
  {
    slug: 'toi-uu-hieu-nang-truy-van-bao-cao-lon-trong-dotnet-va-oracle',
    problemDomain: 'Large-Dataset Reporting & CLR Memory Optimization',
    challengeSummary:
      'Khắc phục hiện tượng ép kiểu ngầm định SYS_OP_C2C gây Full Table Scan trên bảng 18 triệu dòng, chuyển đổi sang Covering Composite Index + Keyset Pagination và đọc tuần tự giảm áp lực Large Object Heap trên .NET 8.',
    fallbackTitle:
      'Tối ưu hiệu năng truy vấn báo cáo lớn 2 triệu dòng trong .NET 8 và Oracle 19c',
    fallbackImpact:
      'Giảm thời gian xuất báo cáo 2 triệu dòng từ 48s xuống 350ms (-99.2%)',
    fallbackPostType: 'deep-dive',
    fallbackEnv: ['.NET 8', 'Oracle 19c', 'EF Core', 'RDLC Report'],
  },
  {
    slug: 'so-tay-dong-goi-nextjs-va-dotnet-api-voi-docker-multi-stage',
    problemDomain: 'Production Container Hardening & Deployment Pipeline',
    challengeSummary:
      'Chuẩn hóa kiến trúc Multi-stage Dockerfile cho hệ thống kết hợp Next.js 16 Standalone và .NET 8 API chạy dưới quyền non-root user trên nền Alpine, tách mạng nội bộ cô lập và thiết lập cơ chế kiểm tra sức khỏe tự động.',
    fallbackTitle:
      'Sổ tay đóng gói Next.js 16 Standalone và .NET 8 API với Docker Multi-stage',
    fallbackImpact: 'Giảm dung lượng Docker Image từ 1.2GB xuống 145MB (-88%)',
    fallbackPostType: 'reference',
    fallbackEnv: [
      'Next.js 16',
      '.NET 8 API',
      'Docker 27',
      'Docker Compose',
      'Alpine Linux',
    ],
  },
];

const POST_TYPE_BADGE_MAP: Record<
  PostType,
  { label: string; bgVar: string; textVar: string }
> = {
  'post-mortem': {
    label: 'POST-MORTEM',
    bgVar: 'var(--badge-post-mortem-bg)',
    textVar: 'var(--badge-post-mortem-text)',
  },
  'deep-dive': {
    label: 'DEEP-DIVE',
    bgVar: 'var(--badge-deep-dive-bg)',
    textVar: 'var(--badge-deep-dive-text)',
  },
  reference: {
    label: 'REFERENCE',
    bgVar: 'var(--badge-reference-bg)',
    textVar: 'var(--badge-reference-text)',
  },
};

const CONSULTING_SERVICES = [
  {
    title: 'Tối ưu hiệu năng truy vấn Oracle/SQL & gỡ nghẽn CSDL',
    detail:
      'Đọc Execution Plan, thiết kế lại chiến lược Indexing, xử lý Deadlock/Locking và tối ưu PL/SQL cho các báo cáo hoặc giao dịch chậm.',
  },
  {
    title: 'Bảo trì, nâng cấp & phát triển hệ thống .NET Web API',
    detail:
      'Ổn định hóa hệ thống .NET Framework hiện hữu, nâng cấp lộ trình lên .NET 8+, tích hợp OpenIddict, Redis, RabbitMQ & Outbox Pattern.',
  },
  {
    title: 'Xây dựng ứng dụng Web hiện đại với Next.js & .NET',
    detail:
      'Phát triển cổng thông tin kỹ thuật, trang quản trị hoặc ứng dụng khách tốc độ cao chuẩn SSG/SSR với Next.js, React và TypeScript Strict.',
  },
  {
    title: 'Đóng gói Docker Multi-stage & thiết lập đường ống CI/CD',
    detail:
      'Chuẩn hóa môi trường chạy bằng Docker Compose, tối ưu dung lượng image bảo mật non-root và tự động hóa kiểm tra chất lượng qua GitHub Actions.',
  },
] as const;

export default function AboutPage(): React.JSX.Element {
  const publishedPosts = getAllPosts({ includeDrafts: false });
  const postBySlug = new Map(publishedPosts.map((post) => [post.slug, post]));

  const personJsonLd = buildPersonJsonLd();
  const safePersonJsonLd = JSON.stringify(personJsonLd).replace(
    /</g,
    '\\u003c',
  );

  const recruiterMailHref = `mailto:${SITE_CONFIG.author.email}?subject=${encodeURIComponent(
    '[Cơ hội Kỹ thuật / Tuyển dụng] Trao đổi cùng Nam Lê',
  )}`;
  const consultingMailHref = `mailto:${SITE_CONFIG.author.email}?subject=${encodeURIComponent(
    '[Tư vấn & Triển khai Kỹ thuật] Trao đổi bài toán hệ thống',
  )}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safePersonJsonLd }}
      />

      {/* =====================================================================
          PHẦN 1 — EXECUTIVE SUMMARY (TÓM TẮT CHUYÊN MÔN SONG NGỮ VIỆT – ANH)
         ===================================================================== */}
      <section aria-labelledby="executive-summary-heading">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs font-medium text-[var(--text-secondary)]">
            <span
              className="h-2 w-2 rounded-full bg-[var(--accent-emerald)]"
              aria-hidden="true"
            />
            <span>Engineering Profile</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs text-[var(--text-muted)]">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
            <span>Hanoi, Vietnam</span>
          </span>
        </div>

        <h1
          id="executive-summary-heading"
          className="mt-5 scroll-mt-24 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
        >
          {SITE_CONFIG.author.name}{' '}
          <span className="block text-xl font-semibold text-[var(--text-secondary)] sm:mt-2 sm:text-2xl">
            {SITE_CONFIG.author.role}
          </span>
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tóm tắt Tiếng Việt */}
          <article className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--accent-primary)] uppercase">
                Tóm tắt Chuyên môn (VI)
              </span>
              <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                vi-VN
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
              Tôi là Kỹ sư Phần mềm làm việc tại Hà Nội, tập trung giải quyết
              các bài toán giao thoa giữa{' '}
              <strong className="font-semibold text-[var(--text-primary)]">
                hệ thống Backend &amp; Cơ sở dữ liệu doanh nghiệp cốt lõi
              </strong>{' '}
              (.NET Framework / .NET 8+, C#, ASP.NET Web API, Oracle Database,
              PL/SQL, báo cáo RDLC) và{' '}
              <strong className="font-semibold text-[var(--text-primary)]">
                lộ trình hiện đại hóa ứng dụng
              </strong>{' '}
              (Docker, Docker Compose, Microservices với RabbitMQ &amp; Outbox
              Pattern, Redis, OpenIddict, Next.js, React và TypeScript).
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
              Thay vì chỉ dừng ở tầng viết tính năng, tôi ưu tiên khả năng đo
              kiểm định lượng: đọc Execution Plan để gỡ nghẽn truy vấn triệu
              dòng, xử lý triệt để khóa chéo (Deadlock) dưới tải cao và chuẩn
              hóa quy trình đóng gói hạ tầng an toàn, tái lập được.
            </p>
          </article>

          {/* English Executive Summary */}
          <article
            lang="en"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-7"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                <Globe className="h-3.5 w-3.5" aria-hidden={true} />
                <span>Executive Summary (EN)</span>
              </span>
              <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                en-US
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
              Software Engineer based in Hanoi, Vietnam, bridging{' '}
              <strong className="font-semibold text-[var(--text-primary)]">
                mission-critical enterprise backends &amp; relational databases
              </strong>{' '}
              (.NET Framework / .NET 8+, C#, ASP.NET Web API, Oracle Database,
              PL/SQL, RDLC Reporting) with{' '}
              <strong className="font-semibold text-[var(--text-primary)]">
                modern cloud-ready web &amp; distributed engineering
              </strong>{' '}
              (Docker, Docker Compose, Microservices, RabbitMQ, Outbox Pattern,
              Redis, OpenIddict, Next.js, React, and TypeScript).
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
              Focused on measurable production impact: diagnosing deep SQL
              execution bottlenecks, eliminating high-concurrency deadlocks and
              connection pool exhaustion, and shipping clean, strictly-typed,
              containerized systems.
            </p>
          </article>
        </div>
      </section>

      {/* =====================================================================
          PHẦN 2 — TECHNICAL COMPETENCY MATRIX (BENTO GRID 3 TRỤ CỘT)
         ===================================================================== */}
      <section
        aria-labelledby="competency-matrix-heading"
        className="mt-16 border-t border-[var(--border-subtle)] pt-12"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold tracking-wider text-[var(--accent-primary)] uppercase">
              Technical Competency Matrix
            </p>
            <h2
              id="competency-matrix-heading"
              className="mt-1.5 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
            >
              Bản Đồ Năng Lực Kỹ Thuật 3 Trụ Cột
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Enterprise Core • High-Performance SQL • Modern Delivery
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {COMPETENCY_PILLARS.map((pillar) => {
            const { Icon } = pillar;
            return (
              <article
                key={pillar.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--border-strong)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--accent-primary)]">
                      <Icon className="h-5 w-5" aria-hidden={true} />
                    </span>
                    <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--text-muted)]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold tracking-tight text-[var(--text-primary)]">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {pillar.summary}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-[var(--border-subtle)] pt-4">
                    {pillar.items.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-emerald)]"
                          aria-hidden={true}
                        />
                        <span className="font-mono text-xs sm:text-[13px]">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-4">
                  {pillar.categoryLinks.map((catLink) => (
                    <Link
                      key={catLink.href}
                      href={catLink.href}
                      prefetch={false}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span>Chuyên mục: {catLink.label}</span>
                      <ArrowUpRight className="h-3 w-3" aria-hidden={true} />
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          PHẦN 3 — DỰ ÁN THỰC TẾ & CASE STUDIES THỰC CHỨNG (PROOF OF WORK)
         ===================================================================== */}
      <section
        aria-labelledby="proof-of-work-heading"
        className="mt-16 border-t border-[var(--border-subtle)] pt-12"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-[var(--accent-emerald)]">
              Verified Engineering Proof of Work
            </p>
            <h2
              id="proof-of-work-heading"
              className="mt-1.5 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
            >
              Bài Toán Thực Tế &amp; Hồ Sơ Phân Tích Kỹ Thuật
            </h2>
          </div>

          <Link
            href="/#archive-explorer"
            prefetch={false}
            className="inline-flex items-center gap-1.5 rounded-sm font-mono text-xs font-medium text-[var(--accent-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Xem toàn bộ kho bài viết</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden={true} />
          </Link>
        </div>

        <div className="mt-6 space-y-5">
          {PROOF_OF_WORK_CASES.map((item) => {
            const matchedPost = postBySlug.get(item.slug);
            const title = matchedPost?.title ?? item.fallbackTitle;
            const impact = matchedPost?.impact ?? item.fallbackImpact;
            const postType = matchedPost?.postType ?? item.fallbackPostType;
            const environments = matchedPost?.environment ?? item.fallbackEnv;
            const badge = POST_TYPE_BADGE_MAP[postType];

            return (
              <article
                key={item.slug}
                className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 transition-colors hover:bg-[var(--bg-elevated)] sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-md px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide"
                      style={{
                        backgroundColor: badge.bgVar,
                        color: badge.textVar,
                      }}
                    >
                      {badge.label}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {item.problemDomain}
                    </span>
                  </div>

                  {matchedPost && (
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {matchedPost.readingTimeMinutes} phút đọc
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  <Link
                    href={`/blog/${item.slug}`}
                    prefetch={false}
                    className="rounded-sm transition-colors hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {title}
                  </Link>
                </h3>

                <div className="mt-3">
                  <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-700/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-800 sm:text-[13px] dark:border-[var(--accent-emerald)]/35 dark:bg-[var(--accent-emerald)]/10 dark:text-[var(--accent-emerald)]">
                    <TrendingUp
                      className="h-4 w-4 shrink-0"
                      aria-hidden={true}
                    />
                    <span>Kết quả định lượng: {impact}</span>
                  </span>
                </div>

                <p className="mt-3.5 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
                  {item.challengeSummary}
                </p>

                <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:items-center">
                  <ul
                    aria-label="Ngăn xếp công nghệ sử dụng"
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    {environments.map((env) => (
                      <li
                        key={env}
                        className="rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]"
                      >
                        {env}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/blog/${item.slug}`}
                    prefetch={false}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span>Đọc phân tích kỹ thuật</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden={true} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          PHẦN 4 — DUAL-TRACK CALL TO ACTION (2 KHỐI ĐỐI XỨNG)
         ===================================================================== */}
      <section
        aria-labelledby="dual-track-cta-heading"
        className="mt-16 border-t border-[var(--border-subtle)] pt-12"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold tracking-wider text-[var(--accent-primary)] uppercase">
            Dual-Track Collaboration
          </p>
          <h2
            id="dual-track-cta-heading"
            className="mt-1.5 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
          >
            Hợp Tác Kỹ Thuật &amp; Liên Hệ Trực Tiếp
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Tùy theo nhu cầu xây dựng đội ngũ kỹ thuật dài hạn hay giải quyết
            bài toán chuyên sâu theo dự án, bạn có thể kết nối trực tiếp qua hai
            luồng dưới đây:
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Khối 1 — Dành cho Nhà tuyển dụng & Tech Lead */}
          <article className="flex flex-col justify-between rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 font-mono text-xs font-semibold text-[var(--accent-primary)]">
                <Users className="h-4 w-4 shrink-0" aria-hidden={true} />
                <span>Track 01 • Recruiters &amp; Tech Leads</span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                Dành cho Nhà tuyển dụng &amp; Tech Lead
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                Quen thuộc với nhịp vận hành dự án phần mềm doanh nghiệp và phối
                hợp chặt chẽ đa vai trò giữa{' '}
                <strong className="font-semibold text-[var(--text-primary)]">
                  Dev, QA, BA và Management
                </strong>{' '}
                — từ khâu làm rõ nghiệp vụ phức tạp, thiết kế hợp đồng API/CSDL,
                kiểm soát chất lượng kiểm thử cho tới điều tra sự cố Production.
              </p>

              <ul className="mt-4 space-y-2.5 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <Briefcase
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-primary)]"
                    aria-hidden={true}
                  />
                  <span>
                    <strong className="font-semibold text-[var(--text-primary)]">
                      Định hướng vị trí:
                    </strong>{' '}
                    Senior Backend / Full-stack Engineer (.NET, Oracle/SQL &amp;
                    Modern Web).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-emerald)]"
                    aria-hidden={true}
                  />
                  <span>
                    Chủ động sở hữu trọn luồng tính năng (End-to-end Ownership),
                    viết tài liệu kỹ thuật rõ ràng và chia sẻ kiến thức nội bộ.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-5">
              <a
                href={recruiterMailHref}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:text-sm"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden={true} />
                <span>Liên hệ Email / Nhận CV</span>
              </a>

              <a
                href={SITE_CONFIG.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-sm"
              >
                <span>GitHub (@namlvThienHoang)</span>
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden={true}
                />
              </a>
            </div>
          </article>

          {/* Khối 2 — Dành cho Khách hàng & Đối tác Tư vấn */}
          <article className="flex flex-col justify-between rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 font-mono text-xs font-semibold text-emerald-700 dark:text-[var(--accent-emerald)]">
                <Wrench className="h-4 w-4 shrink-0" aria-hidden={true} />
                <span>Track 02 • Consulting &amp; Delivery</span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                Dành cho Khách hàng &amp; Đối tác Tư vấn
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                Nhận tư vấn chuyên sâu, gỡ nghẽn hiệu năng hoặc triển khai trọn
                gói theo phạm vi cam kết rõ ràng cho 4 nhóm giải pháp kỹ thuật:
              </p>

              <ol className="mt-4 space-y-3 border-t border-[var(--border-subtle)] pt-4">
                {CONSULTING_SERVICES.map((service, index) => (
                  <li key={service.title} className="text-sm">
                    <p className="font-semibold text-[var(--text-primary)]">
                      <span className="mr-1.5 font-mono text-xs text-emerald-700 dark:text-[var(--accent-emerald)]">
                        0{index + 1}.
                      </span>
                      {service.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {service.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-5">
              <a
                href={consultingMailHref}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:text-sm"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden={true} />
                <span>Trao đổi Bài toán qua Email</span>
              </a>

              <span className="font-mono text-xs text-[var(--text-muted)]">
                {SITE_CONFIG.author.email}
              </span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
