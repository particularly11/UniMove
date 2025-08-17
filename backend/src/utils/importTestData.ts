import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Activity } from '../models/Activity';

// 加载环境变量
dotenv.config();

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('🎉 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// 测试活动数据
const sampleActivities = [
  {
    title: '周末篮球友谊赛',
    description: '欢迎篮球爱好者参加，不限水平，重在参与！我们将在室外篮球场进行3对3的友谊比赛。',
    type: '篮球',
    location: '市体育中心篮球场A',
    date: new Date('2025-08-25T09:00:00.000Z'),
    duration: 120, // 2小时
    maxParticipants: 12,
    currentParticipants: 0,
    fee: 0,
    organizer: '670f1234567890abcdef0001', // 示例用户ID
    participants: [],
    status: 'active',
    tags: ['篮球', '友谊赛', '周末', '免费'],
    rules: [
      '请准时到达',
      '自备运动装备',
      '注意安全，量力而行',
      '保持良好的体育精神'
    ]
  },
  {
    title: '晨跑小组训练',
    description: '每周三次的晨跑训练，适合初学者和有经验的跑者。路线经过公园和湖边，风景优美。',
    type: '跑步',
    location: '城市公园南门集合',
    date: new Date('2025-08-20T06:30:00.000Z'),
    duration: 60, // 1小时
    maxParticipants: 20,
    currentParticipants: 0,
    fee: 10,
    organizer: '670f1234567890abcdef0002',
    participants: [],
    status: 'active',
    tags: ['跑步', '晨练', '健身', '公园'],
    rules: [
      '请穿着舒适的跑鞋',
      '建议带水壶',
      '根据个人体能调节速度',
      '如遇恶劣天气将取消'
    ]
  },
  {
    title: '羽毛球双打比赛',
    description: '羽毛球双打比赛，按水平分组进行。提供专业的羽毛球场地和裁判。',
    type: '羽毛球',
    location: '奥体中心羽毛球馆',
    date: new Date('2025-08-22T14:00:00.000Z'),
    duration: 180, // 3小时
    maxParticipants: 16,
    currentParticipants: 0,
    fee: 50,
    organizer: '670f1234567890abcdef0003',
    participants: [],
    status: 'active',
    tags: ['羽毛球', '双打', '比赛', '室内'],
    rules: [
      '自备球拍',
      '穿着运动鞋',
      '比赛采用淘汰制',
      '奖品丰厚'
    ]
  },
  {
    title: '游泳健身课程',
    description: '专业教练指导的游泳健身课程，适合各个水平的学员。包含自由泳、蛙泳等多种泳姿训练。',
    type: '游泳',
    location: '市游泳馆标准池',
    date: new Date('2025-08-24T19:00:00.000Z'),
    duration: 90, // 1.5小时
    maxParticipants: 15,
    currentParticipants: 0,
    fee: 80,
    organizer: '670f1234567890abcdef0004',
    participants: [],
    status: 'active',
    tags: ['游泳', '健身', '教练', '室内'],
    rules: [
      '必须会基础游泳',
      '自备泳衣和泳帽',
      '禁止在池边奔跑',
      '听从教练指导'
    ]
  },
  {
    title: '足球训练营',
    description: '青少年足球训练营，专业教练指导，提升足球技能。包含传球、射门、战术等全方位训练。',
    type: '足球',
    location: '体育公园足球场',
    date: new Date('2025-08-26T16:00:00.000Z'),
    duration: 150, // 2.5小时
    maxParticipants: 22,
    currentParticipants: 0,
    fee: 100,
    organizer: '670f1234567890abcdef0005',
    participants: [],
    status: 'active',
    tags: ['足球', '训练营', '青少年', '教练'],
    rules: [
      '年龄限制：8-16岁',
      '自备足球装备',
      '购买运动保险',
      '家长需签署安全协议'
    ]
  },
  {
    title: '瑜伽冥想课程',
    description: '放松身心的瑜伽冥想课程，在宁静的环境中练习各种瑜伽体式，适合初学者。',
    type: '瑜伽',
    location: '静心瑜伽馆',
    date: new Date('2025-08-21T18:30:00.000Z'),
    duration: 75, // 1.25小时
    maxParticipants: 10,
    currentParticipants: 0,
    fee: 60,
    organizer: '670f1234567890abcdef0006',
    participants: [],
    status: 'active',
    tags: ['瑜伽', '冥想', '放松', '室内'],
    rules: [
      '穿着舒适的瑜伽服',
      '自备瑜伽垫',
      '课前2小时不要进食',
      '保持安静的环境'
    ]
  }
];

// 导入数据
const importData = async () => {
  try {
    await connectDB();
    
    // 清空现有活动数据
    await Activity.deleteMany({});
    console.log('🗑️ 已清空现有活动数据');
    
    // 插入新的测试数据
    await Activity.insertMany(sampleActivities);
    console.log(`✅ 成功导入 ${sampleActivities.length} 个测试活动`);
    
    console.log('\n📋 已导入的活动：');
    sampleActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title} - ${activity.type} - ¥${activity.fee}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 导入数据失败:', error);
    process.exit(1);
  }
};

// 运行导入
if (require.main === module) {
  importData();
}

export { importData };
