import type { Platform } from '../model/types';

export const getPlatformIcon = (platform: Platform): string => {
  switch (platform) {
    case 'ios': return '🍎';
    case 'android': return '🤖';
    case 'web': return '🌐';
    default: return '📱';
  }
};

export const getPlatformColor = (platform: Platform): string => {
  switch (platform) {
    case 'ios': return 'from-gray-500 to-gray-600';
    case 'android': return 'from-green-500 to-green-600';
    case 'web': return 'from-blue-500 to-blue-600';
    default: return 'from-gray-500 to-gray-600';
  }
};
