// MongoDB 初始化脚本
// 创建应用用户和数据库

db = db.getSiblingDB('unimove');

// 创建应用用户
db.createUser({
  user: 'unimove_user',
  pwd: 'unimove_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'unimove'
    }
  ]
});

// 创建初始集合（可选）
db.createCollection('users');
db.createCollection('activities');
db.createCollection('orders');
db.createCollection('comments');

print('Database initialized successfully');
