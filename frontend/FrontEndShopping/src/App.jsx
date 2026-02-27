import { ConfigProvider } from "antd";
import thTH from "antd/locale/th_TH";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";
import Login from "./pages/Login";
import Cart from "./pages/user/Cart";
import Shop from "./pages/user/Shop";
import UserOrders from "./pages/user/UserOrders";

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role)
    return <Navigate to={user.role === "admin" ? "/admin" : "/shop"} replace />;
  return children;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/shop"} replace />;
}

export default function App() {
  return (
    <ConfigProvider
      locale={thTH}
      theme={{ token: { colorPrimary: "#6366f1", borderRadius: 8 } }}
    >
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />

              {/* Admin routes 25*/}
              <Route
                path="/admin"
                element={
                  <RequireAuth role="admin">
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                {/* <Route index element={<AdminDashboard />} /> */}
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* User routes */}
              <Route
                path="/shop"
                element={
                  <RequireAuth>
                    <UserLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<Shop />} />
                <Route path="cart" element={<Cart />} />
                <Route path="orders" element={<UserOrders />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
