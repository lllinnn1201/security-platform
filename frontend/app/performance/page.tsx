'use client'; // 客戶端元件（需要 Tab 狀態管理）

// ===== 效能檢測頁面 =====
// 整合 K6（負載測試）+ Lighthouse（效能審計）雙分頁

import { useState } from 'react'; // React 狀態鉤子

import {
    k6Metrics,         // K6 負載測試指標
    k6Endpoints,       // K6 端點回應時間
    lighthouseScores,  // Lighthouse 4 大分數
    lighthouseAudits,  // Lighthouse 建議清單
} from '@/data/mockData';

// 效能檢測頁面元件
export default function PerformancePage() {
    // 目前啟用的 tab（k6 或 lighthouse）
    const [activeTab, setActiveTab] = useState<'k6' | 'lighthouse'>('k6');

    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>效能檢測</h2>
                <p>使用 K6 與 Lighthouse 把關網站效能與使用者體驗</p>
            </div>

            {/* Tab 切換列 */}
            <div className="tab-bar">
                {/* K6 分頁按鈕 */}
                <button
                    className={`tab-btn ${activeTab === 'k6' ? 'active' : ''}`}
                    onClick={() => setActiveTab('k6')}
                >
                    K6 負載測試
                </button>
                {/* Lighthouse 分頁按鈕 */}
                <button
                    className={`tab-btn ${activeTab === 'lighthouse' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lighthouse')}
                >
                    Lighthouse 審計
                </button>
            </div>

            {/* K6 分頁內容 */}
            {activeTab === 'k6' && (
                <div className="animate-fade-in">
                    {/* K6 指標卡片 */}
                    <div className="metrics-grid">
                        {/* 遍歷每個指標 */}
                        {k6Metrics.map((metric) => (
                            <div key={metric.label} className="metric-card">
                                {/* 數值 + 單位 */}
                                <div className={`metric-value ${metric.status}`}>
                                    {metric.value}
                                    <span className="metric-unit"> {metric.unit}</span>
                                </div>
                                {/* 指標名稱 */}
                                <div className="metric-label">{metric.label}</div>
                                {/* 門檻值 */}
                                <div className="metric-threshold">門檻：{metric.threshold}</div>
                            </div>
                        ))}
                    </div>

                    {/* 各端點回應時間 */}
                    <div className="glass-card">
                        <div className="section-title">各端點回應時間</div>
                        {/* 表格包裝容器 */}
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>方法</th>
                                        <th>端點</th>
                                        <th>平均 (ms)</th>
                                        <th>P95 (ms)</th>
                                        <th>RPS</th>
                                        <th>錯誤率</th>
                                        <th>狀態</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 遍歷每個端點 */}
                                    {k6Endpoints.map((ep) => (
                                        <tr key={ep.path}>
                                            {/* HTTP 方法 */}
                                            <td>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: ep.method === 'GET' ? 'var(--risk-info-bg)' : 'var(--risk-medium-bg)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: ep.method === 'GET' ? 'var(--accent-blue)' : 'var(--risk-medium)',
                                                }}>
                                                    {ep.method}
                                                </span>
                                            </td>
                                            {/* 端點路徑 */}
                                            <td><span className="code-text">{ep.path}</span></td>
                                            {/* 平均回應時間 */}
                                            <td style={{ fontWeight: 600 }}>{ep.avg}</td>
                                            {/* P95 回應時間 */}
                                            <td style={{ fontWeight: 600, color: ep.p95 > 300 ? 'var(--risk-high)' : 'var(--text-primary)' }}>{ep.p95}</td>
                                            {/* 每秒請求數 */}
                                            <td>{ep.rps}</td>
                                            {/* 錯誤率 */}
                                            <td style={{ color: ep.errorRate !== '0%' ? 'var(--risk-medium)' : 'var(--status-success)' }}>{ep.errorRate}</td>
                                            {/* 狀態標籤 */}
                                            <td><span className={`tool-status ${ep.status === 'good' ? 'passed' : ep.status === 'warning' ? 'running' : 'failed'}`}>{ep.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Lighthouse 分頁內容 */}
            {activeTab === 'lighthouse' && (
                <div className="animate-fade-in">
                    {/* 4 大分數圓形 */}
                    <div className="glass-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <div className="section-title">Lighthouse 效能分數</div>
                        <div className="scores-grid">
                            {/* 遍歷每個分數分類 */}
                            {lighthouseScores.map((score) => (
                                <div key={score.category} className="score-circle-wrapper">
                                    {/* 圓形分數 */}
                                    <div
                                        className="score-circle"
                                        style={{
                                            color: score.color,
                                            border: `4px solid ${score.color}`,
                                            background: `${score.color}10`,
                                        }}
                                    >
                                        {score.score}
                                    </div>
                                    {/* 類別標籤 */}
                                    <div className="score-label">{score.category}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 改善建議清單 */}
                    <div className="glass-card">
                        <div className="section-title">改善建議</div>
                        {/* 表格包裝容器 */}
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>項目</th>
                                        <th>分類</th>
                                        <th>影響</th>
                                        <th>說明</th>
                                        <th>預估效益</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 遍歷每條建議 */}
                                    {lighthouseAudits.map((audit) => (
                                        <tr key={audit.id}>
                                            {/* 項目名稱 */}
                                            <td style={{ fontWeight: 600 }}>{audit.title}</td>
                                            {/* 分類標籤 */}
                                            <td>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: 'var(--accent-primary-light)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: 'var(--accent-primary)',
                                                }}>
                                                    {audit.category}
                                                </span>
                                            </td>
                                            {/* 影響等級 */}
                                            <td><span className={`impact-badge ${audit.impact}`}>{audit.impact}</span></td>
                                            {/* 說明 */}
                                            <td style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px' }}>{audit.description}</td>
                                            {/* 預估效益 */}
                                            <td style={{ fontSize: '13px', fontWeight: 600, color: audit.savings !== '—' ? 'var(--status-success)' : 'var(--text-muted)' }}>{audit.savings}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
