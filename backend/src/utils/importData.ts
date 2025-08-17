import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Activity } from '../models/Activity';
import { User } from '../models/User';
import { connectDatabase } from '../utils/database';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 示例活动数据
const sampleActivities = [
  {
    title: '篮球友谊赛',
    description: '欢迎篮球爱好者参加！我们将在市体育馆举办一场友谊赛，不限水平，重在参与。提供篮球和基本设施，请穿运动服装。',
    category: '篮球',
    location: '市体育馆篮球场A',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3天后
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 3天后+2小时
    maxParticipants: 20,
    price: 25,
    status: 'published',
    tags: ['友谊赛', '初学者友好', '团队运动'],
    images: []
  },
  {
    title: '羽毛球俱乐部活动',
    description: '羽毛球爱好者聚会，提供专业羽毛球场地和教练指导。适合各个水平的球员参加，可以学习技巧，交流经验。',
    category: '羽毛球',
    location: '羽动体育中心',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5天后
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 5天后+3小时
    maxParticipants: 16,
    price: 40,
    status: 'published',
    tags: ['俱乐部', '教练指导', '技能提升'],
    images: []
  },
  {
    title: '游泳健身课程',
    description: '专业游泳教练带领的健身课程，包括游泳技巧训练和水中有氧运动。适合想要学习游泳或提高游泳技能的朋友。',
    category: '游泳',
    location: '蓝波游泳馆',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 7天后+1.5小时
    maxParticipants: 12,
    price: 60,
    status: 'published',
    tags: ['健身', '教练课程', '技能培训'],
    images: []
  },
  {
    title: '足球训练营',
    description: '周末足球训练营，专业教练指导基本技巧和战术配合。欢迎足球爱好者参加，提供足球和护具。',
    category: '足球',
    location: '绿茵足球场',
    startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10天后
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // 10天后+2.5小时
    maxParticipants: 22,
    price: 35,
    status: 'published',
    tags: ['训练营', '战术学习', '团队合作'],
    images: []
  },
  {
    title: '乒乓球比赛',
    description: '月度乒乓球比赛，分为初级、中级、高级三个组别。奖品丰厚，欢迎各水平选手参加！',
    category: '乒乓球',
    location: '乒乓球俱乐部',
    startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14天后
    endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 14天后+4小时
    maxParticipants: 32,
    price: 20,
    status: 'published',
    tags: ['比赛', '分组竞技', '奖品'],
    images: []
  },
  {
    title: '网球初学者课程',
    description: '专为网球初学者设计的入门课程，专业教练一对一指导。提供网球拍和练习球，无需自带装备。',
    category: '网球',
    location: '阳光网球场',
    startTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12天后
    endTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 12天后+2小时
    maxParticipants: 8,
    price: 80,
    status: 'published',
    tags: ['初学者', '一对一指导', '入门课程'],
    images: []
  },
  {
    title: '健身房团体课',
    description: '高强度间歇训练(HIIT)团体课，专业健身教练指导。适合想要快速燃脂和提高体能的朋友参加。',
    category: '健身',
    location: '力量健身房',
    startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6天后
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 6天后+1小时
    maxParticipants: 15,
    price: 45,
    status: 'published',
    tags: ['HIIT', '燃脂', '体能训练'],
    images: []
  },
  {
    title: '晨跑俱乐部',
    description: '每周三次的晨跑活动，路线经过城市公园和湖边。适合所有跑步水平，有经验跑者带队。',
    category: '跑步',
    location: '城市公园入口',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2天后
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 2天后+1小时
    maxParticipants: 25,
    price: 0, // 免费活动
    status: 'published',
    tags: ['晨跑', '免费', '城市公园'],
    images: []
  }
];

async function createDefaultUser() {
  // 创建一个默认的组织者用户
  const existingUser = await User.findOne({ email: 'organizer@unimove.com' });
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const defaultUser = new User({
      username: '系统管理员',
      email: 'organizer@unimove.com',
      password: hashedPassword,
      role: 'admin',
      phone: '13800138000',
      avatar: ''
    });
    
    return await defaultUser.save();
  }
  
  return existingUser;
}

async function importActivities() {
  try {
    // 如果没有连接数据库，则连接
    if (mongoose.connection.readyState === 0) {
      console.log('🔗 连接数据库...');
      await connectDatabase();
    }
    
    console.log('👤 创建默认用户...');
    const defaultUser = await createDefaultUser();
    
    console.log('🗑️  清空现有活动数据...');
    await Activity.deleteMany({});
    
    console.log('📝 导入活动数据...');
    const activitiesWithOrganizer = sampleActivities.map(activity => ({
      ...activity,
      organizer: defaultUser._id
    }));
    
    const result = await Activity.insertMany(activitiesWithOrganizer);
    
    console.log(`✅ 成功导入 ${result.length} 条活动数据！`);
    console.log('📊 导入的活动：');
    result.forEach((activity, index) => {
      console.log(`   ${index + 1}. ${activity.title} - ${activity.category} - ¥${activity.price}`);
    });
    
    console.log('\n🎉 数据导入完成！');
    return result;
    
  } catch (error) {
    console.error('❌ 导入失败:', error);
    throw error;
  }
}

// 执行导入
if (require.main === module) {
  importActivities();
}

export { importActivities, sampleActivities };
