import React from 'react';
import { Card, Tag, Button, Avatar, Space } from 'antd';
import { UserOutlined, CalendarOutlined, EnvironmentOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Activity } from '../api/activity';
import './ActivityCard.css';

interface ActivityCardProps {
  activity: Activity;
  showActions?: boolean;
  onJoin?: (activityId: string) => void;
  onLeave?: (activityId: string) => void;
  isJoined?: boolean;
  loading?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  showActions = true,
  onJoin,
  onLeave,
  isJoined = false,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/activities/${activity._id}`);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isJoined && onLeave) {
      onLeave(activity._id);
    } else if (!isJoined && onJoin) {
      onJoin(activity._id);
    }
  };

  const isActivityFull = activity.currentParticipants >= activity.maxParticipants;
  const isActivityPast = dayjs(activity.startTime).isBefore(dayjs());

  return (
    <Card
      hoverable
      className="activity-card"
      cover={
        activity.images && activity.images.length > 0 ? (
          <img
            alt={activity.title}
            src={activity.images[0]}
            className="activity-image"
          />
        ) : (
          <div className="activity-image-placeholder">
            <CalendarOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          </div>
        )
      }
      actions={
        showActions
          ? [
              <Button type="link" onClick={handleViewDetail}>
                查看详情
              </Button>,
              isJoined ? (
                <Space.Compact>
                  <Button
                    type="default"
                    size="small"
                    disabled
                  >
                    已报名
                  </Button>
                  <Button
                    type="primary"
                    danger
                    size="small"
                    onClick={handleJoinClick}
                    loading={loading}
                  >
                    取消报名
                  </Button>
                </Space.Compact>
              ) : (
                <Button
                  type="primary"
                  onClick={handleJoinClick}
                  loading={loading}
                  disabled={!isJoined && (isActivityFull || isActivityPast)}
                >
                  参加活动
                </Button>
              ),
            ]
          : [
              <Button type="link" onClick={handleViewDetail}>
                查看详情
              </Button>,
            ]
      }
    >
      <Card.Meta
        title={
          <div className="activity-title">
            <span>{activity.title}</span>
            <Tag color="blue">{activity.category}</Tag>
          </div>
        }
        description={
          <div className="activity-description">
            <p className="activity-desc-text">
              {activity.description.length > 80
                ? `${activity.description.substring(0, 80)}...`
                : activity.description}
            </p>
            
            <Space direction="vertical" size="small" className="activity-info">
              <Space>
                <CalendarOutlined />
                <span>{dayjs(activity.startTime).format('YYYY-MM-DD HH:mm')}</span>
              </Space>
              
              <Space>
                <EnvironmentOutlined />
                <span>{activity.location}</span>
              </Space>
              
              <Space>
                <TeamOutlined />
                <span>
                  {activity.currentParticipants}/{activity.maxParticipants}人
                </span>
                {isActivityFull && <Tag color="red">已满</Tag>}
              </Space>
              
              <Space>
                <DollarOutlined />
                <span className="activity-price">
                  {activity.price === 0 ? '免费' : `¥${activity.price}`}
                </span>
              </Space>
            </Space>
            
            <div className="activity-organizer">
              <Space>
                <Avatar
                  size="small"
                  src={activity.organizer.avatar}
                  icon={!activity.organizer.avatar && <UserOutlined />}
                />
                <span>组织者: {activity.organizer.username}</span>
              </Space>
            </div>
            
            {activity.tags && activity.tags.length > 0 && (
              <div className="activity-tags">
                {activity.tags.map((tag, index) => (
                  <Tag key={index}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
            
            {isActivityPast && (
              <div className="activity-status">
                <Tag color="default">活动已结束</Tag>
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default ActivityCard;
