import React from 'react';
import { Layout, Typography, Form, Input, Button, Switch, Card, Tabs, Select, notification } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    notification.success({
      message: '保存成功',
      description: '系统设置已更新'
    });
  };

  // 定义选项卡内容
  const tabItems = [
    {
      key: 'general',
      label: '基本设置',
      children: (
        <Card>
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              username: '张三',
              email: 'zhangsan@example.com'
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              name="password"
              label="修改密码"
            >
              <Input.Password placeholder="留空表示不修改" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
            >
              <Input.Password placeholder="留空表示不修改" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'nodes',
      label: '节点配置',
      children: (
        <Card>
          <Form
            layout="vertical"
            initialValues={{
              failover: true,
              healthCheck: 60
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="failover"
              label="故障自动转移"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>

            <Form.Item
              name="healthCheck"
              label="健康检查间隔(秒)"
            >
              <Select>
                <Option value="30">30秒</Option>
                <Option value="60">60秒</Option>
                <Option value="120">120秒</Option>
                <Option value="300">300秒</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    }
  ];

  return (
    <Content className="content">
      <div style={{ padding: 24, background: '#fff', borderRadius: 4 }}>
        <Title level={4}>系统设置</Title>

        <Tabs defaultActiveKey="general" items={tabItems} />
      </div>
    </Content>
  );
};

export default Settings;
