export type Platform = "ios" | "android" | "web" | "macos";

export interface IconSize {
  name: string;
  size: number;
  description: string;
  platform: Platform;
}

export interface GeneratedIcon {
  name: string;
  size: number;
  dataUrl: string;
  platform: Platform;
}
