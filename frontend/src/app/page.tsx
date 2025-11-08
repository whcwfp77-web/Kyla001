import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            语言学习平台
          </Link>
          <div className="flex gap-6">
            <Link href="/search" className="hover:text-primary">搜索</Link>
            <Link href="/grammar" className="hover:text-primary">语法透镜</Link>
            <Link href="/me/review" className="hover:text-primary">我的复习</Link>
            <Link href="/admin/review" className="hover:text-primary">管理</Link>
          </div>
          <div>
            <Link href="/auth/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              登录
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            在真实语境中学习语言
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            通过真实媒体片段、智能复习和跟读练习，掌握日语、英语、韩语等多种语言
          </p>

          {/* 搜索框 */}
          <div className="mb-16">
            <SearchBar />
          </div>

          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 border rounded-lg bg-card">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">智能搜索</h3>
              <p className="text-muted-foreground">
                关键词+语义搜索，快速找到你需要的学习内容
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="text-4xl mb-4">🗣️</div>
              <h3 className="text-xl font-semibold mb-2">Shadow Lab</h3>
              <p className="text-muted-foreground">
                跟读实验室，模仿原生发音，提升口语能力
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-2">SRS复习</h3>
              <p className="text-muted-foreground">
                间隔重复系统，科学安排复习，高效记忆
              </p>
            </div>
          </div>

          {/* 语言选择 */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">选择你要学习的语言</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {['日语', '英语', '韩语', '中文'].map((lang) => (
                <Link
                  key={lang}
                  href={`/search?language=${lang}`}
                  className="px-8 py-3 border-2 rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  {lang}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">关于</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">关于我们</Link></li>
                <li><Link href="/contact">联系我们</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">法律</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/legal/privacy">隐私政策</Link></li>
                <li><Link href="/legal/copyright">版权声明</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help">帮助中心</Link></li>
                <li><Link href="/feedback">反馈建议</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关注我们</h4>
              <p className="text-sm text-muted-foreground">
                © 2025 语言学习平台. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
