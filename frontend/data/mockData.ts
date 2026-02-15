// ===== 源碼安全分析平台 — Mock 資料 =====
// 集中管理所有頁面的展示用假資料，結構對齊未來 API 格式

// ---------- 共用型別定義 ----------

// 風險等級列舉
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Pipeline 構建狀態列舉
export type PipelineStatus = 'success' | 'failure' | 'running' | 'pending' | 'cancelled';

// ---------- Dashboard 統計卡片資料 ----------
export interface StatCard {
    label: string;      // 卡片標題
    value: string;      // 數值
    icon: string;       // 圖示 emoji
    trend: string;      // 趨勢文字
    trendUp: boolean;   // 趨勢方向
}

// Dashboard 統計卡片 mock
export const dashboardStats: StatCard[] = [
    { label: '總掃描次數', value: '1,284', icon: '🔍', trend: '+12%', trendUp: true },
    { label: '發現漏洞數', value: '347', icon: '🛡️', trend: '-8%', trendUp: false },
    { label: '安全評分', value: '82.5', icon: '📊', trend: '+3.2', trendUp: true },
    { label: 'SBOM 數量', value: '56', icon: '📋', trend: '+5', trendUp: true },
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
    { id: 'SCN-006', project: 'notification-svc', branch: 'hotfix/email', status: 'success', riskLevel: 'info', vulnerabilities: 0, date: '2026-02-14 22:10' },
];

// ---------- 風險等級分佈 ----------
export interface RiskDistribution {
    level: RiskLevel;   // 風險等級
    count: number;      // 數量
    color: string;      // 對應顏色
}

// 風險等級分佈 mock
export const riskDistribution: RiskDistribution[] = [
    { level: 'critical', count: 8, color: '#ff4757' },
    { level: 'high', count: 23, color: '#ff6b35' },
    { level: 'medium', count: 45, color: '#ffa502' },
    { level: 'low', count: 156, color: '#2ed573' },
    { level: 'info', count: 115, color: '#70a1ff' },
];

// ---------- 分析報告詳細 ----------
export interface Vulnerability {
    id: string;            // 漏洞編號
    title: string;         // 漏洞名稱
    severity: RiskLevel;   // 嚴重程度
    file: string;          // 所在檔案
    line: number;          // 行號
    description: string;   // 描述
    cwe: string;           // CWE 編號
}

// 分析報告漏洞清單 mock
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

// ---------- Code Smell 清單 ----------
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

// ---------- Code Flow 資料 ----------
export interface FlowNode {
    id: string;        // 節點 ID
    name: string;      // 函式名稱
    file: string;      // 所在檔案
    type: 'entry' | 'process' | 'sink' | 'taint'; // 節點類型
    children?: FlowNode[]; // 子節點
}

// Code Flow 樹狀結構 mock
export const codeFlowTree: FlowNode = {
    id: 'f1',
    name: 'handleRequest()',
    file: 'src/api/handler.ts',
    type: 'entry',
    children: [
        {
            id: 'f2',
            name: 'parseInput()',
            file: 'src/utils/parser.ts',
            type: 'process',
            children: [
                { id: 'f3', name: 'sanitize()', file: 'src/utils/sanitizer.ts', type: 'process' },
                {
                    id: 'f4',
                    name: 'buildQuery()',
                    file: 'src/db/query.ts',
                    type: 'taint',
                    children: [
                        { id: 'f5', name: 'executeSQL()', file: 'src/db/executor.ts', type: 'sink' },
                    ],
                },
            ],
        },
        {
            id: 'f6',
            name: 'authenticate()',
            file: 'src/middleware/auth.ts',
            type: 'process',
            children: [
                { id: 'f7', name: 'verifyToken()', file: 'src/utils/jwt.ts', type: 'process' },
                { id: 'f8', name: 'checkPermission()', file: 'src/middleware/rbac.ts', type: 'process' },
            ],
        },
        {
            id: 'f9',
            name: 'sendResponse()',
            file: 'src/api/response.ts',
            type: 'process',
            children: [
                { id: 'f10', name: 'renderTemplate()', file: 'src/views/render.ts', type: 'taint' },
            ],
        },
    ],
};

// 污染路徑 mock
export interface TaintPath {
    id: string;          // 路徑 ID
    source: string;      // 來源
    sink: string;        // 結束點
    severity: RiskLevel; // 嚴重程度
    steps: string[];     // 經過的步驟
}

// 污染路徑追蹤 mock
export const taintPaths: TaintPath[] = [
    {
        id: 'TP-001',
        source: 'req.body.username',
        sink: 'db.query()',
        severity: 'critical',
        steps: ['handleRequest()', 'parseInput()', 'buildQuery()', 'executeSQL()'],
    },
    {
        id: 'TP-002',
        source: 'req.query.redirect',
        sink: 'res.redirect()',
        severity: 'medium',
        steps: ['handleCallback()', 'validateRedirect()', 'performRedirect()'],
    },
    {
        id: 'TP-003',
        source: 'req.body.comment',
        sink: 'innerHTML',
        severity: 'high',
        steps: ['submitComment()', 'formatContent()', 'renderTemplate()'],
    },
];

// ---------- SBOM 資料 ----------
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

// ---------- Pipeline 資料 ----------
export interface PipelineJob {
    id: string;              // Job ID
    name: string;            // Job 名稱
    project: string;         // 專案名稱
    status: PipelineStatus;  // 狀態
    duration: string;        // 執行時間
    triggeredBy: string;     // 觸發者
    date: string;            // 日期
    stages: PipelineStage[]; // 階段
    qualityGate: 'passed' | 'failed' | 'pending'; // 品質閘門
}

export interface PipelineStage {
    name: string;            // 階段名稱
    status: PipelineStatus;  // 狀態
    duration: string;        // 執行時間
}

// Pipeline 歷史紀錄 mock
export const pipelineJobs: PipelineJob[] = [
    {
        id: 'JOB-101',
        name: 'full-scan',
        project: 'web-frontend',
        status: 'success',
        duration: '4m 32s',
        triggeredBy: 'nancy',
        date: '2026-02-15 21:30',
        qualityGate: 'passed',
        stages: [
            { name: 'Checkout', status: 'success', duration: '5s' },
            { name: 'SAST Scan', status: 'success', duration: '2m 10s' },
            { name: 'SBOM 產生', status: 'success', duration: '45s' },
            { name: '漏洞掃描', status: 'success', duration: '1m 32s' },
        ],
    },
    {
        id: 'JOB-100',
        name: 'full-scan',
        project: 'api-gateway',
        status: 'failure',
        duration: '3m 15s',
        triggeredBy: 'nancy',
        date: '2026-02-15 20:15',
        qualityGate: 'failed',
        stages: [
            { name: 'Checkout', status: 'success', duration: '4s' },
            { name: 'SAST Scan', status: 'success', duration: '1m 45s' },
            { name: 'SBOM 產生', status: 'success', duration: '38s' },
            { name: '漏洞掃描', status: 'failure', duration: '48s' },
        ],
    },
    {
        id: 'JOB-099',
        name: 'quick-scan',
        project: 'auth-service',
        status: 'success',
        duration: '2m 08s',
        triggeredBy: 'auto',
        date: '2026-02-15 19:42',
        qualityGate: 'passed',
        stages: [
            { name: 'Checkout', status: 'success', duration: '3s' },
            { name: 'SAST Scan', status: 'success', duration: '1m 20s' },
            { name: 'SBOM 產生', status: 'success', duration: '45s' },
        ],
    },
    {
        id: 'JOB-098',
        name: 'full-scan',
        project: 'payment-module',
        status: 'running',
        duration: '1m 22s',
        triggeredBy: 'nancy',
        date: '2026-02-15 19:10',
        qualityGate: 'pending',
        stages: [
            { name: 'Checkout', status: 'success', duration: '4s' },
            { name: 'SAST Scan', status: 'success', duration: '55s' },
            { name: 'SBOM 產生', status: 'running', duration: '23s' },
            { name: '漏洞掃描', status: 'pending', duration: '-' },
        ],
    },
    {
        id: 'JOB-097',
        name: 'full-scan',
        project: 'user-service',
        status: 'success',
        duration: '3m 50s',
        triggeredBy: 'auto',
        date: '2026-02-15 18:30',
        qualityGate: 'passed',
        stages: [
            { name: 'Checkout', status: 'success', duration: '5s' },
            { name: 'SAST Scan', status: 'success', duration: '2m 05s' },
            { name: 'SBOM 產生', status: 'success', duration: '40s' },
            { name: '漏洞掃描', status: 'success', duration: '1m 00s' },
        ],
    },
];

// ---------- 側邊欄導覽項目 ----------
export interface NavItem {
    label: string;   // 顯示名稱
    href: string;    // 路由路徑
    icon: string;    // 圖示 emoji
}

// 側邊欄導覽 mock
export const navItems: NavItem[] = [
    { label: '儀表板', href: '/', icon: '📊' },
    { label: '程式碼上傳', href: '/upload', icon: '📤' },
    { label: '分析報告', href: '/reports', icon: '📝' },
    { label: 'Code Flow', href: '/codeflow', icon: '🔀' },
    { label: 'SBOM 檢視器', href: '/sbom', icon: '📋' },
    { label: 'Pipeline', href: '/pipeline', icon: '🚦' },
];
