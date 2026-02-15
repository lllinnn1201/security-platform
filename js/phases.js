// ========================================
// DevSecOps Pipeline Dashboard - 各階段詳細頁面
// 負責 Phase 1~5 的詳細結果渲染
// ========================================

/**
 * Phase 1: SAST 靜態程式碼分析（SonarQube）
 * 顯示品質分數、嚴重性分佈長條圖、漏洞列表
 */
function renderPhase1(container) {
    const data = PHASE1_DATA; // 取得 Phase 1 模擬資料
    container.innerHTML = `
    <div class="page-enter">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h2 class="page-title"><span style="color:var(--phase-1)">🛡️</span> Phase 1: SAST 源碼檢測</h2>
        <p class="page-subtitle">工具: ${data.tool} ｜ 狀態: ${getStatusLabel(data.status)}</p>
      </div>

      <!-- 程式碼指標統計 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">品質分數</div>
          <div class="stat-value" style="color:var(--phase-1)">${data.qualityScore}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">程式碼行數</div>
          <div class="stat-value">${data.metrics.linesOfCode.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">測試覆蓋率</div>
          <div class="stat-value">${data.metrics.coverage}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">技術債</div>
          <div class="stat-value" style="font-size:1.5rem">${data.metrics.technicalDebt}</div>
        </div>
      </div>

      <!-- 嚴重性分佈長條圖 -->
      <div class="glass-card">
        <h3 class="card-title">📊 嚴重性分佈</h3>
        ${renderSeverityBar(data.severityDistribution)}
      </div>

      <!-- 漏洞列表 -->
      <div class="glass-card">
        <h3 class="card-title">🔍 問題清單 (${data.issues.length})</h3>
        ${renderIssueTable(data.issues)}
      </div>
    </div>
  `;
}

/**
 * Phase 2: SCA 靜態依賴與漏洞掃描
 * 顯示 SBOM 統計、套件列表、CVE 漏洞列表
 */
function renderPhase2(container) {
    const data = PHASE2_DATA; // 取得 Phase 2 模擬資料
    container.innerHTML = `
    <div class="page-enter">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h2 class="page-title"><span style="color:var(--phase-2)">📦</span> Phase 2: SCA / SBOM 掃描</h2>
        <p class="page-subtitle">工具: ${data.tools.join(', ')} ｜ 狀態: ${getStatusLabel(data.status)}</p>
      </div>

      <!-- SBOM 統計 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">總套件數</div>
          <div class="stat-value" style="color:var(--phase-2)">${data.sbom.totalPackages}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">直接依賴</div>
          <div class="stat-value">${data.sbom.directDeps}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">間接依賴</div>
          <div class="stat-value">${data.sbom.transitiveDeps}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已知漏洞</div>
          <div class="stat-value" style="color:var(--severity-high)">${data.vulnerabilities.total}</div>
        </div>
      </div>

      <!-- 漏洞嚴重性長條圖 -->
      <div class="glass-card">
        <h3 class="card-title">📊 漏洞嚴重性分佈</h3>
        ${renderSeverityBar(data.vulnerabilities)}
      </div>

      <!-- 套件清單 -->
      <div class="glass-card">
        <h3 class="card-title">📋 套件清單 (顯示前 ${data.packages.length} 個)</h3>
        <table class="data-table">
          <thead>
            <tr><th>套件名稱</th><th>版本</th><th>授權</th><th>漏洞數</th></tr>
          </thead>
          <tbody>
            ${data.packages.map(pkg => `
              <tr>
                <td><span class="package-tag">${pkg.name}</span></td>
                <td style="font-family:'JetBrains Mono',monospace; font-size:0.82rem">${pkg.version}</td>
                <td>${pkg.license}</td>
                <td>${pkg.vulns > 0 ? `<span style="color:var(--severity-high);font-weight:700">${pkg.vulns}</span>` : '<span style="color:var(--status-pass)">0</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- CVE 漏洞列表 -->
      <div class="glass-card">
        <h3 class="card-title">🔓 CVE 漏洞清單 (${data.cves.length})</h3>
        <table class="data-table">
          <thead>
            <tr><th>CVE 編號</th><th>套件</th><th>嚴重性</th><th>說明</th></tr>
          </thead>
          <tbody>
            ${data.cves.map(cve => `
              <tr>
                <td style="font-family:'JetBrains Mono',monospace; font-size:0.82rem">${cve.id}</td>
                <td><span class="package-tag">${cve.package}</span></td>
                <td><span class="severity-badge ${cve.severity}">${cve.severity.toUpperCase()}</span></td>
                <td>${cve.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Phase 3: 動態可達性分析（⭐ 系統亮點）
 * 顯示可達 vs 不可達對比、Strace 指標、漏洞分類表
 */
function renderPhase3(container) {
    const data = PHASE3_DATA; // 取得 Phase 3 模擬資料
    container.innerHTML = `
    <div class="page-enter">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h2 class="page-title"><span style="color:var(--phase-3)">🔬</span> Phase 3: 動態可達性分析 ⭐</h2>
        <p class="page-subtitle">工具: ${data.tools.join(', ')} ｜ 狀態: ${getStatusLabel(data.status)} ｜ 虛胖過濾率: ${data.reachability.reductionRate}%</p>
      </div>

      <!-- 可達 / 不可達 對比區塊 -->
      <div class="reachability-chart">
        <div class="reach-block reachable">
          <div class="reach-value">${data.reachability.reachable}</div>
          <div class="reach-label">🔴 可達漏洞 (Reachable)</div>
          <div class="reach-desc">需要立即修補的真實威脅</div>
        </div>
        <div class="reach-block unreachable">
          <div class="reach-value">${data.reachability.unreachable}</div>
          <div class="reach-label">🟢 不可達漏洞 (Unreachable)</div>
          <div class="reach-desc">虛胖漏洞，程式未使用到</div>
        </div>
      </div>

      <!-- Strace 追蹤指標 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">系統呼叫數</div>
          <div class="stat-value">${data.straceResults.totalSyscalls.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">存取檔案數</div>
          <div class="stat-value">${data.straceResults.filesAccessed}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">網路呼叫</div>
          <div class="stat-value">${data.straceResults.networkCalls}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">追蹤耗時</div>
          <div class="stat-value" style="font-size:1.5rem">${data.straceResults.durationMs}ms</div>
        </div>
      </div>

      <!-- 可達漏洞清單 -->
      <div class="glass-card">
        <h3 class="card-title">🔴 可達漏洞清單 (${data.reachableVulns.length})</h3>
        <table class="data-table">
          <thead>
            <tr><th>CVE 編號</th><th>套件</th><th>嚴重性</th><th>可達原因</th></tr>
          </thead>
          <tbody>
            ${data.reachableVulns.map(v => `
              <tr>
                <td style="font-family:'JetBrains Mono',monospace; font-size:0.82rem">${v.cve}</td>
                <td><span class="package-tag">${v.package}</span></td>
                <td><span class="severity-badge ${v.severity}">${v.severity.toUpperCase()}</span></td>
                <td>${v.reason}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- 不可達（虛胖）漏洞清單 -->
      <div class="glass-card">
        <h3 class="card-title">🟢 不可達漏洞（虛胖）(${data.unreachableVulns.length} 筆範例)</h3>
        <table class="data-table">
          <thead>
            <tr><th>CVE 編號</th><th>套件</th><th>嚴重性</th><th>不可達原因</th></tr>
          </thead>
          <tbody>
            ${data.unreachableVulns.map(v => `
              <tr>
                <td style="font-family:'JetBrains Mono',monospace; font-size:0.82rem">${v.cve}</td>
                <td><span class="package-tag">${v.package}</span></td>
                <td><span class="severity-badge ${v.severity}">${v.severity.toUpperCase()}</span></td>
                <td>${v.reason}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Phase 4: 系統效能與可用性測試
 * 顯示 K6 負載指標、Lighthouse 分數圓環
 */
function renderPhase4(container) {
    const data = PHASE4_DATA; // 取得 Phase 4 模擬資料
    container.innerHTML = `
    <div class="page-enter">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h2 class="page-title"><span style="color:var(--phase-4)">⚡</span> Phase 4: 效能與可用性測試</h2>
        <p class="page-subtitle">工具: K6 + Lighthouse ｜ 狀態: ${getStatusLabel(data.status)}</p>
      </div>

      <!-- K6 負載測試結果 -->
      <div class="glass-card">
        <h3 class="card-title">🏋️ K6 負載測試</h3>
        <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.88rem">
          模擬 ${data.k6.virtualUsers} 位虛擬使用者，持續 ${data.k6.duration}
        </p>
        <div class="k6-metrics">
          <div class="k6-metric">
            <div class="k6-value">${data.k6.totalRequests.toLocaleString()}</div>
            <div class="k6-label">總請求數</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value">${data.k6.avgResponseTime}ms</div>
            <div class="k6-label">平均回應時間</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value">${data.k6.p95ResponseTime}ms</div>
            <div class="k6-label">P95 回應時間</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value">${data.k6.p99ResponseTime}ms</div>
            <div class="k6-label">P99 回應時間</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value">${data.k6.requestsPerSec}</div>
            <div class="k6-label">RPS (每秒請求)</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value" style="color:${data.k6.errorRate < 1 ? 'var(--status-pass)' : 'var(--status-fail)'}">${data.k6.errorRate}%</div>
            <div class="k6-label">錯誤率</div>
          </div>
        </div>
      </div>

      <!-- Lighthouse 分數 -->
      <div class="glass-card">
        <h3 class="card-title">🏠 Lighthouse 前端效能</h3>
        <div class="perf-grid">
          ${renderScoreRing('效能', data.lighthouse.performance, getScoreColor(data.lighthouse.performance))}
          ${renderScoreRing('無障礙', data.lighthouse.accessibility, getScoreColor(data.lighthouse.accessibility))}
          ${renderScoreRing('最佳實踐', data.lighthouse.bestPractices, getScoreColor(data.lighthouse.bestPractices))}
          ${renderScoreRing('SEO', data.lighthouse.seo, getScoreColor(data.lighthouse.seo))}
        </div>
      </div>

      <!-- Core Web Vitals -->
      <div class="glass-card">
        <h3 class="card-title">📈 Core Web Vitals</h3>
        <div class="k6-metrics">
          <div class="k6-metric">
            <div class="k6-value" style="color:var(--status-pass)">${data.lighthouse.fcp}</div>
            <div class="k6-label">FCP (首次內容繪製)</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value" style="color:var(--status-pass)">${data.lighthouse.lcp}</div>
            <div class="k6-label">LCP (最大內容繪製)</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value" style="color:var(--status-pass)">${data.lighthouse.cls}</div>
            <div class="k6-label">CLS (累計版面位移)</div>
          </div>
          <div class="k6-metric">
            <div class="k6-value" style="color:var(--status-pass)">${data.lighthouse.tbt}</div>
            <div class="k6-label">TBT (總阻塞時間)</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Phase 5: 品質門檻與決策
 * 顯示 Gate 狀態、規則列表、建議行動
 */
function renderPhase5(container) {
    const data = PHASE5_DATA; // 取得 Phase 5 模擬資料
    container.innerHTML = `
    <div class="page-enter">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h2 class="page-title"><span style="color:var(--phase-5)">🚪</span> Phase 5: Quality Gate</h2>
        <p class="page-subtitle">Jenkins 品質門檻決策 ｜ 狀態: ${getStatusLabel(data.status)}</p>
      </div>

      <!-- Quality Gate 狀態大圖 -->
      <div class="glass-card">
        <div class="quality-gate">
          <div class="gate-icon">${data.gateResult === 'passed' ? '✅' : '🚫'}</div>
          <div class="gate-status ${data.gateResult}">${data.gateResult === 'passed' ? 'PASSED - 允許部署' : 'FAILED - 部署已阻斷'}</div>
          <div class="gate-desc">${data.gateMessage}</div>
        </div>
      </div>

      <!-- 品質規則列表 -->
      <div class="glass-card">
        <h3 class="card-title">📋 品質門檻規則</h3>
        <table class="data-table">
          <thead>
            <tr><th>規則名稱</th><th>條件</th><th>實際值</th><th>門檻</th><th>結果</th></tr>
          </thead>
          <tbody>
            ${data.rules.map(rule => `
              <tr>
                <td style="font-weight:600">${rule.name}</td>
                <td style="color:var(--text-secondary)">${rule.condition}</td>
                <td style="font-family:'JetBrains Mono',monospace; font-weight:700; color:${rule.status === 'passed' ? 'var(--status-pass)' : 'var(--status-fail)'}">${rule.actual}</td>
                <td style="font-family:'JetBrains Mono',monospace">${rule.threshold}</td>
                <td><span class="stage-status ${rule.status}">${rule.status === 'passed' ? '✅ 通過' : '❌ 未通過'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- 建議行動 -->
      <div class="glass-card">
        <h3 class="card-title">💡 建議行動</h3>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${data.recommendations.map((rec, i) => `
            <div style="display:flex; align-items:flex-start; gap:12px; padding:12px 16px; background:rgba(30,41,59,0.3); border-radius:var(--radius-sm); border-left:3px solid var(--phase-5);">
              <span style="color:var(--phase-5); font-weight:700; flex-shrink:0;">${i + 1}.</span>
              <span style="color:var(--text-secondary); font-size:0.88rem;">${rec}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ========================================
// 共用渲染輔助函數
// ========================================

/**
 * 渲染嚴重性分佈長條圖
 * @param {object} dist - 嚴重性分佈物件 {critical, high, medium, low, info?}
 */
function renderSeverityBar(dist) {
    // 找出最大值作為長條比例基準
    const max = Math.max(dist.critical || 0, dist.high || 0, dist.medium || 0, dist.low || 0, dist.info || 0, 1);
    // 定義各嚴重性的色彩與標籤
    const levels = [
        { key: 'critical', label: 'Critical', color: 'var(--severity-critical)' },
        { key: 'high', label: 'High', color: 'var(--severity-high)' },
        { key: 'medium', label: 'Medium', color: 'var(--severity-medium)' },
        { key: 'low', label: 'Low', color: 'var(--severity-low)' },
    ];
    // 如果有 info 欄位就加入
    if (dist.info !== undefined) {
        levels.push({ key: 'info', label: 'Info', color: 'var(--severity-info)' });
    }

    let html = '<div class="bar-chart">';
    // 遍歷每個嚴重性等級
    levels.forEach(level => {
        const val = dist[level.key] || 0;                   // 取得數量
        const pct = max > 0 ? (val / max) * 100 : 0;        // 計算百分比
        html += `
      <div class="bar-item">
        <span class="bar-label">${level.label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%; background:${level.color};">${val > 0 ? val : ''}</div>
        </div>
        <span class="bar-value">${val}</span>
      </div>
    `;
    });
    html += '</div>';
    return html;
}

/**
 * 渲染 SAST 問題表格
 * @param {Array} issues - SAST 問題清單
 */
function renderIssueTable(issues) {
    return `
    <table class="data-table">
      <thead>
        <tr><th>ID</th><th>嚴重性</th><th>規則</th><th>檔案</th><th>行號</th><th>說明</th></tr>
      </thead>
      <tbody>
        ${issues.map(issue => `
          <tr>
            <td style="font-family:'JetBrains Mono',monospace; font-size:0.8rem">${issue.id}</td>
            <td><span class="severity-badge ${issue.severity}">${issue.severity.toUpperCase()}</span></td>
            <td style="font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--phase-5)">${issue.rule}</td>
            <td style="font-family:'JetBrains Mono',monospace; font-size:0.8rem">${issue.file}</td>
            <td style="font-family:'JetBrains Mono',monospace">${issue.line}</td>
            <td>${issue.message}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * 渲染 Lighthouse 分數圓環
 * @param {string} label - 標籤名稱
 * @param {number} score - 分數 (0-100)
 * @param {string} color - 色彩值
 */
function renderScoreRing(label, score, color) {
    return `
    <div class="perf-score">
      <div class="score-ring" style="--score:${score}; --ring-color:${color}; color:${color}">
        ${score}
      </div>
      <div class="score-label">${label}</div>
    </div>
  `;
}

/**
 * 根據分數決定色彩
 * @param {number} score - 分數 (0-100)
 * @returns {string} CSS 色彩變數
 */
function getScoreColor(score) {
    if (score >= 90) return 'var(--status-pass)';    // 優秀：綠色
    if (score >= 70) return 'var(--status-warning)';  // 良好：橘色
    return 'var(--status-fail)';                      // 差：紅色
}
