import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Button } from '../components/Button';
import { Search, Filter, MoreVertical, Ban, CheckCircle, Trash2, Edit, Eye } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, loadUsers, suspendUser, activateUser, deleteUser } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'deleted'>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (action: 'suspend' | 'activate' | 'delete', userId: string) => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this user?')) {
      return;
    }

    switch (action) {
      case 'suspend':
        await suspendUser(userId);
        break;
      case 'activate':
        await activateUser(userId);
        break;
      case 'delete':
        await deleteUser(userId);
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      suspended: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      deleted: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">{filteredUsers.length} users found</p>
        </div>
        <Button>
          <Eye className="w-4 h-4 mr-2" />
          Export Users
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-surface border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-brand-purple outline-none"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'active', 'suspended', 'deleted'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/30 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-bold text-slate-400">User</th>
                <th className="text-left p-4 text-sm font-bold text-slate-400">Email</th>
                <th className="text-left p-4 text-sm font-bold text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-bold text-slate-400">Projects</th>
                <th className="text-left p-4 text-sm font-bold text-slate-400">Storage</th>
                <th className="text-left p-4 text-sm font-bold text-slate-400">Last Login</th>
                <th className="text-right p-4 text-sm font-bold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-slate-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{user.projectsCount}</td>
                  <td className="p-4 text-slate-300">{user.storageUsed} MB</td>
                  <td className="p-4 text-slate-400 text-sm">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleAction('suspend', user.id)}
                          className="p-2 hover:bg-yellow-500/10 text-yellow-400 rounded-lg transition-colors"
                          title="Suspend User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : user.status === 'suspended' ? (
                        <button
                          onClick={() => handleAction('activate', user.id)}
                          className="p-2 hover:bg-green-500/10 text-green-400 rounded-lg transition-colors"
                          title="Activate User"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleAction('delete', user.id)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button className="p-2 hover:bg-white/10 text-slate-400 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};
