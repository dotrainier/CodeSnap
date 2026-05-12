'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { loadLanguage, langNames } from '@uiw/codemirror-extensions-langs';

const ReactCodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const extensions = useMemo(() => {
    const lang = langNames.includes(language as never) ? loadLanguage(language as never) : null;
    return lang ? [lang] : [];
  }, [language]);

  return (
    <div className="rounded-md overflow-hidden border border-input text-sm font-mono min-h-60">
      <ReactCodeMirror
        value={value}
        onChange={onChange}
        theme={dracula}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          highlightActiveLine: true,
          highlightSelectionMatches: false,
        }}
        style={{ minHeight: '240px' }}
      />
    </div>
  );
}
