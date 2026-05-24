import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
  }

  return NextResponse.json({ snippet: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Allowlist only mutable user-facing fields
  type AllowedFields = {
    title?: string;
    code?: string;
    language?: string;
    description?: string | null;
    tags?: string[];
    is_public?: boolean;
    is_favorite?: boolean;
    share_id?: string;
  };
  const allowed: AllowedFields = {};
  if (body.title !== undefined) allowed.title = String(body.title).slice(0, 255);
  if (body.code !== undefined) allowed.code = String(body.code);
  if (body.language !== undefined) allowed.language = String(body.language).slice(0, 50);
  if (body.description !== undefined) allowed.description = body.description ? String(body.description) : null;
  if (body.tags !== undefined) allowed.tags = Array.isArray(body.tags) ? body.tags.map(String) : [];
  if (body.is_public !== undefined) allowed.is_public = Boolean(body.is_public);
  if (body.is_favorite !== undefined) allowed.is_favorite = Boolean(body.is_favorite);

  // Generate share_id when making public for the first time
  if (allowed.is_public) {
    const { data: existing } = await supabase
      .from('snippets')
      .select('share_id')
      .eq('id', id)
      .single();

    if (existing && !existing.share_id) {
      allowed.share_id = nanoid(10);
    }
  }

  const { data, error } = await supabase
    .from('snippets')
    .update({ ...allowed, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ snippet: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
