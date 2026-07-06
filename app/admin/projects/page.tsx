'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Project {
  id: number;
  title: string;
  category: string;
}

export default function AdminProjectsPage() {
  const { t } = useTranslation();

  const initialProjects: Project[] = [
    { id: 1, title: 'Villa Lumière – Kit 5kW', category: 'Résidentiel' },
    { id: 2, title: 'Usine Solaire – Système 50kW', category: 'Industriel' },
  ];

  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const updateProject = (id: number, field: keyof Project, value: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = (id: number) => {
    const project = projects.find((p) => p.id === id);
    console.log('Saving project:', project);
    toast.success(t('admin.projectsPage.saved'));
  };

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success(t('admin.projectsPage.deleted'));
  };

  const handleAdd = () => {
    const newId = Math.max(...projects.map((p) => p.id), 0) + 1;
    setProjects((prev) => [...prev, { id: newId, title: '', category: '' }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('admin.projectsPage.management')}</h1>
        <button
          onClick={handleAdd}
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('admin.projectsPage.newProject')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-bg-card border border-white/6 rounded-2xl overflow-hidden shadow-card"
          >
            <div className="h-40 bg-white/3 flex items-center justify-center border-b border-white/6">
              <ImageIcon className="h-12 w-12 text-gray-600" />
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-400">{t('admin.projectsPage.title')}</label>
                <input
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  placeholder={t('admin.projectsPage.titlePlaceholder')}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-400">{t('admin.projectsPage.category')}</label>
                <input
                  value={project.category}
                  onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                  placeholder={t('admin.projectsPage.categoryPlaceholder')}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleSave(project.id)}
                  className="h-9 px-4 rounded-xl bg-green text-white text-xs font-semibold hover:bg-green-dark transition-all duration-300 active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  {t('admin.projectsPage.save')}
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="h-9 px-3 rounded-xl bg-accent-red/10 text-accent-red border border-accent-red/20 text-xs font-semibold hover:bg-accent-red/20 transition-all duration-300 active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAdd}
          className="h-full min-h-[280px] bg-bg-card border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-green hover:border-green/30 transition-all duration-300"
        >
          <Plus className="h-10 w-10" />
          <span className="text-sm font-medium">{t('admin.projectsPage.add')}</span>
        </button>
      </div>
    </div>
  );
}
