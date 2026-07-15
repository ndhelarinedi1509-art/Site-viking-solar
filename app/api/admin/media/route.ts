import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_media')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = await createClient();
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('site-media')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase
      .storage
      .from('site-media')
      .getPublicUrl(filename);

    const { data: mediaRecord, error: dbError } = await supabase
      .from('site_media')
      .insert({
        url: publicUrl,
        filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ data: mediaRecord }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
