// ===== Dashboard 首頁 =====
// 顯示 6 個 DevSecOps 工具的即時狀態、最近掃描紀錄、風險等級分佈

import {
  toolStatusCards,  // 工具狀態卡片資料
  recentScans,      // 最近掃描紀錄
  riskDistribution, // 風險等級分佈
} from '@/data/mockData';
import {
  CheckCircle2, // 通過圖示
  XCircle,      // 失敗圖示
  Loader2,      // 執行中圖示
  Clock,        // 等待中圖示
} from 'lucide-react';



// 狀態名稱對應 Lucide 圖示的映射表
const statusIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  'passed': CheckCircle2,
  'failed': XCircle,
  'running': Loader2,
  'pending': Clock,
};

// 狀態名稱對應中文標籤
const statusLabelMap: Record<string, string> = {
  'passed': '通過',
  'failed': '未通過',
  'running': '執行中',
  'pending': '等待中',
};

// 掃描狀態對應中文標籤
const scanStatusLabelMap: Record<string, string> = {
  'success': '成功',
  'failure': '失敗',
  'running': '執行中',
  'pending': '等待中',
  'cancelled': '已取消',
};

// 風險等級對應中文標籤
const riskLabelMap: Record<string, string> = {
  'critical': '嚴重',
  'high': '高',
  'medium': '中',
  'low': '低',
  'info': '資訊',
};

// Dashboard 頁面元件
export default function DashboardPage() {
  // 計算環形圖所需的 conic-gradient 參數
  const total = riskDistribution.reduce((sum, item) => sum + item.count, 0);
  let accumulated = 0; // 累計角度百分比
  const gradientStops = riskDistribution.map((item) => {
    const start = accumulated;                  // 起始百分比
    accumulated += (item.count / total) * 100;  // 累加
    return `${item.color} ${start}% ${accumulated}%`; // 色段
  });

  return (
    <div className="animate-fade-in">
      {/* 頁面標題 */}
      <div className="page-header">
        <h2>儀表板總覽</h2>
        <p>掌握所有 DevSecOps 工具的即時狀態與分析結果</p>
      </div>

      {/* 6 個工具狀態卡片 */}
      <div className="tools-grid">
        {toolStatusCards.map((card) => {
          // 取得對應的狀態圖示元件
          const StatusIcon = statusIconMap[card.status];
          return (
            <div key={card.tool} className="glass-card tool-card">
              {/* 卡片標頭：名稱 + 狀態 */}
              <div className="tool-card-header">
                {/* 左側：工具名稱 */}
                <div className="tool-card-name">
                  {card.tool}
                </div>
                {/* 右側：分類標籤 */}
                <span className="tool-card-category">{card.category}</span>
              </div>
              {/* 摘要文字 */}
              <div className="tool-card-summary">{card.summary}</div>
              {/* 底部：狀態 + 時間 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* 狀態標籤 */}
                <span className={`tool-status ${card.status}`}>
                  {StatusIcon && <StatusIcon size={12} />}
                  {statusLabelMap[card.status]}
                </span>
                {/* 最後執行時間 */}
                <span className="tool-card-time">{card.lastRun}</span>
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
          {/* 表格包裝容器（手機可水平捲動） */}
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>專案</th>
                  <th>狀態</th>
                  <th>風險</th>
                  <th>漏洞</th>
                  <th className="mobile-hide">時間</th>
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
                      <span className={`status-dot ${scan.status}`}>{scanStatusLabelMap[scan.status] || scan.status}</span>
                    </td>
                    {/* 風險等級標籤 */}
                    <td>
                      <span className={`risk-badge ${scan.riskLevel}`}>{riskLabelMap[scan.riskLevel] || scan.riskLevel}</span>
                    </td>
                    {/* 漏洞數量 */}
                    <td>{scan.vulnerabilities}</td>
                    {/* 掃描時間 */}
                    <td className="mobile-hide" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {scan.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                  <span>{riskLabelMap[item.level] || item.level}: {item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
