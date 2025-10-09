'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Settings, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useImageResizer } from '../model/use-image-resizer';
import { ImageResizeOptions } from '../../../entities/image';
import { ImageUtils } from '../../../entities/image';
import { Button } from '../../../shared/ui/button/button';
import { Input } from '../../../shared/ui/input/input';
import { Card } from '../../../shared/ui/card/card';

export const ImageResizer: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<ImageResizeOptions>({
    width: undefined,
    height: undefined,
    maintainAspectRatio: true,
    quality: 0.9,
    format: 'jpeg'
  });

  const { state, results, uploadedImages, previewUrls, resetState, uploadImages, resizeImages, downloadImage, downloadAllImages, downloadPreview } = useImageResizer(options);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      resetState();
      await uploadImages(files);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      resetState();
      await uploadImages(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleOptionChange = (key: keyof ImageResizeOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleResize = () => {
    resizeImages(options);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          이미지 리사이저
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          이미지를 업로드하고 원하는 크기로 조절하세요
        </p>
      </div>

      {/* 설정 패널 */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            리사이징 설정
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              가로 크기 (px)
            </label>
            <Input
              type="number"
              placeholder="예: 800"
              value={options.width || ''}
              onChange={(e) => handleOptionChange('width', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              세로 크기 (px)
            </label>
            <Input
              type="number"
              placeholder="예: 600"
              value={options.height || ''}
              onChange={(e) => handleOptionChange('height', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              품질 (0-1)
            </label>
            <Input
              type="number"
              min="0.1"
              max="1"
              step="0.1"
              value={options.quality || 0.9}
              onChange={(e) => handleOptionChange('quality', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              포맷
            </label>
            <select
              value={options.format || 'jpeg'}
              onChange={(e) => handleOptionChange('format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.maintainAspectRatio}
              onChange={(e) => handleOptionChange('maintainAspectRatio', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              종횡비 유지
            </span>
          </label>
        </div>
      </Card>

      {/* 파일 업로드 영역 */}
      <Card className="p-6">
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            이미지를 드래그하거나 클릭하여 업로드하세요
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            JPEG, PNG, WebP, GIF 지원 (최대 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {state.isLoading && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">
                이미지 처리 중... {state.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {state.error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{state.error}</p>
          </div>
        )}
      </Card>

      {/* 실시간 미리보기 영역 */}
      {uploadedImages.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              실시간 미리보기 ({uploadedImages.length}개)
            </h2>
            <div className="flex gap-2">
              <Button onClick={() => resetState()} variant="outline">
                초기화
              </Button>
              <Button onClick={handleResize}>
                리사이징 시작
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => {
              // 미리보기 크기 계산
              const previewDimensions = ImageUtils.calculateDimensions(
                image.dimensions?.width || 0,
                image.dimensions?.height || 0,
                options
              );

              const maxPreviewWidth = 300;
              const maxPreviewHeight = 200;
              const minDisplaySize = 80; // 최소 표시 크기

              // 실제 크기가 너무 작으면 확대해서 표시
              let displayWidth = previewDimensions.width;
              let displayHeight = previewDimensions.height;
              let zoomFactor = 1;

              // 너비나 높이가 최소 표시 크기보다 작으면 확대
              if (displayWidth < minDisplaySize || displayHeight < minDisplaySize) {
                const widthZoom = displayWidth < minDisplaySize ? minDisplaySize / displayWidth : 1;
                const heightZoom = displayHeight < minDisplaySize ? minDisplaySize / displayHeight : 1;
                zoomFactor = Math.max(widthZoom, heightZoom);

                displayWidth = Math.round(displayWidth * zoomFactor);
                displayHeight = Math.round(displayHeight * zoomFactor);
              }

              // 최대 크기 제한
              const finalScale = Math.min(
                maxPreviewWidth / displayWidth,
                maxPreviewHeight / displayHeight,
                1
              );

              displayWidth = Math.round(displayWidth * finalScale);
              displayHeight = Math.round(displayHeight * finalScale);

              return (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="space-y-3">
                    {/* 미리보기 이미지 */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        미리보기
                      </h3>
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded border overflow-hidden">
                        <img
                          src={previewUrls[index] || image.url}
                          alt={`미리보기 ${index + 1}`}
                          className="w-full h-full object-contain"
                          style={{
                            width: displayWidth,
                            height: displayHeight,
                            maxWidth: '100%',
                            maxHeight: '200px'
                          }}
                        />
                        {previewUrls[index] && (
                          <div className="absolute top-2 left-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                            {previewDimensions.width}×{previewDimensions.height}
                            {zoomFactor > 1 && (
                              <span className="ml-1">
                                ({Math.round(zoomFactor)}배 확대)
                              </span>
                            )}
                          </div>
                        )}
                        {!previewUrls[index] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">
                            처리 중...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <div className="text-gray-600 dark:text-gray-400 truncate">
                          {image.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          원본: {image.dimensions?.width}×{image.dimensions?.height}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => downloadPreview(index, options)}
                        disabled={!previewUrls[index]}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 결과 영역 */}
      {results.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              처리 결과 ({results.length}개)
            </h2>
            <Button
              onClick={() => downloadAllImages(options)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              전체 다운로드
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* 원본 이미지 */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      원본
                    </h3>
                    <div className="relative">
                      <img
                        src={result.original.url}
                        alt="원본"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <div className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {result.original.dimensions?.width}×{result.original.dimensions?.height}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {ImageUtils.formatFileSize(result.original.size)}
                    </p>
                  </div>

                  {/* 리사이징된 이미지 */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      결과
                    </h3>
                    <div className="relative">
                      <img
                        src={result.resizedUrl}
                        alt="리사이징 결과"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <div className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {result.newDimensions.width}×{result.newDimensions.height}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {ImageUtils.formatFileSize(result.resized.size)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {result.original.name}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => downloadImage(result, options)}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    다운로드
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 사용법 안내 */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              사용법
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 이미지를 업로드하면 실시간으로 설정에 맞는 미리보기가 표시됩니다</li>
              <li>• 가로/세로 크기를 입력하거나 둘 중 하나만 입력하여 자동 계산</li>
              <li>• 종횡비 유지를 해제하면 지정한 크기로 강제 조절</li>
              <li>• 품질은 0.1~1.0 사이 값 (1.0이 최고 품질)</li>
              <li>• 미리보기가 마음에 들면 "리사이징 시작" 버튼을 눌러 최종 파일 생성</li>
              <li>• 여러 이미지를 한 번에 처리할 수 있습니다</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
