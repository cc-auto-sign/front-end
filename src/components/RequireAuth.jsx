import { Navigate } from "react-router-dom";

// 验证用户是否已登录的辅助组件
const RequireAuth = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
