@echo off
REM 设置UTF-8编码
chcp 65001 > nul 2>&1

REM 设置窗口标题
title UniMove Docker Manager

echo ========================================
echo UniMove Docker Management Script
echo ========================================
echo.

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="build" goto build
if "%1"=="clean" goto clean
if "%1"=="status" goto status

:menu
echo Please select an operation:
echo.
echo 1. Start all services (start)
echo 2. Stop all services (stop)
echo 3. Restart all services (restart)
echo 4. View logs (logs)
echo 5. Rebuild images (build)
echo 6. Clean Docker resources (clean)
echo 7. Check status (status)
echo 8. Exit
echo.
set /p choice=Please enter option (1-8): 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto build
if "%choice%"=="6" goto clean
if "%choice%"=="7" goto status
if "%choice%"=="8" goto end
echo Invalid option, please try again.
echo.
goto menu

:start
echo [START] Starting UniMove services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services!
    goto end
)
echo.
echo [SUCCESS] Services started successfully!
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend API: http://localhost:3001/api
echo [INFO] Database Admin: http://localhost:8081
goto end

:stop
echo [STOP] Stopping UniMove services...
docker-compose down
if %errorlevel% neq 0 (
    echo [ERROR] Failed to stop services!
    goto end
)
echo [SUCCESS] Services stopped successfully!
goto end

:restart
echo [RESTART] Restarting UniMove services...
docker-compose down
if %errorlevel% neq 0 (
    echo [ERROR] Failed to stop services!
    goto end
)
echo [WAIT] Waiting 3 seconds...
timeout /t 3 /nobreak > nul
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services!
    goto end
)
echo [SUCCESS] Services restarted successfully!
goto end

:logs
echo [LOGS] Viewing service logs...
echo [INFO] Press Ctrl+C to exit log view
docker-compose logs -f
goto end

:build
echo [BUILD] Rebuilding images...
docker-compose down
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build images!
    goto end
)
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services after build!
    goto end
)
echo [SUCCESS] Build completed successfully!
goto end

:clean
echo [CLEAN] Cleaning Docker resources...
docker-compose down -v
docker system prune -f
if %errorlevel% neq 0 (
    echo [ERROR] Failed to clean resources!
    goto end
)
echo [SUCCESS] Cleanup completed successfully!
goto end

:status
echo [STATUS] Checking service status...
echo.
echo Docker Compose Services:
docker-compose ps
echo.
echo Docker Images:
docker images | findstr unimove
echo.
echo Docker Containers:
docker ps -a | findstr unimove
goto end

:end
echo.
echo Press any key to exit...
pause > nul
