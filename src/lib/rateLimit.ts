interface RateLimitStore {
  timestamps: number[];
}

const store = new Map<string, RateLimitStore>();

// Cleanup routine every 5 minutes
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      // Keep only timestamps within last 1 hour
      const filtered = record.timestamps.filter((t) => now - t < 3600000);
      if (filtered.length === 0) {
        store.delete(key);
      } else {
        record.timestamps = filtered;
      }
    }
  }, 300000);
}

export function rateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  let record = store.get(identifier);

  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    return {
      success: false,
      remaining: 0,
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    remaining: limit - record.timestamps.length,
  };
}
