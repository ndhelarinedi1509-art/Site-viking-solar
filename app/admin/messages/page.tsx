'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';

interface Message {
  id: number;
  status: 'Nouveau' | 'Lu';
  date: string;
  name: string;
  service: string;
  text: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    status: 'Nouveau',
    date: '05/07/2026',
    name: 'Jean Dupont',
    service: 'Installation',
    text: "Bonjour, j'aimerais un devis pour une installation solaire résidentielle de 3kW.",
  },
  {
    id: 2,
    status: 'Lu',
    date: '03/07/2026',
    name: 'Marie Claire',
    service: 'Hybride',
    text: 'Avez-vous des batteries lithium-ion disponibles pour un système hybride?',
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleOpen = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Lu' as const } : m)),
    );
    console.log('Opening message:', id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Boîte de réception</h1>

      <div className="bg-bg-card border border-white/6 rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="text-left px-4 py-3 font-medium text-gray-400 whitespace-nowrap">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 whitespace-nowrap">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 whitespace-nowrap">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 whitespace-nowrap">Service</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 whitespace-nowrap">Message</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b border-white/6 last:border-0 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      msg.status === 'Nouveau'
                        ? 'bg-green/10 text-green'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{msg.date}</td>
                <td className="px-4 py-3 text-white whitespace-nowrap">{msg.name}</td>
                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{msg.service}</td>
                <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{msg.text}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleOpen(msg.id)}
                    className="h-8 px-3 rounded-lg bg-green/10 text-green text-xs font-semibold hover:bg-green/20 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ouvrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
