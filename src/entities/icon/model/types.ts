export interface IconSize {
  name: string;
  size: number;
  description: string;
  platform: 'ios' | 'android' | 'web';
}

export interface GeneratedIcon {
  name: string;
  size: number;
  dataUrl: string;
  platform: 'ios' | 'android' | 'web';
}

export type Platform = 'ios' | 'android' | 'web';
