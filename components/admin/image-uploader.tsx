'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, ImagePlus, X } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUploader({ value, onChange, label, placeholder = '/images/...' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('upload failed');
      const json = (await res.json()) as { data?: { url?: string } };
      const url = json.data?.url;
      if (!url) throw new Error('no url returned');
      onChange(url);
      toast.success('Image importée');
    } catch {
      toast.error("Erreur lors de l'import de l'image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Import en cours…' : 'Importer une image'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </div>
        {value ? (
          <div className="relative shrink-0">
            <img
              src={value}
              alt=""
              className="h-16 w-16 rounded-xl object-cover border border-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent-red text-white flex items-center justify-center hover:bg-accent-red/80 transition-colors"
              title="Retirer l'image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="shrink-0 h-16 w-16 rounded-xl border border-dashed border-white/15 flex items-center justify-center text-gray-500">
            <ImagePlus className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
