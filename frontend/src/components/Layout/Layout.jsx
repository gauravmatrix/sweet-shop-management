import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  XCircle,
  Bell
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Welcome to Sweet Shop!', time: 'Just now' },
    { id: 2, type: 'success', message: 'System is running smoothly', time: '5 min ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Clear notifications on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [notifications]);

  const addNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      time: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="relative">
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sweet-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sweet-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sweet-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Notifications Bell */}
      <div className="fixed top-24 right-6 z-40">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Notifications"
        >
          <Bell className="text-sweet-dark" size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <>
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-sweet-light z-40 overflow-hidden">
              <div className="p-4 border-b border-sweet-light">
                <h3 className="font-semibold text-sweet-dark">Notifications</h3>
                <p className="text-sm text-sweet-dark/70">
                  {notifications.length} new notifications
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-sweet-light ${getNotificationColor(notification.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-sweet-dark">
                            {notification.message}
                          </p>
                          <p className="text-xs text-sweet-dark/50 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-sweet-dark/30 hover:text-sweet-dark"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto text-sweet-dark/30 mb-2" size={32} />
                    <p className="text-sweet-dark/50">No notifications</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-sweet-light">
                <button
                  onClick={() => setNotifications([])}
                  className="w-full text-sm text-sweet-primary hover:text-sweet-primary/80 transition-colors"
                >
                  Clear all notifications
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="min-h-[calc(100vh-4rem)]"
        >
          {/* Page Header */}
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-4xl font-bold text-sweet-dark mb-2">
                  {getPageTitle(location.pathname)}
                </h1>
                <p className="text-sweet-dark/70">
                  {getPageDescription(location.pathname)}
                </p>
              </motion.div>
              
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <nav className="flex items-center space-x-2 text-sm">
                  <span className="text-sweet-dark/50">Sweet Shop</span>
                  <span className="text-sweet-dark/30">/</span>
                  {getBreadcrumbs(location.pathname).map((crumb, index, array) => (
                    <React.Fragment key={crumb.path}>
                      <a
                        href={crumb.path}
                        className={`${
                          index === array.length - 1
                            ? 'text-sweet-primary font-semibold'
                            : 'text-sweet-dark/70 hover:text-sweet-primary'
                        } transition-colors`}
                      >
                        {crumb.label}
                      </a>
                      {index < array.length - 1 && (
                        <span className="text-sweet-dark/30">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Helper functions
const getPageTitle = (pathname) => {
  const titles = {
    '/': 'Sweet Shop Dashboard',
    '/sweets': 'Sweet Collection',
    '/dashboard': 'User Dashboard',
    '/admin/dashboard': 'Admin Dashboard',
    '/admin/sweets': 'Manage Sweets',
    '/admin/users': 'Manage Users',
    '/login': 'Login to Sweet Shop',
    '/register': 'Create Account',
    '/profile': 'My Profile',
  };
  
  return titles[pathname] || 'Sweet Shop Management';
};

const getPageDescription = (pathname) => {
  const descriptions = {
    '/': 'Manage your sweet inventory and track sales',
    '/sweets': 'Browse and manage our delicious sweet collection',
    '/dashboard': 'Track your purchases and sweet preferences',
    '/admin/dashboard': 'Administrator control panel',
    '/admin/sweets': 'Add, edit, and manage sweet items',
    '/admin/users': 'Manage user accounts and permissions',
    '/login': 'Access your Sweet Shop account',
    '/register': 'Join our sweet community',
    '/profile': 'Update your personal information',
  };
  
  return descriptions[pathname] || 'Sweet Shop Management System';
};

const getBreadcrumbs = (pathname) => {
  const segments = pathname.split('/').filter(segment => segment);
  const breadcrumbs = [{ path: '/', label: 'Home' }];
  
  let currentPath = '';
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    breadcrumbs.push({ path: currentPath, label });
  });
  
  return breadcrumbs;
};

export default Layout;