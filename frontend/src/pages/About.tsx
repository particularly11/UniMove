import React from 'react';
import { Card, Typography, Row, Col, Statistic, Timeline, Space } from 'antd';
import { 
  TrophyOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  HeartOutlined,
  SafetyOutlined,
  RocketOutlined,
  UserOutlined,
  StarOutlined
} from '@ant-design/icons';
import './About.css';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const features = [
    {
      icon: <CalendarOutlined />,
      title: '便捷预约',
      description: '一键预约各类体育活动，快速便捷'
    },
    {
      icon: <SafetyOutlined />,
      title: '安全保障',
      description: '完善的安全机制，保障用户权益'
    },
    {
      icon: <TeamOutlined />,
      title: '社区互动',
      description: '结识志同道合的运动伙伴'
    },
    {
      icon: <StarOutlined />,
      title: '优质体验',
      description: '精心设计的用户界面，极致体验'
    }
  ];

  const milestones = [
    {
      color: 'blue',
      children: (
        <div>
          <p><strong>2025年8月12日</strong></p>
          <p>项目启动，确定技术架构</p>
        </div>
      )
    },
    {
      color: 'green',
      children: (
        <div>
          <p><strong>2025年8月16日</strong></p>
          <p>完成核心功能开发</p>
        </div>
      )
    },
    {
      color: 'orange',
      children: (
        <div>
          <p><strong>2025年8月17日</strong></p>
          <p>内测版本发布</p>
        </div>
      )
    },
    {
      color: 'red',
      children: (
        <div>
          <p><strong>2025年8月18日</strong></p>
          <p>正式版本上线</p>
        </div>
      )
    }
  ];

  return (
    <div className="about-container">
      {/* 头部介绍 */}
      <Card className="about-hero">
        <div className="about-hero-content">
          <Title level={1}>
            <RocketOutlined /> 关于 UniMove
          </Title>
          <Paragraph className="about-hero-description">
            UniMove 是一个现代化的体育场所预约系统，致力于为用户提供便捷、安全、高效的运动预约体验。
            我们相信运动能让生活更美好，而技术能让运动更简单。
          </Paragraph>
        </div>
      </Card>

      {/* 统计数据 */}
      <Card className="about-statistics">
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          平台数据
        </Title>
        <Row gutter={[32, 32]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="注册用户"
              value={1280}
              prefix={<UserOutlined />}
              suffix="+"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="活动数量"
              value={156}
              prefix={<CalendarOutlined />}
              suffix="+"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="累计预约"
              value={5420}
              prefix={<TrophyOutlined />}
              suffix="+"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="用户满意度"
              value={98.5}
              prefix={<HeartOutlined />}
              suffix="%"
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 核心特性 */}
        <Col xs={24} lg={12}>
          <Card className="about-features">
            <Title level={3}>核心特性</Title>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-content">
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph>{feature.description}</Paragraph>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 发展历程 */}
        <Col xs={24} lg={12}>
          <Card className="about-timeline">
            <Title level={3}>发展历程</Title>
            <Timeline items={milestones} />
          </Card>
        </Col>
      </Row>

      {/* 技术栈 */}
      <Card className="about-tech">
        <Title level={3} style={{ textAlign: 'center' }}>
          技术栈
        </Title>
        <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
          <Col xs={24} sm={12}>
            <Card className="tech-category">
              <Title level={4}>前端技术</Title>
              <ul>
                <li>React 18 + TypeScript</li>
                <li>Vite 构建工具</li>
                <li>Ant Design 组件库</li>
                <li>Redux Toolkit 状态管理</li>
                <li>React Router 路由管理</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className="tech-category">
              <Title level={4}>后端技术</Title>
              <ul>
                <li>Node.js + Express</li>
                <li>TypeScript</li>
                <li>MongoDB + Mongoose</li>
                <li>JWT 身份验证</li>
                <li>RESTful API 设计</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 联系我们 */}
      <Card className="about-contact">
        <Title level={3} style={{ textAlign: 'center' }}>
          联系我们
        </Title>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Paragraph>
            如果您有任何问题或建议，欢迎联系我们：
          </Paragraph>
          <Paragraph>
            <strong>邮箱：</strong> qjx2967886936@163.com
          </Paragraph>
          <Paragraph>
            <strong>电话：</strong> 19164727379
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default About;
