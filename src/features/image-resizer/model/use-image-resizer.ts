'use client';

import { useState, useCallback, useEffect } from 'react';
import { ImageUtils, ImageResizeOptions, ResizeResult, ImageResizeState, ImageFile } from '../../../entities/image';

export const useImageResizer = (currentOptions?: ImageResizeOptions) => {
  const [state, setState] = useState<ImageResizeState>({
    isLoading: false,
    error: null,
    progress: 0
  });

  const [results, setResults] = useState<ResizeResult[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const resetState = useCallback(() => {
    setState({ isLoading: false, error: null, progress: 0 });
    setResults([]);
    setUploadedImages([]);
    setPreviewUrls([]);
  }, []);

  // 업로드된 이미지를 저장하고 초기화
  const uploadImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const validFiles = fileArray.filter(file => {
      if (!ImageUtils.isValidImageFile(file)) {
        setState(prev => ({
          ...prev,
          error: `${file.name}은(는) 지원하지 않는 이미지 형식입니다.`
        }));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setState(prev => ({
        ...prev,
        error: '유효한 이미지 파일을 선택해주세요.'
      }));
      return;
    }

    const imageFiles: ImageFile[] = [];
    for (const file of validFiles) {
      try {
        const img = await ImageUtils.loadImage(file);
        const imageFile: ImageFile = {
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          dimensions: { width: img.width, height: img.height }
        };
        imageFiles.push(imageFile);
      } catch (error) {
        console.error(`이미지 로드 실패: ${file.name}`, error);
      }
    }

    setUploadedImages(imageFiles);
    setState({ isLoading: false, error: null, progress: 0 });
  }, []);

  // 실시간 미리보기 생성
  const generatePreview = useCallback(async (imageFile: ImageFile, options: ImageResizeOptions): Promise<string> => {
    try {
      const result = await ImageUtils.resizeImage(imageFile.file, options);
      return result.resizedUrl;
    } catch (error) {
      console.error('미리보기 생성 실패:', error);
      return imageFile.url; // 실패 시 원본 이미지 반환
    }
  }, []);

  // 모든 업로드된 이미지에 대한 미리보기 업데이트
  const updatePreviews = useCallback(async (options: ImageResizeOptions) => {
    if (uploadedImages.length === 0) return;

    const newPreviewUrls: string[] = [];
    for (const image of uploadedImages) {
      const previewUrl = await generatePreview(image, options);
      newPreviewUrls.push(previewUrl);
    }
    setPreviewUrls(newPreviewUrls);
  }, [uploadedImages, generatePreview]);

  const resizeImages = useCallback(async (
    options: ImageResizeOptions
  ) => {
    if (uploadedImages.length === 0) {
      setState(prev => ({
        ...prev,
        error: '먼저 이미지를 업로드해주세요.'
      }));
      return;
    }

    setState({ isLoading: true, error: null, progress: 0 });
    setResults([]);

    const newResults: ResizeResult[] = [];

    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        const imageFile = uploadedImages[i];
        const progressCallback = (progress: number) => {
          const overallProgress = ((i / uploadedImages.length) * 100) + (progress / uploadedImages.length);
          setState(prev => ({ ...prev, progress: Math.round(overallProgress) }));
        };

        const result = await ImageUtils.resizeImage(imageFile.file, options, progressCallback);
        newResults.push(result);
      }

      setResults(newResults);
      setState({ isLoading: false, error: null, progress: 100 });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        progress: 0
      });
    }
  }, [uploadedImages]);

  const downloadImage = useCallback((result: ResizeResult, options: ImageResizeOptions) => {
    const fileName = ImageUtils.generateDownloadFileName(result.original.name, options);

    const link = document.createElement('a');
    link.href = result.resizedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadAllImages = useCallback((options: ImageResizeOptions) => {
    results.forEach(result => downloadImage(result, options));
  }, [results, downloadImage]);

  // 미리보기 다운로드 (실시간 미리보기용)
  const downloadPreview = useCallback((index: number, options: ImageResizeOptions) => {
    if (uploadedImages[index] && previewUrls[index]) {
      const fileName = ImageUtils.generateDownloadFileName(uploadedImages[index].name, options);
      const link = document.createElement('a');
      link.href = previewUrls[index];
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [uploadedImages, previewUrls]);

  // 옵션이 변경될 때마다 미리보기 업데이트
  useEffect(() => {
    let isMounted = true;

    const updatePreviewsAsync = async () => {
      if (uploadedImages.length > 0 && currentOptions) {
        await updatePreviews(currentOptions);
      }
    };

    // 디바운싱을 위한 타임아웃
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        updatePreviewsAsync();
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [uploadedImages, currentOptions, updatePreviews]);

  return {
    state,
    results,
    uploadedImages,
    previewUrls,
    resetState,
    uploadImages,
    resizeImages,
    downloadImage,
    downloadAllImages,
    downloadPreview
  };
};
