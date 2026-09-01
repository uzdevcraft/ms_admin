const MEDIA_PROXY_PATH = "/media";

// The media server (MinIO) is only reachable over http, so an https page cannot
// load its images directly — the browser blocks them as mixed content. In that
// case route the request through the same-origin /media proxy instead.
export default (src?: string | null) => {
  if (!src || !src.startsWith("http://")) return src ?? "";
  if (typeof window === "undefined" || window.location.protocol !== "https:") return src;

  const { pathname, search } = new URL(src);

  return `${MEDIA_PROXY_PATH}${pathname}${search}`;
};
