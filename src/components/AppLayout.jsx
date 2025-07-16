import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Drawer, Button, Dropdown, Avatar, Space } from 'antd';
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  DownOutlined,
  CloudServerOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';

const { Header } = Layout;

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 当前用户数据（从本地存储获取）
  const currentUser = {
    name: localStorage.getItem('userName') || '用户',
    avatar: null // 可以设置头像URL
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const navLinks = [
    { key: '/', label: '仪表盘', icon: <DashboardOutlined /> },
    { key: '/store', label: '插件商店', icon: <AppstoreOutlined /> },
    { key: '/tasks', label: '任务管理', icon: <FieldTimeOutlined /> },
    { key: '/nodes', label: '节点管理', icon: <CloudServerOutlined /> },
    { key: '/logs', label: '日志查看', icon: <FileTextOutlined /> },
  ];

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Layout className="dashboard-layout">
      <Header className="header">
        <div className="header-left">
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={showDrawer}
            className="mobile-menu-button"
          />
          <h1>签到管理系统</h1>
        </div>

        <div className="header-right">
          {/* 导航链接 - 在桌面端显示 */}
          <div className="nav-menu" style={{ display: 'flex' }}>
            {navLinks.map(link => (
              <Link 
                key={link.key} 
                to={link.key}
                className={`nav-link ${location.pathname === link.key ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 用户下拉菜单 */}
          <Dropdown menu={{ items: [
            { key: 'settings', label: <Link to="/settings">系统设置</Link>, icon: <SettingOutlined /> },
            { type: 'divider' },
            { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout }
          ]}} trigger={['click']}>
            <div className="user-dropdown">
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{currentUser.name}</span>
                <DownOutlined />
              </Space>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        className="mobile-drawer"
      >
        <div className="user-info-section">
          <Avatar size="large" icon={<UserOutlined />} />
          <span className="username">{currentUser.name}</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
          onClick={closeDrawer}
        >
          {navLinks.map(link => (
            <Menu.Item key={link.key} icon={link.icon}>
              <Link to={link.key}>{link.label}</Link>
            </Menu.Item>
          ))}

          <div className="menu-divider" />

          <Menu.Item key="/settings" icon={<SettingOutlined />}>
            <Link to="/settings">系统设置</Link>
          </Menu.Item>

          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Menu.Item>
        </Menu>
      </Drawer>

      <Outlet />
    </Layout>
  );
};

export default AppLayout;
