import { http } from "@common/services";

export const Upload = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request.post<unknown>("/files/upload", formData);
};

export const UploadMultiple = (files: File[]) => {
  const formData = new FormData();
  // Swagger: multipart field `file` (array of binaries) → ResourceFileDto[] { fileId, url }.
  files.forEach((file) => formData.append("file", file));
  return http.request.post<unknown>("/files/upload-multiple", formData);
};
