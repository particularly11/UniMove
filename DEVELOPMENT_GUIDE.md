# UniMove 开发指南

## 🚀 快速开始

### 环境准备
确保您的开发环境已安装：
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0
- Git

### 项目克隆和安装

```bash
# 克隆项目
git clone <your-repository-url>
cd UniMove

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 环境配置

#### 后端环境变量
创建 `backend/.env` 文件：
```env
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/unimove
DB_NAME=unimove

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-here

# 服务器配置
PORT=3000
NODE_ENV=development

# CORS 配置
CORS_ORIGIN=http://localhost:5173
```

#### 前端环境变量
创建 `frontend/.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 启动开发服务器

#### 启动后端
```bash
cd backend
npm run dev
```
访问: http://localhost:3000

#### 启动前端
```bash
cd frontend
npm run dev
```
访问: http://localhost:5173

## 🏗️ 项目架构

### 目录结构
```
UniMove/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── components/      # 可复用组件
│   │   ├── pages/           # 页面组件
│   │   ├── store/           # Redux 状态管理
│   │   └── App.tsx          # 根组件
│   ├── public/              # 静态资源
│   └── package.json
├── backend/                  # Node.js 后端
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── middleware/      # 中间件
│   │   ├── utils/           # 工具函数
│   │   └── index.ts         # 应用入口
│   └── package.json
├── .github/                  # GitHub 配置
│   ├── workflows/           # GitHub Actions
│   └── copilot-instructions.md
└── README.md
```

## 📝 开发规范

### 命名规范
- **组件**: PascalCase (`ActivityCard.tsx`)
- **文件**: PascalCase (组件) 或 camelCase (工具函数)
- **变量和函数**: camelCase (`getUserProfile`)
- **常量**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **类型接口**: PascalCase，以 I 开头 (`IUser`)

### 代码风格
- 使用 TypeScript 确保类型安全
- 遵循 ESLint 和 Prettier 配置
- 函数式编程风格，优先使用 React Hooks
- 添加适当的注释和 JSDoc

### Git 提交规范
```bash
# 功能开发
git commit -m "feat: 添加用户登录功能"

# Bug 修复
git commit -m "fix: 修复活动列表分页问题"

# 文档更新
git commit -m "docs: 更新 README 文档"

# 样式调整
git commit -m "style: 优化活动卡片样式"

# 重构代码
git commit -m "refactor: 重构用户认证逻辑"
```

## 🔧 开发工具配置

### VS Code 插件推荐
- **ES7+ React/Redux/React-Native snippets**: React 代码片段
- **TypeScript Importer**: 自动导入类型
- **Prettier**: 代码格式化
- **ESLint**: 代码质量检查
- **Auto Rename Tag**: 自动重命名标签
- **Bracket Pair Colorizer**: 括号颜色匹配

### VS Code 设置
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🧪 测试指南

### 运行测试
```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

### 测试编写原则
- 为关键业务逻辑编写单元测试
- API 接口编写集成测试
- 组件编写快照测试和交互测试

## 📦 构建和部署

### 本地构建
```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd backend
npm run build
```

### 生产环境部署
1. **环境变量配置**: 设置生产环境的环境变量
2. **数据库准备**: 确保 MongoDB 服务可用
3. **应用启动**: 使用 PM2 或 Docker 部署应用
4. **反向代理**: 配置 Nginx 作为反向代理

### Docker 部署
```bash
# 构建镜像
docker build -t unimove-frontend ./frontend
docker build -t unimove-backend ./backend

# 运行容器
docker-compose up -d
```

## 🔍 调试技巧

### 前端调试
- 使用 React DevTools 检查组件状态
- 使用 Redux DevTools 调试状态管理
- 浏览器开发者工具查看网络请求
- console.log 和断点调试

### 后端调试
- 使用 VS Code 的 Node.js 调试器
- 查看终端日志输出
- 使用 Postman 测试 API 接口
- MongoDB Compass 查看数据库数据

## 📚 学习资源

### 文档链接
- [React 官方文档](https://react.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Ant Design 组件库](https://ant.design/)
- [Express.js 指南](https://expressjs.com/)
- [MongoDB 文档](https://docs.mongodb.com/)

### 推荐教程
- React Hooks 最佳实践
- TypeScript 进阶用法
- Redux Toolkit 状态管理
- Node.js 性能优化
- MongoDB 数据建模

## 🐛 常见问题

### Q: 前端无法连接后端 API
**A**: 检查后端是否正常启动，确认端口配置和 CORS 设置

### Q: MongoDB 连接失败
**A**: 确认 MongoDB 服务已启动，检查连接字符串配置

### Q: TypeScript 类型错误
**A**: 检查类型定义，确保导入正确的类型接口

### Q: 样式不生效
**A**: 确认 CSS 文件已正确导入，检查类名拼写

### Q: 路由跳转失效
**A**: 检查路由配置，确认 React Router 设置正确

## 🤝 贡献指南

### 如何贡献
1. Fork 项目到您的 GitHub 账户
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码审查
- 确保代码符合项目规范
- 添加必要的测试用例
- 更新相关文档
- 通过 CI/CD 检查

---

欢迎参与 UniMove 项目的开发！如果您有任何问题或建议，请随时联系我们。
