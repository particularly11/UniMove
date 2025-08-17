@echo off
echo 启动 UniMove 项目...
echo.
echo 请确保 MongoDB 正在运行 (端口 27017)
echo 或使用命令: docker run -d --name mongodb -p 27017:27017 mongo:7.0
echo.
cd backend
npm install --production
start /b node dist/index.js
cd ..
echo 后端已启动 (端口 3001)
echo 前端请使用 Web 服务器提供 frontend/dist 目录
echo 建议使用: npx serve frontend/dist -p 80
pause
