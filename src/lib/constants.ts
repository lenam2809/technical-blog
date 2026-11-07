export const SITE_CONFIG = {
  name: 'Nam Lê — Engineering Blog & Portfolio',
  title: 'Nam Lê | .NET, Oracle SQL, System Architecture & Modern Web',
  description:
    'Chia sẻ kinh nghiệm thực chiến về .NET, Web API, tối ưu hóa Oracle/SQL, phân tích sự cố (Post-mortem) và hành trình DevOps, Docker, Next.js.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://namle.dev',
  locale: 'vi_VN',
  author: {
    name: 'Nam Lê',
    role: 'Software Engineer (.NET, Oracle SQL & Modern Web)',
    github: 'https://github.com/namlvThienHoang',
    email: 'contact@namle.dev',
  },
} as const;

export const CATEGORIES = [
  {
    slug: 'dotnet-backend',
    label: '.NET & Backend Engineering',
    shortLabel: '.NET Backend',
    description:
      '.NET Framework / .NET Core, C#, ASP.NET Web API, Entity Framework, quản lý bộ nhớ, bất đồng bộ, xử lý báo cáo (RDLC/ReportViewer) và hiệu năng tầng ứng dụng.',
  },
  {
    slug: 'database-sql',
    label: 'Oracle Database & SQL Tuning',
    shortLabel: 'Database & SQL',
    description:
      'Oracle Database, PL/SQL, tối ưu hóa câu truy vấn SQL, phân tích Execution Plan, chiến lược Indexing, xử lý Locking/Deadlock và thiết kế CSDL.',
  },
  {
    slug: 'system-architecture',
    label: 'System Architecture & Integration',
    shortLabel: 'System Architecture',
    description:
      'Thiết kế hệ thống phân tán, Microservices, tích hợp hệ thống (Outbox Pattern, Message Queue, Caching), bảo mật API (OpenIddict/OAuth2) và Observability/Logging.',
  },
  {
    slug: 'devops-modern-web',
    label: 'DevOps, Docker & Modern Web',
    shortLabel: 'DevOps & Modern Web',
    description:
      'Đóng gói ứng dụng với Docker & Docker Compose, thiết lập đường ống CI/CD, quản trị VPS/Linux và phát triển giao diện hiện đại với Next.js, React, TypeScript.',
  },
] as const;

export type CategoryMeta = (typeof CATEGORIES)[number];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export const ALLOWED_TAGS = [
  // .NET & Backend
  'dotnet-framework',
  'dotnet',
  'csharp',
  'web-api',
  'entity-framework',
  'ef-core',
  'rdlc-report',
  'memory-management',
  'concurrency',
  // Database & SQL
  'oracle',
  'plsql',
  'sql-optimization',
  'execution-plan',
  'indexing',
  'deadlock',
  'connection-pool',
  // System Architecture
  'microservices',
  'rabbitmq',
  'outbox-pattern',
  'redis',
  'openiddict',
  'authentication',
  'observability',
  'security',
  // DevOps & Modern Web
  'docker',
  'docker-compose',
  'ci-cd',
  'linux',
  'nextjs',
  'react',
  'typescript',
] as const;
