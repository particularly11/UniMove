# UniMove Docker 快速指南

## 🚀 快速启动

### 方法一：使用管理脚本（推荐）

```bash
# Windows
.\docker-manage.bat start

# 或者直接双击 docker-manage.bat 文件，选择选项 1
```

### 方法二：使用 Docker Compose 命令

```bash
# 启动所有服务
docker-compose up -d

# 重启所有服务
docker-compose restart

# 停止所有服务
docker-compose down
```

## 📋 服务地址

启动后可以访问以下地址：

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3001/api
- **数据库管理**: http://localhost:8081
- **API 健康检查**: http://localhost:3001/api/health

## 🔧 常用命令

### 查看服务状态

```bash
docker-compose ps
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 重新构建服务

```bash
# 重新构建并启动
docker-compose up -d --build

# 仅重新构建镜像
docker-compose build --no-cache
```

### 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh
```

## 🔄 热重载

- **后端**: 支持热重载，修改代码后自动重启
- **前端**: 支持热重载，修改代码后自动更新
- **数据**: 数据库数据持久化存储

## 🛠️ 故障排除

### 端口冲突

如果遇到端口占用问题，可以修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "3002:3001" # 将后端映射到3002端口
  - "5174:5173" # 将前端映射到5174端口
```

### 重置环境

```bash
# 停止并删除所有容器、网络、卷
docker-compose down -v

# 清理 Docker 系统
docker system prune -f

# 重新启动
docker-compose up -d --build
```

## 💡 优势

使用 Docker 的优势：

- ✅ **环境一致性**: 开发、测试、生产环境完全一致
- ✅ **快速部署**: 一键启动所有服务
- ✅ **依赖隔离**: 不影响本地环境
- ✅ **资源管理**: 容易管理和监控资源使用
- ✅ **团队协作**: 团队成员环境完全一致
