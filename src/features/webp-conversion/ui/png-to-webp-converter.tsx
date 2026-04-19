"use client";

import React from "react";
import { Button } from "shared/ui/button";
import { Input } from "shared/ui/input";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  convertPngFileToWebp,
  downloadDataUrl,
  WebpConversionResult,
} from "../lib/png-to-webp";

interface ConvertedItem extends WebpConversionResult {
  previewUrl?: string;
}

export const PngToWebpConverter: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [quality, setQuality] = React.useState<number>(0.8);
  const [results, setResults] = React.useState<ConvertedItem[]>([]);
  const [isConverting, setIsConverting] = React.useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter((f) =>
      /\.png$/i.test(f.name),
    );
    setFiles(selected);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    try {
      const converted = await Promise.all(
        files.map((file) => convertPngFileToWebp(file, quality)),
      );
      const withPreview: ConvertedItem[] = converted.map((item) => ({
        ...item,
        previewUrl: item.webpDataUrl,
      }));
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
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "converted-webp.zip");
  };

  const totalOriginal = results.reduce(
    (sum, r) => sum + r.originalSizeBytes,
    0,
  );
  const totalWebp = results.reduce((sum, r) => sum + r.webpApproxBytes, 0);
  const savingPct =
    totalOriginal > 0
      ? Math.max(0, 100 - Math.round((totalWebp / totalOriginal) * 100))
      : 0;

  return (
    <div className="space-y-8">
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-8">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#A3A3A3]">
              PNG 파일 선택
            </label>
            <Input
              type="file"
              accept="image/png"
              multiple
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <p className="mt-2 text-xs text-[#525252]">
                {files.length}개 선택됨
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#A3A3A3]">
              품질 (0.1 ~ 1.0)
            </label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-[#A3A3A3] mt-1">
              현재 품질: {quality.toFixed(2)}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleConvert}
              disabled={files.length === 0 || isConverting}
            >
              {isConverting ? "변환 중..." : "변환하기"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                setFiles([]);
                setResults([]);
              }}
              disabled={files.length === 0 && results.length === 0}
            >
              초기화
            </Button>
          </div>
        </div>

        {isConverting && (
          <div className="mt-6 w-full bg-[#1A1A1A] rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-2 rounded-full animate-pulse"
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-[#A3A3A3]">총 용량 절감</div>
                <div className="text-xl font-bold text-white">
                  {savingPct}% 절감
                </div>
              </div>
              <div className="text-sm text-[#A3A3A3]">
                원본 {(totalOriginal / 1024).toFixed(1)} KB → WebP{" "}
                {(totalWebp / 1024).toFixed(1)} KB
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleDownloadAll}>
                  모두 ZIP 다운로드
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((r) => (
              <div
                key={r.fileName}
                className="bg-[#0A0A0A] rounded-xl border border-[#1A1A1A] p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="font-semibold text-white truncate mr-3"
                    title={r.fileName}
                  >
                    {r.fileName}
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => downloadDataUrl(r.webpDataUrl, r.fileName)}
                  >
                    다운로드
                  </Button>
                </div>
                {r.previewUrl && (
                  <img
                    src={r.previewUrl}
                    alt={r.fileName}
                    className="w-full h-40 object-contain bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg"
                  />
                )}
                <div className="mt-3 text-xs text-[#A3A3A3]">
                  원본 {(r.originalSizeBytes / 1024).toFixed(1)} KB → WebP{" "}
                  {(r.webpApproxBytes / 1024).toFixed(1)} KB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
