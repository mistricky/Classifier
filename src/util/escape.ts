export function escapeSpace(str: string): string {
  return str.replace(/\s/g, "\\ ");
}

export function escapePoint(str: string): string {
  return str.replace(/\./g, "\\.");
}

export function escapeAll(str: string): string {
  return escapePoint(escapeSpace(str));
}
