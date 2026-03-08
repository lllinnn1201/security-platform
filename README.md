# SecureFlow — 源碼安全分析平台

> 整合 SonarQube、OSV-Scanner、Strace、Valgrind、K6、Lighthouse 的 DevSecOps 全自動檢測儀表板

## 專案架構

```
frontend/                    # Next.js 前端應用
├── app/                     # App Router 頁面
│   ├── layout.tsx           # 根佈局（Sidebar + Topbar）
│   ├── page.tsx             # Dashboard 首頁（6 工具狀態卡片）
│   ├── upload/page.tsx      # 程式碼上傳頁面
│   ├── static-analysis/     # 靜態分析（SonarQube + OSV-Scanner）
│   │   └── page.tsx
│   ├── dynamic-analysis/    # 動態分析（Strace + Valgrind）
│   │   └── page.tsx
│   ├── performance/         # 效能檢測（K6 + Lighthouse）
│   │   └── page.tsx
│   ├── pipeline/page.tsx    # Pipeline 狀態（7 階段流水線）
│   └── globals.css          # 全域設計系統
├── components/              # 共用元件
│   ├── ClientLayout.tsx     # 客戶端佈局
│   ├── Sidebar.tsx          # 側邊導覽列
│   └── Topbar.tsx           # 頂部列
└── data/                    # 資料層
    └── mockData.ts          # 資料層（型別定義 + 待接 API）
```

## 技術選型

| 項目 | 技術 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 語言 | TypeScript |
| 樣式 | Vanilla CSS (亮色主題) |
| 字型 | Inter + JetBrains Mono |

## 整合工具

| 分類 | 工具 | 用途 |
|------|------|------|
| 靜態分析 | SonarQube | SAST 靜態程式碼掃描 |
| 靜態分析 | OSV-Scanner | SCA 依賴套件漏洞掃描 |
| 動態分析 | Strace | 系統呼叫追蹤 |
| 動態分析 | Valgrind | 記憶體洩漏偵測 |
| 效能檢測 | K6 | 負載測試 |
| 效能檢測 | Lighthouse | 效能 / SEO / 無障礙審計 |

## 頁面說明

| 頁面 | 路由 | 功能 |
|------|------|------|
| 儀表板 | `/` | 6 個工具即時狀態卡片、最近掃描、風險分佈 |
| 程式碼上傳 | `/upload` | 拖拉上傳、Git URL、分析設定（工具分類） |
| 靜態分析 | `/static-analysis` | SonarQube（漏洞 + Code Smell）/ OSV-Scanner（SBOM）雙分頁 |
| 動態分析 | `/dynamic-analysis` | Strace（系統呼叫追蹤）/ Valgrind（記憶體分析）雙分頁 |
| 效能檢測 | `/performance` | K6（負載測試指標）/ Lighthouse（4 大分數 + 建議）雙分頁 |
| Pipeline | `/pipeline` | Jenkins 7 階段流水線 + Quality Gate 阻擋條件 |

## Jenkins Pipeline 階段

```
Checkout → SonarQube → OSV-Scanner → Strace → Valgrind → K6 → Lighthouse → Quality Gate
```

## Quality Gate 阻擋條件

| 條件 | 門檻 |
|------|------|
| Critical 漏洞數 | = 0 |
| High 漏洞數 | ≤ 3 |
| Lighthouse Performance | ≥ 60 |
| 記憶體洩漏 | = 0 |
| K6 錯誤率 | < 1% |

## 啟動方式

```bash
cd frontend
npm install
npm run dev
```

瀏覽器開啟 http://localhost:3000
