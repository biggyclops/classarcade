/** The normal app uses local assets. The portable review file supplies embedded equivalents. */
export function asset(path: string): string {
  return (
    (window as Window & { __CLASSARCADE_ASSETS__?: Record<string, string> })
      .__CLASSARCADE_ASSETS__?.[path] ?? path
  );
}
