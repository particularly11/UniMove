@echo off
chcp 65001 > nul
echo.
echo ===================================
echo     UniMove 项目打包脚本
echo ===================================
echo.

echo [1/5] 清理之前的构建产物...
if exist "backend\dist" rd /s /q "backend\dist"
if exist "frontend\dist" rd /s /q "frontend\dist"
echo ✓ 清理完成

echo.
echo [2/5] 构建后端项目...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 后端构建失败
    pause
    exit /b 1
)
echo ✓ 后端构建完成
cd ..

echo.
echo [3/5] 构建前端项目...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)
echo ✓ 前端构建完成
cd ..

echo.
echo [4/5] 构建 Docker 镜像...
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo ❌ Docker 镜像构建失败
    pause
    exit /b 1
)
echo ✓ Docker 镜像构建完成

echo.
echo [5/5] 生成部署包...
if not exist "deploy" mkdir deploy
if exist "deploy\unimove-deploy.zip" del "deploy\unimove-deploy.zip"

echo 正在打包部署文件...
powershell -Command "Compress-Archive -Path 'docker-compose.yml','backend\dist','frontend\dist','backend\package.json','backend\.env.production','init-mongo.js' -DestinationPath 'deploy\unimove-deploy.zip'"

echo.
echo ===================================
echo        🎉 打包完成！
echo ===================================
echo.
echo 📦 构建产物位置：
echo   - 后端：backend\dist\
echo   - 前端：frontend\dist\
echo   - Docker 镜像：已构建完成
echo   - 部署包：deploy\unimove-deploy.zip
echo.
echo 🚀 部署方式：
echo   1. 直接运行：docker-compose up -d
echo   2. 部署包：将 unimove-deploy.zip 上传到服务器解压后运行
echo.
echo ✨ 访问地址：
echo   - 前端：http://localhost
echo   - 后端 API：http://localhost:3001
echo   - 数据库管理：http://localhost:8081
echo.
pause
