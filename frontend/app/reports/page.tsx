// ===== 分析報告頁面 =====
// 顯示漏洞清單與 Code Smell 列表

import { vulnerabilities, codeSmells } from '@/data/mockData'; // 匯入 mock 資料

// 分析報告頁面元件
export default function ReportsPage() {
    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>分析報告</h2>
                <p>檢視最近一次掃描的安全漏洞與程式碼品質問題</p>
            </div>

            {/* 報告摘要統計 */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
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
                                <td>
                                    <span className="code-text">{vuln.id}</span>
                                </td>
                                {/* 漏洞名稱 */}
                                <td style={{ fontWeight: 600 }}>{vuln.title}</td>
                                {/* 嚴重程度標籤 */}
                                <td>
                                    <span className={`risk-badge ${vuln.severity}`}>{vuln.severity}</span>
                                </td>
                                {/* 檔案 + 行號 */}
                                <td>
                                    <span className="code-text">{vuln.file}:{vuln.line}</span>
                                </td>
                                {/* CWE 編號 */}
                                <td>
                                    <span style={{ color: 'var(--accent-purple)', fontSize: '13px' }}>{vuln.cwe}</span>
                                </td>
                                {/* 漏洞描述 */}
                                <td style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                                    {vuln.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Code Smell 清單 */}
            <div className="glass-card">
                <div className="section-title">Code Smell</div>
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
                                <td>
                                    <span className="code-text">{smell.id}</span>
                                </td>
                                {/* 問題名稱 */}
                                <td style={{ fontWeight: 500 }}>{smell.title}</td>
                                {/* 類型標籤 */}
                                <td>
                                    <span className="risk-badge info">{smell.type}</span>
                                </td>
                                {/* 檔案 + 行號 */}
                                <td>
                                    <span className="code-text">{smell.file}:{smell.line}</span>
                                </td>
                                {/* 修復時間 */}
                                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{smell.effort}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
