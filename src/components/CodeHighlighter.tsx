import { highlightCode } from '@/lib/highlighter';

interface CodeHighlighterProps {
  code: string;
  language: string;
  theme?: string;
}

export async function CodeHighlighter({ code, language, theme = 'dracula' }: CodeHighlighterProps) {
  const html = await highlightCode(code, language, theme);
  return (
    <div
      className="text-sm overflow-x-auto rounded [&_pre]:p-4 [&_pre]:m-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
