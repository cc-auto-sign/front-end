import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Card, Button, Modal, Form, Input, Select, TimePicker, Badge, Tag, Statistic, Row, Col, Space, Popconfirm, notification, Alert, InputNumber, Tabs, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, FieldTimeOutlined, PlayCircleOutlined, PauseCircleOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

// 模拟插件数据
const mockPlugins = [
  {
    id: 1,
    name: '微博',
    icon: '微博',
    version: '1.2.0',
    config: {
      username: { type: 'string', label: '用户名', required: true },
      password: { type: 'password', label: '密码', required: true },
      followMode: { type: 'select', label: '关注模式', options: [{value: 'all', label: '全部'}, {value: 'new', label: '只关注新内容'}], required: false }
    }
  },
  {
    id: 2,
    name: '哔哩哔哩',
    icon: 'B站',
    version: '2.0.1',
    config: {
      cookie: { type: 'textarea', label: 'Cookie', required: true },
      autoWatch: { type: 'boolean', label: '自动观看视频', required: false },
      autoCoin: { type: 'boolean', label: '自动投币', required: false },
      coinCount: { type: 'number', label: '每日投币数量', min: 1, max: 5, required: false }
    }
  },
  {
    id: 3,
    name: '知乎',
    icon: '知乎',
    version: '1.5.3',
    config: {
      token: { type: 'string', label: '访问令牌', required: true },
      autoVote: { type: 'boolean', label: '自动点赞', required: false }
    }
  },
  {
    id: 5,
    name: '京东',
    icon: '京东',
    version: '2.3.1',
    config: {
      cookie: { type: 'textarea', label: 'Cookie', required: true },
      autoTask: { type: 'boolean', label: '自动完成任务', required: false }
    }
  }
];

// 模拟任务数据
const mockTasks = [
  {
    id: 1,
    name: '微博每日签到',
    pluginId: 1,
    pluginName: '微博',
    status: 'active',
    cron: '0 9 * * *',
    lastRun: '2025-07-15 09:00:00',
    nextRun: '2025-07-16 09:00:00',
    config: {
      username: 'user123',
      password: '******',
      followMode: 'all'
    },
    success: 156,
    fail: 2
  },
  {
    id: 2,
    name: 'B站自动任务',
    pluginId: 2,
    pluginName: '哔哩哔哩',
    status: 'active',
    cron: '0 10 * * *',
    lastRun: '2025-07-15 10:00:00',
    nextRun: '2025-07-16 10:00:00',
    config: {
      cookie: '******',
      autoWatch: true,
      autoCoin: true,
      coinCount: 3
    },
    success: 142,
    fail: 0
  },
  {
    id: 3,
    name: '京东签到',
    pluginId: 5,
    pluginName: '京东',
    status: 'paused',
    cron: '0 7 * * *',
    lastRun: '2025-07-14 07:00:00',
    nextRun: '-',
    config: {
      cookie: '******',
      autoTask: true
    },
    success: 98,
    fail: 5
  },
  {
    id: 4,
    name: '知乎每周任务',
    pluginId: 3,
    pluginName: '知乎',
    status: 'active',
    cron: '0 8 * * 1',
    lastRun: '2025-07-15 08:00:00',
    nextRun: '2025-07-22 08:00:00',
    config: {
      token: '******',
      autoVote: true
    },
    success: 25,
    fail: 1
  }
];

// CRON表达式预设
const cronPresets = [
  { label: '每天', value: 'daily', template: '0 {hour} * * *', description: '每天固定时间执行' },
  { label: '每周', value: 'weekly', template: '0 {hour} * * {dayOfWeek}', description: '每周固定时间执行' },
  { label: '每月', value: 'monthly', template: '0 {hour} {dayOfMonth} * *', description: '每月固定日期执行' },
  { label: '每小时', value: 'hourly', template: '0 * * * *', description: '每小时执行一次' },
  { label: '自定义', value: 'custom', template: '', description: '自定义CRON表达式' }
];

// CRON可视化配置组件
const CronVisualEditor = ({ value, onChange }) => {
  const [preset, setPreset] = useState('daily');
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState(1); // 周一
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [customCron, setCustomCron] = useState('');

  // 初始化
  useEffect(() => {
    if (value) {
      // 尝试解析已有的cron表达式
      const parts = value.split(' ');
      if (parts.length === 5) {
        setMinute(parseInt(parts[0]) || 0);
        if (parts[1] === '*') {
          setPreset('hourly');
        } else {
          setHour(parseInt(parts[1]) || 9);

          if (parts[2] === '*' && parts[4] === '*') {
            setPreset('daily');
          } else if (parts[2] === '*' && parts[4] !== '*') {
            setPreset('weekly');
            setDayOfWeek(parseInt(parts[4]) || 1);
          } else if (parts[2] !== '*' && parts[4] === '*') {
            setPreset('monthly');
            setDayOfMonth(parseInt(parts[2]) || 1);
          } else {
            setPreset('custom');
            setCustomCron(value);
          }
        }
      } else {
        setPreset('custom');
        setCustomCron(value);
      }
    }
  }, []);

  // 生成CRON表达式
  const generateCronExpression = () => {
    if (preset === 'custom') {
      return customCron;
    }

    if (preset === 'hourly') {
      return `${minute} * * * *`;
    }

    if (preset === 'daily') {
      return `${minute} ${hour} * * *`;
    }

    if (preset === 'weekly') {
      return `${minute} ${hour} * * ${dayOfWeek}`;
    }

    if (preset === 'monthly') {
      return `${minute} ${hour} ${dayOfMonth} * *`;
    }

    return '';
  };

  // 当配置变化时更新CRON表达式
  useEffect(() => {
    const cronExp = generateCronExpression();
    if (cronExp && cronExp !== value) {
      onChange(cronExp);
    }
  }, [preset, hour, minute, dayOfWeek, dayOfMonth, customCron]);

  // 周几的选项
  const weekdayOptions = [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 0 }
  ];

  // 月份日期选项
  const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}日`,
    value: i + 1
  }));

  // 小时选项
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}点`,
    value: i
  }));

  // 分钟选项
  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    label: `${i}分`,
    value: i
  }));

  return (
    <div>
      <Form.Item label="执行频率">
        <Select 
          value={preset} 
          onChange={setPreset}
          style={{ width: '100%' }}
        >
          {cronPresets.map(item => (
            <Option key={item.value} value={item.value}>{item.label} - {item.description}</Option>
          ))}
        </Select>
      </Form.Item>

      {preset === 'custom' ? (
        <Form.Item 
          label="CRON表达式" 
          extra="自定义CRON表达式，格式：分钟 小时 日期 月份 星期"
        >
          <Input 
            value={customCron} 
            onChange={(e) => setCustomCron(e.target.value)}
            placeholder="0 9 * * *" 
          />
        </Form.Item>
      ) : (
        <>
          {preset !== 'hourly' && (
            <Form.Item label="执行时间">
              <div style={{ display: 'flex', gap: '8px' }}>
                <Select 
                  value={hour} 
                  onChange={setHour}
                  style={{ width: '50%' }}
                >
                  {hourOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
                <Select 
                  value={minute} 
                  onChange={setMinute}
                  style={{ width: '50%' }}
                >
                  {minuteOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </div>
            </Form.Item>
          )}

          {preset === 'hourly' && (
            <Form.Item label="分钟">
              <Select 
                value={minute} 
                onChange={setMinute}
                style={{ width: '100%' }}
              >
                {minuteOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {preset === 'weekly' && (
            <Form.Item label="星期几">
              <Select 
                value={dayOfWeek} 
                onChange={setDayOfWeek}
                style={{ width: '100%' }}
              >
                {weekdayOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {preset === 'monthly' && (
            <Form.Item label="每月几号">
              <Select 
                value={dayOfMonth} 
                onChange={setDayOfMonth}
                style={{ width: '100%' }}
              >
                {monthDayOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </>
      )}

      <Form.Item label="CRON表达式">
        <Input value={generateCronExpression()} readOnly />
      </Form.Item>
    </div>
  );
};

// 根据插件配置生成动态表单
const DynamicPluginConfigForm = ({ plugin, value, onChange }) => {
  if (!plugin) return null;

  const handleFieldChange = (fieldName, fieldValue) => {
    onChange({ ...value, [fieldName]: fieldValue });
  };

  return (
    <div>
      {Object.entries(plugin.config).map(([fieldName, fieldConfig]) => {
        // 根据字段类型生成不同的表单控件
        switch (fieldConfig.type) {
          case 'string':
            return (
              <Form.Item
                key={fieldName}
                label={fieldConfig.label}
                required={fieldConfig.required}
              >
                <Input
                  value={value?.[fieldName] || ''}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  placeholder={`请输入${fieldConfig.label}`}
                />
              </Form.Item>
            );
          case 'password':
            return (
              <Form.Item
                key={fieldName}
                label={fieldConfig.label}
                required={fieldConfig.required}
              >
                <Input.Password
                  value={value?.[fieldName] || ''}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  placeholder={`请输入${fieldConfig.label}`}
                />
              </Form.Item>
            );
          case 'textarea':
            return (
              <Form.Item
                key={fieldName}
                label={fieldConfig.label}
                required={fieldConfig.required}
              >
                <Input.TextArea
                  value={value?.[fieldName] || ''}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  placeholder={`请输入${fieldConfig.label}`}
                  rows={4}
                />
              </Form.Item>
            );
          case 'number':
            return (
              <Form.Item
                key={fieldName}
                label={fieldConfig.label}
                required={fieldConfig.required}
              >
                <InputNumber
                  value={value?.[fieldName] || 0}
                  onChange={(val) => handleFieldChange(fieldName, val)}
                  min={fieldConfig.min}
                  max={fieldConfig.max}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            );
          case 'boolean':
            return (
              <Form.Item
                key={fieldName}
                valuePropName="checked"
              >
                <Select
                  value={value?.[fieldName] ? true : false}
                  onChange={(val) => handleFieldChange(fieldName, val)}
                  options={[
                    { label: `${fieldConfig.label}: 开启`, value: true },
                    { label: `${fieldConfig.label}: 关闭`, value: false },
                  ]}
                />
              </Form.Item>
            );
          case 'select':
            return (
              <Form.Item
                key={fieldName}
                label={fieldConfig.label}
                required={fieldConfig.required}
              >
                <Select
                  value={value?.[fieldName] || ''}
                  onChange={(val) => handleFieldChange(fieldName, val)}
                  placeholder={`请选择${fieldConfig.label}`}
                >
                  {fieldConfig.options.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const TasksManagement = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [plugins, setPlugins] = useState(mockPlugins);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskForm] = Form.useForm();
  const [configForm] = Form.useForm();

  // 表单数据
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [pluginConfig, setPluginConfig] = useState({});

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // 处理插件选择变化
  const handlePluginChange = (pluginId) => {
    const plugin = plugins.find(p => p.id === pluginId);
    setSelectedPlugin(plugin);
    setPluginConfig({});
  };

  // 添加新任务
  const handleAddTask = () => {
    setCurrentTask(null);
    setSelectedPlugin(null);
    setPluginConfig({});
    taskForm.resetFields();
    setModalVisible(true);
  };

  // 编辑任务
  const handleEditTask = (task) => {
    setCurrentTask(task);
    const plugin = plugins.find(p => p.id === task.pluginId);
    setSelectedPlugin(plugin);
    setPluginConfig(task.config);

    taskForm.setFieldsValue({
      name: task.name,
      pluginId: task.pluginId,
      cron: task.cron
    });

    setModalVisible(true);
  };

  // 配置任务
  const handleConfigTask = (task) => {
    setCurrentTask(task);
    const plugin = plugins.find(p => p.id === task.pluginId);
    setSelectedPlugin(plugin);
    setPluginConfig(task.config);
    setConfigModalVisible(true);
  };

  // 保存任务配置
  const handleSaveConfig = () => {
    if (!currentTask || !selectedPlugin) return;

    // 更新任务的配置
    const updatedTasks = tasks.map(task => {
      if (task.id === currentTask.id) {
        return { ...task, config: pluginConfig };
      }
      return task;
    });

    setTasks(updatedTasks);
    setConfigModalVisible(false);
    notification.success({
      message: '保存成功',
      description: '任务配置已更新'
    });
  };

  // 提交任务表单
  const handleSubmitTask = (values) => {
    if (currentTask) {
      // 更新现有任务
      const updatedTasks = tasks.map(task => {
        if (task.id === currentTask.id) {
          return { 
            ...task, 
            name: values.name,
            pluginId: values.pluginId,
            pluginName: plugins.find(p => p.id === values.pluginId)?.name || '',
            cron: values.cron,
            config: pluginConfig
          };
        }
        return task;
      });

      setTasks(updatedTasks);
      notification.success({
        message: '更新成功',
        description: '任务已更新'
      });
    } else {
      // 创建新任务
      const newTask = {
        id: Date.now(),
        name: values.name,
        pluginId: values.pluginId,
        pluginName: plugins.find(p => p.id === values.pluginId)?.name || '',
        status: 'active',
        cron: values.cron,
        lastRun: '-',
        nextRun: '-', // 这里应该计算下一次运行时间
        config: pluginConfig,
        success: 0,
        fail: 0
      };

      setTasks([...tasks, newTask]);
      notification.success({
        message: '创建成功',
        description: '新任务已创建'
      });
    }

    setModalVisible(false);
  };

  // 删除任务
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    notification.success({
      message: '删除成功',
      description: '任务已删除'
    });
  };

  // 切换任务状态
  const handleToggleTaskStatus = (task) => {
    const newStatus = task.status === 'active' ? 'paused' : 'active';
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, status: newStatus };
      }
      return t;
    });

    setTasks(updatedTasks);
    notification.success({
      message: '状态已更改',
      description: `任务已${newStatus === 'active' ? '启用' : '暂停'}`
    });
  };

  // 手动执行任务
  const handleRunTask = (task) => {
    notification.info({
      message: '任务执行中',
      description: `${task.name} 正在执行，请稍候查看结果`
    });

    // 模拟执行结果
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80%成功率

      const updatedTasks = tasks.map(t => {
        if (t.id === task.id) {
          return { 
            ...t, 
            lastRun: new Date().toLocaleString(),
            success: success ? t.success + 1 : t.success,
            fail: !success ? t.fail + 1 : t.fail
          };
        }
        return t;
      });

      setTasks(updatedTasks);

      notification[success ? 'success' : 'error']({
        message: success ? '执行成功' : '执行失败',
        description: `${task.name} ${success ? '已成功执行' : '执行失败，请检查配置'}`
      });
    }, 2000);
  };

  // 渲染任务状态
  const renderTaskStatus = (status) => {
    switch (status) {
      case 'active':
        return <Badge status="success" text="运行中" />;
      case 'paused':
        return <Badge status="warning" text="已暂停" />;
      case 'error':
        return <Badge status="error" text="错误" />;
      default:
        return <Badge status="default" text="未知" />;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '插件',
      dataIndex: 'pluginName',
      key: 'pluginName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderTaskStatus,
      filters: [
        { text: '运行中', value: 'active' },
        { text: '已暂停', value: 'paused' },
        { text: '错误', value: 'error' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: '执行计划',
      dataIndex: 'cron',
      key: 'cron',
      render: (cron) => {
        let description = '自定义';

        // 简单解析cron表达式
        if (cron === '0 * * * *') {
          description = '每小时';
        } else if (cron.match(/^0 \d+ \* \* \*$/)) {
          const hour = cron.split(' ')[1];
          description = `每天 ${hour}:00`;
        } else if (cron.match(/^0 \d+ \* \* \d+$/)) {
          const hour = cron.split(' ')[1];
          const day = cron.split(' ')[4];
          const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
          description = `每${weekdays[day]} ${hour}:00`;
        }

        return (
          <Tooltip title={cron}>
            <span>{description}</span>
          </Tooltip>
        );
      }
    },
    {
      title: '上次执行',
      dataIndex: 'lastRun',
      key: 'lastRun',
    },
    {
      title: '下次执行',
      dataIndex: 'nextRun',
      key: 'nextRun',
    },
    {
      title: '执行情况',
      key: 'execStats',
      render: (_, record) => (
        <span>
          <Tag color="green">成功: {record.success}</Tag>
          <Tag color="red">失败: {record.fail}</Tag>
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<SettingOutlined />} 
            onClick={() => handleConfigTask(record)}
            title="配置"
          />
          <Button 
            type="text" 
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />} 
            onClick={() => handleToggleTaskStatus(record)}
            title={record.status === 'active' ? '暂停' : '启用'}
          />
          <Button 
            type="text" 
            icon={<FieldTimeOutlined />} 
            onClick={() => handleRunTask(record)}
            title="立即执行"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditTask(record)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除此任务吗？"
            onConfirm={() => handleDeleteTask(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              title="删除"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Content className="content">
      <div style={{ padding: 24, background: '#fff', borderRadius: 4 }}>
        <Title level={4}>任务管理</Title>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="总任务数" 
                value={tasks.length} 
                prefix={<FieldTimeOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="运行中任务" 
                value={tasks.filter(task => task.status === 'active').length} 
                valueStyle={{ color: '#3f8600' }}
                prefix={<PlayCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="已暂停任务" 
                value={tasks.filter(task => task.status === 'paused').length} 
                valueStyle={{ color: '#faad14' }}
                prefix={<PauseCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Statistic 
                title="可用插件" 
                value={plugins.length} 
                prefix={<AppstoreOutlined />} 
              />
            </Card>
          </Col>
        </Row>

        {/* 工具栏 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddTask}
          >
            新建任务
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => setLoading(true)}
          >
            刷新
          </Button>
        </div>

        {/* 任务表格 */}
        <Table 
          columns={columns} 
          dataSource={tasks} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </div>

      {/* 添加/编辑任务模态框 */}
      <Modal
        title={currentTask ? '编辑任务' : '新建任务'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleSubmitTask}
        >
          <Tabs defaultActiveKey="basic" items={[
            {
              key: 'basic',
              label: '基本设置',
              children: (
                <>
                  <Form.Item
                    name="name"
                    label="任务名称"
                    rules={[{ required: true, message: '请输入任务名称' }]}
                  >
                    <Input placeholder="请输入任务名称" />
                  </Form.Item>

                  <Form.Item
                    name="pluginId"
                    label="选择插件"
                    rules={[{ required: true, message: '请选择插件' }]}
                  >
                    <Select 
                      placeholder="请选择插件"
                      onChange={handlePluginChange}
                    >
                      {plugins.map(plugin => (
                        <Option key={plugin.id} value={plugin.id}>
                          {plugin.name} - v{plugin.version}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="cron"
                    label="执行计划"
                    rules={[{ required: true, message: '请设置执行计划' }]}
                  >
                    <CronVisualEditor />
                  </Form.Item>
                </>
              )
            },
            {
              key: 'config',
              label: '插件配置',
              disabled: !selectedPlugin,
              children: selectedPlugin ? (
                <DynamicPluginConfigForm 
                  plugin={selectedPlugin}
                  value={pluginConfig}
                  onChange={setPluginConfig}
                />
              ) : (
                <Alert
                  message="请先选择插件"
                  description="在基本设置中选择插件后，可以配置插件参数"
                  type="info"
                  showIcon
                />
              )
            }
          ]} />

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              {currentTask ? '保存修改' : '创建任务'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 配置任务模态框 */}
      <Modal
        title="任务配置"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        onOk={handleSaveConfig}
        okText="保存配置"
        cancelText="取消"
        width={600}
      >
        {selectedPlugin && (
          <DynamicPluginConfigForm 
            plugin={selectedPlugin}
            value={pluginConfig}
            onChange={setPluginConfig}
          />
        )}
      </Modal>
    </Content>
  );
};

export default TasksManagement;
