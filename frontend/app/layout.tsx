// ===== 根佈局 =====
import type { Metadata } from 'next'; // Next.js 元資料型別
import './globals.css';               // 全域樣式
import Sidebar from '@/components/Sidebar'; // 側邊欄元件
import Topbar from '@/components/Topbar';   // 頂部列元件

// SEO 元資料設定
export const metadata: Metadata = {
  title: 'SecureFlow — 源碼安全分析平台',          // 網頁標題
  description: '整合 SAST、SBOM、漏洞掃描的 DevSecOps 源碼安全分析儀表板', // 描述
};

// 根佈局元件：所有頁面共用的外殼
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // 子頁面內容
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        {/* 應用程式佈局容器 */}
        <div className="app-layout">
          {/* 側邊導覽欄 */}
          <Sidebar />

          {/* 主要內容區（含頂部列） */}
          <main className="main-content">
            {/* 頂部列 */}
            <Topbar />

            {/* 頁面內容 */}
            <div className="page-content">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
