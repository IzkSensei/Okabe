/** Use a site-relative path for local routes and files in public/. Preserve external destinations. */
export function href(path = ""): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(path)) return path;
  return (
    import.meta.env.BASE_URL.replace(/\/+$/, "") +
    "/" +
    path.replace(/^\/+/, "")
  );
}
