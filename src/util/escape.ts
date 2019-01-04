export function escapeSpace(str: string): string {
  return str.replace(/(\s)/g, "\\ ");
}
