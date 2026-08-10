'use client';

import { useCallback } from 'react';
import type { PageSection } from '@/types';
import { ImageUploader } from '@/components/admin/image-uploader';

interface SectionEditorProps {
  section: PageSection;
  onChange: (next: PageSection) => void;
}

export function SectionEditor({ section, onChange }: SectionEditorProps) {
  const updateField = useCallback((field: string, value: unknown) => {
    onChange({ ...section, [field]: value });
  }, [section, onChange]);

  const updateContent = useCallback((key: string, value: unknown) => {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  }, [section, onChange]);

  const hasHighlight =
    section.section_type === 'hero' ||
    section.section_type === 'image-text' ||
    section.section_type === 'text' ||
    section.section_type === 'services-grid' ||
    section.section_type === 'services-process' ||
    section.section_type === 'gallery' ||
    section.section_type === 'cta' ||
    section.section_type === 'benefits' ||
    section.section_type === 'testimonials' ||
    section.section_type === 'faq' ||
    section.section_type === 'team';

  return (
    <div className="space-y-5">
      {/* Common fields */}
      <div className="space-y-4">
        {hasHighlight && (
          <InputField
            label="Badge"
            value={contentString(section, 'badge')}
            onChange={(v) => updateContent('badge', v)}
          />
        )}
        <InputField
          label="Titre de la section"
          value={section.title || contentString(section, 'title')}
          onChange={(v) => updateField('title', v)}
        />
        {hasHighlight && (
          <InputField
            label="Partie surlignée du titre"
            value={contentString(section, 'titleHighlight')}
            onChange={(v) => updateContent('titleHighlight', v)}
          />
        )}
        <TextareaField
          label="Description"
          value={section.description}
          onChange={(v) => updateField('description', v)}
        />
      </div>

      {/* Section-type-specific editors */}

      {section.section_type === 'image-text' && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Texte & points forts</h4>
          <TextareaField
            label="Paragraphe 2"
            value={contentString(section, 'paragraph2')}
            onChange={(v) => updateContent('paragraph2', v)}
          />
          <StringListEditor
            label="Points forts"
            items={(section.content?.highlights as string[]) ?? []}
            onChange={(items) => updateContent('highlights', items)}
          />
        </div>
      )}

      {section.section_type === 'hero' && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Boutons</h4>
          <ButtonsEditor
            buttons={(section.content?.buttons as Array<{ label: string; href: string; variant: string }>) ?? []}
            onChange={(buttons) => updateContent('buttons', buttons)}
          />
        </div>
      )}

      {(section.section_type === 'hero' || section.section_type === 'stats') && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <StatsEditor
            stats={(section.content?.stats as Array<{ value: number; suffix: string; label: string }>) ?? []}
            onChange={(stats) => updateContent('stats', stats)}
          />
        </div>
      )}

      {(section.section_type === 'cards' || section.section_type === 'benefits' || section.section_type === 'team' || section.section_type === 'services-process') && (
        <div className="space-y-4 border-t border-white/6 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Éléments</h4>
          <ItemsEditor
            items={(section.content?.items as Array<Record<string, string>>) ?? []}
            fields={
              section.section_type === 'team' ? ['name', 'role']
              : section.section_type === 'benefits' ? ['title', 'description', 'iconColor']
              : section.section_type === 'services-process' ? ['number', 'title', 'description', 'duration', 'color']
              : ['title', 'description']
            }
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

function contentString(section: PageSection, key: string): string {
  const val = section.content?.[key];
  return typeof val === 'string' ? val : '';
}

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
        className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
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
        className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors resize-y"
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
              placeholder="Label" className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none" />
            <input value={btn.href} onChange={(e) => update(i, 'href', e.target.value)}
              placeholder="/lien" className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none" />
            <select value={btn.variant} onChange={(e) => update(i, 'variant', e.target.value)}
              className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green/50 focus:outline-none">
              <option value="primary">Primaire</option>
              <option value="outline">Contour</option>
              <option value="ghost">Ghost</option>
              <option value="whatsapp">WhatsApp</option>
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
          placeholder="Label" className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none" />
        <input value={button.href} onChange={(e) => onChange({ ...button, href: e.target.value })}
          placeholder="/lien" className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none" />
        <select value={button.variant} onChange={(e) => onChange({ ...button, variant: e.target.value })}
          className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green/50 focus:outline-none">
          <option value="primary">Primaire</option>
          <option value="outline">Contour</option>
          <option value="ghost">Ghost</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>
    </div>
  );
}

const fieldLabels: Record<string, string> = {
  title: 'Titre',
  description: 'Description',
  iconColor: 'Couleur (green, blue, orange, teal, purple, amber)',
  question: 'Question',
  answer: 'Réponse',
  name: 'Nom',
  role: 'Rôle',
  number: 'Numéro (01, 02…)',
  duration: 'Durée (ex. Jour 1)',
  color: 'Couleur (blue, green, orange, purple, teal)',
};

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
              label={fieldLabels[field] ?? field.charAt(0).toUpperCase() + field.slice(1)}
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
        <div key={i} className="rounded-xl border border-white/6 bg-white/3 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Image {i + 1}</span>
            <button onClick={() => remove(i)}
              className="h-7 w-7 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center text-sm transition-colors">
              &times;
            </button>
          </div>
          <ImageUploader
            label="URL de l'image"
            value={img.url}
            onChange={(url) => update(i, 'url', url)}
            placeholder="https://… ou /home.jpeg"
          />
          <div className="grid grid-cols-2 gap-2">
            <input value={img.alt ?? ''} onChange={(e) => update(i, 'alt', e.target.value)}
              placeholder="Texte alternatif" className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none" />
            <input value={img.caption ?? ''} onChange={(e) => update(i, 'caption', e.target.value)}
              placeholder="Légende" className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none" />
          </div>
        </div>
      ))}
      <button onClick={add}
        className="text-sm font-semibold text-green hover:text-green-dark transition-colors">
        + Ajouter une image
      </button>
    </div>
  );
}

function StringListEditor({ label, items, onChange }: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const update = (i: number, value: string) => {
    onChange(items.map((item, idx) => (idx === i ? value : item)));
  };
  const add = () => onChange([...items, '']);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none"
          />
          <button onClick={() => remove(i)}
            className="h-8 w-8 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center text-sm transition-colors">
            &times;
          </button>
        </div>
      ))}
      <button onClick={add}
        className="text-sm font-semibold text-green hover:text-green-dark transition-colors">
        + Ajouter
      </button>
    </div>
  );
}

function StatsEditor({ stats, onChange }: {
  stats: Array<{ value: number; suffix: string; label: string }>;
  onChange: (stats: Array<{ value: number; suffix: string; label: string }>) => void;
}) {
  const update = (i: number, field: string, value: string | number) => {
    const next = stats.map((s, idx) => (idx === i ? { ...s, [field]: value } : s));
    onChange(next);
  };
  const add = () => onChange([...stats, { value: 0, suffix: '', label: '' }]);
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Statistiques</h4>
      {stats.map((stat, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <input
              type="number"
              value={stat.value}
              onChange={(e) => update(i, 'value', Number(e.target.value))}
              placeholder="150"
              className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none"
            />
            <input
              value={stat.suffix}
              onChange={(e) => update(i, 'suffix', e.target.value)}
              placeholder="+"
              className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none"
            />
            <input
              value={stat.label}
              onChange={(e) => update(i, 'label', e.target.value)}
              placeholder="Projets réalisés"
              className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none"
            />
          </div>
          <button onClick={() => remove(i)}
            className="mt-1 h-8 w-8 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center text-sm transition-colors">
            &times;
          </button>
        </div>
      ))}
      <button onClick={add}
        className="text-sm font-semibold text-green hover:text-green-dark transition-colors">
        + Ajouter une statistique
      </button>
    </div>
  );
}
