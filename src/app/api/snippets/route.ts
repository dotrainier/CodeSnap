import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ snippets: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, code, language, description, tags, is_public, is_favorite } = body;

  if (!title || !code || !language) {
    return NextResponse.json({ error: 'title, code, and language are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('snippets')
    .insert({
      user_id: user.id,
      title,
      code,
      language,
      description: description ?? null,
      tags: tags ?? [],
      is_public: is_public ?? false,
      is_favorite: is_favorite ?? false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ snippet: data }, { status: 201 });
}
