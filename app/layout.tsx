import type { Metadata } from "next";
import "./globals.css";
import { MobileNav } from "@/components/MobileNav";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: {
    default: "生理信号处理框架",
    template: "%s — 生理信号处理框架",
  },
  description:
    "一个系统化的生理信号处理知识体系，从传感器到临床应用的完整技术栈。覆盖 PPG、ECG、HRV、睡眠分析等 98 个技术模块。",
};

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/layer", label: "层级" },
  { href: "/module", label: "模块" },
  { href: "/glossary", label: "术语" },
  { href: "/references", label: "文献" },
  { href: "/mvptree", label: "MVP树" },
  { href: "/frontier", label: "前沿" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-surface font-body text-text-primary antialiased">
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-5 focus:py-3 focus:text-black focus:outline-none"
        >
          跳转到主内容
        </a>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
            <a href="/" className="group shrink-0 relative">
              <span className="font-heading text-lg font-semibold tracking-tight text-text-primary transition-colors group-hover:text-white">
                生理信号处理框架
              </span>
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-white/50 transition-transform duration-300 group-hover:scale-x-100" />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex md:items-center md:gap-1" aria-label="主导航">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-text-secondary transition-all duration-200 hover:scale-[1.02] hover:bg-surface-hover hover:text-text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile nav */}
            <MobileNav links={navLinks} />
          </div>
        </header>

        {/* Main */}
        <main id="main-content" className="mx-auto max-w-content px-6 py-10" tabIndex={-1}>
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border-subtle">
          <div className="mx-auto flex max-w-content flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                生理信号处理框架
              </p>
              <p className="mt-1 text-xs text-text-muted">
                开源知识体系 — 从传感器到临床应用的完整技术栈
              </p>
            </div>
            <nav className="flex gap-8 text-xs text-text-muted" aria-label="页脚导航">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-text-secondary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>

        <BackToTop />
      </body>
    </html>
  );
}
