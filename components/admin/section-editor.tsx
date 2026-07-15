'use client';

import { useCallback } from 'react';
import type { PageSection, SectionType } from '@/types';
import { toast } from 'sonner';

interface SectionEditorProps {
  section: PageSection;
  onUpdate: (id: string, updates: Partial<PageSection>) => Promise<void>;
}

export function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const updateField = useCallback(async (field: string, value: unknown) => {
    try {
      await onUpdate(section.id, { [field]: value });
      toast.success('Section mise à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  }, [section.id, onUpdate]);

  const updateContent = useCallback(async (key: string, value: unknown) => {
    try {
      await onUpdate(section.id, {
        content: { ...section.content, [key]: value },
      });
      toast.success('Contenu mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  }, [section.id, section.content, onUpdate]);

  return (
    <div className="space-y-5">
      {/* Common fields */}
      <div className="space-y-4">
        <InputField
          label="Titre de la section"
          value={section.title}
          onChange={(v) => updateField('title', v)}
        />
        <InputField
          label="Sous-titre"
          value={section.subtitle}
          onChange={(v) => updateField('subtitle', v)}
        />
        <TextareaField
          label="Description"
          value={section.description}
          onChange={(v) => updateField('description', v)}
        />
      </div>

      {/* Section-type-specific editors */}
      {section.section_type === 'hero' && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Boutons</h4>
          <ButtonsEditor
            buttons={(section.content?.buttons as Array<{ label: string; href: string; variant: string }>) ?? []}
            onChange={(buttons) => updateContent('buttons', buttons)}
          />
        </div>
      )}

      {(section.section_type === 'cards' || section.section_type === 'benefits' || section.section_type === 'team') && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Éléments</h4>
          <ItemsEditor
            items={(section.content?.items as Array<Record<string, string>>) ?? []}
            fields={section.section_type === 'team' ? ['name', 'role'] : ['title', 'description']}
            onChange={(items) => updateContent('items', items)}
          />
        </div>
      )}

      {section.section_type === 'faq' && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Questions fréquentes</h4>
          <ItemsEditor
            items={(section.content?.items as Array<Record<string, string>>) ?? []}
            fields={['question', 'answer']}
            onChange={(items) => updateContent('items', items)}
          />
        </div>
      )}

      {(section.section_type === 'cta' || section.section_type === 'gallery') && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Bouton</h4>
          <SingleButtonEditor
            button={(section.content?.button as { label: string; href: string; variant: string }) ?? { label: '', href: '', variant: 'primary' }}
            onChange={(button) => updateContent('button', button)}
          />
        </div>
      )}

      {/* Images */}
      <div className="space-y-3 border-t border-white/6 pt-4">
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Images</h4>
        <ImagesEditor
          images={section.images}
          onChange={(images) => updateField('images', images)}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/6">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={section.is_published}
            onChange={(e) => updateField('is_published', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-green peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
        </label>
        <span className="text-sm text-gray-400">{section.is_published ? 'Publiée' : 'Brouillon'}</span>
      </div>
    </div>
  );
}

// ── Sub-components ──

function InputField({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors resize-y"
      />
    </div>
  );
}

function ButtonsEditor({ buttons, onChange }: {
  buttons: Array<{ label: string; href: string; variant: string }>;
  onChange: (buttons: Array<{ label: string; href: string; variant: string }>) => void;
}) {
  const update = (i: number, field: string, value: string) => {
    const next = buttons.map((b, idx) => (idx === i ? { ...b, [field]: value } : b));
    onChange(next);
  };

  const add = () => onChange([...buttons, { label: '', href: '', variant: 'primary' }]);
  const remove = (i: number) => onChange(buttons.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {buttons.map((btn, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <input value={btn.label} onChange={(e) => update(i, 'label', e.target.value)}
              placeholder="Label" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none" />
            <input value={btn.href} onChange={(e) => update(i, 'href', e.target.value)}
              placeholder="/lien" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none" />
            <select value={btn.variant} onChange={(e) => update(i, 'variant', e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-green/50 focus:outline-none">
              <option value="primary">Primaire</option>
              <option value="outline">Contour</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
          <button onClick={() => remove(i)}
            className="mt-1 h-8 w-8 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center text-sm transition-colors">
            &times;
          </button>
        </div>
      ))}
      <button onClick={add}
        className="text-sm font-semibold text-green hover:text-green-dark transition-colors">
        + Ajouter un bouton
      </button>
    </div>
  );
}

function SingleButtonEditor({ button, onChange }: {
  button: { label: string; href: string; variant: string };
  onChange: (btn: { label: string; href: string; variant: string }) => void;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 grid grid-cols-3 gap-2">
        <input value={button.label} onChange={(e) => onChange({ ...button, label: e.target.value })}
          placeholder="Label" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none" />
        <input value={button.href} onChange={(e) => onChange({ ...button, href: e.target.value })}
          placeholder="/lien" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none" />
        <select value={button.variant} onChange={(e) => onChange({ ...button, variant: e.target.value })}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-green/50 focus:outline-none">
          <option value="primary">Primaire</option>
          <option value="outline">Contour</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>
    </div>
  );
}

function ItemsEditor({ items, fields, onChange }: {
  items: Array<Record<string, string>>;
  fields: string[];
  onChange: (items: Array<Record<string, string>>) => void;
}) {
  const update = (i: number, field: string, value: string) => {
    const next = items.map((item, idx) => (idx === i ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const add = () => {
    const obj = fields.reduce<Record<string, string>>((acc, f) => ({ ...acc, [f]: '' }), {});
    onChange([...items, obj]);
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/6 bg-white/3 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Élément {i + 1}</span>
            <button onClick={() => remove(i)}
              className="h-7 w-7 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center text-sm transition-colors">
              &times;
            </button>
          </div>
          {fields.map((field) => (
            <InputField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={item[field] ?? ''}
              onChange={(v) => update(i, field, v)}
            />
          ))}
        </div>
      ))}
      <button onClick={add}
        className="text-sm font-semibold text-green hover:text-green-dark transition-colors">
        + Ajouter un élément
      </button>
    </div>
  );
}

function ImagesEditor({ images, onChange }: {
  images: Array<{ url: string; alt?: string; caption?: string }>;
  onChange: (images: Array<{ url: string; alt?: string; caption?: string }>) => void;
}) {
  const add = () => onChange([...images, { url: '', alt: '', caption: '' }]);
  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string) => {
    const next = images.map((img, idx) => (idx === i ? { ...img, [field]: value } : img));
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {images.map((img, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input value={img.url} onChange={(e) => update(i, 'url', e.target.value)}
              placeholder="URL de l'image" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none col-span-2" />
            <input value={img.alt ?? ''} onChange={(e) => update(i, 'alt', e.target.value)}
              placeholder="Texte alternatif" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none" />
            <input value={img.caption ?? ''} onChange={(e) => update(i, 'caption', e.target.value)}
              placeholder="Légende" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none" />
          </div>
          <button onClick={() => remove(i)}
            className="mt-1 h-8 w-8 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center text-sm transition-colors">
            &times;
          </button>
        </div>
      ))}
      <button onClick={add}
        className="text-sm font-semibold text-green hover:text-green-dark transition-colors">
        + Ajouter une image
      </button>
    </div>
  );
}
