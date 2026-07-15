'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Trash2, Image as ImageIcon, Loader2, Copy, Check } from 'lucide-react';
import type { SiteMedia } from '@/types';
import { toast } from 'sonner';

export default function AdminMediaPage() {
  const { t } = useTranslation();
  const [media, setMedia] = useState<SiteMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media');
      const json = await res.json();
      setMedia(json.data ?? []);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      toast.success('Image uploadée');
      fetchMedia();
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [fetchMedia]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMedia((prev) => prev.filter((m) => m.id !== id));
      toast.success('Image supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  }, []);

  const handleCopyUrl = useCallback((url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copiée');
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('admin.media.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{media.length} fichier{media.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="h-10 px-5 rounded-xl bg-green text-bg-primary text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {t('admin.media.upload')}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {media.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-bg-card border border-white/6 rounded-2xl">
          <ImageIcon className="h-12 w-12 text-gray-600 mb-4" />
          <p className="text-sm text-gray-500">{t('admin.media.empty')}</p>
          <button onClick={() => fileRef.current?.click()}
            className="mt-4 h-10 px-5 rounded-xl bg-green text-bg-primary text-sm font-semibold hover:bg-green-dark transition-all">
            {t('admin.media.uploadFirst')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group bg-bg-card border border-white/6 rounded-xl overflow-hidden hover:border-green/20 transition-all">
              <div className="relative aspect-square bg-bg-elevated overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt || item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleCopyUrl(item.url, item.id)}
                    className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all">
                    {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 rounded-lg bg-accent-red/20 backdrop-blur-sm flex items-center justify-center text-accent-red hover:bg-accent-red/30 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-400 truncate">{item.filename}</p>
                <p className="text-[0.65rem] text-gray-600 mt-0.5">{formatSize(item.size_bytes)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
