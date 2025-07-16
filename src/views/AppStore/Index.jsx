import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, List, Button, Tag, Avatar, notification, Modal } from 'antd';
import { DownloadOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

const mockApps = [
  {
    id: 1,
    name: '微博',
    icon: '微博',
    description: '新浪微博自动签到，支持多账号管理，每日自动领取积分',
    downloads: 2354,
    version: '1.2.0',
    author: '签到团队',
    tags: ['热门', '社交']
  },
  {
    id: 2,
    name: '哔哩哔哩',
    icon: 'B站',
    description: 'B站每日签到领取经验，支持自动观看视频、投币等任务',
    downloads: 1872,
    version: '2.0.1',
    author: 'B站爱好者',
    tags: ['视频', '热门']
  },
  {
    id: 3,
    name: '知乎',
    icon: '知乎',
    description: '知乎每日签到，支持自动回答问题获取更多积分',
    downloads: 1254,
    version: '1.5.3',
    author: '匿名开发者',
    tags: ['问答']
  },
  {
    id: 4,
    name: '百度贴吧',
    icon: '贴吧',
    description: '贴吧自动签到，支持一键签到所有关注的贴吧',
    downloads: 2018,
    version: '3.1.0',
    author: '签到团队',
    tags: ['论坛']
  },
  {
    id: 5,
    name: '京东',
    icon: '京东',
    description: '京东每日签到领京豆，支持自动完成每日任务',
    downloads: 3254,
    version: '2.3.1',
    author: '电商助手',
    tags: ['购物', '热门']
  },
  {
    id: 6,
    name: '网易云音乐',
    icon: '网易云',
    description: '网易云音乐签到，支持自动听歌、点赞等任务',
    downloads: 1654,
    version: '1.1.2',
    author: '音乐爱好者',
    tags: ['音乐']
  },
];

const AppStore = () => {
  const [apps, setApps] = useState(mockApps);
  const [loading, setLoading] = useState(false);
  const [uninstallModalVisible, setUninstallModalVisible] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);

  // 检查插件安装状态
  useEffect(() => {
    // 模拟从本地存储获取已安装的插件
    const installedAppIds = localStorage.getItem('installedApps') 
      ? JSON.parse(localStorage.getItem('installedApps')) 
      : [];

    const updatedApps = apps.map(app => ({
      ...app,
      installed: installedAppIds.includes(app.id)
    }));

    setApps(updatedApps);
  }, []);

  // 安装插件
  const handleInstall = (app) => {
    setLoading(true);

    // 模拟安装过程
    setTimeout(() => {
      // 更新本地存储
      const installedAppIds = localStorage.getItem('installedApps')
        ? JSON.parse(localStorage.getItem('installedApps'))
        : [];

      if (!installedAppIds.includes(app.id)) {
        installedAppIds.push(app.id);
        localStorage.setItem('installedApps', JSON.stringify(installedAppIds));
      }

      // 更新UI
      const updatedApps = apps.map(a => {
        if (a.id === app.id) {
          return { ...a, installed: true };
        }
        return a;
      });

      setApps(updatedApps);
      setLoading(false);

      notification.success({
        message: '安装成功',
        description: `${app.name} 插件已成功安装，您可以在任务管理中使用它。`
      });
    }, 1500);
  };

  // 显示卸载确认
  const showUninstallConfirm = (app) => {
    setCurrentApp(app);
    setUninstallModalVisible(true);
  };

  // 卸载插件
  const handleUninstall = () => {
    if (!currentApp) return;

    setLoading(true);

    // 模拟卸载过程
    setTimeout(() => {
      // 更新本地存储
      const installedAppIds = localStorage.getItem('installedApps')
        ? JSON.parse(localStorage.getItem('installedApps'))
        : [];

      const updatedIds = installedAppIds.filter(id => id !== currentApp.id);
      localStorage.setItem('installedApps', JSON.stringify(updatedIds));

      // 更新UI
      const updatedApps = apps.map(a => {
        if (a.id === currentApp.id) {
          return { ...a, installed: false };
        }
        return a;
      });

      setApps(updatedApps);
      setLoading(false);
      setUninstallModalVisible(false);

      notification.success({
        message: '卸载成功',
        description: `${currentApp.name} 插件已成功卸载。`
      });
    }, 1500);
  };

  // 更新插件
  const handleUpdate = (app) => {
    setLoading(true);

    // 模拟更新过程
    setTimeout(() => {
      setLoading(false);

      notification.success({
        message: '更新成功',
        description: `${app.name} 插件已更新到最新版本。`
      });
    }, 1500);
  };

  return (
    <Content className="content">
      <div style={{ padding: 24, background: '#fff', borderRadius: 4 }}>
        <Title level={4}>插件商店</Title>
        <p style={{ marginBottom: 20 }}>从插件商店安装更多平台插件，您可以在任务管理中使用它们创建自动化任务</p>

        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={apps}
          loading={loading}
          renderItem={app => (
            <List.Item>
              <Card
                className="platform-card"
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={40} style={{ backgroundColor: '#1677ff', color: '#fff' }}>
                      {app.icon}
                    </Avatar>
                    <span style={{ marginLeft: 10 }}>{app.name}</span>
                  </div>
                }
                extra={app.installed && <Tag color="green">已安装</Tag>}
                actions={[
                  app.installed ? (
                    <>
                      <Button 
                        type="primary" 
                        icon={<SyncOutlined />} 
                        size="small"
                        onClick={() => handleUpdate(app)}
                      >
                        更新
                      </Button>
                      <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={() => showUninstallConfirm(app)}
                        style={{ marginLeft: 8 }}
                      >
                        卸载
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      size="small"
                      onClick={() => handleInstall(app)}
                    >
                      安装
                    </Button>
                  )
                ]}
              >
                <div style={{ marginBottom: 10 }}>
                  {app.description}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <small>版本: {app.version} | 下载: {app.downloads}</small>
                </div>
                <div>
                  {app.tags.map(tag => (
                    <Tag key={tag} color="blue" style={{ marginRight: 5 }}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* 卸载确认模态框 */}
      <Modal
        title="确认卸载"
        open={uninstallModalVisible}
        onOk={handleUninstall}
        onCancel={() => setUninstallModalVisible(false)}
        okText="确认卸载"
        cancelText="取消"
      >
        <p>确定要卸载 <strong>{currentApp?.name}</strong> 插件吗？</p>
        <p>卸载后，所有使用此插件的任务将无法正常运行。</p>
      </Modal>
    </Content>
  );
};

export default AppStore;
