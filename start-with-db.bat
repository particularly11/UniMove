@echo off
echo.
echo ======================================
echo UniMove 数据库连接测试
echo ======================================
echo.

echo 1. 检查 Docker 是否运行...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Docker 已安装
    echo.
    echo 2. 启动 MongoDB 容器...
    docker-compose up -d mongodb
    if %errorlevel% equ 0 (
        echo ✓ MongoDB 容器启动成功
        echo.
        echo 3. 等待 MongoDB 初始化...
        timeout /t 10 /nobreak > nul
        echo.
        echo 4. 启动后端服务...
        cd backend
        npm run dev
    ) else (
        echo ❌ MongoDB 容器启动失败
        echo 请检查 Docker 是否正常运行
        pause
    )
) else (
    echo ❌ Docker 未安装或未运行
    echo.
    echo 请选择以下选项：
    echo 1. 安装 Docker Desktop
    echo 2. 使用本地 MongoDB
    echo 3. 使用 MongoDB Atlas
    echo.
    echo 详细说明请查看 DATABASE_SETUP.md 文件
    pause
)
