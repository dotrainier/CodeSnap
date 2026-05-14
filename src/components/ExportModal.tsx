'use client';

import { useState, useEffect, useId } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportSnippetAsImage, copyImageToClipboard } from '@/lib/export';
import { toast } from 'sonner';
import { Download, Copy, Link2, Check, Palette, Monitor, Image, Settings2, Camera } from 'lucide-react';
import { THEMES, PRESET_GRADIENTS, DEFAULT_EXPORT_SETTINGS, type ExportSettings } from '@/lib/types';
import type { Snippet } from '@/lib/types';

interface ExportModalProps {
  snippet: Snippet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ snippet, open, onOpenChange }: ExportModalProps) {
  const uid = useId().replace(/:/g, '');
  const exportId = `export-preview-${uid}`;

  const [settings, setSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);
  const [highlightedHtml, setHighlightedHtml] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  function update<K extends keyof ExportSettings>(key: K, value: ExportSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch('/api/highlight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: snippet.code, language: snippet.language, theme: settings.theme }),
    })
      .then(r => r.json())
      .then(d => { if (!cancelled) setHighlightedHtml(d.html ?? ''); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [open, settings.theme, snippet.code, snippet.language]);

  const background = settings.backgroundType === 'transparent'
    ? 'transparent'
    : settings.backgroundType === 'solid'
    ? settings.backgroundColor
    : `linear-gradient(${settings.gradientAngle}deg, ${settings.gradientFrom}, ${settings.gradientTo})`;

  const paddingSize = { small: '24px', medium: '48px', large: '80px' }[settings.padding];

  async function handleDownload() {
    setDownloading(true);
    try {
      await exportSnippetAsImage(exportId, snippet.title, { pixelRatio: settings.pixelRatio });
      toast.success('Image downloaded!');
    } catch {
      toast.error('Export failed.');
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopyImage() {
    setCopying(true);
    try {
      await copyImageToClipboard(exportId);
      toast.success('Image copied to clipboard!');
    } catch {
      toast.error('Copy failed — browser may not support this.');
    } finally {
      setCopying(false);
    }
  }

  async function handleCopyLink() {
    let shareId = snippet.share_id;
    if (!shareId) {
      const res = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: true }),
      });
      const data = await res.json();
      shareId = data.snippet?.share_id;
    }
    await navigator.clipboard.writeText(`${window.location.origin}/public/${shareId}`);
    setLinkCopied(true);
    toast.success('Shareable link copied!');
    setTimeout(() => setLinkCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-full h-[90vh] overflow-hidden p-0 gap-0 flex flex-col">

        {/* Header */}
        <DialogHeader className="flex-row items-center gap-3 px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 shrink-0">
            <Camera className="h-4 w-4 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-base font-semibold leading-tight">Export Snippet</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">{snippet.title}</p>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

          {/* Preview panel */}
          <div className="flex-1 overflow-auto bg-[#0a0a0f] flex items-start justify-center p-8 min-h-64">
            <div
              id={exportId}
              style={{ background, padding: paddingSize, borderRadius: '16px' }}
              className="w-full max-w-2xl"
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{ boxShadow: settings.addShadow ? '0 32px 80px rgba(0,0,0,0.6)' : undefined }}
              >
                {settings.windowStyle !== 'none' && (
                  <div className="relative flex items-center justify-between px-4 py-3 bg-[#1e1e2e]">
                    {settings.windowStyle === 'macos' && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                        </div>
                        {settings.showFileName && (
                          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-white/40 font-mono">
                            {snippet.title}.{snippet.language}
                          </span>
                        )}
                        <span />
                      </>
                    )}
                    {settings.windowStyle === 'windows' && (
                      <>
                        {settings.showFileName && (
                          <span className="text-xs text-white/40 font-mono">{snippet.title}.{snippet.language}</span>
                        )}
                        <div className="flex gap-2 ml-auto">
                          {['─', '□', '✕'].map(c => (
                            <span key={c} className="text-xs text-white/40 w-5 text-center">{c}</span>
                          ))}
                        </div>
                      </>
                    )}
                    {settings.windowStyle === 'minimal' && settings.showFileName && (
                      <span className="text-xs text-white/40 font-mono">{snippet.title}.{snippet.language}</span>
                    )}
                  </div>
                )}

                <div className="relative overflow-hidden" style={{ fontSize: settings.fontSize }}>
                  {!highlightedHtml ? (
                    <div className="bg-[#1e1e2e] h-32 flex items-center justify-center">
                      <span className="text-xs text-white/30 animate-pulse">Rendering…</span>
                    </div>
                  ) : (
                    <div
                      className="[&_pre]:m-0! [&_pre]:rounded-none! [&_pre]:p-5! [&_pre]:overflow-x-auto [&_pre]:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    />
                  )}
                  {settings.addWatermark && (
                    <div className="absolute bottom-2 right-3 text-[10px] text-white/20 select-none font-mono">
                      Made with CodeSnap
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls panel */}
          <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l flex flex-col bg-card">
            <div className="flex-1 overflow-y-auto">

              {/* Theme section */}
              <div className="px-4 pt-5 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Theme</span>
                </div>
                <Select value={settings.theme} onValueChange={v => v && update('theme', v)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dark</div>
                    {THEMES.filter(t => t.dark).map(t => (
                      <SelectItem key={t.id} value={t.id} className="text-sm">{t.name}</SelectItem>
                    ))}
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Light</div>
                    {THEMES.filter(t => !t.dark).map(t => (
                      <SelectItem key={t.id} value={t.id} className="text-sm">{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Window section */}
              <div className="px-4 py-4 border-b border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Window Style</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['macos', 'windows', 'minimal', 'none'] as const).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => update('windowStyle', style)}
                      className={`text-xs py-2 rounded-lg border font-medium transition-all ${
                        settings.windowStyle === style
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'border-input bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {style === 'none' ? 'None' : style === 'macos' ? 'macOS' : style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background section */}
              <div className="px-4 py-4 border-b border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Image className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Background</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {(['gradient', 'solid', 'transparent'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update('backgroundType', type)}
                      className={`text-xs py-2 rounded-lg border font-medium transition-all capitalize ${
                        settings.backgroundType === type
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'border-input bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {settings.backgroundType === 'gradient' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-5 gap-1.5">
                      {PRESET_GRADIENTS.map(g => (
                        <button
                          key={g.name}
                          type="button"
                          title={g.name}
                          onClick={() => { update('gradientFrom', g.from); update('gradientTo', g.to); }}
                          className="h-8 rounded-lg border-2 border-transparent hover:border-primary/70 hover:scale-105 transition-all"
                          style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">From</Label>
                        <input type="color" value={settings.gradientFrom} onChange={e => update('gradientFrom', e.target.value)}
                          className="w-full h-8 rounded-lg cursor-pointer border border-input" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">To</Label>
                        <input type="color" value={settings.gradientTo} onChange={e => update('gradientTo', e.target.value)}
                          className="w-full h-8 rounded-lg cursor-pointer border border-input" />
                      </div>
                    </div>
                  </div>
                )}

                {settings.backgroundType === 'solid' && (
                  <input type="color" value={settings.backgroundColor} onChange={e => update('backgroundColor', e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border border-input" />
                )}
              </div>

              {/* Options section */}
              <div className="px-4 py-4 border-b border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Settings2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Padding</Label>
                    <Select value={settings.padding} onValueChange={v => v && update('padding', v as ExportSettings['padding'])}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small" className="text-xs">Small</SelectItem>
                        <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                        <SelectItem value="large" className="text-xs">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Resolution</Label>
                    <Select value={String(settings.pixelRatio)} onValueChange={v => v && update('pixelRatio', Number(v) as 1 | 2 | 3)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1" className="text-xs">1× Screen</SelectItem>
                        <SelectItem value="2" className="text-xs">2× Retina</SelectItem>
                        <SelectItem value="3" className="text-xs">3× HiDPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  {([
                    { id: 'lineNumbers', label: 'Line numbers', key: 'showLineNumbers' },
                    { id: 'fileName', label: 'Show file name', key: 'showFileName' },
                    { id: 'shadow', label: 'Drop shadow', key: 'addShadow' },
                    { id: 'watermark', label: 'Watermark', key: 'addWatermark' },
                  ] as const).map(({ id, label, key }) => (
                    <div key={id} className="flex items-center justify-between">
                      <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                      <Switch
                        id={id}
                        checked={settings[key] as boolean}
                        onCheckedChange={v => update(key, v as never)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky action footer */}
            <div className="p-4 border-t border-border bg-card space-y-2 shrink-0">
              <Button className="w-full gap-2 shadow-sm shadow-primary/20 font-semibold" onClick={handleDownload} disabled={downloading}>
                <Download className="h-4 w-4" />
                {downloading ? 'Exporting…' : 'Download PNG'}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="gap-1.5" onClick={handleCopyImage} disabled={copying}>
                  <Copy className="h-3.5 w-3.5" />
                  {copying ? 'Copying…' : 'Copy Image'}
                </Button>
                <Button variant="outline" className="gap-1.5" onClick={handleCopyLink}>
                  {linkCopied
                    ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                    : <Link2 className="h-3.5 w-3.5" />}
                  {linkCopied ? 'Copied!' : 'Share Link'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
