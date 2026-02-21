// ===== Pipeline 狀態頁面 =====
// 顯示 Jenkins Job 列表、階段進度與品質閘門結果

import { pipelineJobs } from '@/data/mockData'; // 匯入 mock 資料
import {
    CheckCircle2,  // 通過圖示
    XCircle,       // 失敗圖示
    Clock,         // 等待圖示
    ChevronRight,  // 箭頭圖示
} from 'lucide-react';

// Pipeline 狀態頁面元件
export default function PipelinePage() {
    return (
        <div className="animate-fade-in">
            {/* 頁面標題 */}
            <div className="page-header">
                <h2>Pipeline 狀態</h2>
                <p>監控 Jenkins CI/CD Pipeline 的即時執行狀態與歷史紀錄</p>
            </div>

            {/* 統計摘要（使用 CSS class 取代 inline grid） */}
            <div className="stats-grid">
                {/* 各狀態統計 */}
                {[
                    { label: '總 Job 數', value: pipelineJobs.length, color: 'var(--accent-primary)' },
                    { label: '成功', value: pipelineJobs.filter((j) => j.status === 'success').length, color: 'var(--status-success)' },
                    { label: '失敗', value: pipelineJobs.filter((j) => j.status === 'failure').length, color: 'var(--status-failure)' },
                    { label: '執行中', value: pipelineJobs.filter((j) => j.status === 'running').length, color: 'var(--status-running)' },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '26px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Pipeline Job 列表 */}
            {pipelineJobs.map((job) => (
                <div key={job.id} className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
                    {/* Job 標頭（使用 CSS class 支援手機堆疊） */}
                    <div className="job-header">
                        {/* 左側：Job 資訊 */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                                {/* 狀態指示燈 */}
                                <span className={`status-dot ${job.status}`}>{job.status}</span>
                                {/* Job 名稱 */}
                                <span style={{ fontWeight: 700, fontSize: '15px' }}>{job.project}</span>
                                {/* Job ID */}
                                <span className="code-text">{job.id}</span>
                            </div>
                            {/* 詳細資訊（使用 CSS class 支援換行） */}
                            <div className="job-details">
                                <span>{job.name}</span>
                                <span>{job.triggeredBy}</span>
                                <span>{job.duration}</span>
                                <span>{job.date}</span>
                            </div>
                        </div>

                        {/* 右側：Quality Gate */}
                        <div className={`quality-gate ${job.qualityGate}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {/* Quality Gate 圖示 */}
                            {job.qualityGate === 'passed' && <><CheckCircle2 size={14} /> Quality Gate 通過</>}
                            {job.qualityGate === 'failed' && <><XCircle size={14} /> Quality Gate 未通過</>}
                            {job.qualityGate === 'pending' && <><Clock size={14} /> 等待中</>}
                        </div>
                    </div>

                    {/* 階段進度 */}
                    <div className="pipeline-stages">
                        {job.stages.map((stage, i) => (
                            <span key={stage.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                {/* 非第一階段前加箭頭 */}
                                {i > 0 && <span className="pipeline-stage-arrow"><ChevronRight size={12} /></span>}
                                {/* 階段卡片 */}
                                <div className="pipeline-stage">
                                    {/* 狀態指示點 */}
                                    <span className={`stage-indicator ${stage.status}`}></span>
                                    {/* 階段名稱 + 時間 */}
                                    <span>{stage.name}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>({stage.duration})</span>
                                </div>
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
