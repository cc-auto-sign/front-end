import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PageLoading from "./PageLoading";
import useUserStore from "../store/userStore";

/**
 * 验证用户是否已登录及是否有权限访问
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {string} [props.permission] - 需要的权限标识，如果不提供则只检查登录状态
 * @returns {React.ReactNode} - 返回子组件或重定向到登录页
 */
const RequireAuth = ({ children, permission }) => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  const { userInfo, loadUserInfo, hasPermission } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (token && isLoggedIn) {
        if (!userInfo) {
          try {
            await loadUserInfo();
          } catch (error) {
            console.error("Failed to load user info:", error);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, isLoggedIn, userInfo, loadUserInfo]);

  // 如果正在加载用户信息，显示加载状态
  if (loading) {
    return <PageLoading message="正在验证身份..." />;
  }

  // 检查token和登录状态
  if (!token || !isLoggedIn) {
    // 清理任何可能存在的过期状态
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果指定了权限要求，则检查用户是否拥有该权限
  if (permission && !hasPermission(permission)) {
    // 没有权限，导航到403页面
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default RequireAuth;

