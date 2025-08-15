export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: '이미지 파일만 업로드 가능합니다.' };
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    return { isValid: false, error: '파일 크기는 10MB를 초과할 수 없습니다.' };
  }
  
  return { isValid: true };
};
