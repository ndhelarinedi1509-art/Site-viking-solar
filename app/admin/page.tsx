'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { FolderOpen, Users, MessageSquare, Mail } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  color: string;
  icon: React.ElementType;
}

interface Activity {
  id: number;
  text: string;
  time: string;
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();

  const initialStats: StatCard[] = [
    { title: t('admin.dashboard.projectsCompleted'), value: '124', color: 'text-green', icon: FolderOpen },
    { title: t('admin.dashboard.visitors30d'), value: '8,450', color: 'text-accent-blue', icon: Users },
    { title: t('admin.dashboard.quoteRequests'), value: '32', color: 'text-accent-orange', icon: MessageSquare },
    { title: t('admin.dashboard.newMessages'), value: '14', color: 'text-accent-purple', icon: Mail },
  ];

  const initialActivities: Activity[] = [
    { id: 1, text: t('admin.dashboard.activity1'), time: t('admin.dashboard.timeAgo2h') },
    { id: 2, text: t('admin.dashboard.activity2'), time: t('admin.dashboard.timeAgo5h') },
    { id: 3, text: t('admin.dashboard.activity3'), time: t('admin.dashboard.timeYesterday') },
  ];

  const [stats] = useState<StatCard[]>(initialStats);
  const [activities] = useState<Activity[]>(initialActivities);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('admin.dashboard.overview')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-bg-card border border-white/6 rounded-2xl p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{stat.title}</span>
              <stat.icon className="h-5 w-5 text-gray-500" />
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-semibold text-white mb-4">{t('admin.dashboard.recentActivity')}</h2>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-white/6 last:border-0"
            >
              <p className="text-sm text-gray-300">{activity.text}</p>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
