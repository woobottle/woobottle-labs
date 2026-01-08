'use client';

import { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface UseMarkdownPreviewReturn {
  text: string;
  html: string;
  copied: boolean;
  setText: (value: string) => void;
  copyHtml: () => Promise<void>;
  copyMarkdown: () => Promise<void>;
  clear: () => void;
}

const DEFAULT_MARKDOWN = `# Markdown 미리보기

## 소개
이 도구는 **Markdown** 텍스트를 실시간으로 미리볼 수 있습니다.

## 기능
- 실시간 미리보기
- HTML 복사
- Markdown 복사

## 코드 블록
\`\`\`javascript
const hello = "Hello, World!";
console.log(hello);
\`\`\`

## 링크
[WooBottle Labs](https://woo-bottle.com)

> 인용문도 지원합니다.
`;

export function useMarkdownPreview(): UseMarkdownPreviewReturn {
  const [text, setTextValue] = useState(DEFAULT_MARKDOWN);
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        const rawHtml = await marked(text);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setHtml(sanitizedHtml);
      } catch {
        setHtml('<p>Markdown 파싱 오류</p>');
      }
    };

    renderMarkdown();
  }, [text]);

  const setText = useCallback((value: string) => {
    setTextValue(value);
  }, []);

  const copyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('복사 실패');
    }
  }, [html]);

  const copyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('복사 실패');
    }
  }, [text]);

  const clear = useCallback(() => {
    setTextValue('');
    setHtml('');
  }, []);

  return {
    text,
    html,
    copied,
    setText,
    copyHtml,
    copyMarkdown,
    clear,
  };
}
