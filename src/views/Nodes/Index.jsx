import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Card, Button, Modal, Form, Input, Select, Badge, Tag, Statistic, Row, Col, Tooltip, Space, Popconfirm, notification, Alert } from 'antd';
import { getNodes, addNode, updateNode, deleteNode } from '../../services/api';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  LaptopOutlined,
  KeyOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

// 模拟节点数据
const mockNodes = [
  {
    id: 1,
    name: '主节点-阿里云',
    ip: '121.40.168.21',
    status: 'online',
    type: 'master',
    region: '华东',
    lastActive: '2025-07-15 10:30:15',
    performance: 'good',
    cpu: 32,
    memory: 70,
    tasks: 156,
    platform: 'linux'
  },
  {
    id: 2,
    name: '备用节点-腾讯云',
    ip: '118.25.63.45',
    status: 'online',
    type: 'worker',
    region: '华南',
    lastActive: '2025-07-15 10:28:22',
    performance: 'medium',
    cpu: 56,
    memory: 45,
    tasks: 89,
    platform: 'linux'
  },
  {
    id: 3,
    name: '边缘节点-北京',
    ip: '116.62.186.85',
    status: 'offline',
    type: 'worker',
    region: '华北',
    lastActive: '2025-07-14 18:45:36',
    performance: 'poor',
    cpu: 0,
    memory: 0,
    tasks: 0,
    platform: 'windows'
  },
  {
    id: 4,
    name: '美国节点',
    ip: '47.89.185.35',
    status: 'online',
    type: 'worker',
    region: '北美',
    lastActive: '2025-07-15 10:25:18',
    performance: 'good',
    cpu: 28,
    memory: 30,
    tasks: 42,
    platform: 'linux'
  },
  {
    id: 5,
    name: '香港节点',
    ip: '47.244.33.65',
    status: 'maintenance',
    type: 'worker',
    region: '香港',
    lastActive: '2025-07-15 09:05:44',
    performance: 'medium',
    cpu: 45,
    memory: 60,
    tasks: 0,
    platform: 'linux'
  }
];

const NodesManagement = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    setLoading(true);
    try {
      const data = await getNodes();
      setNodes(data);
    } catch (error) {
      console.error('Failed to load nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  // 统计数据
  const statistics = {
    total: nodes.length,
    online: nodes.filter(node => node.status === 'online').length,
    offline: nodes.filter(node => node.status === 'offline').length,
    maintenance: nodes.filter(node => node.status === 'maintenance').length,
    totalTasks: nodes.reduce((sum, node) => sum + node.tasks, 0)
  };

  // 处理新增/编辑节点
  const handleAddEditNode = () => {
    setCurrentNode(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑现有节点
  const handleEdit = (node) => {
    setCurrentNode(node);
    form.setFieldsValue({
      name: node.name,
      ip: node.ip,
      platform: node.platform,
      secureKey: '******' // 实际情况应从API获取或默认隐藏
    });
    setModalVisible(true);
  };

  // 处理删除节点
  const handleDelete = async (nodeId) => {
    try {
      setLoading(true);
      await deleteNode(nodeId);
      setNodes(nodes.filter(node => node.id !== nodeId));
      notification.success({
        message: '删除成功',
        description: '节点已成功删除'
      });
    } catch (error) {
      notification.error({
        message: '删除失败',
        description: error.message || '请稍后再试'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (currentNode) {
        // 更新现有节点
        await updateNode(currentNode.id, values);
        const updatedNodes = nodes.map(node => 
          node.id === currentNode.id ? { ...node, ...values } : node
        );
        setNodes(updatedNodes);
        notification.success({
          message: '更新成功',
          description: '节点信息已更新'
        });
      } else {
        // 添加新节点
        const result = await addNode(values);
        const newNode = {
          id: result.nodeId,
          ...values,
          status: 'offline',
          lastActive: '-',
          performance: 'unknown',
          cpu: 0,
          memory: 0,
          tasks: 0
        };
        setNodes([...nodes, newNode]);
        notification.success({
          message: '添加成功',
          description: '新节点已添加'
        });
      }

      setModalVisible(false);
    } catch (error) {
      notification.error({
        message: currentNode ? '更新失败' : '添加失败',
        description: error.message || '请稍后再试'
      });
    } finally {
      setLoading(false);
    }
  };

  // 刷新节点状态
  const refreshNodes = async () => {
    try {
      await loadNodes();
      notification.success({
        message: '刷新成功',
        description: '节点状态已更新'
      });
    } catch (error) {
      notification.error({
        message: '刷新失败',
        description: error.message || '请稍后再试'
      });
    }
  };

  // 节点状态标签渲染
  const renderStatus = (status) => {
    switch (status) {
      case 'online':
        return <Badge status="success" text="在线" />;
      case 'offline':
        return <Badge status="error" text="离线" />;
      case 'maintenance':
        return <Badge status="warning" text="维护中" />;
      default:
        return <Badge status="default" text="未知" />;
    }
  };

  // 显示节点密钥对话框
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const [currentNodeKey, setCurrentNodeKey] = useState(null);

  const showNodeKey = (node) => {
    setCurrentNodeKey({
      name: node.name,
      // 模拟获取密钥，实际应用中应该通过API安全获取
      key: `sk_${node.id}_${Math.random().toString(36).substring(2, 10)}`
    });
    setKeyModalVisible(true);
  };



  // 表格列定义
  const columns = [
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.platform === 'linux' ? (
            <CloudServerOutlined style={{ marginRight: 8, color: '#1677ff' }} />
          ) : (
            <LaptopOutlined style={{ marginRight: 8, color: '#1677ff' }} />
          )}
          {text}
        </div>
      )
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
      filters: [
        { text: '在线', value: 'online' },
        { text: '离线', value: 'offline' },
        { text: '维护中', value: 'maintenance' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: '任务数',
      dataIndex: 'tasks',
      key: 'tasks',
      sorter: (a, b) => a.tasks - b.tasks
    },
    {
      title: '系统负载',
      key: 'performance',
      render: (_, record) => {
        if (record.status !== 'online') {
          return <span>-</span>;
        }

        // CPU使用率渲染
        let cpuColor = 'green';
        if (record.cpu > 80) cpuColor = 'red';
        else if (record.cpu > 50) cpuColor = 'orange';

        // 内存使用率渲染
        let memColor = 'green';
        if (record.memory > 80) memColor = 'red';
        else if (record.memory > 50) memColor = 'orange';

        return (
          <span>
            <Tooltip title="CPU使用率">
              <Tag color={cpuColor}>CPU: {record.cpu}%</Tag>
            </Tooltip>
            <Tooltip title="内存使用率">
              <Tag color={memColor}>内存: {record.memory}%</Tag>
            </Tooltip>
          </span>
        );
      }
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            icon={<KeyOutlined />} 
            onClick={() => showNodeKey(record)}
            title="查看密钥"
          />
          <Popconfirm
            title="确定要删除此节点吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Content className="content">
      <div style={{ padding: 24, background: '#fff', borderRadius: 4 }}>
        <Title level={4}>节点管理</Title>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="总节点数" 
                value={statistics.total} 
                prefix={<CloudServerOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="在线节点" 
                value={statistics.online} 
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="离线节点" 
                value={statistics.offline} 
                valueStyle={{ color: '#cf1322' }}
                prefix={<ExclamationCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="正在运行的任务" 
                value={statistics.totalTasks} 
                prefix={<ClockCircleOutlined />} 
              />
            </Card>
          </Col>
        </Row>

        {/* 工具栏 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddEditNode}
          >
            添加节点
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={refreshNodes}
          >
            刷新状态
          </Button>
        </div>

        {/* 节点表格 */}
        <Table 
          columns={columns} 
          dataSource={nodes} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </div>

      {/* 添加/编辑节点模态框 */}
      <Modal
        title={currentNode ? '编辑节点' : '添加节点'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>

          <Form.Item
            name="ip"
            label="IP地址"
            rules={[
              { required: true, message: '请输入IP地址' },
              { pattern: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, message: '请输入有效的IP地址' }
            ]}
          >
            <Input placeholder="例如: 192.168.1.1" />
          </Form.Item>

          <Form.Item
            name="platform"
            label="系统平台"
            rules={[{ required: true, message: '请选择系统平台' }]}
          >
            <Select placeholder="请选择系统平台">
              <Option value="linux">Linux</Option>
              <Option value="windows">Windows</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="secureKey"
            label="安全密钥"
            rules={[{ required: true, message: '请输入节点安全密钥' }]}
            extra="安全密钥用于节点间通信认证和加密，请妥善保管"
          >
            <Input.Password 
              placeholder="请输入安全密钥" 
              addonAfter={
                <Button 
                  type="text" 
                  size="small"
                  onClick={() => {
                    // 在实际应用中，这应该从主节点或系统设置中获取
                    const randomKey = Math.random().toString(36).substring(2) + Date.now().toString(36);
                    form.setFieldsValue({ secureKey: randomKey });
                  }}
                >
                  生成
                </Button>
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {currentNode ? '保存修改' : '添加节点'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看节点密钥模态框 */}
      <Modal
        title="节点安全密钥"
        open={keyModalVisible}
        onCancel={() => setKeyModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setKeyModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {currentNodeKey && (
          <div>
            <p><strong>节点名称:</strong> {currentNodeKey.name}</p>
            <p><strong>安全密钥:</strong></p>
            <Input.Password
              value={currentNodeKey.key}
              readOnly
              style={{ marginBottom: 16 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(currentNodeKey.key);
                  notification.success({
                    message: '复制成功',
                    description: '安全密钥已复制到剪贴板'
                  });
                }}
              >
                复制密钥
              </Button>
              <Button
                type="dashed"
                onClick={() => {
                  const newKey = `sk_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
                  setCurrentNodeKey({ ...currentNodeKey, key: newKey });
                  notification.info({
                    message: '密钥重置',
                    description: '安全密钥已重置，请保存并更新到节点配置'
                  });
                }}
              >
                重置密钥
              </Button>
            </div>
            <div style={{ marginTop: 16 }}>
              <Alert
                type="warning"
                message="安全提醒"
                description="密钥用于节点间通信认证和加密，请妥善保管，不要泄露给未授权人员。"
                showIcon
              />
            </div>
          </div>
        )}
      </Modal>

    </Content>
  );
};

export default NodesManagement;
