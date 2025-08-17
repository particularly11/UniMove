import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Activity } from '../models/Activity';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Comment } from '../models/Comment';

const __dirname = process.cwd();

// 数据库连接
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/unimove?authSource=admin';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB 连接成功');
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    process.exit(1);
  }
};

// 导出数据为 JSON 文件
const exportData = async () => {
  try {
    console.log('📊 正在导出数据...');
    
    // 获取所有数据
    const activities = await Activity.find({}).lean();
    const users = await User.find({}).select('-password').lean(); // 不导出密码
    const orders = await Order.find({}).lean();
    const comments = await Comment.find({}).lean();
    
    // 创建数据对象
    const exportData = {
      activities,
      users,
      orders,
      comments,
      exportTime: new Date().toISOString(),
      totalRecords: {
        activities: activities.length,
        users: users.length,
        orders: orders.length,
        comments: comments.length
      }
    };
    
    // 确保输出目录存在
    const outputDir = path.join(__dirname, '../../deploy');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入 JSON 文件
    const outputFile = path.join(outputDir, 'unimove-data.json');
    fs.writeFileSync(outputFile, JSON.stringify(exportData, null, 2), 'utf8');
    
    console.log('✅ 数据导出完成！');
    console.log(`📄 文件位置: ${outputFile}`);
    console.log('📊 导出统计:');
    console.log(`   - 活动: ${activities.length} 条`);
    console.log(`   - 用户: ${users.length} 条`);
    console.log(`   - 订单: ${orders.length} 条`);
    console.log(`   - 评论: ${comments.length} 条`);
    
  } catch (error) {
    console.error('❌ 数据导出失败:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📋 数据库连接已关闭');
  }
};

// 主函数
const main = async () => {
  await connectDB();
  await exportData();
};

main().catch(console.error);
