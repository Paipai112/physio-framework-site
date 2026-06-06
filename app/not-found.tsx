import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span className="font-heading text-[8rem] font-bold tracking-[-0.05em] text-white/5 select-none">
        404
      </span>
      <h1 className="font-heading text-2xl font-semibold text-text-primary mt-[-3rem]">
        页面未找到
      </h1>
      <p className="text-text-secondary mt-3">
        您访问的页面不存在或已被移除
      </p>
      <div className="flex gap-4 mt-8">
        <Link
          href="/"
          className="rounded-xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-all duration-200"
        >
          返回首页
        </Link>
        <Link
          href="/module"
          className="rounded-xl border border-border-default text-text-secondary px-6 py-3 text-sm font-medium hover:border-white/30 hover:text-text-primary transition-all duration-200"
        >
          浏览模块
        </Link>
      </div>
    </div>
  );
}
