import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Candy,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Users,
  Settings,
  ShoppingCart,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/sweets', label: 'Sweets', icon: <Candy size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Panel', icon: <Settings size={20} /> },
    { path: '/admin/sweets', label: 'Manage Sweets', icon: <Package size={20} /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20} /> },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const UserAvatar = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-full flex items-center justify-center text-white font-semibold">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        {isAdmin && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-xs">👑</span>
          </div>
        )}
      </div>
      <div className="hidden md:block text-left">
        <p className="font-semibold text-sweet-dark">{user?.username}</p>
        <p className="text-xs text-sweet-dark/70">{user?.email}</p>
      </div>
      <ChevronDown size={16} className="text-sweet-dark/60" />
    </div>
  );

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
        : 'bg-gradient-to-r from-sweet-primary to-sweet-accent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              scrolled ? 'bg-gradient-to-r from-sweet-primary to-sweet-accent' : 'bg-white'
            }`}>
              <Candy className={scrolled ? 'text-white' : 'text-sweet-primary'} size={28} />
            </div>
            <div>
              <h1 className={`text-2xl font-heading font-bold ${
                scrolled ? 'text-sweet-primary' : 'text-white'
              }`}>
                Sweet Shop 🍬
              </h1>
              <p className={`text-xs ${scrolled ? 'text-sweet-dark/70' : 'text-white/80'}`}>
                Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? scrolled
                      ? 'bg-sweet-primary/10 text-sweet-primary'
                      : 'bg-white/20 text-white'
                    : scrolled
                    ? 'text-sweet-dark hover:bg-sweet-light'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {isAdmin && adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? scrolled
                      ? 'bg-yellow-500/10 text-yellow-600'
                      : 'bg-yellow-500/20 text-yellow-200'
                    : scrolled
                    ? 'text-sweet-dark hover:bg-sweet-light'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    scrolled
                      ? 'hover:bg-sweet-light'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <UserAvatar />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-sweet-light z-50 overflow-hidden">
                      <div className="p-4 border-b border-sweet-light">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {user?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sweet-dark">{user.username}</p>
                            <p className="text-sm text-sweet-dark/70">{user.email}</p>
                            <div className="mt-1">
                              <span className="inline-block px-2 py-1 text-xs rounded-full bg-sweet-primary/10 text-sweet-primary">
                                {isAdmin ? 'Admin' : 'User'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-sweet-light text-sweet-dark transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={18} />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-sweet-light text-sweet-dark transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-yellow-50 text-yellow-700 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings size={18} />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>
                      
                      <div className="p-2 border-t border-sweet-light">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    scrolled
                      ? 'bg-sweet-primary text-white hover:bg-sweet-primary/90'
                      : 'bg-white text-sweet-primary hover:bg-white/90'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-sweet-secondary text-white rounded-lg font-semibold hover:bg-sweet-secondary/90 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled
                ? 'bg-sweet-light text-sweet-dark'
                : 'bg-white/10 text-white'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden py-4 border-t ${
            scrolled ? 'border-sweet-light' : 'border-white/20'
          }`}>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? scrolled
                        ? 'bg-sweet-primary/10 text-sweet-primary'
                        : 'bg-white/20 text-white'
                      : scrolled
                      ? 'text-sweet-dark hover:bg-sweet-light'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {isAdmin && (
                <>
                  <div className="px-4 py-2">
                    <p className={`text-sm font-semibold ${
                      scrolled ? 'text-sweet-dark/70' : 'text-white/70'
                    }`}>
                      Admin
                    </p>
                  </div>
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-yellow-500/20 text-yellow-600'
                          : scrolled
                          ? 'text-sweet-dark hover:bg-sweet-light'
                          : 'text-white/90 hover:bg-white/10'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </>
              )}

              {user ? (
                <>
                  <div className="pt-4 border-t border-sweet-light/50">
                    <div className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-full flex items-center justify-center text-white font-semibold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-semibold ${scrolled ? 'text-sweet-dark' : 'text-white'}`}>
                            {user.username}
                          </p>
                          <p className={`text-sm ${scrolled ? 'text-sweet-dark/70' : 'text-white/70'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg hover:bg-white/10 text-white transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-sweet-light/50">
                  <div className="grid grid-cols-2 gap-2 px-4">
                    <Link
                      to="/login"
                      className="px-4 py-3 bg-sweet-primary text-white rounded-lg font-semibold text-center hover:bg-sweet-primary/90 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-3 bg-sweet-secondary text-white rounded-lg font-semibold text-center hover:bg-sweet-secondary/90 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;