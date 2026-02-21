'use client'; // 客戶端元件（需要 usePathname）

// ===== 頂部列元件 =====
import { usePathname } from 'next/navigation'; // 取得當前路徑
import { navItems } from '@/data/mockData';     // 導覽項目資料（取標題用）
import { Search, Menu } from 'lucide-react';    // 搜尋與漢堡圖示

// 頂部列 props 型別
interface TopbarProps {
    onMenuToggle: () => void; // 漢堡按鈕點擊回呼
}

// 頂部列元件
export default function Topbar({ onMenuToggle }: TopbarProps) {
    // 取得當前路由路徑
    const pathname = usePathname();

    // 根據當前路徑找到對應的頁面標題
    const currentPage = navItems.find((item) => item.href === pathname);
    // 若找不到則預設為「儀表板」
    const pageTitle = currentPage ? currentPage.label : '儀表板';

    return (
        <header className="topbar">
            {/* 左側：漢堡按鈕 + 頁面標題 */}
            <div className="topbar-left">
                {/* 漢堡按鈕（手機版才顯示，由 CSS 控制） */}
                <button className="hamburger-btn" onClick={onMenuToggle}>
                    <Menu size={20} />
                </button>
                {/* 頁面標題 */}
                <span className="topbar-title">{pageTitle}</span>
            </div>

            {/* 搜尋框 */}
            <div className="topbar-search">
                <Search size={15} className="search-icon" />
                <input type="text" placeholder="搜尋專案、漏洞、套件..." />
            </div>
        </header>
    );
}
