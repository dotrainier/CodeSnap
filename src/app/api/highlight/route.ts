import { highlightCode } from '@/lib/highlighter';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code, language, theme } = await request.json();

  if (!code || !language) {
    return NextResponse.json({ error: 'code and language are required' }, { status: 400 });
  }

  const html = await highlightCode(code, language, theme ?? 'dracula');
  return NextResponse.json({ html });
}
