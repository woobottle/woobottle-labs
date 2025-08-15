'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Smartphone, Monitor, X, CheckCircle, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AppLayout from '../../components/AppLayout';

interface IconSize {
  name: string;
  size: number;
  description: string;
  platform: 'ios' | 'android' | 'web';
}

const iconSizes: IconSize[] = [
  // iOS Sizes
  { name: 'icon-20@1x', size: 20, description: 'iPhone Notification', platform: 'ios' },
  { name: 'icon-20@2x', size: 40, description: 'iPhone Notification @2x', platform: 'ios' },
  { name: 'icon-20@3x', size: 60, description: 'iPhone Notification @3x', platform: 'ios' },
  { name: 'icon-29@1x', size: 29, description: 'iPhone Settings', platform: 'ios' },
  { name: 'icon-29@2x', size: 58, description: 'iPhone Settings @2x', platform: 'ios' },
  { name: 'icon-29@3x', size: 87, description: 'iPhone Settings @3x', platform: 'ios' },
  { name: 'icon-40@1x', size: 40, description: 'iPhone Spotlight', platform: 'ios' },
  { name: 'icon-40@2x', size: 80, description: 'iPhone Spotlight @2x', platform: 'ios' },
  { name: 'icon-40@3x', size: 120, description: 'iPhone Spotlight @3x', platform: 'ios' },
  { name: 'icon-60@2x', size: 120, description: 'iPhone App @2x', platform: 'ios' },
  { name: 'icon-60@3x', size: 180, description: 'iPhone App @3x', platform: 'ios' },
  { name: 'icon-76@1x', size: 76, description: 'iPad App', platform: 'ios' },
  { name: 'icon-76@2x', size: 152, description: 'iPad App @2x', platform: 'ios' },
  { name: 'icon-83.5@2x', size: 167, description: 'iPad Pro App @2x', platform: 'ios' },
  { name: 'icon-1024@1x', size: 1024, description: 'App Store', platform: 'ios' },
  
  // Android Sizes
  { name: 'ic_launcher_36', size: 36, description: 'ldpi', platform: 'android' },
  { name: 'ic_launcher_48', size: 48, description: 'mdpi', platform: 'android' },
  { name: 'ic_launcher_72', size: 72, description: 'hdpi', platform: 'android' },
  { name: 'ic_launcher_96', size: 96, description: 'xhdpi', platform: 'android' },
  { name: 'ic_launcher_144', size: 144, description: 'xxhdpi', platform: 'android' },
  { name: 'ic_launcher_192', size: 192, description: 'xxxhdpi', platform: 'android' },
  { name: 'ic_launcher_512', size: 512, description: 'Play Store', platform: 'android' },
  
  // Web/PWA Sizes
  { name: 'favicon-16', size: 16, description: 'Favicon 16x16', platform: 'web' },
  { name: 'favicon-32', size: 32, description: 'Favicon 32x32', platform: 'web' },
  { name: 'apple-touch-icon-180', size: 180, description: 'Apple Touch Icon', platform: 'web' },
  { name: 'android-chrome-192', size: 192, description: 'Android Chrome 192x192', platform: 'web' },
  { name: 'android-chrome-512', size: 512, description: 'Android Chrome 512x512', platform: 'web' },
];

export default function IconGeneratorPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedIcons, setGeneratedIcons] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['ios', 'android', 'web']);
  const [dragActive, setDragActive] = useState(false);
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
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string);
        setGeneratedIcons({});
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const resizeImage = (originalImage: HTMLImageElement, size: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = size;
      canvas.height = size;
      
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(originalImage, 0, 0, size, size);
      }
      
      resolve(canvas.toDataURL('image/png'));
    });
  };

  const generateIcons = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    
    const img = new Image();
    img.onload = async () => {
      const icons: { [key: string]: string } = {};
      
      const filteredSizes = iconSizes.filter(iconSize => 
        selectedPlatforms.includes(iconSize.platform)
      );

      for (const iconSize of filteredSizes) {
        const resizedImage = await resizeImage(img, iconSize.size);
        icons[iconSize.name] = resizedImage;
      }
      
      setGeneratedIcons(icons);
      setIsGenerating(false);
    };
    
    img.src = uploadedImage;
  };

  const downloadZip = async () => {
    if (Object.keys(generatedIcons).length === 0) return;

    const zip = new JSZip();
    
    // Create platform folders
    const iosFolder = zip.folder('ios');
    const androidFolder = zip.folder('android');
    const webFolder = zip.folder('web');

    for (const [name, dataUrl] of Object.entries(generatedIcons)) {
      const iconSize = iconSizes.find(size => size.name === name);
      if (!iconSize) continue;

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      const fileName = `${name}.png`;
      
      if (iconSize.platform === 'ios' && iosFolder) {
        iosFolder.file(fileName, blob);
      } else if (iconSize.platform === 'android' && androidFolder) {
        androidFolder.file(fileName, blob);
      } else if (iconSize.platform === 'web' && webFolder) {
        webFolder.file(fileName, blob);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'app-icons.zip');
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      case 'web': return '🌐';
      default: return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'ios': return 'from-gray-500 to-gray-600';
      case 'android': return 'from-green-500 to-green-600';
      case 'web': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
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
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setGeneratedIcons({});
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />
                    <div>
                      <p className="text-gray-600 mb-2">
                        이미지를 드래그 앤 드롭하거나 클릭하여 업로드
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        파일 선택
                      </button>
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
                {['ios', 'android', 'web'].map((platform) => (
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
                          {platform === 'ios' && `${iconSizes.filter(s => s.platform === 'ios').length}개 크기`}
                          {platform === 'android' && `${iconSizes.filter(s => s.platform === 'android').length}개 크기`}
                          {platform === 'web' && `${iconSizes.filter(s => s.platform === 'web').length}개 크기`}
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
            <button
              onClick={generateIcons}
              disabled={!uploadedImage || isGenerating || selectedPlatforms.length === 0}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                ${uploadedImage && selectedPlatforms.length > 0 && !isGenerating
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isGenerating ? '생성 중...' : '아이콘 생성하기'}
            </button>
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
                  <button
                    onClick={downloadZip}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    ZIP 파일로 다운로드
                  </button>
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
}
