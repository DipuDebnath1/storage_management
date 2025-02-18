export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} Bytes`;
  } else if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  } else {
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  }
}
