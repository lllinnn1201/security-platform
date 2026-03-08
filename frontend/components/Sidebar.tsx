'use client'; // 客戶端元件（需要 usePathname）

// ===== 側邊欄導覽元件 =====
import Link from 'next/link';       // Next.js 路由連結
import { usePathname } from 'next/navigation'; // 取得當前路徑
import { navItems } from '@/data/mockData';     // 導覽項目資料
import {
    LayoutDashboard, // 儀表板圖示
    Upload,          // 上傳圖示
    FileSearch,      // 靜態分析圖示（區別 SonarQube 的 ShieldCheck）
    Cpu,             // 動態分析圖示（處理器 = 動態執行分析）
    BarChart3,       // 效能檢測圖示（區別 Lighthouse 的 Gauge）
    PlayCircle,      // Pipeline 圖示
    Shield,          // Logo 圖示
} from 'lucide-react';

// 圖示名稱對應 Lucide 元件的映射表
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    'layout-dashboard': LayoutDashboard,
    'upload': Upload,
    'file-search': FileSearch,
    'cpu': Cpu,
    'bar-chart-3': BarChart3,
    'play-circle': PlayCircle,
};

// 側邊欄元件 props 型別
interface SidebarProps {
    isOpen: boolean;   // 手機版是否開啟
    onClose: () => void; // 關閉回呼
}

// 側邊欄元件
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    // 取得當前路由路徑
    const pathname = usePathname();

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            {/* Logo 區域 */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    {/* 盾牌圖示 */}
                    <Shield size={18} />
                </div>
                <h1>Security Platform</h1>
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
                                    onClick={onClose}
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
