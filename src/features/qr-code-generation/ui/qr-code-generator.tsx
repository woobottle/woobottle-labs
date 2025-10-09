'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'shared/ui/button';
import { Input } from 'shared/ui/input';

// qrcodejs2 is a UMD-only library that exposes a global QRCode constructor.
// We import it for side effects so the global becomes available in the browser.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'qrcodejs2';

declare global {
   
  var QRCode: any;
}

interface QrCodeGeneratorProps {
  defaultText?: string;
  size?: number;
}

export const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ defaultText = '', size = 192 }) => {
  const [text, setText] = useState<string>(defaultText);
  const [error, setError] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined' || !window.QRCode) return;

    // Clear previous content and instance
    containerRef.current.innerHTML = '';
    qrInstanceRef.current = new window.QRCode(containerRef.current, {
      text: text || ' ',
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.H,
    });

    // Ensure initial code is rendered similar to example usage
    try {
      qrInstanceRef.current.makeCode(text || ' ');
    } catch {}

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      qrInstanceRef.current = null;
    };
  }, [size]);

  useEffect(() => {
    if (!qrInstanceRef.current || !window.QRCode) return;
    try {
      qrInstanceRef.current.clear();
      qrInstanceRef.current.makeCode(text || ' ');
      setError(undefined);
    } catch (e) {
      setError('QR 코드 생성 중 오류가 발생했습니다.');
    }
  }, [text]);

  const handleDownload = () => {
    if (!containerRef.current) return;
    const img = containerRef.current.querySelector('img') as HTMLImageElement | null;
    const canvas = containerRef.current.querySelector('canvas') as HTMLCanvasElement | null;
    let dataUrl: string | undefined;
    if (img && img.src) {
      dataUrl = img.src;
    } else if (canvas) {
      dataUrl = canvas.toDataURL('image/png');
    }
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return;

    const supportsFileShare = (navigator as any).canShare && typeof (navigator as any).canShare === 'function';

    // Obtain data URL from generated image/canvas
    if (!containerRef.current) return;
    const img = containerRef.current.querySelector('img') as HTMLImageElement | null;
    const canvas = containerRef.current.querySelector('canvas') as HTMLCanvasElement | null;
    let dataUrl: string | undefined;
    if (img && img.src) {
      dataUrl = img.src;
    } else if (canvas) {
      dataUrl = canvas.toDataURL('image/png');
    }
    if (!dataUrl) return;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });

      if (supportsFileShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({
          files: [file],
          title: 'QR 코드',
          text: '생성된 QR 코드를 공유합니다.',
        });
      } else if (navigator.share) {
        // As a fallback, some platforms allow sharing a URL
        await navigator.share({
          title: 'QR 코드',
          text: '생성된 QR 코드를 확인하세요.',
          url: dataUrl,
        });
      } else {
        alert('이 브라우저는 공유 기능을 지원하지 않습니다. 다운로드를 사용해주세요.');
      }
    } catch (e) {
      alert('공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] items-start">
        <div className="space-y-4">
          <Input
            label="QR 코드 텍스트 또는 URL"
            placeholder="https://example.com 또는 임의의 텍스트"
            value={text}
            onChange={(e) => setText(e.target.value)}
            helperText="텍스트를 입력하면 자동으로 QR 코드가 업데이트됩니다."
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={handleDownload}>PNG 다운로드</Button>
            <Button variant="secondary" onClick={handleShare}>공유하기</Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div
            ref={containerRef}
            className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
            style={{ width: size, height: size }}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">사이즈: {size}px</p>
        </div>
      </div>
    </div>
  );
};


