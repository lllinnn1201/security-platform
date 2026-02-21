'use client'; // 客戶端元件（需要 usePathname）

// ===== 頂部列元件 =====
import { usePathname } from 'next/navigation'; // 取得當前路徑
import { navItems } from '@/data/mockData';     // 導覽項目資料（取標題用）
import { Search } from 'lucide-react';          // 搜尋圖示

// 頂部列元件
export default function Topbar() {
    // 取得當前路由路徑
    const pathname = usePathname();

    // 根據當前路徑找到對應的頁面標題
    const currentPage = navItems.find((item) => item.href === pathname);
    // 若找不到則預設為「儀表板」
    const pageTitle = currentPage ? currentPage.label : '儀表板';

    return (
        <header className="topbar">
            {/* 頁面標題 */}
            <span className="topbar-title">{pageTitle}</span>

            {/* 搜尋框 */}
            <div className="topbar-search">
                <Search size={15} className="search-icon" />
                <input type="text" placeholder="搜尋專案、漏洞、套件..." />
            </div>
        </header>
    );
}
