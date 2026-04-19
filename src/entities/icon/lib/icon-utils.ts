import type { Platform } from "../model/types";

export const getPlatformIcon = (platform: Platform): string => {
  switch (platform) {
    case "ios":
      return "🍎";
    case "android":
      return "🤖";
    case "web":
      return "🌐";
    case "macos":
      return "💻";
    default:
      return "📱";
  }
};
