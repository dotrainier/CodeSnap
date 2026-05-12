'use client';

import { toPng } from 'html-to-image';

export interface ExportOptions {
  pixelRatio?: number;
  backgroundColor?: string;
}

export async function exportSnippetAsImage(
  elementId: string,
  fileName: string,
  options: ExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Export element not found');

  const { pixelRatio = 2, backgroundColor = 'transparent' } = options;

  const dataUrl = await toPng(element, {
    pixelRatio,
    backgroundColor,
    cacheBust: true,
  });

  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  link.click();
}

export async function copyImageToClipboard(elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Export element not found');

  const dataUrl = await toPng(element, { pixelRatio: 2, cacheBust: true });
  const blob = await fetch(dataUrl).then((res) => res.blob());

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ]);
}
