'use client'; // 客戶端元件（需要 usePathname）

// ===== 側邊欄導覽元件 =====
import Link from 'next/link';       // Next.js 路由連結
import { usePathname } from 'next/navigation'; // 取得當前路徑
import { navItems } from '@/data/mockData';     // 導覽項目資料
import {
    LayoutDashboard, // 儀表板圖示
    Upload,          // 上傳圖示
    FileText,        // 報告圖示
    GitBranch,       // Code Flow 圖示
    List,            // SBOM 圖示
    PlayCircle,      // Pipeline 圖示
    Shield,          // Logo 圖示
} from 'lucide-react';

// 圖示名稱對應 Lucide 元件的映射表
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    'layout-dashboard': LayoutDashboard,
    'upload': Upload,
    'file-text': FileText,
    'git-branch': GitBranch,
    'list': List,
    'play-circle': PlayCircle,
};

// 側邊欄元件
export default function Sidebar() {
    // 取得當前路由路徑
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            {/* Logo 區域 */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    {/* 盾牌圖示 */}
                    <Shield size={18} />
                </div>
                <h1>SecureFlow</h1>
            </div>

            {/* 導覽選單 */}
            <nav className="sidebar-nav">
                <ul>
                    {/* 遍歷每個導覽項目 */}
                    {navItems.map((item) => {
                        // 取得對應的 Lucide 圖示元件
                        const IconComponent = iconMap[item.icon];
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                                >
                                    {/* SVG 圖示 */}
                                    <span className="nav-icon">
                                        {IconComponent && <IconComponent size={18} />}
                                    </span>
                                    {/* 文字標籤 */}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
