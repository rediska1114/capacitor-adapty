export function decodeDate(date?: string): Date | undefined {
  if (!date) return undefined;

  return new Date(date);
}

/** Format: YYYY-MM-dd */
export function encodeDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(n => n.toString().padStart(2, '0')).join('-');
}
