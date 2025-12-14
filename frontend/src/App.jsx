import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { lazy, Suspense } from 'react';
import './App.css';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sweet-primary"></div>
      <p className="mt-4 text-sweet-dark font-sweet">Loading sweet goodness... 🍬</p>
    </div>
  </div>
);

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const UserDashboard = lazy(() => import('./pages/Dashboard/UserDashboard'));
const SweetsPage = lazy(() => import('./pages/Sweets/SweetsPage'));
const ManageSweetsPage = lazy(() => import('./pages/Admin/ManageSweetsPage'));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sweet-light via-white to-sweet-light/30">
      <Navbar />
      <main className="flex-grow">
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={
                user ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } />
              <Route path="/register" element={
                user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
              } />

              {/* Protected User Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/sweets" element={
                <ProtectedRoute>
                  <SweetsPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/sweets" element={
                <ProtectedRoute requireAdmin>
                  <ManageSweetsPage />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-sweet-primary mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-sweet-dark mb-4">Sweet Not Found! 🍬</h2>
                    <p className="text-sweet-dark/70 mb-6">
                      The page you're looking for doesn't exist or has been moved.
                    </p>
                    <a 
                      href="/" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-sweet-primary to-sweet-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Back to Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </main>
      <Footer />
    </div>
  );
}

export default App;