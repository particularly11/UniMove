import { Router } from 'express';
import mongoose from 'mongoose';
import userRoutes from './users';
import activityRoutes from './activities';
import orderRoutes from './orders';
import commentRoutes from './comments';
import { importActivities } from '../utils/importData';

const router = Router();

// API 路由
router.use('/users', userRoutes);
router.use('/activities', activityRoutes);
router.use('/orders', orderRoutes);
router.use('/comments', commentRoutes);

// 健康检查
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    success: true,
    message: 'UniMove API is running',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbStatus as keyof typeof dbStatusMap],
      name: mongoose.connection.name || 'unknown',
      host: mongoose.connection.host || 'unknown',
      port: mongoose.connection.port || 'unknown'
    },
    version: '1.0.0'
  });
});

// 数据库连接测试
router.get('/db-test', async (req, res) => {
  try {
    // 检查连接状态
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: '数据库未连接',
        status: 'disconnected'
      });
    }

    // 尝试执行一个简单的数据库操作
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('数据库实例不可用');
    }

    await db.admin().ping();
    const collections = await db.listCollections().toArray();
    
    res.json({
      success: true,
      message: '数据库连接正常',
      database: {
        status: 'connected',
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        collections: collections.map(col => col.name)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 数据导入端点（仅开发环境）
router.post('/import-sample-data', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        success: false,
        message: '数据导入功能仅在开发环境可用'
      });
    }

    await importActivities();
    
    res.json({
      success: true,
      message: '示例数据导入成功！',
      data: {
        message: '已导入8个示例活动'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '数据导入失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router;
