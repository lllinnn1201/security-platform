// ========================================
// DevSecOps Pipeline Dashboard - SPA 路由管理
// 負責頁面切換、導航列互動、初始化
// ========================================

// --- 當前頁面狀態 ---
let currentPage = 'dashboard'; // 預設顯示 Dashboard 頁面

/**
 * 初始化應用程式
 * 在 DOM 載入完成後執行
 */
function initApp() {
    // 根據 URL Hash 決定初始頁面
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    navigateTo(hash); // 導航到初始頁面
}

/**
 * 導航到指定頁面
 * @param {string} page - 頁面名稱（dashboard / phase1~5）
 */
function navigateTo(page) {
    currentPage = page;                              // 更新當前頁面
    window.location.hash = page;                     // 更新 URL Hash
    const container = document.getElementById('main-content'); // 取得主內容容器

    // 根據頁面名稱渲染對應內容
    switch (page) {
        case 'dashboard':
            renderDashboard(container);                  // 渲染 Dashboard
            break;
        case 'phase1':
            renderPhase1(container);                     // 渲染 Phase 1
            break;
        case 'phase2':
            renderPhase2(container);                     // 渲染 Phase 2
            break;
        case 'phase3':
            renderPhase3(container);                     // 渲染 Phase 3
            break;
        case 'phase4':
            renderPhase4(container);                     // 渲染 Phase 4
            break;
        case 'phase5':
            renderPhase5(container);                     // 渲染 Phase 5
            break;
        default:
            renderDashboard(container);                  // 未知頁面則回到 Dashboard
            break;
    }

    updateActiveNav(page);                           // 更新側邊欄選中狀態
    window.scrollTo(0, 0);                           // 捲動到頁面頂端
}

/**
 * 更新側邊欄導航的選中狀態
 * @param {string} page - 當前頁面名稱
 */
function updateActiveNav(page) {
    // 移除所有 nav-link 的 active 樣式
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    // 為當前頁面的 nav-link 加上 active 樣式
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * 綁定側邊欄導航點擊事件
 */
function bindNavEvents() {
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();                          // 阻止預設行為
            const page = link.dataset.page;              // 取得目標頁面
            navigateTo(page);                            // 導航到該頁面
        });
    });
}

/**
 * 監聽瀏覽器前進/後退按鈕
 */
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    if (hash !== currentPage) {
        navigateTo(hash);                              // Hash 改變時重新導航
    }
});

/**
 * DOM 載入完成後初始化
 */
document.addEventListener('DOMContentLoaded', () => {
    bindNavEvents();                                 // 綁定導航事件
    initApp();                                       // 初始化應用
});
