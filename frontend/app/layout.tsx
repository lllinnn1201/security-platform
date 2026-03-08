// ===== 根佈局 =====
import type { Metadata } from 'next'; // Next.js 元資料型別
import './globals.css';               // 全域樣式
import ClientLayout from '@/components/ClientLayout'; // 客戶端佈局元件

// SEO 元資料設定
export const metadata: Metadata = {
  title: 'Security Platform — 源碼安全分析平台',          // 網頁標題
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
        {/* 客戶端佈局（包含 Sidebar + Topbar + 頁面內容） */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
