import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "生理信号处理框架",
  description:
    "一个系统化的生理信号处理知识体系，从传感器到临床应用的完整技术栈",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-surface-dark text-slate-100 antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="border-b border-slate-700/50 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  生理信号处理框架
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Physiological Signal Processing Framework
                </p>
              </div>
              <nav className="hidden md:flex md:items-center md:space-x-6">
                <a
                  href="/"
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  首页
                </a>
                <a
                  href="/layer"
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  层级
                </a>
                <a
                  href="/module"
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  模块
                </a>
                <a
                  href="/glossary"
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  术语
                </a>
                <a
                  href="/references"
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  参考文献
                </a>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="py-8">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-700/50 py-6 text-center text-xs text-slate-500">
            <p>生理信号处理框架 &mdash; 开源知识体系</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
