const CACHE_PREFIX = 'tokenChartCache_';

/**
 * Retrieves cached data from localStorage if available and not expired.
 * @param {object} cache - The cache object.
 * @param {string} key - The unique key for the cache entry.
 * @returns {object|null} - The cached data or null if not available/expired.
 */
export const getCachedData = (cache, key) => {
  const cachedEntry = cache.current[key];
  if (cachedEntry) {
    const { timestamp, data } = cachedEntry;
    const now = Date.now();
    const TEN_MINUTES = 10 * 60 * 1000; // in milliseconds
    if (now - timestamp < TEN_MINUTES) {
      return data;
    } else {
      // Invalidate the cache entry if expired
      delete cache.current[key];
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    }
  }

  // Attempt to retrieve from localStorage
  const storedData = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      const { timestamp, data } = parsedData;
      const now = Date.now();
      const TEN_MINUTES = 10 * 60 * 1000; // in milliseconds
      if (now - timestamp < TEN_MINUTES) {
        cache.current[key] = { timestamp, data };
        return data;
      } else {
        // Invalidate the cache entry if expired
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      }
    } catch (error) {
      console.error('Error parsing cached data from localStorage:', error);
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    }
  }

  return null;
};

/**
 * Adds data to the cache with the current timestamp and stores it in localStorage.
 * @param {object} cache - The cache object.
 * @param {string} key - The unique key for the cache entry.
 * @param {object} data - The data to cache.
 */
export const setCachedData = (cache, key, data) => {
  const timestamp = Date.now();
  cache.current[key] = { timestamp, data };
  const cacheEntry = JSON.stringify({ timestamp, data });
  localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheEntry);
};