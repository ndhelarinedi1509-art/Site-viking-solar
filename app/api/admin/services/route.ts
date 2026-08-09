import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';

const SERVICE_COLORS = ['blue', 'green', 'orange', 'purple', 'teal', 'amber'] as const;
const SERVICE_ICONS = ['sun', 'file-text', 'wrench', 'industrial', 'home', 'clipboard-list'] as const;

const serviceSchema = z.object({
  title: z.string().trim().min(2, 'Le titre est obligatoire').max(200),
  description: z.string().trim().max(1000).optional().default(''),
  features: z.array(z.string()).optional().default([]),
  tag: z.string().trim().max(200).optional().default(''),
  color: z.enum(SERVICE_COLORS).default('green'),
  featured: z.boolean().default(false),
  icon: z.enum(SERVICE_ICONS).default('sun'),
  sort_order: z.number().int().optional().default(0),
  is_published: z.boolean().default(true),
});

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Données invalides' }, { status: 400 });
    }

    const supabase = getAdminClient();
    let slug = slugify(parsed.data.title);
    const { data: existing } = await supabase
      .from('services')
      .select('slug')
      .eq('slug', slug)
      .limit(1);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const { data, error } = await supabase
      .from('services')
      .insert({ ...parsed.data, slug })
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
