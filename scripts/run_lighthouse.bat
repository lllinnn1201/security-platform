@echo off
echo ======================================
echo Running Lighthouse Analysis
echo ======================================

cd /d %~dp0\..

if not exist output mkdir output

lighthouse http://127.0.0.1:8000/ ^
 --output html ^
 --output json ^
 --output-path .\output\lighthouse-report ^
 --chrome-flags="--headless --disable-gpu --no-sandbox"

echo Lighthouse analysis finished