import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Typography,
  Tag,
  Space,
  Avatar,
  Divider,
  message,
  Modal,
  Form,
  Input,
  Rate,
  List,
  Spin,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  CommentOutlined,
  StarOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAppSelector } from '../store/hooks';
import { activityAPI, type Activity } from '../api/activity';
import { orderAPI } from '../api/order';
import { commentAPI, type Comment } from '../api/comment';
import './ActivityDetail.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [userEnrollmentStatus, setUserEnrollmentStatus] = useState(false);
  const [form] = Form.useForm();

  const loadActivityDetail = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getActivityById(id!);
      if (response.success) {
        setActivity(response.data.activity);
      } else {
        message.error('活动不存在');
        navigate('/activities');
      }
    } catch {
      message.error('加载活动详情失败');
      navigate('/activities');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // 检查用户报名状态
  const checkUserEnrollmentStatus = React.useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUserEnrollmentStatus(false);
      return;
    }

    try {
      const response = await orderAPI.getUserOrders();
      if (response.success) {
        const hasEnrolled = response.data.orders.some(order => 
          order.activity._id === id && order.status === 'paid'
        );
        setUserEnrollmentStatus(hasEnrolled);
      }
    } catch (error) {
      console.error('检查报名状态失败:', error);
    }
  }, [id, isAuthenticated, user]);

  const loadComments = React.useCallback(async () => {
    try {
      const response = await commentAPI.getActivityComments(id!);
      if (response.success) {
        setComments(response.data.comments);
      }
    } catch {
      console.error('加载评论失败');
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await Promise.all([
          loadActivityDetail(), 
          loadComments(),
          checkUserEnrollmentStatus()
        ]);
      }
    };
    loadData();
  }, [id, loadActivityDetail, loadComments, checkUserEnrollmentStatus]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (!activity) return;

    // 防止重复点击
    if (enrolling) return;

    // 检查是否已经报名
    if (userEnrollmentStatus) {
      message.warning('您已经报名过此活动');
      return;
    }

    setEnrolling(true);
    try {
      const response = await orderAPI.createOrder({
        activityId: activity._id
      });
      
      if (response.success) {
        message.success('报名成功！');
        setUserEnrollmentStatus(true);
        loadActivityDetail(); // 重新加载活动信息
      } else {
        message.error(response.message || '报名失败');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '报名失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!isAuthenticated || !user || !activity) {
      return;
    }

    setCancelling(true);
    try {
      // 获取用户的订单
      const ordersResponse = await orderAPI.getUserOrders();
      if (!ordersResponse.success) {
        message.error('获取订单信息失败');
        return;
      }

      // 找到对应活动的订单
      const order = ordersResponse.data.orders.find(order => 
        order.activity._id === activity._id && order.status === 'paid'
      );

      if (!order) {
        message.error('未找到对应的订单');
        return;
      }

      // 取消订单
      const response = await orderAPI.cancelOrder(order._id, { reason: '用户主动取消' });
      if (response.success) {
        message.success('取消报名成功！');
        setUserEnrollmentStatus(false);
        loadActivityDetail(); // 重新加载活动信息
      } else {
        message.error(response.message || '取消报名失败');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '取消报名失败';
      message.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const handleComment = async (values: { content: string; rating: number }) => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      return;
    }

    setCommentLoading(true);
    try {
      const response = await commentAPI.createComment({
        activityId: id!,
        content: values.content,
        rating: values.rating
      });

      if (response.success) {
        message.success('评论成功！');
        setCommentModalVisible(false);
        form.resetFields();
        loadComments();
      } else {
        message.error(response.message || '评论失败');
      }
    } catch {
      message.error('评论失败，请稍后重试');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="activity-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!activity) {
    return null;
  }

  const isEnrollable = activity.maxParticipants > activity.currentParticipants;
  const enrollmentRate = (activity.currentParticipants / activity.maxParticipants) * 100;

  return (
    <div className="activity-detail-container">
      <Card className="activity-detail-card">
        {/* 活动头部信息 */}
        <div className="activity-header">
          <div className="activity-image">
            <img
              src={(activity.images && activity.images[0]) || '/api/placeholder/600/300'}
              alt={activity.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/api/placeholder/600/300';
              }}
            />
          </div>
          
          <div className="activity-info">
            <Title level={1}>{activity.title}</Title>
            
            <Space wrap className="activity-tags">
              <Tag color="blue">{activity.category}</Tag>
              <Tag color={isEnrollable ? 'green' : 'red'}>
                {isEnrollable ? '可报名' : '已满员'}
              </Tag>
            </Space>

            <div className="activity-meta">
              <Space direction="vertical" size="small">
                <Space>
                  <CalendarOutlined />
                  <Text>{dayjs(activity.startTime).format('YYYY-MM-DD HH:mm')}</Text>
                  <Text type="secondary">至</Text>
                  <Text>{dayjs(activity.endTime).format('YYYY-MM-DD HH:mm')}</Text>
                </Space>
                
                <Space>
                  <EnvironmentOutlined />
                  <Text>{activity.location}</Text>
                </Space>
                
                <Space>
                  <UserOutlined />
                  <Text>组织者：{activity.organizer?.username || '未知'}</Text>
                </Space>
              </Space>
            </div>

            <Row gutter={16} className="activity-stats">
              <Col span={8}>
                <Statistic
                  title="当前人数"
                  value={activity.currentParticipants}
                  suffix={`/ ${activity.maxParticipants}`}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="报名率"
                  value={enrollmentRate}
                  precision={1}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="评论数"
                  value={comments.length}
                />
              </Col>
            </Row>

            <div className="activity-actions">
              <Space>
                {!userEnrollmentStatus ? (
                  <Button
                    type="primary"
                    size="large"
                    loading={enrolling}
                    disabled={!isEnrollable}
                    onClick={handleEnroll}
                    icon={<TeamOutlined />}
                  >
                    {isEnrollable ? '立即报名' : '已满员'}
                  </Button>
                ) : (
                  <Space>
                    <Button
                      type="default"
                      size="large"
                      disabled
                      icon={<TeamOutlined />}
                    >
                      已报名
                    </Button>
                    <Button
                      type="primary"
                      danger
                      size="large"
                      loading={cancelling}
                      onClick={handleCancelEnrollment}
                    >
                      取消报名
                    </Button>
                  </Space>
                )}
                
                <Button
                  size="large"
                  disabled={!userEnrollmentStatus}
                  onClick={() => setCommentModalVisible(true)}
                  icon={<CommentOutlined />}
                >
                  写评论
                </Button>
                
                <Button size="large" icon={<HeartOutlined />}>
                  收藏
                </Button>
                
                <Button size="large" icon={<ShareAltOutlined />}>
                  分享
                </Button>
              </Space>
            </div>
          </div>
        </div>

        <Divider />

        {/* 活动描述 */}
        <div className="activity-description">
          <Title level={3}>活动详情</Title>
          <Paragraph>
            {activity.description || '暂无详细描述'}
          </Paragraph>
        </div>

        <Divider />

        {/* 评论区 */}
        <div className="activity-comments">
          <Title level={3}>
            评论 ({comments.length})
            <Button
              type="link"
              onClick={() => setCommentModalVisible(true)}
              icon={<CommentOutlined />}
            >
              写评论
            </Button>
          </Title>
          
          <List
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <Text strong>{comment.user?.username || '匿名用户'}</Text>
                      <Rate disabled defaultValue={comment.rating} />
                      <Text type="secondary">
                        {dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    </Space>
                  }
                  description={comment.content}
                />
              </List.Item>
            )}
            locale={{
              emptyText: '暂无评论，快来抢沙发吧！'
            }}
          />
        </div>
      </Card>

      {/* 评论模态框 */}
      <Modal
        title="写评论"
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          onFinish={handleComment}
          layout="vertical"
        >
          <Form.Item
            label="评分"
            name="rating"
            initialValue={5}
            rules={[{ required: true, message: '请给出评分' }]}
          >
            <Rate />
          </Form.Item>
          
          <Form.Item
            label="评论内容"
            name="content"
            rules={[
              { required: true, message: '请输入评论内容' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="分享你的参与体验..."
              showCount
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={commentLoading}
                icon={<StarOutlined />}
              >
                发布评论
              </Button>
              <Button onClick={() => setCommentModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivityDetail;
