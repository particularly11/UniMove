# 使用官方 Node.js 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（包括开发依赖，用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建 TypeScript 项目
RUN npm run build

# 清理开发依赖，只保留生产依赖
RUN npm ci --only=production && npm cache clean --force

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production

# 启动命令（使用构建后的 JS 文件）
CMD ["npm", "start"]
