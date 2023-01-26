import { environment } from 'src/environments/environment';

export function getFileSrc(fileId: string) {
  return `${environment.fileServiceUrl}/v1/files/${fileId}?disposition=inline`;
}

export function getImgSrc(imageId?: string) {
  if (imageId) {
    return `${environment.fileServiceUrl}/v1/files/${imageId}?disposition=image/*`;
  }
  return null;
}

export function getThumbnailSrc(imageId?: string) {
  if (imageId) {
    return `${environment.fileServiceUrl}/v1/thumbnail/${imageId}?w=70&h=50`;
  }
  return null;
}

export function isURL(str: string) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    // empty
  }
  return false;
}
