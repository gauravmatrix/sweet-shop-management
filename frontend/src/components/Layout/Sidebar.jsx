import { NavLink } from 'react-router-dom';
import { 
  Home, Package, ShoppingCart, Users, BarChart3, 
  Settings, LogOut, User, Bell, HelpCircle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.is_admin || false;

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/sweets', label: 'Browse Sweets', icon: <Package size={20} /> },
    { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
    { path: '/orders', label: 'My Orders', icon: <ShoppingCart size={20} /> },
    { path: '/help', label: 'Help Center', icon: <HelpCircle size={20} /> },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/admin/sweets', label: 'Manage Sweets', icon: <Package size={20} /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20} /> },
    { path: '/admin/orders', label: 'All Orders', icon: <ShoppingCart size={20} /> },
    { path: '/admin/reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-sweet-dark to-sweet-dark/90 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-sweet-primary to-sweet-accent rounded-full flex items-center justify-center">
            <span className="text-xl">🍬</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Sweet Shop</h2>
            <p className="text-xs text-white/70">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sweet-primary/20 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-white/70 truncate">{user?.email || 'user@example.com'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-sweet-primary/20 rounded-full">
              {isAdmin ? 'Admin' : 'User'}
            </span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg">
            <Bell size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          <p className="text-xs uppercase text-white/50 font-semibold mb-2">Main</p>
          {userNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-sweet-primary/20 to-sweet-accent/20 text-white border-l-4 border-sweet-primary'
                    : 'hover:bg-white/10 text-white/80'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-8 space-y-1">
            <p className="text-xs uppercase text-white/50 font-semibold mb-2">Administration</p>
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-sweet-secondary/20 to-emerald-400/20 text-white border-l-4 border-sweet-secondary'
                      : 'hover:bg-white/10 text-white/80'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <div className="mt-4 text-center text-xs text-white/50">
          <p>Sweet Shop v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;