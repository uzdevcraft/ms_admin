const DEFAULT_MEDIA_ORIGIN = 'http://45.80.149.4:9000';
const MEDIA_PROXY_PATH = '/media';

const normalizeOrigin = (origin: string): string => origin.replace(/\/+$/, '');

// Media files live on a MinIO server that (a) has no https listener, so an https page
// cannot load them directly (mixed content), and (b) serves every object as
// `application/octet-stream` with `X-Content-Type-Options: nosniff`, which makes the
// browser refuse to render them in an <img>. Both are fixed by going through the
// same-origin /media proxy, which forwards to the media server and repairs the
// Content-Type — see the `/media` proxy in vite.config.ts.
//
// External URLs (Unsplash, Firebase, etc.) are already served with correct
// headers and should be loaded directly; proxying them through the MinIO origin
// would return 404.
export default (src?: string | null) => {
  if (!src) return '';

  const mediaOrigin = normalizeOrigin(
    (import.meta.env.VITE_MEDIA_ORIGIN as string | undefined) || DEFAULT_MEDIA_ORIGIN
  );

  if (!/^https?:\/\//.test(src)) {
    // Relative MinIO paths should still go through the /media proxy. Already
    // proxied paths are returned as-is to avoid double proxying.
    if (src.startsWith(MEDIA_PROXY_PATH)) return src;
    return `${MEDIA_PROXY_PATH}${src.startsWith('/') ? '' : '/'}${src}`;
  }

  const { origin, pathname, search } = new URL(src);

  if (normalizeOrigin(origin) !== mediaOrigin) {
    return src;
  }

  return `${MEDIA_PROXY_PATH}${pathname}${search}`;
};
