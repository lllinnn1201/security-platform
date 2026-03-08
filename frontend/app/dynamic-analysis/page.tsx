'use client'; // 客戶端元件（需要 Tab 狀態管理）

// ===== 動態分析頁面 =====
// 整合 Strace（系統呼叫追蹤）+ Valgrind（記憶體分析）雙分頁

import { useState } from 'react'; // React 狀態鉤子

import {
    straceRecords,    // Strace 追蹤紀錄
    straceSummary,    // Strace 統計摘要
    valgrindErrors,   // Valgrind 錯誤清單
    valgrindSummary,  // Valgrind 統計摘要
} from '@/data/mockData';

// 系統呼叫分類對應中文標籤
const categoryLabelMap: Record<string, string> = {
    'file': '檔案',
    'network': '網路',
    'process': '程序',
    'memory': '記憶體',
};

// 風險等級對應中文標籤
const riskLabelMap: Record<string, string> = {
    'critical': '嚴重',
    'high': '高',
    'medium': '中',
    'low': '低',
    'info': '資訊',
};

// 動態分析頁面元件
export default function DynamicAnalysisPage() {
    // 目前啟用的 tab（strace 或 valgrind）
    const [activeTab, setActiveTab] = useState<'strace' | 'valgrind'>('strace');

    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>動態分析</h2>
                <p>結合 Strace 與 Valgrind 執行動態行為追蹤與記憶體分析</p>
            </div>

            {/* Tab 切換列 */}
            <div className="tab-bar">
                {/* Strace 分頁按鈕 */}
                <button
                    className={`tab-btn ${activeTab === 'strace' ? 'active' : ''}`}
                    onClick={() => setActiveTab('strace')}
                >
                    Strace
                </button>
                {/* Valgrind 分頁按鈕 */}
                <button
                    className={`tab-btn ${activeTab === 'valgrind' ? 'active' : ''}`}
                    onClick={() => setActiveTab('valgrind')}
                >
                    Valgrind
                </button>
            </div>

            {/* Strace 分頁內容 */}
            {activeTab === 'strace' && (
                <div className="animate-fade-in">
                    {/* 統計摘要 */}
                    <div className="stats-grid">
                        {/* 各分類統計卡片 */}
                        {[
                            { label: '總系統呼叫', value: straceSummary.totalCalls.toLocaleString(), color: 'var(--accent-primary)' },
                            { label: '檔案操作', value: straceSummary.fileCalls.toLocaleString(), color: 'var(--accent-blue)' },
                            { label: '網路操作', value: straceSummary.networkCalls.toLocaleString(), color: 'var(--accent-teal)' },
                            { label: '可疑呼叫', value: straceSummary.suspiciousCalls.toString(), color: 'var(--risk-critical)' },
                        ].map((stat) => (
                            <div key={stat.label} className="glass-card" style={{ textAlign: 'center' }}>
                                {/* 數值 */}
                                <div style={{ fontSize: '26px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                                {/* 標籤 */}
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 系統呼叫追蹤表格 */}
                    <div className="glass-card">
                        <div className="section-title">系統呼叫追蹤紀錄</div>
                        {/* 表格包裝容器 */}
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>PID</th>
                                        <th>系統呼叫</th>
                                        <th>引數</th>
                                        <th>回傳值</th>
                                        <th>時間</th>
                                        <th>分類</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 遍歷每筆追蹤紀錄 */}
                                    {straceRecords.map((record) => (
                                        <tr key={record.id}>
                                            {/* 紀錄 ID */}
                                            <td><span className="code-text">{record.id}</span></td>
                                            {/* 程序 ID */}
                                            <td><span className="code-text">{record.pid}</span></td>
                                            {/* 系統呼叫名稱 */}
                                            <td style={{ fontWeight: 600 }}>{record.syscall}</td>
                                            {/* 引數（等寬字型顯示） */}
                                            <td>
                                                <span className="code-text" style={{ maxWidth: '250px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {record.args}
                                                </span>
                                            </td>
                                            {/* 回傳值 */}
                                            <td><span className="code-text">{record.returnVal}</span></td>
                                            {/* 執行時間 */}
                                            <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{record.duration}</td>
                                            {/* 分類標籤 */}
                                            <td><span className={`category-badge ${record.category}`}>{categoryLabelMap[record.category] || record.category}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Valgrind 分頁內容 */}
            {activeTab === 'valgrind' && (
                <div className="animate-fade-in">
                    {/* 統計摘要 */}
                    <div className="stats-grid">
                        {/* 各記憶體分析統計卡片 */}
                        {[
                            { label: '總錯誤數', value: valgrindSummary.totalErrors.toString(), color: 'var(--risk-critical)' },
                            { label: '確定遺失', value: `${valgrindSummary.definitelyLost.toLocaleString()} bytes`, color: 'var(--risk-high)' },
                            { label: '可能遺失', value: `${valgrindSummary.possiblyLost.toLocaleString()} bytes`, color: 'var(--risk-medium)' },
                            { label: '分配 / 釋放', value: `${valgrindSummary.allocations} / ${valgrindSummary.frees}`, color: 'var(--accent-primary)' },
                        ].map((stat) => (
                            <div key={stat.label} className="glass-card" style={{ textAlign: 'center' }}>
                                {/* 數值 */}
                                <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                                {/* 標籤 */}
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 記憶體錯誤報告 */}
                    <div className="glass-card">
                        <div className="section-title">記憶體錯誤報告</div>
                        {/* 表格包裝容器 */}
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>錯誤類型</th>
                                        <th>嚴重程度</th>
                                        <th>影響大小</th>
                                        <th>位置</th>
                                        <th>檔案</th>
                                        <th>堆疊追蹤</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 遍歷每筆記憶體錯誤 */}
                                    {valgrindErrors.map((error) => (
                                        <tr key={error.id}>
                                            {/* 錯誤 ID */}
                                            <td><span className="code-text">{error.id}</span></td>
                                            {/* 錯誤類型 */}
                                            <td style={{ fontWeight: 600 }}>{error.type}</td>
                                            {/* 嚴重程度標籤 */}
                                            <td><span className={`risk-badge ${error.severity}`}>{riskLabelMap[error.severity] || error.severity}</span></td>
                                            {/* 影響位元組數 */}
                                            <td><span className="code-text">{error.bytes > 0 ? `${error.bytes} bytes` : '—'}</span></td>
                                            {/* 函式位置 */}
                                            <td><span className="code-text">{error.location}</span></td>
                                            {/* 檔案 + 行號 */}
                                            <td><span className="code-text">{error.file}:{error.line}</span></td>
                                            {/* 堆疊追蹤 */}
                                            <td style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '250px' }}>{error.stackTrace}</td>
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
