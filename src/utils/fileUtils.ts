import { all } from "axios";

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return "";
}
export function isFileExtensionAllowed(
  fileName: string,
  allowedExtensions: string[]
): boolean {
  if (
    allowedExtensions.length === 0 ||
    (allowedExtensions.length === 1 && allowedExtensions[0] === "*/*")
  ) {
    return true;
  }
  return allowedExtensions.includes(getFileExtension(fileName));
}

export const documentAcceptFiles: string[] = [
  "txt",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "csv",
  "zip",
  "rar",
  "json",
  "xml",
  "html",
  "css",
  "js",
  "ts",
  "mp3",
  "wav",
  "mp4",
  "avi",
  "mov",
  "svg",
  "ico",
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  "psd",
  "ai",
  "eps",
  "flv",
  "wmv",
  "aac",
  "apk",
  "exe",
  "jar",
  "csv",
  "ini",
  "log",
  "sql",
  "yaml",
  "md",
  "txt",
  // Add more file extensions as needed
];
