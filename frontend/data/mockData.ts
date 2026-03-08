// ===== SecureFlow DevSecOps 平台 — Mock 資料 =====
// 集中管理所有頁面的展示用假資料，結構對齊未來 API 格式
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

// Dashboard 工具狀態卡片 mock
export const toolStatusCards: ToolStatusCard[] = [
    { tool: 'SonarQube', category: '靜態分析', status: 'passed', summary: '發現 3 個漏洞、5 個 Code Smell', lastRun: '2026-02-15 21:30' },
    { tool: 'OSV-Scanner', category: '靜態分析', status: 'failed', summary: '2 個高風險依賴套件', lastRun: '2026-02-15 21:31' },
    { tool: 'Strace', category: '動態分析', status: 'passed', summary: '追蹤 1,284 個系統呼叫', lastRun: '2026-02-15 21:32' },
    { tool: 'Valgrind', category: '動態分析', status: 'passed', summary: '未偵測到記憶體洩漏', lastRun: '2026-02-15 21:33' },
    { tool: 'K6', category: '效能檢測', status: 'passed', summary: 'P95 回應 < 200ms', lastRun: '2026-02-15 21:34' },
    { tool: 'Lighthouse', category: '效能檢測', status: 'failed', summary: 'Performance 分數 58/100', lastRun: '2026-02-15 21:35' },
];

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

// 最近掃描紀錄 mock
export const recentScans: ScanRecord[] = [
    { id: 'SCN-001', project: 'web-frontend', branch: 'main', status: 'success', riskLevel: 'low', vulnerabilities: 3, date: '2026-02-15 21:30' },
    { id: 'SCN-002', project: 'api-gateway', branch: 'develop', status: 'failure', riskLevel: 'critical', vulnerabilities: 12, date: '2026-02-15 20:15' },
    { id: 'SCN-003', project: 'auth-service', branch: 'feature/oauth', status: 'success', riskLevel: 'medium', vulnerabilities: 7, date: '2026-02-15 19:42' },
    { id: 'SCN-004', project: 'payment-module', branch: 'main', status: 'running', riskLevel: 'high', vulnerabilities: 0, date: '2026-02-15 19:10' },
    { id: 'SCN-005', project: 'user-service', branch: 'main', status: 'success', riskLevel: 'low', vulnerabilities: 1, date: '2026-02-15 18:30' },
];

// ---------- 風險等級分佈 ----------
export interface RiskDistribution {
    level: RiskLevel;   // 風險等級
    count: number;      // 數量
    color: string;      // 對應顏色
}

// 風險等級分佈 mock
export const riskDistribution: RiskDistribution[] = [
    { level: 'critical', count: 8, color: '#dc2626' },
    { level: 'high', count: 23, color: '#ea580c' },
    { level: 'medium', count: 45, color: '#ca8a04' },
    { level: 'low', count: 156, color: '#16a34a' },
    { level: 'info', count: 115, color: '#2563eb' },
];

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

// SonarQube 漏洞清單 mock
export const vulnerabilities: Vulnerability[] = [
    { id: 'VUL-001', title: 'SQL Injection', severity: 'critical', file: 'src/db/query.ts', line: 42, description: '使用未經過濾的使用者輸入直接拼接 SQL 查詢字串', cwe: 'CWE-89' },
    { id: 'VUL-002', title: 'Cross-Site Scripting (XSS)', severity: 'high', file: 'src/components/Comment.tsx', line: 15, description: '未對使用者輸入進行 HTML 編碼即直接渲染至 DOM', cwe: 'CWE-79' },
    { id: 'VUL-003', title: 'Hardcoded Secret', severity: 'high', file: 'src/config/env.ts', line: 8, description: '在原始碼中硬編碼 API 金鑰', cwe: 'CWE-798' },
    { id: 'VUL-004', title: 'Path Traversal', severity: 'medium', file: 'src/utils/fileHandler.ts', line: 23, description: '檔案路徑未進行正規化驗證，可能允許目錄遍歷攻擊', cwe: 'CWE-22' },
    { id: 'VUL-005', title: 'Insecure Deserialization', severity: 'medium', file: 'src/api/parser.ts', line: 67, description: '使用不安全的反序列化方式處理外部資料', cwe: 'CWE-502' },
    { id: 'VUL-006', title: 'Missing Rate Limiting', severity: 'low', file: 'src/middleware/auth.ts', line: 12, description: '登入 API 端點缺少速率限制機制', cwe: 'CWE-307' },
    { id: 'VUL-007', title: 'Weak Cryptographic Algorithm', severity: 'medium', file: 'src/utils/crypto.ts', line: 5, description: '使用 MD5 雜湊演算法儲存密碼', cwe: 'CWE-328' },
    { id: 'VUL-008', title: 'Open Redirect', severity: 'low', file: 'src/routes/redirect.ts', line: 18, description: '重新導向 URL 未進行白名單驗證', cwe: 'CWE-601' },
];

// ---------- SonarQube Code Smell ----------
export interface CodeSmell {
    id: string;        // 編號
    title: string;     // 名稱
    type: string;      // 類型
    file: string;      // 所在檔案
    line: number;      // 行號
    effort: string;    // 修復時間估計
}

// Code Smell mock
export const codeSmells: CodeSmell[] = [
    { id: 'CS-001', title: '函式過長', type: '維護性', file: 'src/services/scanner.ts', line: 120, effort: '30 分鐘' },
    { id: 'CS-002', title: '重複程式碼區塊', type: '重複性', file: 'src/utils/validator.ts', line: 45, effort: '20 分鐘' },
    { id: 'CS-003', title: '過深巢狀結構', type: '複雜度', file: 'src/controllers/report.ts', line: 88, effort: '45 分鐘' },
    { id: 'CS-004', title: '未使用的匯入', type: '清潔度', file: 'src/components/Header.tsx', line: 3, effort: '5 分鐘' },
    { id: 'CS-005', title: '魔術數字', type: '可讀性', file: 'src/config/limits.ts', line: 12, effort: '10 分鐘' },
];

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

// SBOM 套件清單 mock
export const sbomPackages: SBOMPackage[] = [
    { name: 'lodash', version: '4.17.15', license: 'MIT', ecosystem: 'npm', vulnerabilities: 3, riskLevel: 'high', cve: 'CVE-2020-8203' },
    { name: 'express', version: '4.18.2', license: 'MIT', ecosystem: 'npm', vulnerabilities: 0, riskLevel: 'info', cve: '' },
    { name: 'jsonwebtoken', version: '8.5.1', license: 'MIT', ecosystem: 'npm', vulnerabilities: 1, riskLevel: 'medium', cve: 'CVE-2022-23529' },
    { name: 'axios', version: '1.6.0', license: 'MIT', ecosystem: 'npm', vulnerabilities: 0, riskLevel: 'info', cve: '' },
    { name: 'pg', version: '8.11.3', license: 'MIT', ecosystem: 'npm', vulnerabilities: 0, riskLevel: 'info', cve: '' },
    { name: 'bcrypt', version: '5.1.0', license: 'MIT', ecosystem: 'npm', vulnerabilities: 0, riskLevel: 'info', cve: '' },
    { name: 'helmet', version: '7.1.0', license: 'MIT', ecosystem: 'npm', vulnerabilities: 0, riskLevel: 'info', cve: '' },
    { name: 'dotenv', version: '16.3.1', license: 'BSD-2', ecosystem: 'npm', vulnerabilities: 0, riskLevel: 'info', cve: '' },
    { name: 'moment', version: '2.29.1', license: 'MIT', ecosystem: 'npm', vulnerabilities: 1, riskLevel: 'low', cve: 'CVE-2022-31129' },
    { name: 'qs', version: '6.5.2', license: 'BSD-3', ecosystem: 'npm', vulnerabilities: 2, riskLevel: 'high', cve: 'CVE-2022-24999' },
    { name: 'minimist', version: '1.2.5', license: 'MIT', ecosystem: 'npm', vulnerabilities: 1, riskLevel: 'critical', cve: 'CVE-2021-44906' },
    { name: 'node-fetch', version: '2.6.7', license: 'MIT', ecosystem: 'npm', vulnerabilities: 0, riskLevel: 'info', cve: '' },
];

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

// Strace 系統呼叫追蹤 mock
export const straceRecords: StraceRecord[] = [
    { id: 'ST-001', pid: 12345, syscall: 'open', args: '"/etc/passwd", O_RDONLY', returnVal: '3', duration: '0.000012s', category: 'file' },
    { id: 'ST-002', pid: 12345, syscall: 'read', args: '3, buf, 4096', returnVal: '1024', duration: '0.000008s', category: 'file' },
    { id: 'ST-003', pid: 12345, syscall: 'connect', args: 'sockfd, {sa_family=AF_INET, sin_port=htons(3306)}', returnVal: '0', duration: '0.003421s', category: 'network' },
    { id: 'ST-004', pid: 12345, syscall: 'write', args: '1, "SELECT * FROM users WHERE id=...", 48', returnVal: '48', duration: '0.000015s', category: 'network' },
    { id: 'ST-005', pid: 12346, syscall: 'execve', args: '"/bin/sh", ["sh", "-c", "rm -rf /tmp/*"]', returnVal: '0', duration: '0.001230s', category: 'process' },
    { id: 'ST-006', pid: 12345, syscall: 'mmap', args: 'NULL, 65536, PROT_READ|PROT_WRITE, MAP_PRIVATE', returnVal: '0x7f...', duration: '0.000045s', category: 'memory' },
    { id: 'ST-007', pid: 12345, syscall: 'socket', args: 'AF_INET, SOCK_STREAM, IPPROTO_TCP', returnVal: '4', duration: '0.000018s', category: 'network' },
    { id: 'ST-008', pid: 12346, syscall: 'fork', args: '', returnVal: '12347', duration: '0.000890s', category: 'process' },
    { id: 'ST-009', pid: 12345, syscall: 'close', args: '3', returnVal: '0', duration: '0.000005s', category: 'file' },
    { id: 'ST-010', pid: 12345, syscall: 'unlink', args: '"/tmp/session_abc123"', returnVal: '0', duration: '0.000032s', category: 'file' },
];

// Strace 統計摘要
export interface StraceSummary {
    totalCalls: number;     // 總系統呼叫次數
    fileCalls: number;      // 檔案操作次數
    networkCalls: number;   // 網路操作次數
    processCalls: number;   // 程序操作次數
    memoryCalls: number;    // 記憶體操作次數
    suspiciousCalls: number; // 可疑呼叫次數
}

// Strace 統計 mock
export const straceSummary: StraceSummary = {
    totalCalls: 1284,
    fileCalls: 412,
    networkCalls: 356,
    processCalls: 89,
    memoryCalls: 215,
    suspiciousCalls: 3,
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

// Valgrind 記憶體分析 mock
export const valgrindErrors: ValgrindError[] = [
    { id: 'VG-001', type: 'Definitely Lost', severity: 'critical', bytes: 1024, location: 'allocateBuffer()', file: 'src/utils/buffer.c', line: 42, stackTrace: 'main → processRequest → allocateBuffer' },
    { id: 'VG-002', type: 'Invalid Read', severity: 'high', bytes: 4, location: 'parseHeader()', file: 'src/parser/http.c', line: 78, stackTrace: 'main → handleConnection → parseHeader' },
    { id: 'VG-003', type: 'Use After Free', severity: 'critical', bytes: 8, location: 'freeSession()', file: 'src/session/manager.c', line: 156, stackTrace: 'main → cleanupSessions → freeSession' },
    { id: 'VG-004', type: 'Possibly Lost', severity: 'medium', bytes: 256, location: 'createWorkerThread()', file: 'src/thread/pool.c', line: 34, stackTrace: 'main → initThreadPool → createWorkerThread' },
    { id: 'VG-005', type: 'Uninitialized Value', severity: 'medium', bytes: 0, location: 'computeChecksum()', file: 'src/crypto/hash.c', line: 91, stackTrace: 'main → verifyPayload → computeChecksum' },
    { id: 'VG-006', type: 'Still Reachable', severity: 'low', bytes: 512, location: 'initLogger()', file: 'src/utils/logger.c', line: 12, stackTrace: 'main → initLogger' },
];

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

// Valgrind 統計 mock
export const valgrindSummary: ValgrindSummary = {
    totalErrors: 6,
    definitelyLost: 1024,
    possiblyLost: 256,
    stillReachable: 512,
    heapUsage: 2457600,
    allocations: 3421,
    frees: 3419,
};

// ---------- K6 負載測試 ----------
export interface K6Metric {
    label: string;     // 指標名稱
    value: string;     // 指標值
    unit: string;      // 單位
    status: 'good' | 'warning' | 'bad'; // 狀態
    threshold: string; // 門檻值
}

// K6 負載測試指標 mock
export const k6Metrics: K6Metric[] = [
    { label: '虛擬使用者 (VUs)', value: '50', unit: 'users', status: 'good', threshold: '—' },
    { label: '總請求數', value: '12,847', unit: 'requests', status: 'good', threshold: '—' },
    { label: '請求速率 (RPS)', value: '214.1', unit: 'req/s', status: 'good', threshold: '> 100 req/s' },
    { label: 'P50 回應時間', value: '45', unit: 'ms', status: 'good', threshold: '< 200ms' },
    { label: 'P95 回應時間', value: '187', unit: 'ms', status: 'good', threshold: '< 500ms' },
    { label: 'P99 回應時間', value: '432', unit: 'ms', status: 'warning', threshold: '< 500ms' },
    { label: '錯誤率', value: '0.12', unit: '%', status: 'good', threshold: '< 1%' },
    { label: '資料吞吐量', value: '3.2', unit: 'MB/s', status: 'good', threshold: '> 1 MB/s' },
];

// K6 各端點回應時間 mock
export interface K6Endpoint {
    method: string;    // HTTP 方法
    path: string;      // 端點路徑
    avg: number;       // 平均回應（ms）
    p95: number;       // P95 回應（ms）
    rps: number;       // 每秒請求數
    errorRate: string; // 錯誤率
    status: 'good' | 'warning' | 'bad'; // 狀態
}

// K6 端點明細 mock
export const k6Endpoints: K6Endpoint[] = [
    { method: 'GET', path: '/api/health', avg: 12, p95: 25, rps: 85.2, errorRate: '0%', status: 'good' },
    { method: 'POST', path: '/api/auth/login', avg: 89, p95: 210, rps: 42.1, errorRate: '0.1%', status: 'good' },
    { method: 'GET', path: '/api/reports', avg: 156, p95: 380, rps: 38.5, errorRate: '0.2%', status: 'warning' },
    { method: 'POST', path: '/api/upload', avg: 234, p95: 520, rps: 22.3, errorRate: '0.5%', status: 'warning' },
    { method: 'GET', path: '/api/sbom', avg: 67, p95: 145, rps: 56.0, errorRate: '0%', status: 'good' },
];

// ---------- Lighthouse 效能審計 ----------
export interface LighthouseScore {
    category: string;  // 分類名稱
    score: number;     // 分數（0-100）
    color: string;     // 顏色
}

// Lighthouse 4 大分數 mock
export const lighthouseScores: LighthouseScore[] = [
    { category: 'Performance', score: 58, color: '#ea580c' },
    { category: 'Accessibility', score: 91, color: '#16a34a' },
    { category: 'Best Practices', score: 83, color: '#ca8a04' },
    { category: 'SEO', score: 95, color: '#16a34a' },
];

// Lighthouse 建議清單
export interface LighthouseAudit {
    id: string;        // 審計 ID
    title: string;     // 項目名稱
    category: string;  // 所屬分類
    impact: 'high' | 'medium' | 'low'; // 影響程度
    description: string; // 說明
    savings: string;   // 可節省時間/資源
}

// Lighthouse 建議 mock
export const lighthouseAudits: LighthouseAudit[] = [
    { id: 'LH-001', title: 'Reduce unused JavaScript', category: 'Performance', impact: 'high', description: '移除未使用的 JavaScript 以減少網路傳輸', savings: '節省 1.2s' },
    { id: 'LH-002', title: 'Serve images in next-gen formats', category: 'Performance', impact: 'high', description: '使用 WebP / AVIF 格式取代 PNG/JPEG', savings: '節省 850ms' },
    { id: 'LH-003', title: 'Eliminate render-blocking resources', category: 'Performance', impact: 'medium', description: '延遲載入非關鍵 CSS/JS 資源', savings: '節省 620ms' },
    { id: 'LH-004', title: 'Image elements have [alt] attributes', category: 'Accessibility', impact: 'medium', description: '3 個 img 元素缺少 alt 屬性', savings: '—' },
    { id: 'LH-005', title: 'Document has a meta description', category: 'SEO', impact: 'low', description: '頁面已有 meta description', savings: '—' },
    { id: 'LH-006', title: 'Properly size images', category: 'Performance', impact: 'medium', description: '圖片尺寸應與顯示大小相符', savings: '節省 340ms' },
];

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

// Pipeline 歷史紀錄 mock（階段對齊 7 個工具）
export const pipelineJobs: PipelineJob[] = [
    {
        id: 'JOB-101',
        name: 'full-pipeline',
        project: 'web-frontend',
        status: 'success',
        duration: '8m 45s',
        triggeredBy: 'nancy',
        date: '2026-02-15 21:30',
        qualityGate: 'passed',
        gateConditions: [
            { rule: 'Critical 漏洞數 = 0', actual: '0', threshold: '0', passed: true },
            { rule: 'High 漏洞數 ≤ 3', actual: '2', threshold: '3', passed: true },
            { rule: 'Lighthouse Performance ≥ 60', actual: '72', threshold: '60', passed: true },
            { rule: '記憶體洩漏 = 0', actual: '0', threshold: '0', passed: true },
            { rule: 'K6 錯誤率 < 1%', actual: '0.12%', threshold: '1%', passed: true },
        ],
        stages: [
            { name: 'Checkout', status: 'success', duration: '5s', tool: 'git' },
            { name: 'SonarQube', status: 'success', duration: '2m 10s', tool: 'sonarqube' },
            { name: 'OSV-Scanner', status: 'success', duration: '45s', tool: 'osv-scanner' },
            { name: 'Strace', status: 'success', duration: '1m 30s', tool: 'strace' },
            { name: 'Valgrind', status: 'success', duration: '2m 15s', tool: 'valgrind' },
            { name: 'K6', status: 'success', duration: '1m 20s', tool: 'k6' },
            { name: 'Lighthouse', status: 'success', duration: '40s', tool: 'lighthouse' },
        ],
    },
    {
        id: 'JOB-100',
        name: 'full-pipeline',
        project: 'api-gateway',
        status: 'failure',
        duration: '6m 32s',
        triggeredBy: 'nancy',
        date: '2026-02-15 20:15',
        qualityGate: 'failed',
        gateConditions: [
            { rule: 'Critical 漏洞數 = 0', actual: '3', threshold: '0', passed: false },
            { rule: 'High 漏洞數 ≤ 3', actual: '5', threshold: '3', passed: false },
            { rule: 'Lighthouse Performance ≥ 60', actual: '58', threshold: '60', passed: false },
            { rule: '記憶體洩漏 = 0', actual: '2', threshold: '0', passed: false },
            { rule: 'K6 錯誤率 < 1%', actual: '0.5%', threshold: '1%', passed: true },
        ],
        stages: [
            { name: 'Checkout', status: 'success', duration: '4s', tool: 'git' },
            { name: 'SonarQube', status: 'success', duration: '1m 45s', tool: 'sonarqube' },
            { name: 'OSV-Scanner', status: 'failure', duration: '38s', tool: 'osv-scanner' },
            { name: 'Strace', status: 'success', duration: '1m 20s', tool: 'strace' },
            { name: 'Valgrind', status: 'failure', duration: '1m 50s', tool: 'valgrind' },
            { name: 'K6', status: 'success', duration: '55s', tool: 'k6' },
            { name: 'Lighthouse', status: 'failure', duration: '40s', tool: 'lighthouse' },
        ],
    },
    {
        id: 'JOB-099',
        name: 'full-pipeline',
        project: 'auth-service',
        status: 'success',
        duration: '7m 20s',
        triggeredBy: 'auto',
        date: '2026-02-15 19:42',
        qualityGate: 'passed',
        gateConditions: [
            { rule: 'Critical 漏洞數 = 0', actual: '0', threshold: '0', passed: true },
            { rule: 'High 漏洞數 ≤ 3', actual: '1', threshold: '3', passed: true },
            { rule: 'Lighthouse Performance ≥ 60', actual: '85', threshold: '60', passed: true },
            { rule: '記憶體洩漏 = 0', actual: '0', threshold: '0', passed: true },
            { rule: 'K6 錯誤率 < 1%', actual: '0.05%', threshold: '1%', passed: true },
        ],
        stages: [
            { name: 'Checkout', status: 'success', duration: '3s', tool: 'git' },
            { name: 'SonarQube', status: 'success', duration: '1m 50s', tool: 'sonarqube' },
            { name: 'OSV-Scanner', status: 'success', duration: '42s', tool: 'osv-scanner' },
            { name: 'Strace', status: 'success', duration: '1m 25s', tool: 'strace' },
            { name: 'Valgrind', status: 'success', duration: '1m 40s', tool: 'valgrind' },
            { name: 'K6', status: 'success', duration: '1m 10s', tool: 'k6' },
            { name: 'Lighthouse', status: 'success', duration: '30s', tool: 'lighthouse' },
        ],
    },
    {
        id: 'JOB-098',
        name: 'full-pipeline',
        project: 'payment-module',
        status: 'running',
        duration: '3m 10s',
        triggeredBy: 'nancy',
        date: '2026-02-15 19:10',
        qualityGate: 'pending',
        gateConditions: [],
        stages: [
            { name: 'Checkout', status: 'success', duration: '4s', tool: 'git' },
            { name: 'SonarQube', status: 'success', duration: '1m 55s', tool: 'sonarqube' },
            { name: 'OSV-Scanner', status: 'success', duration: '40s', tool: 'osv-scanner' },
            { name: 'Strace', status: 'running', duration: '31s', tool: 'strace' },
            { name: 'Valgrind', status: 'pending', duration: '—', tool: 'valgrind' },
            { name: 'K6', status: 'pending', duration: '—', tool: 'k6' },
            { name: 'Lighthouse', status: 'pending', duration: '—', tool: 'lighthouse' },
        ],
    },
];

// ---------- 側邊欄導覽項目 ----------
export interface NavItem {
    label: string;   // 顯示名稱
    href: string;    // 路由路徑
    icon: string;    // 圖示名稱（對應 Lucide 圖示）
}

// 側邊欄導覽 mock（對應新頁面架構）
export const navItems: NavItem[] = [
    { label: '儀表板', href: '/', icon: 'layout-dashboard' },
    { label: '程式碼上傳', href: '/upload', icon: 'upload' },
    { label: '靜態分析', href: '/static-analysis', icon: 'file-search' },
    { label: '動態分析', href: '/dynamic-analysis', icon: 'cpu' },
    { label: '效能檢測', href: '/performance', icon: 'bar-chart-3' },
    { label: 'Pipeline', href: '/pipeline', icon: 'play-circle' },
];
