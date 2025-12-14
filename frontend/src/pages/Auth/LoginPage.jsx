import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/Auth/LoginForm';
import { Candy, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (data) => {
    try {
      setError('');
      const result = await login(data.email, data.password);
      
      if (!result.success) {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sweet-light via-white to-sweet-light/50 p-4">
      <div className="w-full max-w-md">
        {/* Decorative Top */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-full mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-sweet-dark mb-2">
            Welcome Back! 🍬
          </h1>
          <p className="text-sweet-dark/70">
            Sign in to manage your sweet inventory
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sweet-shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-sweet-primary to-sweet-accent p-6">
            <div className="flex items-center justify-center space-x-3">
              <Candy className="text-white" size={28} />
              <h2 className="text-2xl font-bold text-white">Sweet Shop Login</h2>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <LoginForm onSubmit={handleLogin} loading={loading} />

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-sweet-light"></div>
              <div className="px-4 text-sm text-sweet-dark/50">or</div>
              <div className="flex-grow border-t border-sweet-light"></div>
            </div>

            {/* Demo Credentials */}
            <div className="mb-6 p-4 bg-sweet-light/50 rounded-lg">
              <h4 className="font-semibold text-sweet-dark mb-2">Demo Credentials:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <Mail size={14} className="text-sweet-primary mr-2" />
                  <span className="font-mono">admin@example.com</span>
                </div>
                <div className="flex items-center">
                  <Lock size={14} className="text-sweet-primary mr-2" />
                  <span className="font-mono">password: admin123</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="text-center space-y-4">
              <p className="text-sweet-dark/70">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-sweet-primary font-semibold hover:text-sweet-accent transition-colors"
                >
                  Create one now
                </Link>
              </p>
              <Link
                to="/"
                className="inline-block text-sweet-dark/60 hover:text-sweet-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Sweet Animation */}
        <div className="text-center mt-8">
          <div className="inline-block float-animation">
            <div className="text-4xl">🍭🍬🍫</div>
          </div>
          <p className="text-sm text-sweet-dark/50 mt-4">
            Your sweet journey starts here!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;