'use client';

import React from 'react';
import { Button } from 'shared/ui/button';
import { Input } from 'shared/ui/input';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { convertPngFileToWebp, downloadDataUrl, WebpConversionResult } from '../lib/png-to-webp';

interface ConvertedItem extends WebpConversionResult {
  previewUrl?: string;
}

export const PngToWebpConverter: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [quality, setQuality] = React.useState<number>(0.8);
  const [results, setResults] = React.useState<ConvertedItem[]>([]);
  const [isConverting, setIsConverting] = React.useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(f => /\.png$/i.test(f.name));
    setFiles(selected);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    try {
      const converted = await Promise.all(files.map(file => convertPngFileToWebp(file, quality)));
      const withPreview: ConvertedItem[] = converted.map(item => ({ ...item, previewUrl: item.webpDataUrl }));
      setResults(withPreview);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    for (const r of results) {
      const response = await fetch(r.webpDataUrl);
      const blob = await response.blob();
      zip.file(r.fileName, blob);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'converted-webp.zip');
  };

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSizeBytes, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webpApproxBytes, 0);
  const savingPct = totalOriginal > 0 ? Math.max(0, 100 - Math.round((totalWebp / totalOriginal) * 100)) : 0;

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 dark:bg-gray-800/80 dark:border-gray-700/30">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">PNG → WebP 변환기</h2>
          <p className="text-gray-600 dark:text-gray-300">여러 PNG 파일을 선택하고 품질을 조절해 WebP로 변환하세요.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">PNG 파일 선택</label>
            <Input type="file" accept="image/png" multiple onChange={handleFileChange} />
            {files.length > 0 && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{files.length}개 선택됨</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">품질 (0.1 ~ 1.0)</label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">현재 품질: {quality.toFixed(2)}</div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="lg" onClick={handleConvert} disabled={files.length === 0 || isConverting}>
              {isConverting ? '변환 중...' : '변환하기'}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => { setFiles([]); setResults([]); }} disabled={files.length === 0 && results.length === 0}>초기화</Button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 dark:bg-gray-800/80 dark:border-gray-700/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">총 용량 절감</div>
                <div className="text-xl font-bold text-green-600">{savingPct}% 절감</div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                원본 {(totalOriginal / 1024).toFixed(1)} KB → WebP {(totalWebp / 1024).toFixed(1)} KB
              </div>
              <div className="flex gap-3">
                <Button variant="success" onClick={handleDownloadAll}>모두 ZIP 다운로드</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((r) => (
              <div key={r.fileName} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-4 dark:bg-gray-800/80 dark:border-gray-700/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-100 truncate mr-3" title={r.fileName}>{r.fileName}</div>
                  <Button size="sm" variant="primary" onClick={() => downloadDataUrl(r.webpDataUrl, r.fileName)}>다운로드</Button>
                </div>
                {r.previewUrl && (
                  <img src={r.previewUrl} alt={r.fileName} className="w-full h-40 object-contain bg-gray-50 dark:bg-gray-900 rounded-lg" />
                )}
                <div className="mt-3 text-xs text-gray-600 dark:text-gray-300">
                  원본 {(r.originalSizeBytes / 1024).toFixed(1)} KB → WebP {(r.webpApproxBytes / 1024).toFixed(1)} KB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


