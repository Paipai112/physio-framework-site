import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "页面未找到 - 生理信号处理框架",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 text-8xl">🔍</div>
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="mt-4 text-lg text-slate-400">
        您访问的页面不存在或已被移除
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          返回首页
        </Link>
        <Link
          href="/module"
          className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
        >
          浏览模块
        </Link>
      </div>
    </div>
  );
}
