import React from 'react';
import { TrendingUp, Download, Calendar, Users, Video, DollarSign } from 'lucide-react';
import { Button } from '../components/Button';

export const Analytics: React.FC = () => {
  const metrics = [
    { label: 'Jan', users: 45, videos: 120, revenue: 3400 },
    { label: 'Feb', users: 52, videos: 145, revenue: 3800 },
    { label: 'Mar', users: 48, videos: 135, revenue: 3600 },
    { label: 'Apr', users: 65, videos: 180, revenue: 4500 },
    { label: 'May', users: 72, videos: 210, revenue: 5200 },
    { label: 'Jun', users: 68, videos: 195, revenue: 4900 },
    { label: 'Jul', users: 85, videos: 245, revenue: 6100 },
    { label: 'Aug', users: 92, videos: 270, revenue: 6800 },
    { label: 'Sep', users: 88, videos: 255, revenue: 6400 },
    { label: 'Oct', users: 95, videos: 285, revenue: 7200 },
    { label: 'Nov', users: 102, videos: 310, revenue: 7900 },
    { label: 'Dec', users: 98, videos: 295, revenue: 7500 }
  ];

  const maxValue = Math.max(...metrics.map(m => Math.max(m.users, m.videos / 3, m.revenue / 100)));

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
          <p className="text-slate-400">Detailed insights into platform performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '$78,450', change: '+23%', icon: DollarSign, color: 'text-green-400', bgColor: 'bg-green-400/10' },
          { title: 'New Users', value: '1,247', change: '+12%', icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
          { title: 'Videos Created', value: '2,841', change: '+18%', icon: Video, color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
          { title: 'Growth Rate', value: '34.2%', change: '+5%', icon: TrendingUp, color: 'text-orange-400', bgColor: 'bg-orange-400/10' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-green-400 text-sm font-bold">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Multi-Metric Chart */}
      <div className="bg-surface border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Performance Overview</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-slate-400">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-slate-400">Videos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-slate-400">Revenue</span>
            </div>
          </div>
        </div>

        <div className="h-80 flex items-end justify-between gap-1">
          {metrics.map((metric, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              {/* Revenue Bar */}
              <div
                className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t opacity-60 hover:opacity-100 transition-opacity relative group"
                style={{ height: `${(metric.revenue / 100 / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${metric.revenue}
                </div>
              </div>

              {/* Videos Bar */}
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-violet-400 rounded-t opacity-60 hover:opacity-100 transition-opacity relative group"
                style={{ height: `${(metric.videos / 3 / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {metric.videos} videos
                </div>
              </div>

              {/* Users Bar */}
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t opacity-60 hover:opacity-100 transition-opacity relative group"
                style={{ height: `${(metric.users / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {metric.users} users
                </div>
              </div>

              {/* Label */}
              <span className="text-xs text-slate-500 mt-2">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <div className="bg-surface border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Users by Projects</h3>
          <div className="space-y-3">
            {[
              { name: 'Sarah Chen', projects: 45, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
              { name: 'John Doe', projects: 38, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
              { name: 'Emily Wilson', projects: 32, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
              { name: 'Michael Brown', projects: 28, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
              { name: 'Lisa Anderson', projects: 25, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
            ].map((user, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                <span className="text-slate-500 font-bold text-sm w-6">#{idx + 1}</span>
                <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                <div className="flex-1">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.projects} projects</p>
                </div>
                <div className="w-20 h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-purple to-pink-500" style={{ width: `${(user.projects / 45) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Templates */}
        <div className="bg-surface border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Templates by Usage</h3>
          <div className="space-y-3">
            {[
              { name: 'Modern E-commerce', usage: 1234, category: 'ecommerce' },
              { name: 'App Promo', usage: 892, category: 'app' },
              { name: 'Gaming Hero', usage: 756, category: 'game' },
              { name: 'Minimal Luxury', usage: 643, category: 'ecommerce' },
              { name: 'Service Hero', usage: 521, category: 'service' }
            ].map((template, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                <span className="text-slate-500 font-bold text-sm w-6">#{idx + 1}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{template.name}</p>
                  <p className="text-xs text-slate-400">{template.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{template.usage}</p>
                  <p className="text-xs text-slate-400">uses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
