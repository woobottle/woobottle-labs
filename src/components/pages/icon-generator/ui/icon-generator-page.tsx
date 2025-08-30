'use client';

import React, { useRef, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Smartphone, Monitor, X, CheckCircle, AlertCircle } from 'lucide-react';

import { AppLayout } from 'widgets/app-layout';
import { Button } from 'shared/ui/button';
import { validateFile } from 'shared/lib/utils';
import { iconSizes, getPlatformIcon, getPlatformColor, type Platform } from 'entities/icon';
import { useIconGeneration, downloadIconsAsZip } from 'features/icon-generation';

export const IconGeneratorPage: React.FC = () => {
  const {
    uploadedImage,
    setUploadedImage,
    generatedIcons,
    isGenerating,
    selectedPlatforms,
    generateIcons,
    resetGeneration,
    togglePlatform,
  } = useIconGeneration();

  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFile = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, [setUploadedImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    resetGeneration();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            앱 아이콘 생성기
          </h1>
          <p className="text-gray-600 text-lg">
            하나의 이미지로 iOS, Android, Web용 아이콘을 한 번에 생성하세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                이미지 업로드
              </h2>
              
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-32 h-32 mx-auto rounded-xl object-cover border-2 border-gray-200"
                    />
                    <p className="text-green-600 font-medium">이미지 업로드 완료!</p>
                    <Button variant="danger" size="sm" onClick={handleReset}>
                      <X className="w-4 h-4 mr-2" />
                      제거
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />
                    <div>
                      <p className="text-gray-600 mb-2">
                        이미지를 드래그 앤 드롭하거나 클릭하여 업로드
                      </p>
                      <Button onClick={() => fileInputRef.current?.click()}>
                        파일 선택
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      권장: 1024x1024 PNG 파일
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Platform Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                플랫폼 선택
              </h2>
              
              <div className="space-y-3">
                {(['ios', 'android', 'web'] as Platform[]).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`
                      w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200
                      ${selectedPlatforms.includes(platform)
                        ? `bg-gradient-to-r ${getPlatformColor(platform)} text-white`
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(platform)}</span>
                      <div className="text-left">
                        <p className="font-medium capitalize">{platform}</p>
                        <p className={`text-sm ${selectedPlatforms.includes(platform) ? 'text-white/80' : 'text-gray-500'}`}>
                          {iconSizes.filter(s => s.platform === platform).length}개 크기
                        </p>
                      </div>
                    </div>
                    {selectedPlatforms.includes(platform) && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateIcons}
              disabled={!uploadedImage || isGenerating || selectedPlatforms.length === 0}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {isGenerating ? '생성 중...' : '아이콘 생성하기'}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                생성된 아이콘 미리보기
              </h2>
              
              {Object.keys(generatedIcons).length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">아이콘을 생성하면 여기에 미리보기가 표시됩니다</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedPlatforms.map(platform => {
                    const platformIcons = Object.entries(generatedIcons).filter(([name]) => {
                      const iconSize = iconSizes.find(s => s.name === name);
                      return iconSize?.platform === platform;
                    });

                    if (platformIcons.length === 0) return null;

                    return (
                      <div key={platform} className="space-y-3">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-xl">{getPlatformIcon(platform)}</span>
                          <span className="capitalize">{platform}</span>
                          <span className="text-sm text-gray-500">({platformIcons.length}개)</span>
                        </h3>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                          {platformIcons.map(([name, dataUrl]) => {
                            const iconSize = iconSizes.find(s => s.name === name);
                            return (
                              <div key={name} className="text-center">
                                <img 
                                  src={dataUrl} 
                                  alt={name}
                                  className="w-12 h-12 mx-auto rounded-lg border border-gray-200 shadow-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">{iconSize?.size}px</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Download Button */}
                  <Button
                    onClick={() => downloadIconsAsZip(generatedIcons)}
                    variant="success"
                    size="lg"
                    className="w-full"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    ZIP 파일로 다운로드
                  </Button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                사용 안내
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• 최상의 품질을 위해 1024x1024 이상의 정방형 이미지를 사용하세요</li>
                <li>• PNG 형식을 권장합니다 (투명 배경 지원)</li>
                <li>• 생성된 아이콘은 각 플랫폼의 가이드라인에 맞게 최적화됩니다</li>
                <li>• 모든 처리는 브라우저에서 로컬로 수행됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
