const MEDIA_PROXY_PATH = '/media';

// Media files live on a MinIO server that (a) has no https listener, so an https page
// cannot load them directly (mixed content), and (b) serves every object as
// `application/octet-stream` with `X-Content-Type-Options: nosniff`, which makes the
// browser refuse to render them in an <img>. Both are fixed by going through the
// same-origin /media proxy, which forwards to the media server and repairs the
// Content-Type — see the `/media` proxy in vite.config.ts.
export default (src?: string | null) => {
  if (!src) return '';
  if (!/^https?:\/\//.test(src)) return src;

  const { pathname, search } = new URL(src);

  return `${MEDIA_PROXY_PATH}${pathname}${search}`;
};
