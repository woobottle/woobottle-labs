import JSZip from "jszip";
import { saveAs } from "file-saver";
import { iconSizes } from "entities/icon";

export const downloadIconsAsZip = async (generatedIcons: {
  [key: string]: string;
}) => {
  if (Object.keys(generatedIcons).length === 0) return;

  const zip = new JSZip();

  // Create platform folders
  const iosFolder = zip.folder("ios");
  const androidFolder = zip.folder("android");
  const webFolder = zip.folder("web");
  const macosFolder = zip.folder("macos");

  for (const [name, dataUrl] of Object.entries(generatedIcons)) {
    const iconSize = iconSizes.find((size) => size.name === name);
    if (!iconSize) continue;

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const fileName = `${name}.png`;

    if (iconSize.platform === "ios" && iosFolder) {
      iosFolder.file(fileName, blob);
    } else if (iconSize.platform === "android" && androidFolder) {
      androidFolder.file(fileName, blob);
    } else if (iconSize.platform === "web" && webFolder) {
      webFolder.file(fileName, blob);
    } else if (iconSize.platform === "macos" && macosFolder) {
      macosFolder.file(fileName, blob);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "app-icons.zip");
};
