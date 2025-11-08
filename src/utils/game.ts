export type LngLat = { lng: number; lat: number };

/**
 * Returns true if the provided longitude/latitude difference is within the winning threshold.
 */
export function isWinnerByDifference(
  difference: LngLat | null | undefined,
  threshold = 5,
): boolean {
  if (!difference) return false;
  return Math.abs(difference.lng) < threshold &&
    Math.abs(difference.lat) < threshold;
}

/**
 * Utility to compute the lng/lat difference between a target and a guess.
 */
export function computeDifference(target: LngLat, guess: LngLat): LngLat {
  return {
    lng: target.lng - guess.lng,
    lat: target.lat - guess.lat,
  };
}

/**
 * Convert degrees to radians.
 */
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Great-circle distance using the Haversine formula.
 * Returns distance in meters between two lon/lat points.
 */
export function getDistanceMeters(a: LngLat, b: LngLat): number {
  const R = 6371000; // mean Earth radius in meters
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinDlat = Math.sin(dLat / 2);
  const sinDlng = Math.sin(dLng / 2);
  const h = sinDlat * sinDlat +
    Math.cos(lat1) * Math.cos(lat2) * sinDlng * sinDlng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

/**
 * Returns true if the distance between points is within thresholdMeters.
 * Defaults to ~5 degrees at equator ≈ 555km.
 */
export function isWinnerByDistance(
  target: LngLat,
  guess: LngLat,
  thresholdMeters = 500_000,
): boolean {
  return getDistanceMeters(target, guess) <= thresholdMeters;
}
