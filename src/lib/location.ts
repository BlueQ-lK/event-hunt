export const CITY_COOKIE_NAME = 'user_preferred_city';
export const DEFAULT_CITY = 'bangalore';
export const LOCATION_COOKIE_NAME = 'user_location_cache';
export const LOCATION_LOCAL_STORAGE_KEY = 'eventhunt.user.location';

export type LocationCache = {
  city: string;
  lat?: number;
  lng?: number;
};

export const normalizeCitySlug = (value?: string | null, fallback?: string) => {
  if (!value) return fallback ?? '';
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || (fallback ?? '');
};

export const readCookie = (name: string) => {
  if (typeof document === 'undefined') return undefined;
  const found = document.cookie
    .split('; ')
    .find((chunk) => chunk.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split('=').slice(1).join('=')) : undefined;
};

export const writeCookie = (name: string, value: string, maxAgeSeconds: number) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
};

export const getStoredCity = () => normalizeCitySlug(readCookie(CITY_COOKIE_NAME), DEFAULT_CITY);
export const getBestStoredCity = () => getStoredLocation().city;

export const saveCityLocally = (city: string) => {
  writeCookie(CITY_COOKIE_NAME, normalizeCitySlug(city, DEFAULT_CITY), 30 * 24 * 60 * 60);
};

const safeParseLocation = (value?: string): LocationCache | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<LocationCache>;
    const city = normalizeCitySlug(parsed.city, DEFAULT_CITY);
    const lat = Number(parsed.lat);
    const lng = Number(parsed.lng);
    return {
      city,
      lat: Number.isFinite(lat) ? lat : undefined,
      lng: Number.isFinite(lng) ? lng : undefined,
    };
  } catch {
    return null;
  }
};

export const getStoredLocation = (): LocationCache => {
  if (typeof window !== 'undefined') {
    const local = safeParseLocation(window.localStorage.getItem(LOCATION_LOCAL_STORAGE_KEY) ?? undefined);
    if (local?.city) return local;
  }
  const cookieLocation = safeParseLocation(readCookie(LOCATION_COOKIE_NAME));
  if (cookieLocation?.city) return cookieLocation;
  return { city: getStoredCity() };
};

export const saveLocationLocally = (location: LocationCache) => {
  const normalized: LocationCache = {
    city: normalizeCitySlug(location.city, DEFAULT_CITY),
    lat: location.lat,
    lng: location.lng,
  };
  const payload = JSON.stringify(normalized);

  // Backward-compatible cookie for instant city redirect.
  saveCityLocally(normalized.city);

  writeCookie(LOCATION_COOKIE_NAME, payload, 30 * 24 * 60 * 60);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCATION_LOCAL_STORAGE_KEY, payload);
  }
};

export const buildCityAllPath = (city: string) => `/${normalizeCitySlug(city)}/all`;

export const fetchCityFromCoords = async (lat: number, lon: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to reverse geocode coordinates.');
  }
  const data = await res.json();
  const rawCity =
    data?.address?.city ||
    data?.address?.town ||
    data?.address?.village ||
    data?.address?.county ||
    DEFAULT_CITY;
  return normalizeCitySlug(rawCity);
};