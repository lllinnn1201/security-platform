@echo off
echo ======================================
echo Running OSV Scanner
echo ======================================

REM 切到 repo root
cd /d %~dp0\..

REM 建立 output 資料夾
if not exist output mkdir output

REM 執行 OSV Scanner
osv-scanner scan source . --format json --output output\osv-results.json

echo OSV scan finished