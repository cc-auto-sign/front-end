import React from 'react';
import useUserStore from '../store/userStore';

/**
 * 权限控制组件，根据用户权限条件性渲染元素
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.permission - 所需权限标识
 * @param {React.ReactNode} props.children - 子组件，在有权限时显示
 * @param {React.ReactNode} [props.fallback] - 可选的后备内容，在无权限时显示
 * @returns {React.ReactNode} - 根据权限返回的内容
 */
const WithPermission = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useUserStore();

  // 如果用户有权限，则渲染子组件
  if (hasPermission(permission)) {
    return children;
  }

  // 否则返回后备内容（默认为null，即不显示任何内容）
  return fallback;
};

export default WithPermission;
