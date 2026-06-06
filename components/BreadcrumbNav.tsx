import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

function ChevronSeparator() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted/40 shrink-0"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  );
}

export default function BreadcrumbNav({ crumbs }: Props) {
  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-[13px] font-body"
    >
      {crumbs.map((crumb, i) => {
        const isFirst = i === 0;
        const isLast = i === crumbs.length - 1;

        return (
          <span key={i} className="flex items-center gap-2">
            {!isFirst && <ChevronSeparator />}

            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="text-text-muted hover:text-text-secondary transition-colors duration-200"
              >
                {isFirst ? <HomeIcon /> : <span>{crumb.label}</span>}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "text-text-primary font-medium"
                    : "text-text-muted hover:text-text-secondary transition-colors duration-200"
                }
              >
                {isFirst ? <HomeIcon /> : <span>{crumb.label}</span>}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
