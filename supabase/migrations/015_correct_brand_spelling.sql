-- Correct the brand spelling in content already stored in Supabase.
UPDATE page_sections
SET
  label = replace(label, 'Vicking Solar', 'Viking Solar'),
  title = replace(title, 'Vicking Solar', 'Viking Solar'),
  subtitle = replace(subtitle, 'Vicking Solar', 'Viking Solar'),
  description = replace(description, 'Vicking Solar', 'Viking Solar'),
  content = replace(content::text, 'Vicking Solar', 'Viking Solar')::jsonb,
  images = replace(images::text, 'Vicking Solar', 'Viking Solar')::jsonb
WHERE concat_ws(' ', label, title, subtitle, description, content::text, images::text)
  LIKE '%Vicking Solar%';

UPDATE news_posts
SET
  title = replace(title, 'Vicking Solar', 'Viking Solar'),
  excerpt = replace(excerpt, 'Vicking Solar', 'Viking Solar'),
  content = replace(content, 'Vicking Solar', 'Viking Solar'),
  updated_at = now()
WHERE concat_ws(' ', title, excerpt, content) LIKE '%Vicking Solar%';

UPDATE site_media
SET
  alt = replace(alt, 'Vicking Solar', 'Viking Solar'),
  caption = replace(caption, 'Vicking Solar', 'Viking Solar')
WHERE concat_ws(' ', alt, caption) LIKE '%Vicking Solar%';

UPDATE site_settings
SET
  value = replace(value::text, 'Vicking Solar', 'Viking Solar')::jsonb,
  updated_at = now()
WHERE value::text LIKE '%Vicking Solar%';