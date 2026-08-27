import { useMutation } from "@tanstack/react-query";
import { get } from "radash";
import * as Api from "../api";

const asString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const extractUrl = (data: unknown): string => {
  if (typeof data === "string") return data;

  return (
    asString(get(data, "url")) ||
    asString(get(data, "fileUrl")) ||
    asString(get(data, "path")) ||
    asString(get(data, "link")) ||
    asString(get(data, "data")) ||
    ""
  );
};

export const useUpload = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const { data } = await Api.Upload(file);
      const url = extractUrl(data);
      if (!url) {
        throw new Error("Upload did not return a valid URL");
      }
      return url;
    },
  });

export default useUpload;
