'use client';

import { useState } from 'react';
import { iconSizes, type Platform } from 'entities/icon';
import { resizeImage } from '../lib/image-processor';

export const useIconGeneration = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedIcons, setGeneratedIcons] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['ios', 'android', 'web']);

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

  const resetGeneration = () => {
    setUploadedImage(null);
    setGeneratedIcons({});
    setIsGenerating(false);
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return {
    uploadedImage,
    setUploadedImage,
    generatedIcons,
    isGenerating,
    selectedPlatforms,
    generateIcons,
    resetGeneration,
    togglePlatform,
  };
};
