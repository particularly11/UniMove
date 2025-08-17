@echo off
chcp 65001 > nul 2>&1
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

:menu
echo Select operation:
echo.
echo 1. Start all services
echo 2. Stop all services  
echo 3. Restart all services
echo 4. View logs
echo 5. Rebuild images
echo 6. Clean Docker resources
echo 7. Exit
echo.
set /p choice=Enter option (1-7): 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto build
if "%choice%"=="6" goto clean
if "%choice%"=="7" goto end
goto menu

:start
echo [INFO] Starting UniMove services...
docker-compose up -d
echo.
echo [SUCCESS] Services started!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:3001/api
echo Database Admin: http://localhost:8081
goto end

:stop
echo [INFO] Stopping UniMove services...
docker-compose down
echo [SUCCESS] Services stopped!
goto end

:restart
echo [INFO] Restarting UniMove services...
docker-compose down
echo [INFO] Waiting 3 seconds...
timeout /t 3 /nobreak > nul
docker-compose up -d
echo [SUCCESS] Services restarted!
goto end

:logs
echo [INFO] Viewing service logs...
echo Press Ctrl+C to exit log view
docker-compose logs -f
goto end

:build
echo [INFO] Rebuilding images...
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo [SUCCESS] Build completed!
goto end

:clean
echo [INFO] Cleaning Docker resources...
docker-compose down -v
docker system prune -f
echo [SUCCESS] Cleanup completed!
goto end

:end
echo.
pause
