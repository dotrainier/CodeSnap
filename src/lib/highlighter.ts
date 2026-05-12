import { createHighlighter, bundledLanguages, type Highlighter } from 'shiki';

let highlighterInstance: Highlighter | null = null;

export async function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: [
        'dracula',
        'monokai',
        'one-dark-pro',
        'nord',
        'tokyo-night',
        'github-dark',
        'night-owl',
        'material-theme-darker',
        'github-light',
        'light-plus',
        'min-light',
      ],
      langs: Object.keys(bundledLanguages),
    });
  }
  return highlighterInstance;
}

export async function highlightCode(
  code: string,
  language: string,
  theme: string = 'dracula'
): Promise<string> {
  const highlighter = await getHighlighterInstance();
  const lang = Object.keys(bundledLanguages).includes(language) ? language : 'text';

  try {
    return highlighter.codeToHtml(code, { lang, theme });
  } catch {
    return highlighter.codeToHtml(code, { lang, theme: 'dracula' });
  }
}
