# SecureFlow — 源碼安全分析平台

> 整合 SAST、SBOM、漏洞掃描的 DevSecOps 源碼安全分析儀表板

## 專案架構

```
frontend/                    # Next.js 前端應用
├── app/                     # App Router 頁面
│   ├── layout.tsx           # 根佈局（Sidebar + Topbar）
│   ├── page.tsx             # Dashboard 首頁
│   ├── upload/page.tsx      # 程式碼上傳頁面
│   ├── reports/page.tsx     # 分析報告頁面
│   ├── codeflow/page.tsx    # Code Flow 視覺化頁面
│   ├── sbom/page.tsx        # SBOM 檢視器頁面
│   ├── pipeline/page.tsx    # Pipeline 狀態頁面
│   └── globals.css          # 全域設計系統
├── components/              # 共用元件
│   ├── Sidebar.tsx          # 側邊導覽列
│   └── Topbar.tsx           # 頂部列
└── data/                    # 資料層
    └── mockData.ts          # Mock 資料（對齊未來 API 格式）
```

## 技術選型

| 項目 | 技術 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 語言 | TypeScript |
| 樣式 | Vanilla CSS (暗色主題) |
| 字型 | Inter + JetBrains Mono |

## 頁面說明

| 頁面 | 路由 | 功能 |
|------|------|------|
| 儀表板 | `/` | 統計卡片、最近掃描、風險分佈 |
| 程式碼上傳 | `/upload` | 拖拉上傳、Git URL、分析設定 |
| 分析報告 | `/reports` | 漏洞清單、Code Smell |
| Code Flow | `/codeflow` | 函式呼叫樹、污染路徑追蹤 |
| SBOM 檢視器 | `/sbom` | 依賴套件表、搜尋篩選 |
| Pipeline | `/pipeline` | Jenkins Job 狀態、階段進度 |

## 啟動方式

```bash
cd frontend
npm install
npm run dev
```

瀏覽器開啟 http://localhost:3000
