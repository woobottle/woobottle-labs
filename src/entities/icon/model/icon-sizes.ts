import type { IconSize } from './types';

export const iconSizes: IconSize[] = [
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

  // macOS Sizes
  { name: 'icon_16x16', size: 16, description: 'Small Dock Icon', platform: 'macos' },
  { name: 'icon_32x32', size: 32, description: 'Large Dock Icon', platform: 'macos' },
  { name: 'icon_64x64', size: 64, description: 'Small App Icon', platform: 'macos' },
  { name: 'icon_128x128', size: 128, description: 'App Icon', platform: 'macos' },
  { name: 'icon_256x256', size: 256, description: 'Standard App Icon', platform: 'macos' },
  { name: 'icon_512x512', size: 512, description: 'App Icon @2x', platform: 'macos' },
  { name: 'icon_1024x1024', size: 1024, description: 'App Store', platform: 'macos' },
];
