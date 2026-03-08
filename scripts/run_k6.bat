@echo off
echo ======================================
echo Running K6 Load Test
echo ======================================

cd /d %~dp0\..

if not exist output mkdir output

k6 run --summary-export=output\k6-summary.json k6-upload-test.js

echo K6 load test finished