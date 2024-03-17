export function decodeRecords<T, C>(
  records: Record<string, T>,
  converter: (value: T) => C,
) {
  return Object.entries(records).reduce((acc, [key, value]) => {
    acc[key] = converter(value);
    return acc;
  }, {} as Record<string, C>);
}
