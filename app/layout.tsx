import type { Metadata } from "next";
import "./globals.css";
import { MobileNav } from "@/components/MobileNav";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: {
    default: "生理信号处理框架",
    template: "%s - 生理信号处理框架",
  },
  description:
    "一个系统化的生理信号处理知识体系，从传感器到临床应用的完整技术栈",
};

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/layer", label: "层级" },
  { href: "/module", label: "模块" },
  { href: "/glossary", label: "术语" },
  { href: "/references", label: "参考文献" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-surface-dark text-slate-100 antialiased">
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          跳转到主内容
        </a>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="border-b border-slate-700/50 py-6">
            <div className="flex items-center justify-between">
              <a href="/" className="group">
                <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-primary-400 transition-colors">
                  生理信号处理框架
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Physiological Signal Processing Framework
                </p>
              </a>

              {/* Desktop nav */}
              <nav className="hidden md:flex md:items-center md:space-x-1" aria-label="主导航">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Mobile nav */}
              <MobileNav links={navLinks} />
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" className="py-8" tabIndex={-1}>
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-700/50 py-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-400">
                  生理信号处理框架 &mdash; 开源知识体系
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  从传感器到临床应用的系统化技术栈
                </p>
              </div>
              <nav className="flex gap-6 text-xs text-slate-500" aria-label="页脚导航">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-slate-300"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </footer>
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
