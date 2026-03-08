#!/bin/bash

# ==========================================
# DevSecOps 動態分析自動化腳本 (Valgrind + Graphviz)
# 目標專案：vit-pytorch
# ==========================================

# 1. 定義固定的輸出檔名，避免 PID 變動導致 Jenkins 抓不到檔案
TRACE_FILE="callgrind.out.trace"
OUTPUT_IMAGE="reachability_graph.png"

echo "🚀 [Phase 1] 啟動 Valgrind 動態二進位插樁監控 (目標：run_test.py)..."

# 使用 --callgrind-out-file 強制指定輸出檔名
# 執行你們的測試主程式 run_test.py
valgrind --tool=callgrind --callgrind-out-file=$TRACE_FILE python3 run_test.py

echo "✅ [Phase 1] 軌跡記錄完成！"
echo "------------------------------------------"
echo "🎨 [Phase 2] 開始讀取指令軌跡，並生成視覺化函數呼叫圖..."

# 2. 確保讀取剛剛固定的檔名，並用管道 (|) 一口氣交給 dot 畫出 png
~/.local/bin/gprof2dot -f callgrind $TRACE_FILE | dot -Tpng -o $OUTPUT_IMAGE

echo "✅ [Phase 2] 繪圖完成！"
echo "🎉 動態 SBOM 可達性分析圖已成功生成：$OUTPUT_IMAGE"