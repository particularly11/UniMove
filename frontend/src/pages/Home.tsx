import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Space, Carousel, Statistic } from 'antd';
import { CalendarOutlined, TeamOutlined, TrophyOutlined, StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { activityAPI } from '../api/activity';
import type { Activity } from '../api/activity';
import ActivityCard from '../components/ActivityCard';
import './Home.css';

const Home: React.FC = () => {
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchFeaturedActivities();
  }, []);

  const fetchFeaturedActivities = async () => {
    try {
      const response = await activityAPI.getActivities({
        limit: 6,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setFeaturedActivities(response.data.activities);
    } catch (error) {
      console.error('Failed to fetch featured activities:', error);
    }
  };

  const carouselItems = [
    {
      title: '发现精彩活动',
      description: '加入我们的体育社区，发现身边的精彩活动',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop',
      action: '/activities'
    },
    {
      title: '创建你的活动',
      description: '组织属于你的体育活动，邀请朋友一起参与',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop',
      action: '/create-activity'
    },
    {
      title: '运动改变生活',
      description: '让运动成为习惯，让健康伴随一生',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop',
      action: '/activities'
    }
  ];

  const features = [
    {
      icon: <CalendarOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: '活动管理',
      description: '轻松创建和管理体育活动'
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: '社区互动',
      description: '结识志同道合的运动伙伴'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
      title: '多元体验',
      description: '涵盖各类体育运动项目'
    },
    {
      icon: <StarOutlined style={{ fontSize: 32, color: '#f5222d' }} />,
      title: '品质保证',
      description: '优质的场地和服务体验'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Carousel autoplay effect="fade" className="hero-carousel">
          {carouselItems.map((item, index) => (
            <div key={index}>
              <div 
                className="carousel-item"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="carousel-content">
                  <h1>{item.title}</h1>
                  <p>{item.description}</p>
                  <Link to={item.action}>
                    <Button type="primary" size="large">
                      立即开始
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[32, 32]} justify="center">
            <Col xs={12} sm={6}>
              <Statistic
                title="活动总数"
                value={1128}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="用户数量"
                value={5680}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="运动类型"
                value={15}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="用户评分"
                value={4.8}
                precision={1}
                prefix={<StarOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>为什么选择 UniMove</h2>
            <p>专业的体育活动预约平台，让运动更简单</p>
          </div>
          
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Activities Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>精选活动</h2>
            <p>发现最新最热门的体育活动</p>
          </div>
          
          <Row gutter={[16, 16]}>
            {featuredActivities.map((activity) => (
              <Col xs={24} sm={12} lg={8} key={activity._id}>
                <ActivityCard activity={activity} showActions={false} />
              </Col>
            ))}
          </Row>
          
          <div className="section-footer">
            <Link to="/activities">
              <Button type="primary" size="large">
                查看更多活动
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>开始你的运动之旅</h2>
            <p>加入 UniMove 社区，发现更多精彩的体育活动</p>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large">
                  立即注册
                </Button>
              </Link>
              <Link to="/activities">
                <Button size="large">
                  浏览活动
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
