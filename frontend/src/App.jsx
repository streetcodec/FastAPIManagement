import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CarForm from './components/Cars/CarForm';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/Layout/Navbar';
import CarDetailView from './components/Cars/CarDetailView';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/cars/new" element={
          <PrivateRoute>
            <CarForm mode="create" />
          </PrivateRoute>
        } />
        <Route path="/cars/:id/edit" element={
          <PrivateRoute>
            <CarForm mode="edit" />
          </PrivateRoute>
        } />
        <Route path="/cars/:id" element={
          <PrivateRoute>
            <CarDetailView />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App; 