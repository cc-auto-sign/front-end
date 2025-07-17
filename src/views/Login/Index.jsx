import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, notification, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../../api';
import './Login.css';

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 使用AuthAPI处理登录请求
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // 调用登录API
      await AuthAPI.login(values.username, values.password);

      notification.success({
        message: '登录成功',
        description: `欢迎回来，${values.username}！`,
      });

      // 跳转到首页
      navigate('/');
    } catch (error) {
      notification.error({
        message: '登录失败',
        description: error.message || '请检查用户名和密码',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="login-layout">
      <Content className="login-content">
        <div className="login-background" />
        <Card className="login-card">
          <div className="login-header">
            <Title level={2} className="login-title">签到管理系统</Title>
            <p className="login-subtitle">登录您的账户以继续</p>
          </div>

          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="密码" 
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <a href="#" className="login-forgot">
                  忘记密码？
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="login-button" 
                icon={<LoginOutlined />}
                loading={loading}
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <p>© 2025 签到管理系统 版权所有</p>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
