/** The normal app uses local assets. The portable review file supplies embedded equivalents. */
export function asset(path: string): string {
  const embedded = (window as Window & {
    __CLASSARCADE_ASSETS__?: Record<string, string>;
  }).__CLASSARCADE_ASSETS__?.[path];
  if (embedded) return embedded;
  return path.startsWith("/")
    ? `${import.meta.env.BASE_URL}${path.slice(1)}`
    : path;
}
