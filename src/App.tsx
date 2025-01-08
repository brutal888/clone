import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Browse from './pages/Browse';
import AdminDashboard from './pages/AdminDashboard';
import Watch from './pages/Watch';
import Layout from './components/Layout';

function PrivateRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isAdmin } = useAuthStore();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/browse" />;

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/browse" />} />
          <Route path="browse" element={<Browse />} />
          <Route path="watch/:id" element={<Watch />} />
          <Route
            path="admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
