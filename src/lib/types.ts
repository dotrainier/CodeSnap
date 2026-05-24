export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  code: string;
  language: string;
  description: string | null;
  tags: string[];
  is_public: boolean;
  is_favorite: boolean;
  share_id: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type SnippetInsert = Omit<Snippet, 'id' | 'user_id' | 'share_id' | 'view_count' | 'created_at' | 'updated_at'>;
export type SnippetUpdate = Partial<SnippetInsert>;

export interface ExportSettings {
  theme: string;
  windowStyle: 'macos' | 'windows' | 'minimal' | 'none';
  backgroundType: 'solid' | 'gradient' | 'transparent';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  showLineNumbers: boolean;
  showFileName: boolean;
  addShadow: boolean;
  addWatermark: boolean;
  padding: 'small' | 'medium' | 'large';
  fontSize: number;
  pixelRatio: 1 | 2 | 3;
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  theme: 'dracula',
  windowStyle: 'macos',
  backgroundType: 'gradient',
  backgroundColor: '#1e1e1e',
  gradientFrom: '#667eea',
  gradientTo: '#764ba2',
  gradientAngle: 45,
  showLineNumbers: true,
  showFileName: true,
  addShadow: false,
  addWatermark: false,
  padding: 'medium',
  fontSize: 14,
  pixelRatio: 2,
};

export const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'html',
  'css', 'scss', 'json', 'yaml', 'toml', 'markdown', 'bash', 'shell',
  'sql', 'graphql', 'vue', 'svelte', 'jsx', 'tsx', 'dart', 'r',
  'matlab', 'lua', 'perl', 'haskell', 'elixir', 'clojure', 'ocaml',
];

export const THEMES = [
  { id: 'dracula', name: 'Dracula', dark: true },
  { id: 'monokai', name: 'Monokai', dark: true },
  { id: 'one-dark-pro', name: 'One Dark Pro', dark: true },
  { id: 'nord', name: 'Nord', dark: true },
  { id: 'tokyo-night', name: 'Tokyo Night', dark: true },
  { id: 'github-dark', name: 'GitHub Dark', dark: true },
  { id: 'night-owl', name: 'Night Owl', dark: true },
  { id: 'material-theme-darker', name: 'Material Darker', dark: true },
  { id: 'github-light', name: 'GitHub Light', dark: false },
  { id: 'light-plus', name: 'Light Plus', dark: false },
  { id: 'min-light', name: 'Min Light', dark: false },
];

export const LANG_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-400/15 text-yellow-600 border-yellow-400/30',
  typescript: 'bg-blue-400/15 text-blue-600 border-blue-400/30',
  python: 'bg-green-400/15 text-green-600 border-green-400/30',
  rust: 'bg-orange-400/15 text-orange-600 border-orange-400/30',
  go: 'bg-cyan-400/15 text-cyan-600 border-cyan-400/30',
  css: 'bg-pink-400/15 text-pink-600 border-pink-400/30',
  html: 'bg-red-400/15 text-red-600 border-red-400/30',
  sql: 'bg-indigo-400/15 text-indigo-600 border-indigo-400/30',
  bash: 'bg-emerald-400/15 text-emerald-600 border-emerald-400/30',
  java: 'bg-amber-400/15 text-amber-700 border-amber-400/30',
  php: 'bg-violet-400/15 text-violet-600 border-violet-400/30',
  ruby: 'bg-rose-400/15 text-rose-600 border-rose-400/30',
};

export const LANG_COLORS_DARK: Record<string, string> = {
  javascript: 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 border-yellow-400/30',
  typescript: 'bg-blue-400/15 text-blue-600 dark:text-blue-400 border-blue-400/30',
  python: 'bg-green-400/15 text-green-600 dark:text-green-400 border-green-400/30',
  rust: 'bg-orange-400/15 text-orange-600 dark:text-orange-400 border-orange-400/30',
  go: 'bg-cyan-400/15 text-cyan-600 dark:text-cyan-400 border-cyan-400/30',
  css: 'bg-pink-400/15 text-pink-600 dark:text-pink-400 border-pink-400/30',
  html: 'bg-red-400/15 text-red-600 dark:text-red-400 border-red-400/30',
  sql: 'bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 border-indigo-400/30',
  bash: 'bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 border-emerald-400/30',
  java: 'bg-amber-400/15 text-amber-700 dark:text-amber-400 border-amber-400/30',
  php: 'bg-violet-400/15 text-violet-600 dark:text-violet-400 border-violet-400/30',
  ruby: 'bg-rose-400/15 text-rose-600 dark:text-rose-400 border-rose-400/30',
};

export const LANG_ACCENT: Record<string, string> = {
  javascript: 'bg-yellow-400',
  typescript: 'bg-blue-500',
  python: 'bg-green-500',
  rust: 'bg-orange-500',
  go: 'bg-cyan-500',
  css: 'bg-pink-500',
  html: 'bg-red-500',
  sql: 'bg-indigo-500',
  bash: 'bg-emerald-500',
  java: 'bg-amber-500',
  php: 'bg-violet-500',
  ruby: 'bg-rose-500',
};

export function getLangColor(lang: string, withDark = false): string {
  const map = withDark ? LANG_COLORS_DARK : LANG_COLORS;
  return map[lang.toLowerCase()] ?? (withDark
    ? 'bg-primary/10 text-primary border-primary/20'
    : 'bg-primary/10 text-primary border-primary/20');
}

export function getLangAccent(lang: string): string {
  return LANG_ACCENT[lang.toLowerCase()] ?? 'bg-primary';
}

export const PRESET_GRADIENTS = [
  { name: 'Purple Dream', from: '#667eea', to: '#764ba2' },
  { name: 'Sunset', from: '#ff6e7f', to: '#bfe9ff' },
  { name: 'Ocean Blue', from: '#2e3192', to: '#1bffff' },
  { name: 'Forest', from: '#134e5e', to: '#71b280' },
  { name: 'Fire', from: '#f12711', to: '#f5af19' },
];
