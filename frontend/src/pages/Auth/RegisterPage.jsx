import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from '../../components/Auth/RegisterForm';
import { Candy, UserPlus, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (data) => {
    try {
      setError('');
      const result = await register(data);
      
      if (!result.success) {
        setError('Registration failed. Please check your details.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sweet-light via-white to-sweet-light/50 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-sweet-secondary to-emerald-400 rounded-full mb-6 relative">
            <UserPlus className="text-white" size={40} />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="text-yellow-400" size={24} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-sweet-dark mb-3">
            Join Our Sweet Family! 🎉
          </h1>
          <p className="text-xl text-sweet-dark/70 max-w-2xl mx-auto">
            Create your account and start managing your sweet inventory like a pro
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sweet-shadow-lg">
            <div className="flex items-center space-x-3 mb-8">
              <Candy className="text-sweet-primary" size={28} />
              <h2 className="text-2xl font-bold text-sweet-dark">
                Create Account
              </h2>
            </div>

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

            <RegisterForm onSubmit={handleRegister} loading={loading} />

            <div className="mt-8 pt-6 border-t border-sweet-light">
              <p className="text-center text-sweet-dark/70">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-sweet-primary font-semibold hover:text-sweet-accent transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-6">
            {/* Benefit Cards */}
            <div className="bg-gradient-to-r from-sweet-primary/10 to-sweet-accent/10 rounded-2xl p-6 border border-sweet-primary/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-sweet-dark mb-2">
                    Real-time Inventory
                  </h3>
                  <p className="text-sweet-dark/70">
                    Track your sweet stock in real-time with automatic updates
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-sweet-secondary/10 to-emerald-400/10 rounded-2xl p-6 border border-sweet-secondary/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-sweet-dark mb-2">
                    Easy Purchases
                  </h3>
                  <p className="text-sweet-dark/70">
                    One-click purchases with instant stock updates
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-sweet-dark mb-2">
                    Mobile Friendly
                  </h3>
                  <p className="text-sweet-dark/70">
                    Access your sweet shop from any device, anywhere
                  </p>
                </div>
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-sweet-light/50 rounded-2xl p-6">
              <h3 className="font-bold text-lg text-sweet-dark mb-4">
                Account Types
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sweet-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sweet-primary text-sm">👑</span>
                    </div>
                    <span className="font-semibold text-sweet-dark">Admin</span>
                  </div>
                  <span className="text-sm text-sweet-dark/70">Full access</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sweet-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-sweet-secondary text-sm">👤</span>
                    </div>
                    <span className="font-semibold text-sweet-dark">User</span>
                  </div>
                  <span className="text-sm text-sweet-dark/70">Basic access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sweet-dark/60 hover:text-sweet-primary transition-colors"
          >
            <span>←</span>
            <span>Back to Homepage</span>
          </Link>
          <p className="text-sm text-sweet-dark/50 mt-4">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;