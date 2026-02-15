'use client'; // 客戶端元件（需要 usePathname）

// ===== 側邊欄導覽元件 =====
import Link from 'next/link';       // Next.js 路由連結
import { usePathname } from 'next/navigation'; // 取得當前路徑
import { navItems } from '@/data/mockData';     // 導覽項目資料

// 側邊欄元件
export default function Sidebar() {
    // 取得當前路由路徑
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            {/* Logo 區域 */}
            <div className="sidebar-logo">
                <div className="logo-icon">🛡️</div>
                <h1>SecureFlow</h1>
            </div>

            {/* 導覽選單 */}
            <nav className="sidebar-nav">
                <ul>
                    {/* 遍歷每個導覽項目 */}
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                            >
                                {/* 圖示 */}
                                <span className="nav-icon">{item.icon}</span>
                                {/* 文字標籤 */}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
