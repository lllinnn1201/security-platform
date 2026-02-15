// ========================================
// DevSecOps Pipeline Dashboard - 模擬資料
// 提供各階段的範例掃描結果與統計數據
// ========================================

// --- Pipeline 整體執行狀態 ---
const PIPELINE_STATUS = {
  id: 'BUILD-2026-0215-001',        // 建置編號
  branch: 'main',                    // Git 分支
  commit: 'a3f7c2d',                 // Commit 短碼
  trigger: 'push',                   // 觸發方式
  startTime: '2026-02-15 20:30:00',  // 開始時間
  duration: '4m 32s',                // 執行時長
  status: 'passed',                  // 整體狀態
  language: 'Python',                // 偵測到的語言
};

// --- Phase 1: SAST 靜態程式碼分析（SonarQube） ---
const PHASE1_DATA = {
  status: 'passed',                  // 階段狀態
  tool: 'SonarQube',                 // 使用工具
  qualityScore: 87,                  // 品質分數（百分比）
  // 嚴重性分佈
  severityDistribution: {
    critical: 1,                     // 嚴重
    high: 3,                         // 高
    medium: 8,                       // 中
    low: 12,                         // 低
    info: 5,                         // 資訊
  },
  // 漏洞清單
  issues: [
    { id: 'SAST-001', severity: 'critical', rule: 'hardcoded-password',     file: 'config/settings.py',   line: 42,  message: '密碼硬編碼在程式碼中' },
    { id: 'SAST-002', severity: 'high',     rule: 'sql-injection',          file: 'api/users.py',         line: 78,  message: '潛在 SQL 注入風險' },
    { id: 'SAST-003', severity: 'high',     rule: 'xss-vulnerability',      file: 'templates/index.html', line: 15,  message: '未過濾的使用者輸入可能導致 XSS' },
    { id: 'SAST-004', severity: 'high',     rule: 'insecure-random',        file: 'utils/token.py',       line: 23,  message: '使用不安全的隨機數生成器' },
    { id: 'SAST-005', severity: 'medium',   rule: 'unused-import',          file: 'api/routes.py',        line: 3,   message: '未使用的匯入模組' },
    { id: 'SAST-006', severity: 'medium',   rule: 'complexity',             file: 'core/engine.py',       line: 120, message: '函數循環複雜度過高 (15)' },
    { id: 'SAST-007', severity: 'medium',   rule: 'no-error-handling',      file: 'api/upload.py',        line: 55,  message: '缺少例外處理' },
    { id: 'SAST-008', severity: 'low',      rule: 'naming-convention',      file: 'models/user.py',       line: 10,  message: '變數命名不符合 PEP8 規範' },
  ],
  // 程式碼指標
  metrics: {
    linesOfCode: 4250,               // 程式碼行數
    coverage: 72,                    // 測試覆蓋率（%）
    duplications: 3.2,               // 重複碼比例（%）
    technicalDebt: '2h 15m',         // 技術債
  },
};

// --- Phase 2: SCA 靜態依賴與漏洞掃描 ---
const PHASE2_DATA = {
  status: 'passed',                  // 階段狀態
  tools: ['Syft', 'Trivy', 'OSV-Scanner'], // 使用工具
  // SBOM 統計
  sbom: {
    totalPackages: 94,               // 總套件數
    directDeps: 28,                  // 直接依賴
    transitiveDeps: 66,              // 間接依賴
    format: 'CycloneDX',            // SBOM 格式
  },
  // 漏洞統計
  vulnerabilities: {
    total: 24,                       // 總漏洞數
    critical: 2,                     // 嚴重
    high: 5,                         // 高
    medium: 9,                       // 中
    low: 8,                          // 低
  },
  // 套件與漏洞清單
  packages: [
    { name: 'fastapi',       version: '0.104.1', license: 'MIT',       vulns: 0 },
    { name: 'uvicorn',       version: '0.24.0',  license: 'BSD-3',     vulns: 0 },
    { name: 'pydantic',      version: '2.5.2',   license: 'MIT',       vulns: 0 },
    { name: 'sqlalchemy',    version: '2.0.23',  license: 'MIT',       vulns: 1 },
    { name: 'requests',      version: '2.28.0',  license: 'Apache-2',  vulns: 2 },
    { name: 'pillow',        version: '9.3.0',   license: 'MIT-like',  vulns: 3 },
    { name: 'cryptography',  version: '38.0.0',  license: 'Apache-2',  vulns: 2 },
    { name: 'jinja2',        version: '3.1.2',   license: 'BSD-3',     vulns: 1 },
    { name: 'numpy',         version: '1.24.0',  license: 'BSD-3',     vulns: 0 },
    { name: 'werkzeug',      version: '2.2.2',   license: 'BSD-3',     vulns: 1 },
  ],
  // CVE 漏洞清單
  cves: [
    { id: 'CVE-2023-45803', package: 'requests',      severity: 'critical', description: '未驗證的重定向可能洩漏敏感資訊' },
    { id: 'CVE-2023-43804', package: 'requests',      severity: 'high',     description: 'Cookie 洩漏到第三方網站' },
    { id: 'CVE-2023-44271', package: 'pillow',         severity: 'critical', description: '記憶體耗盡型阻斷服務攻擊' },
    { id: 'CVE-2023-50447', package: 'pillow',         severity: 'high',     description: '任意程式碼執行漏洞' },
    { id: 'CVE-2023-44270', package: 'pillow',         severity: 'medium',   description: '路徑穿越漏洞' },
    { id: 'CVE-2023-49083', package: 'cryptography',   severity: 'high',     description: 'NULL 指標解引用導致崩潰' },
    { id: 'CVE-2023-38325', package: 'cryptography',   severity: 'high',     description: 'SSH 憑證驗證繞過' },
    { id: 'CVE-2024-22195', package: 'jinja2',         severity: 'medium',   description: 'XSS 跨站腳本攻擊' },
    { id: 'CVE-2023-46136', package: 'werkzeug',       severity: 'high',     description: '多部分表單解析拒絕服務' },
    { id: 'CVE-2024-12345', package: 'sqlalchemy',     severity: 'medium',   description: 'SQL 注入風險（特定條件下）' },
  ],
};

// --- Phase 3: 動態可達性分析（⭐ 系統亮點） ---
const PHASE3_DATA = {
  status: 'passed',                  // 階段狀態
  tools: ['Strace', 'coverage.py'],  // 使用工具
  // 可達性統計
  reachability: {
    totalVulns: 24,                  // 靜態漏洞總數（來自 Phase 2）
    reachable: 7,                    // 可達漏洞數
    unreachable: 17,                 // 不可達（虛胖）漏洞數
    reductionRate: 70.8,             // 虛胖過濾率（%）
  },
  // Strace 追蹤結果
  straceResults: {
    totalSyscalls: 15420,            // 總系統呼叫數
    filesAccessed: 234,              // 存取的檔案數
    networkCalls: 45,                // 網路呼叫數
    durationMs: 3200,                // 追蹤耗時（毫秒）
  },
  // 可達漏洞清單
  reachableVulns: [
    { cve: 'CVE-2023-45803', package: 'requests',     severity: 'critical', reason: 'API 端點直接呼叫 requests.get()' },
    { cve: 'CVE-2023-43804', package: 'requests',     severity: 'high',     reason: '使用者登入流程中使用 cookie' },
    { cve: 'CVE-2023-44271', package: 'pillow',        severity: 'critical', reason: '圖片上傳功能直接呼叫 Image.open()' },
    { cve: 'CVE-2023-50447', package: 'pillow',        severity: 'high',     reason: '圖片處理 pipeline 呼叫 PIL 函數' },
    { cve: 'CVE-2023-49083', package: 'cryptography',  severity: 'high',     reason: 'HTTPS 連線使用 OpenSSL 綁定' },
    { cve: 'CVE-2024-22195', package: 'jinja2',        severity: 'medium',   reason: '模板渲染直接使用 Jinja2' },
    { cve: 'CVE-2023-46136', package: 'werkzeug',      severity: 'high',     reason: 'FastAPI 底層使用 Werkzeug 解析' },
  ],
  // 不可達漏洞清單（虛胖）
  unreachableVulns: [
    { cve: 'CVE-2023-44270', package: 'pillow',        severity: 'medium',   reason: '未使用路徑相關功能' },
    { cve: 'CVE-2023-38325', package: 'cryptography',  severity: 'high',     reason: 'SSH 模組未被載入' },
    { cve: 'CVE-2024-12345', package: 'sqlalchemy',    severity: 'medium',   reason: '使用 ORM 模式，未直接拼接 SQL' },
  ],
};

// --- Phase 4: 系統效能與可用性測試 ---
const PHASE4_DATA = {
  status: 'passed',                  // 階段狀態
  // K6 負載測試結果
  k6: {
    tool: 'K6',                      // 工具名稱
    virtualUsers: 200,               // 虛擬使用者數
    duration: '60s',                 // 測試時長
    totalRequests: 28450,            // 總請求數
    avgResponseTime: 45,             // 平均回應時間（ms）
    p95ResponseTime: 120,            // P95 回應時間（ms）
    p99ResponseTime: 350,            // P99 回應時間（ms）
    requestsPerSec: 474,             // 每秒請求數
    errorRate: 0.3,                  // 錯誤率（%）
    status: 'passed',               // K6 測試狀態
  },
  // Lighthouse 前端效能結果
  lighthouse: {
    tool: 'Lighthouse',              // 工具名稱
    performance: 92,                 // 效能分數
    accessibility: 88,               // 無障礙分數
    bestPractices: 95,               // 最佳實踐分數
    seo: 90,                         // SEO 分數
    fcp: '1.2s',                     // First Contentful Paint
    lcp: '2.1s',                     // Largest Contentful Paint
    cls: 0.05,                       // Cumulative Layout Shift
    tbt: '150ms',                    // Total Blocking Time
  },
};

// --- Phase 5: 品質門檻與決策 ---
const PHASE5_DATA = {
  status: 'passed',                  // 階段狀態
  // Quality Gate 規則
  rules: [
    { name: '無 Reachable Critical 漏洞',  condition: '可達的嚴重漏洞 = 0',     actual: '2',   threshold: '0',   status: 'failed'  },
    { name: '無 Reachable High 漏洞',      condition: '可達的高危漏洞 ≤ 3',      actual: '4',   threshold: '≤ 3', status: 'failed'  },
    { name: 'SAST 品質分數',               condition: '品質分數 ≥ 80',           actual: '87',  threshold: '≥ 80', status: 'passed' },
    { name: '測試覆蓋率',                  condition: '覆蓋率 ≥ 70%',            actual: '72%', threshold: '≥ 70%', status: 'passed' },
    { name: 'K6 錯誤率',                   condition: '錯誤率 < 1%',             actual: '0.3%', threshold: '< 1%', status: 'passed' },
    { name: 'Lighthouse 效能',             condition: '效能分數 ≥ 85',           actual: '92',  threshold: '≥ 85', status: 'passed' },
  ],
  // 門檻判定結果
  gateResult: 'failed',             // 門檻結果（因為有 Reachable Critical 漏洞）
  gateMessage: '發現 2 個可達的嚴重漏洞，部署已阻斷', // 門檻說明
  // 建議行動
  recommendations: [
    '立即修補 CVE-2023-45803 (requests)：升級到 requests >= 2.31.0',
    '立即修補 CVE-2023-44271 (pillow)：升級到 Pillow >= 10.0.1',
    '評估 CVE-2023-50447 (pillow)：考慮升級到 Pillow >= 10.2.0',
    '將虛胖漏洞加入白名單以減少雜訊',
  ],
};

// --- 最近執行歷史 ---
const PIPELINE_HISTORY = [
  { id: 'BUILD-2026-0215-001', branch: 'main',      commit: 'a3f7c2d', time: '2026-02-15 20:30', status: 'failed',  duration: '4m 32s', gate: 'failed'  },
  { id: 'BUILD-2026-0214-003', branch: 'main',      commit: 'b8e1f4a', time: '2026-02-14 16:45', status: 'passed',  duration: '3m 58s', gate: 'passed'  },
  { id: 'BUILD-2026-0214-002', branch: 'feature/auth', commit: 'c2d5e7b', time: '2026-02-14 14:20', status: 'passed',  duration: '4m 12s', gate: 'passed'  },
  { id: 'BUILD-2026-0214-001', branch: 'main',      commit: 'f9a3b1c', time: '2026-02-14 09:10', status: 'failed',  duration: '5m 01s', gate: 'failed'  },
  { id: 'BUILD-2026-0213-002', branch: 'develop',   commit: 'd4e6f8a', time: '2026-02-13 17:30', status: 'passed',  duration: '3m 45s', gate: 'passed'  },
];
