export async function hasCamera(): Promise<boolean> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.some((device) => device.kind === "videoinput");
}

export interface DownloadOptions {
  fileName: string
  contents: string
}

export function promptDownload(options: DownloadOptions): void {
  const anchor = document.createElement("a");
  anchor.download = options.fileName;
  anchor.href = options.contents;
  anchor.target = "_blank";
  anchor.click();
  anchor.remove();
}
