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
import { Download, Copy, Link2, Check } from 'lucide-react';
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

  const windowDots = (
    <div className="flex items-center gap-1.5">
      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
      <div className="h-3 w-3 rounded-full bg-[#28c840]" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-full h-[90vh] overflow-hidden p-0 gap-0 flex flex-col">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-base font-semibold">Export Snippet</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
            {/* Preview panel */}
            <div className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-8 min-h-64">
              <div
                id={exportId}
                style={{ background, padding: paddingSize, borderRadius: '12px' }}
                className="w-full max-w-xl"
              >
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ boxShadow: settings.addShadow ? '0 25px 60px rgba(0,0,0,0.5)' : undefined }}
                >
                  {/* Window chrome */}
                  {settings.windowStyle !== 'none' && (
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e2e]/90">
                      {settings.windowStyle === 'macos' && (
                        <>
                          {windowDots}
                          {settings.showFileName && (
                            <span className="text-xs text-white/40 absolute left-1/2 -translate-x-1/2">
                              {snippet.title}.{snippet.language}
                            </span>
                          )}
                          <span />
                        </>
                      )}
                      {settings.windowStyle === 'windows' && (
                        <>
                          {settings.showFileName && (
                            <span className="text-xs text-white/40">{snippet.title}.{snippet.language}</span>
                          )}
                          <div className="flex gap-2 ml-auto">
                            {['─', '□', '✕'].map(c => (
                              <span key={c} className="text-xs text-white/40 w-5 text-center">{c}</span>
                            ))}
                          </div>
                        </>
                      )}
                      {settings.windowStyle === 'minimal' && settings.showFileName && (
                        <span className="text-xs text-white/40">{snippet.title}.{snippet.language}</span>
                      )}
                    </div>
                  )}

                  {/* Code area */}
                  <div
                    className="relative overflow-hidden"
                    style={{ fontSize: settings.fontSize }}
                  >
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
                      <div className="absolute bottom-2 right-3 text-[10px] text-white/20 select-none">
                        Made with CodeSnap
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls panel */}
            <div className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l overflow-y-auto">
              <div className="p-5 space-y-5">

                {/* Theme */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Theme</Label>
                  <Select value={settings.theme} onValueChange={v => v && update('theme', v)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Dark</div>
                      {THEMES.filter(t => t.dark).map(t => (
                        <SelectItem key={t.id} value={t.id} className="text-sm">{t.name}</SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs text-muted-foreground font-medium mt-1">Light</div>
                      {THEMES.filter(t => !t.dark).map(t => (
                        <SelectItem key={t.id} value={t.id} className="text-sm">{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Window style */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Window</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['macos', 'windows', 'minimal', 'none'] as const).map(style => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => update('windowStyle', style)}
                        className={`text-xs py-1.5 px-2 rounded-md border transition-colors capitalize ${
                          settings.windowStyle === style
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-input hover:bg-muted'
                        }`}
                      >
                        {style === 'none' ? 'None' : style === 'macos' ? 'macOS' : style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Background</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['gradient', 'solid', 'transparent'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => update('backgroundType', type)}
                        className={`text-xs py-1.5 px-2 rounded-md border transition-colors capitalize ${
                          settings.backgroundType === type
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-input hover:bg-muted'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {settings.backgroundType === 'gradient' && (
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-3 gap-1">
                        {PRESET_GRADIENTS.map(g => (
                          <button
                            key={g.name}
                            type="button"
                            title={g.name}
                            onClick={() => { update('gradientFrom', g.from); update('gradientTo', g.to); }}
                            className="h-7 rounded-md border-2 border-transparent hover:border-primary/60 transition-all"
                            style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">From</Label>
                          <input type="color" value={settings.gradientFrom} onChange={e => update('gradientFrom', e.target.value)}
                            className="w-full h-7 rounded cursor-pointer border border-input" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">To</Label>
                          <input type="color" value={settings.gradientTo} onChange={e => update('gradientTo', e.target.value)}
                            className="w-full h-7 rounded cursor-pointer border border-input" />
                        </div>
                      </div>
                    </div>
                  )}

                  {settings.backgroundType === 'solid' && (
                    <input type="color" value={settings.backgroundColor} onChange={e => update('backgroundColor', e.target.value)}
                      className="w-full h-7 rounded cursor-pointer border border-input mt-1" />
                  )}
                </div>

                {/* Options grid */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Padding</Label>
                      <Select value={settings.padding} onValueChange={v => v && update('padding', v as ExportSettings['padding'])}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
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
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1" className="text-xs">1× Screen</SelectItem>
                          <SelectItem value="2" className="text-xs">2× Retina</SelectItem>
                          <SelectItem value="3" className="text-xs">3× HiDPI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2.5">
                  {[
                    { id: 'lineNumbers', label: 'Line numbers', key: 'showLineNumbers' },
                    { id: 'fileName', label: 'File name', key: 'showFileName' },
                    { id: 'shadow', label: 'Drop shadow', key: 'addShadow' },
                    { id: 'watermark', label: 'Watermark', key: 'addWatermark' },
                  ].map(({ id, label, key }) => (
                    <div key={id} className="flex items-center justify-between">
                      <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                      <Switch
                        id={id}
                        checked={settings[key as keyof ExportSettings] as boolean}
                        onCheckedChange={v => update(key as keyof ExportSettings, v as never)}
                      />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <Button className="w-full" onClick={handleDownload} disabled={downloading}>
                    <Download className="h-4 w-4 mr-2" />
                    {downloading ? 'Exporting…' : 'Download PNG'}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCopyImage} disabled={copying}>
                    <Copy className="h-4 w-4 mr-2" />
                    {copying ? 'Copying…' : 'Copy Image'}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                    {linkCopied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Link2 className="h-4 w-4 mr-2" />}
                    {linkCopied ? 'Link Copied!' : 'Share Link'}
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
