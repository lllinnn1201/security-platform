'use client'; // 客戶端元件（需要 Tab 狀態管理）

// ===== 靜態分析頁面 =====
// 整合 SonarQube + OSV-Scanner 雙分頁

import { useState } from 'react'; // React 狀態鉤子
import {
    Search,       // 搜尋圖示
} from 'lucide-react';
import {
    vulnerabilities, // SonarQube 漏洞清單
    codeSmells,      // SonarQube Code Smell
    sbomPackages,    // OSV-Scanner SBOM 套件
} from '@/data/mockData';

// 靜態分析頁面元件
export default function StaticAnalysisPage() {
    // 目前啟用的 tab（sonarqube 或 osv-scanner）
    const [activeTab, setActiveTab] = useState<'sonarqube' | 'osv-scanner'>('sonarqube');
    // SBOM 搜尋關鍵字
    const [search, setSearch] = useState('');
    // SBOM 風險等級篩選
    const [filterRisk, setFilterRisk] = useState('all');

    // 根據搜尋與篩選條件過濾 SBOM 套件
    const filtered = sbomPackages.filter((pkg) => {
        // 名稱搜尋比對
        const matchSearch = pkg.name.toLowerCase().includes(search.toLowerCase());
        // 風險等級篩選
        const matchRisk = filterRisk === 'all' || pkg.riskLevel === filterRisk;
        return matchSearch && matchRisk;
    });

    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>靜態分析</h2>
                <p>透過 SonarQube 與 OSV-Scanner 進行靜態安全防禦</p>
            </div>

            {/* Tab 切換列 */}
            <div className="tab-bar">
                {/* SonarQube 分頁按鈕 */}
                <button
                    className={`tab-btn ${activeTab === 'sonarqube' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sonarqube')}
                >
                    SonarQube
                </button>
                {/* OSV-Scanner 分頁按鈕 */}
                <button
                    className={`tab-btn ${activeTab === 'osv-scanner' ? 'active' : ''}`}
                    onClick={() => setActiveTab('osv-scanner')}
                >
                    OSV-Scanner
                </button>
            </div>

            {/* SonarQube 分頁內容 */}
            {activeTab === 'sonarqube' && (
                <div className="animate-fade-in">
                    {/* 報告摘要統計 */}
                    <div className="stats-grid-5">
                        {/* 各風險等級統計卡片 */}
                        {[
                            { label: 'Critical', count: vulnerabilities.filter((v) => v.severity === 'critical').length, cls: 'critical' },
                            { label: 'High', count: vulnerabilities.filter((v) => v.severity === 'high').length, cls: 'high' },
                            { label: 'Medium', count: vulnerabilities.filter((v) => v.severity === 'medium').length, cls: 'medium' },
                            { label: 'Low', count: vulnerabilities.filter((v) => v.severity === 'low').length, cls: 'low' },
                            { label: 'Code Smells', count: codeSmells.length, cls: 'info' },
                        ].map((item) => (
                            <div key={item.label} className="glass-card" style={{ textAlign: 'center' }}>
                                {/* 數量 */}
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: `var(--risk-${item.cls})`,
                                    marginBottom: 'var(--spacing-xs)',
                                }}>
                                    {item.count}
                                </div>
                                {/* 標籤 */}
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 安全漏洞清單 */}
                    <div className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div className="section-title">安全漏洞清單</div>
                        {/* 表格包裝容器 */}
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>編號</th>
                                        <th>漏洞名稱</th>
                                        <th>嚴重程度</th>
                                        <th>檔案位置</th>
                                        <th>CWE</th>
                                        <th>描述</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 遍歷每筆漏洞 */}
                                    {vulnerabilities.map((vuln) => (
                                        <tr key={vuln.id}>
                                            {/* 漏洞編號 */}
                                            <td><span className="code-text">{vuln.id}</span></td>
                                            {/* 漏洞名稱 */}
                                            <td style={{ fontWeight: 600 }}>{vuln.title}</td>
                                            {/* 嚴重程度標籤 */}
                                            <td><span className={`risk-badge ${vuln.severity}`}>{vuln.severity}</span></td>
                                            {/* 檔案 + 行號 */}
                                            <td><span className="code-text">{vuln.file}:{vuln.line}</span></td>
                                            {/* CWE 編號 */}
                                            <td><span style={{ color: 'var(--accent-purple)', fontSize: '13px' }}>{vuln.cwe}</span></td>
                                            {/* 漏洞描述 */}
                                            <td style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px' }}>{vuln.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Code Smell 清單 */}
                    <div className="glass-card">
                        <div className="section-title">Code Smell</div>
                        {/* 表格包裝容器 */}
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>編號</th>
                                        <th>問題名稱</th>
                                        <th>類型</th>
                                        <th>檔案位置</th>
                                        <th>預估修復時間</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 遍歷每筆 Code Smell */}
                                    {codeSmells.map((smell) => (
                                        <tr key={smell.id}>
                                            {/* 編號 */}
                                            <td><span className="code-text">{smell.id}</span></td>
                                            {/* 問題名稱 */}
                                            <td style={{ fontWeight: 500 }}>{smell.title}</td>
                                            {/* 類型標籤 */}
                                            <td><span className="risk-badge info">{smell.type}</span></td>
                                            {/* 檔案 + 行號 */}
                                            <td><span className="code-text">{smell.file}:{smell.line}</span></td>
                                            {/* 修復時間 */}
                                            <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{smell.effort}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* OSV-Scanner 分頁內容 */}
            {activeTab === 'osv-scanner' && (
                <div className="animate-fade-in">
                    {/* 統計摘要 */}
                    <div className="stats-grid-3">
                        {/* 總套件數 */}
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--accent-primary)' }}>{sbomPackages.length}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>依賴套件總數</div>
                        </div>
                        {/* 有漏洞的套件 */}
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--risk-high)' }}>
                                {sbomPackages.filter((p) => p.vulnerabilities > 0).length}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>含漏洞套件</div>
                        </div>
                        {/* 總漏洞數 */}
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--risk-critical)' }}>
                                {sbomPackages.reduce((sum, p) => sum + p.vulnerabilities, 0)}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>已知漏洞總數</div>
                        </div>
                    </div>

                    {/* 搜尋與篩選列 */}
                    <div className="glass-card">
                        <div className="filter-bar">
                            {/* 搜尋輸入框 */}
                            <div style={{ position: 'relative', flex: 1, minWidth: '0' }}>
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
                        <div className="table-wrapper">
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
                                            <td><span className="code-text">{pkg.version}</span></td>
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
                                            <td><span className={`risk-badge ${pkg.riskLevel}`}>{pkg.riskLevel}</span></td>
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
                        </div>

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
            )}
        </div>
    );
}
