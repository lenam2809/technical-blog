import * as React from 'react';
import { Container, Database, Server } from 'lucide-react';

export interface EnvironmentBadgesProps {
  environments?: readonly string[];
  className?: string;
}

type BadgeIconComponent = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean;
}>;

function resolveEnvironmentIcon(label: string): BadgeIconComponent {
  if (/oracle|sql|pl\/sql|odp|postgres|redis|db/i.test(label)) {
    return Database;
  }
  if (/docker|compose|alpine|linux|k8s|nginx/i.test(label)) {
    return Container;
  }
  return Server;
}

export function EnvironmentBadges({
  environments,
  className,
}: EnvironmentBadgesProps): React.JSX.Element | null {
  if (!environments || environments.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label="Thông số môi trường kỹ thuật"
      className={[
        'flex flex-wrap items-center gap-2',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {environments.map((envItem) => {
        const Icon = resolveEnvironmentIcon(envItem);
        return (
          <li
            key={envItem}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--text-secondary)]"
          >
            <Icon
              className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]"
              aria-hidden={true}
            />
            <span>{envItem}</span>
          </li>
        );
      })}
    </ul>
  );
}
