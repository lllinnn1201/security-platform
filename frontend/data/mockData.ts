// ===== Security Platform DevSecOps 平台 — 資料層 =====
// 集中管理所有頁面的資料，結構對齊未來 API 格式
// 工具整合：SonarQube / OSV-Scanner / Strace / Valgrind / K6 / Lighthouse

// ---------- 共用型別定義 ----------

// 風險等級列舉
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Pipeline 構建狀態列舉
export type PipelineStatus = 'success' | 'failure' | 'running' | 'pending' | 'cancelled';

// ---------- Dashboard 工具狀態卡片 ----------
export interface ToolStatusCard {
    tool: string;       // 工具名稱
    category: string;   // 分類（靜態分析 / 動態分析 / 效能檢測）
    status: 'passed' | 'failed' | 'running' | 'pending'; // 最新狀態
    summary: string;    // 一行摘要
    lastRun: string;    // 最後執行時間
}

// Dashboard 工具狀態卡片（待接 API）
export const toolStatusCards: ToolStatusCard[] = [];

// ---------- 最近掃描紀錄 ----------
export interface ScanRecord {
    id: string;            // 掃描 ID
    project: string;       // 專案名稱
    branch: string;        // 分支名稱
    status: PipelineStatus; // 狀態
    riskLevel: RiskLevel;  // 風險等級
    vulnerabilities: number; // 漏洞數量
    date: string;          // 掃描日期
}

// 最近掃描紀錄（待接 API）
export const recentScans: ScanRecord[] = [];

// ---------- 風險等級分佈 ----------
export interface RiskDistribution {
    level: RiskLevel;   // 風險等級
    count: number;      // 數量
    color: string;      // 對應顏色
}

// 風險等級分佈（待接 API）
export const riskDistribution: RiskDistribution[] = [];

// ---------- SonarQube 漏洞清單 ----------
export interface Vulnerability {
    id: string;            // 漏洞編號
    title: string;         // 漏洞名稱
    severity: RiskLevel;   // 嚴重程度
    file: string;          // 所在檔案
    line: number;          // 行號
    description: string;   // 描述
    cwe: string;           // CWE 編號
}

// SonarQube 漏洞清單（待接 API）
export const vulnerabilities: Vulnerability[] = [];

// ---------- SonarQube Code Smell ----------
export interface CodeSmell {
    id: string;        // 編號
    title: string;     // 名稱
    type: string;      // 類型
    file: string;      // 所在檔案
    line: number;      // 行號
    effort: string;    // 修復時間估計
}

// Code Smell（待接 API）
export const codeSmells: CodeSmell[] = [];

// ---------- OSV-Scanner SBOM 資料 ----------
export interface SBOMPackage {
    name: string;           // 套件名稱
    version: string;        // 版本
    license: string;        // 授權
    ecosystem: string;      // 生態系
    vulnerabilities: number; // 漏洞數
    riskLevel: RiskLevel;   // 風險等級
    cve: string;            // CVE 編號（空字串代表無）
}

// SBOM 套件清單（待接 API）
export const sbomPackages: SBOMPackage[] = [];

// ---------- Strace 系統呼叫追蹤 ----------
export interface StraceRecord {
    id: string;        // 紀錄 ID
    pid: number;       // 程序 ID
    syscall: string;   // 系統呼叫名稱
    args: string;      // 引數
    returnVal: string; // 回傳值
    duration: string;  // 執行時間
    category: string;  // 分類（file / network / process / memory）
}

// Strace 系統呼叫追蹤（待接 API）
export const straceRecords: StraceRecord[] = [];

// Strace 統計摘要
export interface StraceSummary {
    totalCalls: number;     // 總系統呼叫次數
    fileCalls: number;      // 檔案操作次數
    networkCalls: number;   // 網路操作次數
    processCalls: number;   // 程序操作次數
    memoryCalls: number;    // 記憶體操作次數
    suspiciousCalls: number; // 可疑呼叫次數
}

// Strace 統計（待接 API）
export const straceSummary: StraceSummary = {
    totalCalls: 0,
    fileCalls: 0,
    networkCalls: 0,
    processCalls: 0,
    memoryCalls: 0,
    suspiciousCalls: 0,
};

// ---------- Valgrind 記憶體分析 ----------
export interface ValgrindError {
    id: string;        // 錯誤 ID
    type: string;      // 錯誤類型（memory leak / use-after-free / invalid read / uninitialized）
    severity: RiskLevel; // 嚴重程度
    bytes: number;     // 影響位元組數
    location: string;  // 位置（函式名稱）
    file: string;      // 檔案路徑
    line: number;      // 行號
    stackTrace: string; // 簡化堆疊
}

// Valgrind 記憶體分析（待接 API）
export const valgrindErrors: ValgrindError[] = [];

// Valgrind 統計摘要
export interface ValgrindSummary {
    totalErrors: number;      // 總錯誤數
    definitelyLost: number;   // 確定洩漏（bytes）
    possiblyLost: number;     // 可能洩漏（bytes）
    stillReachable: number;   // 仍可存取（bytes）
    heapUsage: number;        // 堆積使用量（bytes）
    allocations: number;      // 分配次數
    frees: number;            // 釋放次數
}

// Valgrind 統計（待接 API）
export const valgrindSummary: ValgrindSummary = {
    totalErrors: 0,
    definitelyLost: 0,
    possiblyLost: 0,
    stillReachable: 0,
    heapUsage: 0,
    allocations: 0,
    frees: 0,
};

// ---------- K6 負載測試 ----------
export interface K6Metric {
    label: string;     // 指標名稱
    value: string;     // 指標值
    unit: string;      // 單位
    status: 'good' | 'warning' | 'bad'; // 狀態
    threshold: string; // 門檻值
}

// K6 負載測試指標（待接 API）
export const k6Metrics: K6Metric[] = [];

// K6 各端點回應時間
export interface K6Endpoint {
    method: string;    // HTTP 方法
    path: string;      // 端點路徑
    avg: number;       // 平均回應（ms）
    p95: number;       // P95 回應（ms）
    rps: number;       // 每秒請求數
    errorRate: string; // 錯誤率
    status: 'good' | 'warning' | 'bad'; // 狀態
}

// K6 端點明細（待接 API）
export const k6Endpoints: K6Endpoint[] = [];

// ---------- Lighthouse 效能審計 ----------
export interface LighthouseScore {
    category: string;  // 分類名稱
    score: number;     // 分數（0-100）
    color: string;     // 顏色
}

// Lighthouse 4 大分數（待接 API）
export const lighthouseScores: LighthouseScore[] = [];

// Lighthouse 建議清單
export interface LighthouseAudit {
    id: string;        // 審計 ID
    title: string;     // 項目名稱
    category: string;  // 所屬分類
    impact: 'high' | 'medium' | 'low'; // 影響程度
    description: string; // 說明
    savings: string;   // 可節省時間/資源
}

// Lighthouse 建議（待接 API）
export const lighthouseAudits: LighthouseAudit[] = [];

// ---------- Pipeline 資料（整合全部工具階段） ----------
export interface PipelineJob {
    id: string;              // Job ID
    name: string;            // Job 名稱
    project: string;         // 專案名稱
    status: PipelineStatus;  // 狀態
    duration: string;        // 執行時間
    triggeredBy: string;     // 觸發者
    date: string;            // 日期
    stages: PipelineStage[]; // 階段（7 步驟）
    qualityGate: 'passed' | 'failed' | 'pending'; // 品質閘門
    gateConditions: GateCondition[]; // 品質閘門條件
}

export interface PipelineStage {
    name: string;            // 階段名稱
    status: PipelineStatus;  // 狀態
    duration: string;        // 執行時間
    tool: string;            // 對應工具名稱
}

// Quality Gate 條件
export interface GateCondition {
    rule: string;            // 條件規則
    actual: string;          // 實際值
    threshold: string;       // 門檻值
    passed: boolean;         // 是否通過
}

// Pipeline 歷史紀錄（待接 API）
export const pipelineJobs: PipelineJob[] = [];

// ---------- 側邊欄導覽項目 ----------
export interface NavItem {
    label: string;   // 顯示名稱
    href: string;    // 路由路徑
    icon: string;    // 圖示名稱（對應 Lucide 圖示）
}

// 側邊欄導覽（對應頁面架構）
export const navItems: NavItem[] = [
    { label: '儀表板', href: '/', icon: 'layout-dashboard' },
    { label: '程式碼上傳', href: '/upload', icon: 'upload' },
    { label: '靜態分析', href: '/static-analysis', icon: 'file-search' },
    { label: '動態分析', href: '/dynamic-analysis', icon: 'cpu' },
    { label: '效能檢測', href: '/performance', icon: 'bar-chart-3' },
    { label: 'Pipeline', href: '/pipeline', icon: 'play-circle' },
];
