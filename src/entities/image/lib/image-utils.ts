import { ImageResizeOptions, ImageFile, ResizeResult } from '../model/types';

export class ImageUtils {
  /**
   * 이미지 파일로부터 Image 객체를 생성합니다
   */
  static async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('이미지를 불러올 수 없습니다'));
      };

      img.src = url;
    });
  }

  /**
   * Canvas를 사용하여 이미지 크기를 조절합니다
   */
  static async resizeImage(
    file: File,
    options: ImageResizeOptions,
    onProgress?: (progress: number) => void
  ): Promise<ResizeResult> {
    try {
      onProgress?.(10);

      const img = await this.loadImage(file);
      onProgress?.(30);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 컨텍스트를 생성할 수 없습니다');
      }

      // 새로운 크기 계산
      const newDimensions = this.calculateDimensions(
        img.width,
        img.height,
        options
      );

      canvas.width = newDimensions.width;
      canvas.height = newDimensions.height;

      onProgress?.(50);

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);

      onProgress?.(80);

      // Blob으로 변환
      const mimeType = this.getMimeType(options.format || 'jpeg');
      const quality = options.quality || 0.9;

      const resizedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('이미지 변환에 실패했습니다'));
            }
          },
          mimeType,
          quality
        );
      });

      onProgress?.(100);

      const resizedUrl = URL.createObjectURL(resizedBlob);

      return {
        original: {
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          dimensions: { width: img.width, height: img.height }
        },
        resized: resizedBlob,
        resizedUrl,
        newDimensions
      };
    } catch (error) {
      throw new Error(`이미지 리사이징 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 새로운 이미지 크기를 계산합니다
   */
  static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    options: ImageResizeOptions
  ): { width: number; height: number } {
    const { width: targetWidth, height: targetHeight, maintainAspectRatio = true } = options;

    if (!targetWidth && !targetHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    if (!maintainAspectRatio) {
      return {
        width: targetWidth || originalWidth,
        height: targetHeight || originalHeight
      };
    }

    const aspectRatio = originalWidth / originalHeight;

    if (targetWidth && targetHeight) {
      // 둘 다 지정된 경우, 더 작은 쪽에 맞춤
      const widthRatio = targetWidth / originalWidth;
      const heightRatio = targetHeight / originalHeight;
      const ratio = Math.min(widthRatio, heightRatio);

      return {
        width: Math.round(originalWidth * ratio),
        height: Math.round(originalHeight * ratio)
      };
    }

    if (targetWidth) {
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio)
      };
    }

    if (targetHeight) {
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight
      };
    }

    return { width: originalWidth, height: originalHeight };
  }

  /**
   * 포맷에 따른 MIME 타입을 반환합니다
   */
  private static getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp'
    };

    return mimeTypes[format] || 'image/jpeg';
  }

  /**
   * 파일이 이미지인지 확인합니다
   */
  static isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
  }

  /**
   * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 다운로드할 수 있는 파일 이름을 생성합니다
   */
  static generateDownloadFileName(originalName: string, options: ImageResizeOptions): string {
    const extension = options.format || originalName.split('.').pop() || 'jpg';
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    const suffix = options.width && options.height
      ? `_${options.width}x${options.height}`
      : options.width
      ? `_w${options.width}`
      : options.height
      ? `_h${options.height}`
      : '_resized';

    return `${baseName}${suffix}.${extension}`;
  }
}
