export function rowPoint(row: { latitude: string; longitude: string }) {
  return {
    latitude: Number(row.latitude),
    longitude: Number(row.longitude)
  };
}
