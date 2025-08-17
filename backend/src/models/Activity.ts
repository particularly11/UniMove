import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  location: string;
  startTime: Date;
  endTime: Date;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  images: string[];
  organizer: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, '活动标题不能为空'],
    trim: true,
    maxlength: [100, '活动标题不能超过100个字符']
  },
  description: {
    type: String,
    required: [true, '活动描述不能为空'],
    maxlength: [2000, '活动描述不能超过2000个字符']
  },
  category: {
    type: String,
    required: [true, '活动分类不能为空'],
    enum: ['篮球', '足球', '羽毛球', '乒乓球', '网球', '游泳', '健身', '跑步', '其他']
  },
  location: {
    type: String,
    required: [true, '活动地点不能为空'],
    maxlength: [200, '活动地点不能超过200个字符']
  },
  startTime: {
    type: Date,
    required: [true, '开始时间不能为空'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: '开始时间必须是未来时间'
    }
  },
  endTime: {
    type: Date,
    required: [true, '结束时间不能为空'],
    validate: {
      validator: function(this: IActivity, value: Date) {
        return value > this.startTime;
      },
      message: '结束时间必须晚于开始时间'
    }
  },
  maxParticipants: {
    type: Number,
    required: [true, '最大参与人数不能为空'],
    min: [1, '最大参与人数至少为1'],
    max: [1000, '最大参与人数不能超过1000']
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    required: [true, '活动价格不能为空'],
    min: [0, '活动价格不能为负数']
  },
  images: [{
    type: String
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '活动组织者不能为空']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// 创建索引
ActivitySchema.index({ title: 'text', description: 'text', tags: 'text' });
ActivitySchema.index({ category: 1, startTime: 1 });
ActivitySchema.index({ location: 1 });
ActivitySchema.index({ organizer: 1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
