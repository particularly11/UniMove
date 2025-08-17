import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unimove';
    
    // 连接选项
    const options = {
      // 设置服务器选择超时（毫秒）
      serverSelectionTimeoutMS: 5000,
      // 连接超时（毫秒）
      connectTimeoutMS: 10000,
      // Socket 超时（毫秒）
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUri, options);
    
    console.log('🎉 MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // 监听连接事件
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('📋 Please check:');
    console.error('   1. MongoDB service is running');
    console.error('   2. Connection string is correct');
    console.error('   3. Network connectivity');
    process.exit(1);
  }
};

export default connectDatabase;
