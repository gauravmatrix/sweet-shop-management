import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { 
  Users, Search, Filter, UserPlus, Edit, Trash2, 
  Shield, UserCheck, UserX, Mail, Calendar 
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import Loading from '../../components/Common/Loading';
import Error from '../../components/Common/Error';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: adminAPI.getUsers,
    enabled: currentUser?.is_admin,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowDeleteModal(false);
      setSelectedUser(null);
    },
  });

  // Filter users
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      selectedRole === 'all' || 
      (selectedRole === 'admin' && user.is_admin) ||
      (selectedRole === 'user' && !user.is_admin);
    
    return matchesSearch && matchesRole;
  }) || [];

  const handleDeleteUser = () => {
    if (selectedUser && selectedUser.id !== currentUser.id) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  const handleActivateUser = (userId) => {
    // Implementation for activate/deactivate
    console.log('Activate/Deactivate user:', userId);
  };

  if (isLoading) return <Loading text="Loading users..." />;
  if (error) return <Error message="Failed to load users" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sweet-light to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-sweet-dark flex items-center">
                <Users className="mr-3" size={28} />
                User Management
              </h1>
              <p className="text-sweet-dark/70 mt-2">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus className="mr-2" size={20} />
              Add New User
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-sweet-dark mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/50" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sweet-dark mb-2">
                  Filter by Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin Users</option>
                  <option value="user">Regular Users</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-sweet-dark mb-2">
                  Status
                </label>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-sweet-light hover:bg-sweet-light/80 rounded-lg transition-colors">
                    <UserCheck className="inline mr-2" size={16} />
                    Active
                  </button>
                  <button className="px-4 py-2 bg-sweet-light hover:bg-sweet-light/80 rounded-lg transition-colors">
                    <UserX className="inline mr-2" size={16} />
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sweet-dark/70">Total Users</p>
                <p className="text-2xl font-bold text-sweet-dark">{users?.length || 0}</p>
              </div>
              <Users className="text-sweet-primary" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sweet-dark/70">Admin Users</p>
                <p className="text-2xl font-bold text-sweet-secondary">
                  {users?.filter(u => u.is_admin).length || 0}
                </p>
              </div>
              <Shield className="text-sweet-secondary" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sweet-dark/70">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {users?.filter(u => u.is_active).length || 0}
                </p>
              </div>
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sweet-dark/70">New This Month</p>
                <p className="text-2xl font-bold text-sweet-accent">
                  {users?.filter(u => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(u.date_joined) > monthAgo;
                  }).length || 0}
                </p>
              </div>
              <UserPlus className="text-sweet-accent" size={24} />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-sweet-primary to-sweet-accent text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Last Login</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sweet-light">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-sweet-light/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sweet-primary/10 rounded-full flex items-center justify-center">
                          {user.first_name ? (
                            <span className="font-semibold text-sweet-primary">
                              {user.first_name[0]}{user.last_name?.[0]}
                            </span>
                          ) : (
                            <User size={20} className="text-sweet-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sweet-dark">
                            {user.first_name} {user.last_name}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-sweet-dark/70">
                            <Mail size={14} />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_admin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-sweet-dark/70">
                      <div className="flex items-center">
                        <Calendar className="mr-2" size={14} />
                        {formatDate(user.date_joined, 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-sweet-dark/70">
                      {user.last_login ? formatDate(user.last_login, 'MMM dd, yyyy') : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-sweet-primary hover:bg-sweet-light rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_active
                              ? 'text-yellow-500 hover:bg-yellow-50'
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto text-sweet-dark/30" size={48} />
              <p className="mt-4 text-sweet-dark/70">No users found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-sweet-dark/70">
            Showing {filteredUsers.length} of {users?.length || 0} users
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-red-800">Warning: This action cannot be undone</h4>
                <p className="text-red-600 text-sm mt-1">
                  All user data will be permanently deleted
                </p>
              </div>
            </div>
          </div>

          <div className="bg-sweet-light/50 p-4 rounded-lg">
            <p className="font-medium">User to be deleted:</p>
            <p className="text-lg font-bold mt-1">{selectedUser?.email}</p>
            <p className="text-sm text-sweet-dark/70">
              {selectedUser?.first_name} {selectedUser?.last_name}
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
              loading={deleteMutation.isLoading}
              className="flex-1"
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sweet-dark mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedUser.first_name}
                  className="w-full px-4 py-2 border border-sweet-light rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sweet-dark mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedUser.last_name}
                  className="w-full px-4 py-2 border border-sweet-light rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sweet-dark mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={selectedUser.email}
                className="w-full px-4 py-2 border border-sweet-light rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                                <div>
                    <label className="block text-sm font-medium text-sweet-dark mb-2">
                      Role
                    </label>
                    <select className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none">
                      <option value="user" selected={!selectedUser.is_admin}>User</option>
                      <option value="admin" selected={selectedUser.is_admin}>Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-sweet-dark mb-2">
                      Status
                    </label>
                    <select className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none">
                      <option value="active" selected={selectedUser.is_active}>Active</option>
                      <option value="inactive" selected={!selectedUser.is_active}>Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={selectedUser.is_staff}
                      className="rounded border-sweet-light text-sweet-primary focus:ring-sweet-primary"
                    />
                    <span className="text-sm font-medium text-sweet-dark">Staff Member</span>
                  </label>
                  <p className="text-xs text-sweet-dark/60 mt-1">
                    Staff members can access certain administrative features
                  </p>
                </div>

                <div className="bg-sweet-light/30 p-4 rounded-lg">
                  <h4 className="font-medium text-sweet-dark mb-2">User Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-sweet-dark/60">Username:</p>
                      <p className="font-medium">{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sweet-dark/60">User ID:</p>
                      <p className="font-medium">{selectedUser.id}</p>
                    </div>
                    <div>
                      <p className="text-sweet-dark/60">Date Joined:</p>
                      <p className="font-medium">{formatDate(selectedUser.date_joined)}</p>
                    </div>
                    <div>
                      <p className="text-sweet-dark/60">Last Login:</p>
                      <p className="font-medium">
                        {selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-sweet-light">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      // Handle save user
                      console.log('Save user:', selectedUser);
                      setShowEditModal(false);
                    }}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Add User Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Add New User"
            size="lg"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sweet-dark mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sweet-dark mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sweet-dark mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-sweet-dark mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sweet-dark mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sweet-dark mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sweet-dark mb-2">
                    Role
                  </label>
                  <select className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sweet-dark mb-2">
                    Status
                  </label>
                  <select className="w-full px-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-sweet-light text-sweet-primary focus:ring-sweet-primary"
                  />
                  <span className="text-sm font-medium text-sweet-dark">
                    Send welcome email to user
                  </span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-sweet-light">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Handle create user
                    console.log('Create new user');
                    setShowAddModal(false);
                  }}
                  className="flex-1"
                >
                  Create User
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      );
    };

    export default ManageUsersPage;