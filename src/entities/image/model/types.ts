export interface ImageResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageFile {
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ResizeResult {
  original: ImageFile;
  resized: Blob;
  resizedUrl: string;
  newDimensions: {
    width: number;
    height: number;
  };
}

export interface ImageResizeState {
  isLoading: boolean;
  error: string | null;
  progress: number;
}
