export interface WebpConversionResult {
  fileName: string;
  webpDataUrl: string;
  originalSizeBytes: number;
  webpApproxBytes: number;
}

export const convertPngFileToWebp = async (file: File, quality: number): Promise<WebpConversionResult> => {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is not available');
  }
  context.drawImage(imageBitmap, 0, 0);

  const qualityClamped = Math.min(1, Math.max(0, quality));
  const webpDataUrl = canvas.toDataURL('image/webp', qualityClamped);

  const originalSizeBytes = file.size;
  // Rough estimate: data URL length ~ 4/3 of bytes; subtract header
  const base64Length = webpDataUrl.length - (webpDataUrl.indexOf(',') + 1);
  const webpApproxBytes = Math.floor((base64Length * 3) / 4);

  const baseName = file.name.replace(/\.png$/i, '').replace(/\.(jpg|jpeg|webp)$/i, '');
  const fileName = `${baseName}.webp`;

  return { fileName, webpDataUrl, originalSizeBytes, webpApproxBytes };
};

export const downloadDataUrl = async (dataUrl: string, fileName: string) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

