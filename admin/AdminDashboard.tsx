import React, { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Users, Video, HardDrive, TrendingUp, DollarSign, Activity, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { stats, loadStats } = useAdminStore();

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects.toLocaleString(),
      change: '+23%',
      trend: 'up',
      icon: Video,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      title: 'Total Videos',
      value: stats.totalVideos.toLocaleString(),
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
    {
      title: 'Storage Used',
      value: `${stats.storageUsed} GB`,
      change: '+5%',
      trend: 'up',
      icon: HardDrive,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ];

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Monitor your platform's key metrics and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-surface border border-white/10 rounded-xl p-6 hover:border-brand-purple/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-surface border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 52, 48, 65, 72, 68, 85, 92, 88, 95, 102, 98].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-brand-purple to-purple-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-surface border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[30, 45, 38, 55, 70, 65, 80, 75, 90, 85, 95, 88].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { user: 'John Doe', action: 'created a new project', time: '2 minutes ago', color: 'text-blue-400' },
            { user: 'Sarah Chen', action: 'generated an avatar video', time: '15 minutes ago', color: 'text-green-400' },
            { user: 'Michael Brown', action: 'exported 5 videos', time: '1 hour ago', color: 'text-purple-400' },
            { user: 'Emily Wilson', action: 'upgraded to Pro plan', time: '2 hours ago', color: 'text-yellow-400' },
            { user: 'David Lee', action: 'created batch campaign', time: '3 hours ago', color: 'text-pink-400' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
              <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
              <div className="flex-1">
                <span className={`font-medium ${activity.color}`}>{activity.user}</span>
                <span className="text-slate-400"> {activity.action}</span>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
