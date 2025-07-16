import React, { useState, useEffect } from 'react';
import { Card, Statistic, Table, Button, Modal, notification, Tabs, List, Tag, Spin, Avatar, Layout } from 'antd';
import { CheckCircleOutlined, AppstoreAddOutlined, ReloadOutlined, ClockCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { getPlatforms, getSignInLogs, getStatistics, installPlatform } from '../../services/api';
import './Dashboard.css';

const { Content } = Layout;


const Home = () => {
  const [platforms, setPlatforms] = useState([]);
  const [signInLogs, setSignInLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [installModalVisible, setInstallModalVisible] = useState(false);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [platformsData, logsData, statsData] = await Promise.all([
        getPlatforms(),
        getSignInLogs(),
        getStatistics()
      ]);

      setPlatforms(platformsData);
      setSignInLogs(logsData);
      setStats(statsData);
    } catch (error) {
      notification.error({
        message: '加载数据失败',
        description: error.message || '请稍后再试'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 安装平台插件
  const handleInstall = (platform) => {
    setCurrentPlatform(platform);
    setInstallModalVisible(true);
  };

  // 签到日志表格列
  const logColumns = [
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status === 'success' ? 
          <Tag color="green">成功</Tag> : 
          <Tag color="red">失败</Tag>
      )
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '详情',
      dataIndex: 'message',
      key: 'message',
    },
  ];

  return (
      <>
    <Content className="content">
        {loading && platforms.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ padding: 24, background: '#fff', borderRadius: 4 }}>
            {/* 统计卡片 */}
            <div className="dashboard-stats">
              <Card hoverable>
                <Statistic 
                  title="已安装平台" 
                  value={stats.totalPlatforms || 0} 
                  prefix={<AppstoreAddOutlined style={{ color: '#1677ff' }} />} 
                />
              </Card>
              <Card hoverable>
                <Statistic 
                  title="今日执行任务" 
                  value={stats.todayTasks || 0} 
                  prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />} 
                />
              </Card>
              <Card hoverable>
                <Statistic 
                  title="活跃任务" 
                  value={stats.activeTasks || 0} 
                  prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />} 
                />
              </Card>
              <Card hoverable>
                <Statistic 
                  title="任务成功率" 
                  value={stats.taskSuccessRate || 0} 
                  suffix="%" 
                  precision={1}
                  valueStyle={{ color: (stats.taskSuccessRate || 0) > 90 ? '#52c41a' : '#f5222d' }}
                />
              </Card>
            </div>

            <Tabs defaultActiveKey="platforms" items={[
              {
                key: 'platforms',
                label: '平台管理',
                children: (
                  <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                      <Button 
                        type="primary" 
                        icon={<ReloadOutlined />} 
                        onClick={loadData}
                      >
                        刷新
                      </Button>
                    </div>

                    <List
                      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                      dataSource={platforms}
                      loading={loading}
                      renderItem={platform => (
                        <List.Item>
                          <Card
                            className="platform-card"
                            title={
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  size={40} 
                                  style={{ 
                                    backgroundColor: platform.installed ? '#1677ff' : '#fafafa', 
                                    color: platform.installed ? '#fff' : '#999' 
                                  }}
                                >
                                  {platform.icon}
                                </Avatar>
                                <span style={{ marginLeft: 10 }}>{platform.name}</span>
                              </div>
                            }
                            extra={platform.installed ? 
                              <Tag color="green">已安装</Tag> : 
                              <Tag color="orange">未安装</Tag>
                            }
                            actions={[
                              platform.installed ? (
                                <Button 
                                  type="text" 
                                  icon={<FieldTimeOutlined />} 
                                  onClick={() => {
                                    notification.info({
                                      message: '前往任务管理',
                                      description: '请在任务管理页面创建使用此插件的任务'
                                    });
                                  }}
                                >
                                  创建任务
                                </Button>
                              ) : (
                                <Button 
                                  type="text" 
                                  icon={<AppstoreAddOutlined />} 
                                  onClick={() => handleInstall(platform)}
                                >
                                  安装
                                </Button>
                              )
                            ]}
                          >
                            <div style={{ minHeight: '60px' }}>
                              {platform.description}
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </>
                )
              },
              {
                key: 'logs',
                label: '签到日志',
                children: (
                  <>
                    <div className="refresh-button">
                      <Button 
                        type="primary" 
                        icon={<ReloadOutlined />} 
                        onClick={loadData}
                      >
                        刷新日志
                      </Button>
                    </div>
                    <Table 
                      columns={logColumns} 
                      dataSource={signInLogs} 
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      loading={loading}
                    />
                  </>
                )
              }
            ]} />
          </div>
        )}
      </Content>


      {/* 安装插件的模态框 */}
      <Modal
        title="安装平台插件"
        open={installModalVisible}
        onCancel={() => setInstallModalVisible(false)}
        onOk={async () => {
          setLoading(true);
          try {
            await installPlatform(currentPlatform.id);
            notification.success({
              message: '安装成功',
              description: `${currentPlatform?.name || ''}平台插件已成功安装`
            });
            setInstallModalVisible(false);
            await loadData(); // 重新加载数据
            // 安装后直接打开配置窗口
            handleConfigure({...currentPlatform, installed: true});
          } catch (error) {
            notification.error({
              message: '安装失败',
              description: error.message || '请稍后再试'
            });
          } finally {
            setLoading(false);
          }
        }}
        confirmLoading={loading}
      >
        <p>确认安装 <b>{currentPlatform?.name}</b> 平台插件吗？安装后需要配置账号信息才能使用。</p>
      </Modal>
      </>
  );
};

export default Home;