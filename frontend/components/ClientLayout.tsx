'use client'; // 客戶端元件（需要狀態管理）

// ===== 客戶端佈局包裝元件 =====
// 管理手機版側邊欄的開關狀態

import { useState } from 'react'; // React 狀態鉤子
import Sidebar from '@/components/Sidebar'; // 側邊欄元件
import Topbar from '@/components/Topbar';   // 頂部列元件

// 客戶端佈局元件：包裝 Sidebar + Topbar + 頁面內容
export default function ClientLayout({
    children, // 子頁面內容
}: {
    children: React.ReactNode;
}) {
    // 手機版側邊欄是否開啟
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            {/* 側邊欄 overlay 遮罩（手機版點擊關閉用） */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 側邊導覽欄 */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* 主要內容區（含頂部列） */}
            <main className="main-content">
                {/* 頂部列（含漢堡按鈕） */}
                <Topbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

                {/* 頁面內容 */}
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
