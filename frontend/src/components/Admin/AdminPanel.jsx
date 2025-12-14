import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Icons
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ShoppingCart,
  Bell,
  User,
  CreditCard,
  FileText,
  Shield,
  HelpCircle
} from 'lucide-react';

const AdminPanel = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminMenuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/admin/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Manage Sweets',
      icon: <Package size={20} />,
      path: '/admin/sweets',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Manage Users',
      icon: <Users size={20} />,
      path: '/admin/users',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Sales Reports',
      icon: <BarChart3 size={20} />,
      path: '/admin/reports',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Orders',
      icon: <ShoppingCart size={20} />,
      path: '/admin/orders',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/admin/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
  ];

  const quickStats = [
    { label: 'Total Sweets', value: '156', change: '+12%', icon: '🍬' },
    { label: 'Today\'s Orders', value: '24', change: '+8%', icon: '📦' },
    { label: 'Revenue', value: '₹12,850', change: '+15%', icon: '💰' },
    { label: 'New Users', value: '8', change: '+5%', icon: '👤' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'added new sweet', target: 'Chocolate Truffle', time: '5 min ago' },
    { user: 'Jane Smith', action: 'updated stock', target: 'Gulab Jamun', time: '15 min ago' },
    { user: 'Admin', action: 'restocked', target: 'Gummy Bears', time: '30 min ago' },
    { user: 'System', action: 'low stock alert', target: 'Rasgulla', time: '1 hour ago' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sweet-light via-white to-sweet-light/30">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-sweet-light shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-sweet-light"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-sweet-dark">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-sweet-dark/70">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-sweet-light">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-sweet-dark">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-sweet-dark/70">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-full flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-sweet-light min-h-[calc(100vh-80px)] sticky top-20">
          <div className="p-6">
            {/* User Profile Card */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <h3 className="font-semibold text-sweet-dark">{user?.username || 'Admin User'}</h3>
                  <p className="text-sm text-sweet-dark/70">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
              
              <div className="bg-sweet-light rounded-lg p-3">
                <p className="text-sm text-sweet-dark">
                  <span className="font-semibold">Role:</span> Administrator
                </p>
                <p className="text-sm text-sweet-dark">
                  <span className="font-semibold">Last Login:</span> Today, 10:30 AM
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {adminMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? `${item.bgColor} ${item.color} font-semibold`
                      : 'text-sweet-dark/70 hover:bg-sweet-light hover:text-sweet-dark'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-current"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-sweet-light"></div>

            {/* Quick Links */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider text-sweet-dark/50 font-semibold mb-3">
                Quick Links
              </h4>
              <div className="space-y-2">
                <a href="/" className="flex items-center space-x-2 text-sm text-sweet-dark/70 hover:text-sweet-primary">
                  <Home size={16} />
                  <span>Public Site</span>
                </a>
                <a href="/dashboard" className="flex items-center space-x-2 text-sm text-sweet-dark/70 hover:text-sweet-primary">
                  <LayoutDashboard size={16} />
                  <span>User Dashboard</span>
                </a>
              </div>
            </div>

            {/* System Status */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider text-sweet-dark/50 font-semibold mb-3">
                System Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sweet-dark/70">API Status</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-semibold">Online</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sweet-dark/70">Database</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-semibold">Healthy</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-sweet-dark">Admin Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-sweet-light"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                        isActive(item.path)
                          ? `${item.bgColor} ${item.color} font-semibold`
                          : 'text-sweet-dark/70 hover:bg-sweet-light'
                      }`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-sweet-light">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{stat.icon}</div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <p className="text-sm text-sweet-dark/70 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-sweet-dark">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-sweet-dark">Recent Activity</h3>
              <button className="text-sm text-sweet-primary hover:text-sweet-accent">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-sweet-light rounded-full flex items-center justify-center">
                    <User size={16} className="text-sweet-dark/70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-sweet-dark">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-semibold">{activity.target}</span>
                    </p>
                    <p className="text-xs text-sweet-dark/50">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page Content */}
          <div className="bg-white rounded-xl shadow-md border border-sweet-light overflow-hidden">
            {children}
          </div>

          {/* Admin Footer */}
          <div className="mt-8 text-center text-sm text-sweet-dark/50">
            <p>Sweet Shop Management System v1.0.0 • Admin Panel</p>
            <p className="mt-1">
              Need help?{' '}
              <a href="#" className="text-sweet-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;