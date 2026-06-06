import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function BreadcrumbNav({ crumbs }: Props) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-400">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center space-x-2">
          {i > 0 && <span>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-white">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-white">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
