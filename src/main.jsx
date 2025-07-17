import '@ant-design/v5-patch-for-react-19';
import { createRoot } from 'react-dom/client'
import 'normalize.css'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./views/Home/Index.jsx";
import About from "./views/About/Index.jsx";
import AppStore from "./views/AppStore/Index.jsx";
import LogsView from "./views/Logs/Index.jsx";
import Settings from "./views/Settings/Index.jsx";
import NodesManagement from "./views/Nodes/Index.jsx";
import TasksManagement from "./views/Tasks/Index.jsx";
import Login from "./views/Login/Index.jsx";
import NotFound from "./views/NotFound/Index.jsx";
import Forbidden from "./views/Forbidden/Index.jsx";
import AppLayout from "./components/AppLayout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* 登录路由 - 独立于 AppLayout */}
      <Route path="/login" element={<Login />} />

      {/* 需要身份验证的路由 */}
      <Route path="/" element={
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      }>
        <Route index element={<Home />} />
        <Route path="store" element={<AppStore />} />
        <Route path="logs" element={<LogsView />} />
        <Route path="tasks" element={<TasksManagement />} />
        <Route path="nodes" element={<NodesManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* 404 页面 */}
      <Route path="/404" element={<NotFound />} />

      {/* 403 权限不足页面 */}
      <Route path="/403" element={<Forbidden />} />

      {/* 未匹配的路由重定向到404 页面 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  </BrowserRouter>,
)
