export const resizeImage = (originalImage: HTMLImageElement, size: number): Promise<string> => {
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
