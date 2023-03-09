export function makeSafeName(unsafe_name: string): string {
  return unsafe_name.replace(/[^a-zA-Z0-9]/g, '_');
}
