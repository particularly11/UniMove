import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  activity: mongoose.Types.ObjectId;
  content: string;
  rating: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户信息不能为空']
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: [true, '活动信息不能为空']
  },
  content: {
    type: String,
    required: [true, '评论内容不能为空'],
    trim: true,
    maxlength: [1000, '评论内容不能超过1000个字符']
  },
  rating: {
    type: Number,
    required: [true, '评分不能为空'],
    min: [1, '评分最低为1分'],
    max: [5, '评分最高为5分']
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

// 创建复合索引，确保一个用户只能对一个活动评论一次
CommentSchema.index({ user: 1, activity: 1 }, { unique: true });
CommentSchema.index({ activity: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
