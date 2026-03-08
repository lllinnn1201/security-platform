'use client'; // 客戶端元件（需要狀態管理）

// ===== 程式碼上傳頁面 =====
// 支援拖拉上傳與 Git Repo URL 輸入，掃描類型對齊 DevSecOps 工具分類

import { useState } from 'react'; // React 狀態鉤子
import {
    FileCode,     // 程式碼檔圖示
    ArrowRight,   // 箭頭圖示
    UploadCloud,  // 上傳雲圖示
    X,            // 關閉圖示
} from 'lucide-react';

// 程式碼上傳頁面元件
export default function UploadPage() {
    // 拖曳狀態
    const [isDragOver, setIsDragOver] = useState(false);
    // 已選檔案列表
    const [files, setFiles] = useState<string[]>([]);
    // Git Repo URL
    const [repoUrl, setRepoUrl] = useState('');
    // 已選分析類型
    const [scanTypes, setScanTypes] = useState<string[]>(['all']);

    // 處理拖曳進入
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();      // 阻止預設行為
        setIsDragOver(true);     // 設定拖曳狀態
    };

    // 處理拖曳離開
    const handleDragLeave = () => {
        setIsDragOver(false);    // 取消拖曳狀態
    };

    // 處理檔案放置
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();      // 阻止預設行為
        setIsDragOver(false);    // 取消拖曳狀態
        // 取得拖入的檔案名稱
        const droppedFiles = Array.from(e.dataTransfer.files).map((f) => f.name);
        setFiles((prev) => [...prev, ...droppedFiles]); // 加入檔案列表
    };

    // 切換分析類型選擇
    const toggleScanType = (type: string) => {
        if (type === 'all') {
            setScanTypes(['all']); // 選「全部」時清除其他
            return;
        }
        setScanTypes((prev) => {
            const filtered = prev.filter((t) => t !== 'all'); // 移除「全部」
            if (filtered.includes(type)) {
                const result = filtered.filter((t) => t !== type); // 取消選擇
                return result.length === 0 ? ['all'] : result;     // 空時預設全部
            }
            return [...filtered, type]; // 新增選擇
        });
    };

    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>程式碼上傳</h2>
                <p>上傳程式碼或輸入 Git Repository URL 以觸發 CI/CD 安全分析</p>
            </div>

            <div className="grid-2">
                {/* 左側：上傳方式 */}
                <div>
                    {/* 拖拉上傳區 */}
                    <div className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div className="section-title">檔案上傳</div>
                        <div
                            className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {/* 上傳圖示 */}
                            <div className="upload-icon">
                                <UploadCloud size={40} />
                            </div>
                            {/* 上傳說明 */}
                            <div className="upload-text">拖拉檔案至此處，或點擊選擇檔案</div>
                            <div className="upload-hint">支援 .zip、.tar.gz 或單一原始碼檔案，最大 100MB</div>
                        </div>

                        {/* 已選檔案列表 */}
                        {files.length > 0 && (
                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <div className="section-title">已選擇的檔案</div>
                                {files.map((file, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px 12px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-sm)',
                                        marginBottom: 'var(--spacing-xs)',
                                        fontSize: '13px',
                                    }}>
                                        {/* 檔案名稱 */}
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FileCode size={14} style={{ color: 'var(--text-muted)' }} />
                                            <span className="code-text">{file}</span>
                                        </span>
                                        {/* 移除按鈕 */}
                                        <button
                                            onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                padding: '2px',
                                                display: 'flex',
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Git Repo URL 輸入 */}
                    <div className="glass-card">
                        <div className="section-title">Git 儲存庫</div>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="https://github.com/username/repository.git"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                        />
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            marginTop: 'var(--spacing-sm)',
                        }}>
                            輸入公開的 Git Repository URL，系統將自動 clone 並觸發 Jenkins Pipeline
                        </p>
                    </div>
                </div>

                {/* 右側：分析設定 */}
                <div>
                    {/* 分析類型選擇（對齊 DevSecOps 工具分類） */}
                    <div className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div className="section-title">分析類型</div>
                        <div className="option-group">
                            {/* 工具分類選項 */}
                            {[
                                { key: 'all', label: '完整 Pipeline', desc: '6 個工具全部執行' },
                                { key: 'static', label: '靜態分析', desc: 'SonarQube + OSV-Scanner' },
                                { key: 'dynamic', label: '動態分析', desc: 'Strace + Valgrind' },
                                { key: 'performance', label: '效能測試', desc: 'K6 + Lighthouse' },
                            ].map((option) => (
                                <button
                                    key={option.key}
                                    className={`option-btn ${scanTypes.includes(option.key) ? 'selected' : ''}`}
                                    onClick={() => toggleScanType(option.key)}
                                    style={{ textAlign: 'left', minWidth: '180px' }}
                                >
                                    <div style={{ fontWeight: 600 }}>{option.label}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{option.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 分析摘要 */}
                    <div className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div className="section-title">掃描摘要</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {/* 上傳來源 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--border-default)',
                            }}>
                                <span>上傳來源</span>
                                <span style={{ color: 'var(--text-primary)' }}>
                                    {files.length > 0 ? `${files.length} 個檔案` : repoUrl ? 'Git Repository' : '未選擇'}
                                </span>
                            </div>
                            {/* 分析類型 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--border-default)',
                            }}>
                                <span>分析類型</span>
                                <span style={{ color: 'var(--text-primary)' }}>
                                    {scanTypes.includes('all') ? '完整 Pipeline（6 工具）' : scanTypes.map((t) => {
                                        // 對應中文名稱
                                        const labels: Record<string, string> = { static: '靜態分析', dynamic: '動態分析', performance: '效能測試' };
                                        return labels[t] || t;
                                    }).join('、')}
                                </span>
                            </div>
                            {/* 執行工具 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--border-default)',
                            }}>
                                <span>執行工具</span>
                                <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                                    {scanTypes.includes('all') ? 'SonarQube, OSV-Scanner, Strace, Valgrind, K6, Lighthouse' :
                                        scanTypes.map((t) => {
                                            // 各分類對應的工具
                                            const toolMap: Record<string, string> = {
                                                static: 'SonarQube, OSV-Scanner',
                                                dynamic: 'Strace, Valgrind',
                                                performance: 'K6, Lighthouse',
                                            };
                                            return toolMap[t] || '';
                                        }).filter(Boolean).join(', ')}
                                </span>
                            </div>
                            {/* 預估時間 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 0',
                            }}>
                                <span>預估時間</span>
                                <span style={{ color: 'var(--text-primary)' }}>
                                    {scanTypes.includes('all') ? '~8 分鐘' : `~${scanTypes.length * 3} 分鐘`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 提交按鈕 */}
                    <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                        <ArrowRight size={16} />
                        觸發 Jenkins Pipeline
                    </button>
                </div>
            </div>
        </div>
    );
}
