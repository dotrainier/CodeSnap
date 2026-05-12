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

export const PRESET_GRADIENTS = [
  { name: 'Purple Dream', from: '#667eea', to: '#764ba2' },
  { name: 'Sunset', from: '#ff6e7f', to: '#bfe9ff' },
  { name: 'Ocean Blue', from: '#2e3192', to: '#1bffff' },
  { name: 'Forest', from: '#134e5e', to: '#71b280' },
  { name: 'Fire', from: '#f12711', to: '#f5af19' },
];
