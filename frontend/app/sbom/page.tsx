'use client'; // 客戶端元件（需要狀態管理）

// ===== SBOM 檢視器頁面 =====
// 顯示依賴套件清單與漏洞比對狀態

import { useState } from 'react';               // React 狀態鉤子
import { sbomPackages } from '@/data/mockData'; // 匯入 mock 資料
import { Search } from 'lucide-react';          // 搜尋圖示

// SBOM 檢視器頁面元件
export default function SBOMPage() {
    // 搜尋關鍵字
    const [search, setSearch] = useState('');
    // 篩選風險等級
    const [filterRisk, setFilterRisk] = useState('all');

    // 根據搜尋與篩選條件過濾套件列表
    const filtered = sbomPackages.filter((pkg) => {
        // 名稱搜尋比對
        const matchSearch = pkg.name.toLowerCase().includes(search.toLowerCase());
        // 風險等級篩選
        const matchRisk = filterRisk === 'all' || pkg.riskLevel === filterRisk;
        return matchSearch && matchRisk;
    });

    // 計算統計數據
    const totalPkgs = sbomPackages.length;                                          // 總套件數
    const vulnPkgs = sbomPackages.filter((p) => p.vulnerabilities > 0).length;     // 有漏洞套件數
    const totalVulns = sbomPackages.reduce((sum, p) => sum + p.vulnerabilities, 0); // 總漏洞數

    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>SBOM 檢視器</h2>
                <p>Software Bill of Materials — 瀏覽專案的依賴套件與已知漏洞</p>
            </div>

            {/* 統計摘要 */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--spacing-md)' }}>
                {/* 總套件數 */}
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--accent-primary)' }}>{totalPkgs}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>依賴套件總數</div>
                </div>
                {/* 有漏洞的套件 */}
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--risk-high)' }}>{vulnPkgs}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>含漏洞套件</div>
                </div>
                {/* 總漏洞數 */}
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--risk-critical)' }}>{totalVulns}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>已知漏洞總數</div>
                </div>
            </div>

            {/* 搜尋與篩選列 */}
            <div className="glass-card">
                <div className="filter-bar">
                    {/* 搜尋輸入框 */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input-field filter-input"
                            style={{ paddingLeft: '34px' }}
                            placeholder="搜尋套件名稱..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* 風險等級篩選按鈕 */}
                    <div className="option-group">
                        {['all', 'critical', 'high', 'medium', 'low', 'info'].map((level) => (
                            <button
                                key={level}
                                className={`option-btn ${filterRisk === level ? 'selected' : ''}`}
                                onClick={() => setFilterRisk(level)}
                            >
                                {level === 'all' ? '全部' : level.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 套件清單表格 */}
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>套件名稱</th>
                            <th>版本</th>
                            <th>授權</th>
                            <th>生態系</th>
                            <th>漏洞數</th>
                            <th>風險等級</th>
                            <th>CVE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 遍歷篩選後的套件 */}
                        {filtered.map((pkg) => (
                            <tr key={pkg.name}>
                                {/* 套件名稱 */}
                                <td style={{ fontWeight: 600 }}>{pkg.name}</td>
                                {/* 版本號 */}
                                <td>
                                    <span className="code-text">{pkg.version}</span>
                                </td>
                                {/* 授權類型 */}
                                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{pkg.license}</td>
                                {/* 生態系標籤 */}
                                <td>
                                    <span style={{
                                        padding: '2px 8px',
                                        background: 'var(--accent-primary-light)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '11px',
                                        color: 'var(--accent-primary)',
                                        fontWeight: 600,
                                    }}>
                                        {pkg.ecosystem}
                                    </span>
                                </td>
                                {/* 漏洞數量 */}
                                <td>
                                    <span style={{
                                        fontWeight: 600,
                                        color: pkg.vulnerabilities > 0 ? 'var(--risk-high)' : 'var(--status-success)',
                                    }}>
                                        {pkg.vulnerabilities}
                                    </span>
                                </td>
                                {/* 風險等級標籤 */}
                                <td>
                                    <span className={`risk-badge ${pkg.riskLevel}`}>{pkg.riskLevel}</span>
                                </td>
                                {/* CVE 編號 */}
                                <td>
                                    {pkg.cve ? (
                                        <span className="code-text" style={{ color: 'var(--risk-critical)' }}>{pkg.cve}</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 顯示筆數 */}
                <div style={{
                    marginTop: 'var(--spacing-md)',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    textAlign: 'right',
                }}>
                    顯示 {filtered.length} / {sbomPackages.length} 筆套件
                </div>
            </div>
        </div>
    );
}
