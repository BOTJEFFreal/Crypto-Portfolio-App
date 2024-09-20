export const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { expiry, data } = JSON.parse(cached);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  };
  
  export const setCachedData = (key, data, ttlMinutes = 30) => {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem(key, JSON.stringify({ expiry, data }));
  };
  