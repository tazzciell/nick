
export function getImageUrl(
  path: string | undefined | null,
  fallback: string = "https://avatar.iran.liara.run/public"
): string {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl.replace(/\/api$/, ""); 
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  return `${baseUrl}/${cleanPath}`;
}
