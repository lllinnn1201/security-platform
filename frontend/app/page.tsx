// ===== Dashboard 首頁 =====
// 顯示總覽統計卡片、最近掃描紀錄、風險等級分佈

import {
  dashboardStats,   // 統計卡片資料
  recentScans,      // 最近掃描紀錄
  riskDistribution, // 風險等級分佈
} from '@/data/mockData';
import {
  ScanSearch,   // 掃描圖示
  ShieldCheck,  // 漏洞圖示
  Activity,     // 評分圖示
  Package,      // SBOM 圖示
  TrendingUp,   // 上升趨勢圖示
  TrendingDown, // 下降趨勢圖示
} from 'lucide-react';

// 統計卡片圖示映射表
const statIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  scan: ScanSearch,
  shield: ShieldCheck,
  activity: Activity,
  package: Package,
};

// Dashboard 頁面元件
export default function DashboardPage() {
  // 計算環形圖所需的 conic-gradient 參數
  const total = riskDistribution.reduce((sum, item) => sum + item.count, 0);
  let accumulated = 0; // 累計角度百分比
  const gradientStops = riskDistribution.map((item) => {
    const start = accumulated;              // 起始百分比
    accumulated += (item.count / total) * 100; // 累加
    return `${item.color} ${start}% ${accumulated}%`; // 色段
  });

  return (
    <div className="animate-fade-in">
      {/* 頁面標題 */}
      <div className="page-header">
        <h2>儀表板總覽</h2>
        <p>掌握源碼安全分析的即時狀態與趨勢</p>
      </div>

      {/* 統計卡片區 */}
      <div className="stats-grid">
        {dashboardStats.map((stat) => {
          // 取得對應的 Lucide 圖示元件
          const IconComponent = statIconMap[stat.icon];
          return (
            <div key={stat.label} className="glass-card stat-card">
              {/* 圖示 */}
              <div className="stat-icon">
                {IconComponent && <IconComponent size={22} />}
              </div>
              {/* 數值 */}
              <div className="stat-value">{stat.value}</div>
              {/* 標籤 */}
              <div className="stat-label">{stat.label}</div>
              {/* 趨勢 */}
              <div className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                {/* 趨勢方向圖示 */}
                {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{stat.trend} 較上月</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 下方雙欄：最近掃描 + 風險分佈 */}
      <div className="grid-2">
        {/* 最近掃描紀錄 */}
        <div className="glass-card">
          <div className="section-title">最近掃描紀錄</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>專案</th>
                <th>狀態</th>
                <th>風險</th>
                <th>漏洞</th>
                <th>時間</th>
              </tr>
            </thead>
            <tbody>
              {/* 遍歷掃描紀錄 */}
              {recentScans.map((scan) => (
                <tr key={scan.id}>
                  {/* 專案名稱 + 分支 */}
                  <td>
                    <div style={{ fontWeight: 500 }}>{scan.project}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{scan.branch}</div>
                  </td>
                  {/* 狀態指示燈 */}
                  <td>
                    <span className={`status-dot ${scan.status}`}>{scan.status}</span>
                  </td>
                  {/* 風險等級標籤 */}
                  <td>
                    <span className={`risk-badge ${scan.riskLevel}`}>{scan.riskLevel}</span>
                  </td>
                  {/* 漏洞數量 */}
                  <td>{scan.vulnerabilities}</td>
                  {/* 掃描時間 */}
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{scan.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 風險等級分佈 */}
        <div className="glass-card">
          <div className="section-title">風險等級分佈</div>
          <div className="pie-chart-container">
            {/* CSS 環形圖 */}
            <div
              className="pie-chart"
              style={{
                background: `conic-gradient(${gradientStops.join(', ')})`,
              }}
            />
            {/* 圖例 */}
            <div className="pie-legend">
              {riskDistribution.map((item) => (
                <div key={item.level} className="pie-legend-item">
                  {/* 色塊 */}
                  <span className="pie-legend-color" style={{ background: item.color }} />
                  {/* 等級 + 數量 */}
                  <span>{item.level.toUpperCase()}: {item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
