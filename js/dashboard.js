// ========================================
// DevSecOps Pipeline Dashboard - 主頁面渲染
// 負責 Dashboard 概覽頁面的所有渲染邏輯
// ========================================

/**
 * 渲染主 Dashboard 頁面
 * 包含統計卡片、Pipeline 流程圖、執行歷史
 * @param {HTMLElement} container - 主內容容器
 */
function renderDashboard(container) {
    // 組合 Dashboard 頁面 HTML
    container.innerHTML = `
    <div class="page-enter">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h2 class="page-title">📊 Pipeline 總覽</h2>
        <p class="page-subtitle">建置編號: ${PIPELINE_STATUS.id} ｜ 分支: ${PIPELINE_STATUS.branch} ｜ 語言: ${PIPELINE_STATUS.language}</p>
      </div>

      <!-- 統計卡片列 -->
      ${renderStatsGrid()}

      <!-- Pipeline 流程視覺化 -->
      <div class="glass-card">
        <h3 class="card-title">🔗 Pipeline 執行流程</h3>
        ${renderPipelineFlow()}
      </div>

      <!-- 最近執行歷史 -->
      <div class="glass-card">
        <h3 class="card-title">📋 最近執行歷史</h3>
        ${renderTimeline()}
      </div>
    </div>
  `;

    // 綁定 Pipeline 卡片點擊事件
    container.querySelectorAll('.pipeline-stage').forEach(stage => {
        stage.addEventListener('click', () => {
            const phase = stage.dataset.phase; // 取得階段編號
            navigateTo(`phase${phase}`);       // 導航到該階段頁面
        });
    });
}

/**
 * 渲染統計卡片列
 * 顯示 4 個關鍵指標
 */
function renderStatsGrid() {
    // 計算關鍵數據
    const totalVulns = PHASE2_DATA.vulnerabilities.total;         // 總漏洞數
    const reachableVulns = PHASE3_DATA.reachability.reachable;     // 可達漏洞數
    const reductionRate = PHASE3_DATA.reachability.reductionRate;  // 過濾率
    const qualityScore = PHASE1_DATA.qualityScore;                 // 品質分數

    return `
    <div class="stats-grid">
      <!-- 靜態漏洞數 -->
      <div class="stat-card">
        <div class="stat-label">靜態漏洞 (Phase 2)</div>
        <div class="stat-value">${totalVulns}</div>
        <div class="stat-change negative">⚠ 來自 ${PHASE2_DATA.sbom.totalPackages} 個套件</div>
      </div>
      <!-- 可達漏洞數 -->
      <div class="stat-card">
        <div class="stat-label">可達漏洞 (Phase 3)</div>
        <div class="stat-value" style="color: var(--severity-high);">${reachableVulns}</div>
        <div class="stat-change positive">✅ 過濾 ${reductionRate}% 虛胖</div>
      </div>
      <!-- 品質分數 -->
      <div class="stat-card">
        <div class="stat-label">品質分數 (Phase 1)</div>
        <div class="stat-value">${qualityScore}</div>
        <div class="stat-change positive">↑ 較上次 +3</div>
      </div>
      <!-- Quality Gate -->
      <div class="stat-card">
        <div class="stat-label">Quality Gate</div>
        <div class="stat-value" style="color: ${PHASE5_DATA.gateResult === 'passed' ? 'var(--status-pass)' : 'var(--status-fail)'};">
          ${PHASE5_DATA.gateResult === 'passed' ? 'PASS' : 'FAIL'}
        </div>
        <div class="stat-change ${PHASE5_DATA.gateResult === 'passed' ? 'positive' : 'negative'}">
          ${PHASE5_DATA.gateResult === 'passed' ? '✅ 允許部署' : '🚫 部署已阻斷'}
        </div>
      </div>
    </div>
  `;
}

/**
 * 渲染 Pipeline 流程圖
 * 5 個階段卡片 + 箭頭連接
 */
function renderPipelineFlow() {
    // 定義 5 個階段的資料
    const phases = [
        { phase: 1, icon: '🛡️', name: 'SAST 源碼檢測', desc: 'SonarQube', status: PHASE1_DATA.status },
        { phase: 2, icon: '📦', name: 'SCA / SBOM 掃描', desc: 'Syft + Trivy', status: PHASE2_DATA.status },
        { phase: 3, icon: '🔬', name: '動態可達性分析', desc: 'Strace + Coverage', status: PHASE3_DATA.status },
        { phase: 4, icon: '⚡', name: '效能與可用性測試', desc: 'K6 + Lighthouse', status: PHASE4_DATA.status },
        { phase: 5, icon: '🚪', name: 'Quality Gate', desc: 'Jenkins 品質門檻', status: PHASE5_DATA.gateResult },
    ];

    // 組合各階段卡片與箭頭
    let html = '<div class="pipeline-flow">';
    phases.forEach((p, i) => {
        // 產生階段卡片
        html += `
      <div class="pipeline-stage" data-phase="${p.phase}">
        <div class="stage-icon">${p.icon}</div>
        <div class="stage-name">Phase ${p.phase}</div>
        <div class="stage-desc">${p.name}</div>
        <div class="stage-status ${p.status}">${getStatusLabel(p.status)}</div>
      </div>
    `;
        // 在階段間加入箭頭（最後一個不加）
        if (i < phases.length - 1) {
            html += '<div class="pipeline-arrow">→</div>';
        }
    });
    html += '</div>';
    return html;
}

/**
 * 渲染執行歷史時間軸
 */
function renderTimeline() {
    let html = '<div class="timeline">';
    // 遍歷每筆歷史記錄
    PIPELINE_HISTORY.forEach(item => {
        const statusClass = item.status === 'passed' ? 'positive' : 'negative'; // 狀態色彩
        const gateIcon = item.gate === 'passed' ? '✅' : '🚫';                  // 門檻圖標
        html += `
      <div class="timeline-item">
        <div class="timeline-header">
          <span class="timeline-title">${item.id}</span>
          <span class="timeline-time">${item.time}</span>
        </div>
        <div class="timeline-body">
          分支: <strong>${item.branch}</strong> ｜
          Commit: <code>${item.commit}</code> ｜
          耗時: ${item.duration} ｜
          Gate: ${gateIcon}
          <span class="stat-change ${statusClass}" style="display:inline-flex;">${item.status === 'passed' ? '✅ 通過' : '❌ 失敗'}</span>
        </div>
      </div>
    `;
    });
    html += '</div>';
    return html;
}

/**
 * 取得狀態的中文標籤
 * @param {string} status - 狀態值
 * @returns {string} 中文狀態顯示
 */
function getStatusLabel(status) {
    const labels = {
        passed: '✅ 通過',
        failed: '❌ 失敗',
        running: '⏳ 執行中',
        waiting: '⏸ 等待中',
    };
    return labels[status] || status; // 找不到就回傳原值
}
