import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import AdminDashboard from './components/admin/AdminDashboard';
import Statistics from './components/admin/Statistics';
import FarbrengensManagement from './components/admin/FarbrengensManagement';
import UserManagement from './components/admin/UserManagement';

// דפי התוועדויות
import Farbrengens from './pages/farbrengens/Farbrengens';
import NewFarbrengen from './pages/farbrengens/NewFarbrengen';
import EditFarbrengen from './pages/farbrengens/EditFarbrengen';
import FarbrengenDetail from './pages/farbrengens/FarbrengenDetail';

// דפי אימות
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './pages/auth/Profile';
import ResetPassword from './components/auth/ResetPassword';

// דף הבית
import Home from './pages/home/Home';

const AppRoutes = () => {
  return (
    <Routes>
      {/* דף הבית */}
      <Route path="/" element={<Home />} />

      {/* דפי אימות */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />

      {/* דפ ניהול */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/statistics" 
        element={
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/farbrengens" 
        element={
          <PrivateRoute>
            <FarbrengensManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        } 
      />

      {/* דפי התוועדויות */}
      <Route 
        path="/farbrengens" 
        element={
          <PrivateRoute>
            <Farbrengens />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/farbrengens/new" 
        element={
          <PrivateRoute>
            <NewFarbrengen />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/farbrengens/:id" 
        element={
          <PrivateRoute>
            <FarbrengenDetail />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/farbrengens/edit/:id" 
        element={
          <PrivateRoute>
            <EditFarbrengen />
          </PrivateRoute>
        } 
      />

      {/* נתיב לאיפוס סיסמה */}
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthProvider>
  );
};

export default App;