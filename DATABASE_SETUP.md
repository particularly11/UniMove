# UniMove 数据库连接指南

## 🚀 快速开始

### 方案一：使用 Docker（推荐）

1. **启动 MongoDB**

```bash
docker-compose up -d mongodb
```

2. **启动 MongoDB + Web UI**

```bash
docker-compose up -d
```

3. **查看数据库 Web UI**
   打开浏览器访问：http://localhost:8081

4. **停止服务**

```bash
docker-compose down
```

### 方案二：本地 MongoDB

1. **安装 MongoDB Community Edition**

   - 访问：https://www.mongodb.com/try/download/community
   - 下载 Windows 版本并安装

2. **启动 MongoDB 服务**

```powershell
# 通过 Windows 服务
net start MongoDB

# 或手动启动
mongod --dbpath "C:\data\db"
```

### 方案三：MongoDB Atlas（云数据库）

1. **注册 MongoDB Atlas**

   - 访问：https://www.mongodb.com/atlas
   - 创建免费账户

2. **创建集群并获取连接字符串**

3. **更新 .env 文件**

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/unimove?retryWrites=true&w=majority
```

## 🔧 配置说明

### 环境变量（backend/.env）

```env
# 选择以下之一：

# 本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/unimove

# Docker MongoDB
MONGODB_URI=mongodb://unimove_user:unimove_pass@localhost:27017/unimove

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/unimove?retryWrites=true&w=majority
```

## 🧪 测试连接

启动后端服务：

```bash
cd backend
npm run dev
```

如果看到以下信息，说明连接成功：

```
🎉 MongoDB connected successfully
📊 Database: unimove
🌐 Host: localhost:27017
```

## 🛠️ 常见问题

### 连接失败

1. 检查 MongoDB 服务是否启动
2. 检查端口 27017 是否被占用
3. 检查防火墙设置
4. 验证连接字符串格式

### Docker 问题

1. 确保 Docker Desktop 已启动
2. 检查端口冲突
3. 查看容器日志：`docker-compose logs mongodb`

### 权限问题

1. 确保数据目录有写权限
2. 检查用户名密码是否正确
