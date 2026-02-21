// ===== Code Flow 視覺化頁面 =====
// 顯示函式呼叫樹狀圖與污染路徑追蹤

import { codeFlowTree, taintPaths } from '@/data/mockData'; // 匯入 mock 資料
import type { FlowNode } from '@/data/mockData';             // 匯入型別

// 節點類型標籤對照表
const typeLabels: Record<string, string> = {
    entry: 'Entry',
    process: 'Process',
    taint: 'Taint',
    sink: 'Sink',
};

// 遞迴渲染單一節點與其子節點的函式
function FlowNodeComponent({ node }: { node: FlowNode }) {
    return (
        <div className="flow-node">
            {/* 節點內容 */}
            <div className={`flow-node-content ${node.type}`}>
                {/* 節點類型色點 */}
                <span className={`flow-type-dot ${node.type}`} />
                {/* 函式名稱 */}
                <span>{node.name}</span>
                {/* 所在檔案 */}
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{node.file}</span>
            </div>

            {/* 子節點（遞迴渲染） */}
            {node.children && node.children.length > 0 && (
                <div className="flow-children">
                    {node.children.map((child) => (
                        <FlowNodeComponent key={child.id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
}

// Code Flow 頁面元件
export default function CodeFlowPage() {
    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>Code Flow 視覺化</h2>
                <p>追蹤程式碼的函式呼叫路徑與資料流向</p>
            </div>

            {/* 圖例說明 */}
            <div className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div className="section-title">節點類型圖例</div>
                <div style={{ display: 'flex', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                    {/* 遍歷渲染每個節點類型說明 */}
                    {[
                        { type: 'entry', label: 'Entry（進入點）', desc: '函式呼叫的起始位置' },
                        { type: 'process', label: 'Process（處理）', desc: '中間處理邏輯' },
                        { type: 'taint', label: 'Taint（污染）', desc: '可能存在安全風險的節點' },
                        { type: 'sink', label: 'Sink（終點）', desc: '危險操作的最終執行點' },
                    ].map((item) => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            {/* 色點 */}
                            <span className={`flow-type-dot ${item.type}`} style={{ width: '10px', height: '10px' }} />
                            <div>
                                {/* 類型標籤 */}
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                                {/* 類型說明 */}
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid-2">
                {/* 左側：函式呼叫樹 */}
                <div className="glass-card">
                    <div className="section-title">函式呼叫樹</div>
                    <div className="flow-tree">
                        {/* 從根節點開始渲染 */}
                        <FlowNodeComponent node={codeFlowTree} />
                    </div>
                </div>

                {/* 右側：污染路徑追蹤 */}
                <div className="glass-card">
                    <div className="section-title">污染路徑追蹤</div>
                    {/* 遍歷每條污染路徑 */}
                    {taintPaths.map((path) => (
                        <div key={path.id} className="taint-path-card" style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-md)',
                            borderLeft: `3px solid var(--risk-${path.severity})`,
                        }}>
                            {/* 路徑標頭 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                                <span className="code-text">{path.id}</span>
                                <span className={`risk-badge ${path.severity}`}>{path.severity}</span>
                            </div>
                            {/* 來源與終點 */}
                            <div style={{ fontSize: '13px', marginBottom: 'var(--spacing-sm)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>來源：</span>
                                <span className="code-text">{path.source}</span>
                                <span style={{ margin: '0 var(--spacing-sm)', color: 'var(--text-muted)' }}>→</span>
                                <span style={{ color: 'var(--text-secondary)' }}>終點：</span>
                                <span className="code-text">{path.sink}</span>
                            </div>
                            {/* 路徑步驟 */}
                            <div className="taint-path-steps">
                                {path.steps.map((step, i) => (
                                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                        {/* 非第一步驟前加箭頭 */}
                                        {i > 0 && <span className="taint-arrow">→</span>}
                                        <span className="taint-step">{step}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
