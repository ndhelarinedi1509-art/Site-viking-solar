'use client';

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

const initialStats: StatCard[] = [
  { title: 'Projets Réalisés', value: '124', color: 'text-green', icon: FolderOpen },
  { title: 'Visiteurs 30j', value: '8,450', color: 'text-accent-blue', icon: Users },
  { title: 'Demandes Devis', value: '32', color: 'text-accent-orange', icon: MessageSquare },
  { title: 'Nouveaux Messages', value: '14', color: 'text-accent-purple', icon: Mail },
];

const initialActivities: Activity[] = [
  { id: 1, text: 'Nouveau devis demandé par Jean Dupont – Installation solaire', time: 'Il y a 2h' },
  { id: 2, text: 'Message reçu de Marie Claire – Demande info batteries', time: 'Il y a 5h' },
  { id: 3, text: 'Projet "Villa Lumière" marqué comme terminé', time: 'Hier' },
];

export default function AdminDashboardPage() {
  const [stats] = useState<StatCard[]>(initialStats);
  const [activities] = useState<Activity[]>(initialActivities);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Aperçu Global</h1>

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
        <h2 className="text-lg font-semibold text-white mb-4">Activité Récente</h2>
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
