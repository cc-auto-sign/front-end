import { useState, useEffect, useCallback } from 'react';
import { AuthAPI } from '../api';

/**
 * 创建用户状态存储
 * 用于管理用户信息、权限等状态
 */
export const useUserStore = () => {
  // 用户基本信息
  const [userInfo, setUserInfo] = useState(null);
  // 用户角色列表
  const [roles, setRoles] = useState([]);
  // 用户权限列表
  const [permissions, setPermissions] = useState([]);
  // 用户菜单列表
  const [menus, setMenus] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 错误信息
  const [error, setError] = useState(null);

  /**
   * 加载用户信息
   */
  const loadUserInfo = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AuthAPI.getUserInfo();

      if (response.code === 200 && response.data) {
        const userData = response.data;

        // 设置用户基本信息
        setUserInfo({
          userId: userData.userId,
          username: userData.username,
          nickName: userData.nickName || userData.username,
          avatar: userData.avatar || '',
          status: userData.status,
          createTime: userData.createTime
        });

        // 设置用户角色
        setRoles(userData.roles || []);

        // 设置用户权限
        setPermissions(userData.permissions || []);

        // 设置用户菜单
        setMenus(userData.menus || []);
      }
    } catch (err) {
      setError(err.message || '获取用户信息失败');
      console.error('Failed to load user info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 清除用户信息
   */
  const clearUserInfo = useCallback(() => {
    setUserInfo(null);
    setRoles([]);
    setPermissions([]);
    setMenus([]);
  }, []);

  /**
   * 检查用户是否有特定权限
   * @param {string} permission - 权限标识
   * @returns {boolean} - 是否拥有权限
   */
  const hasPermission = useCallback((permission) => {
    // 如果用户是管理员角色，默认拥有所有权限
    if (roles.some(role => role.roleKey === 'admin')) {
      return true;
    }

    // 检查具体权限
    return permissions.includes(permission);
  }, [permissions, roles]);

  /**
   * 是否为管理员
   * @returns {boolean} - 是否为管理员
   */
  const isAdmin = useCallback(() => {
    return roles.some(role => role.roleKey === 'admin');
  }, [roles]);

  /**
   * 初始加载用户信息
   */
  useEffect(() => {
    if (localStorage.getItem('token')) {
      loadUserInfo();
    }
  }, [loadUserInfo]);

  return {
    userInfo,
    roles,
    permissions,
    menus,
    loading,
    error,
    loadUserInfo,
    clearUserInfo,
    hasPermission,
    isAdmin
  };
};

export default useUserStore;
