import { Navigate } from "react-router-dom";

// 验证用户是否已登录的辅助组件
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 检查token和登录状态
  if (!token || !isLoggedIn) {
    // 清理任何可能存在的过期状态
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
