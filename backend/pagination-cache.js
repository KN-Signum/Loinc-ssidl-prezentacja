class PaginationCache {
  constructor() {
    this.cache = new Map();
    this.lastCleanup = Date.now();
    this.cleanupIntervalMs = 5 * 60 * 1000;
    this.instance = null;
  }
  get(token) {
    this.maybeCleanup();

    const data = this.cache.get(token);
    if (!data) return null;

    if (data.expiresAt < Date.now()) {
      this.cache.delete(token);
      return null;
    }

    return data;
  }

  set(token, data, ttlMs = 15 * 60 * 1000) {
    this.maybeCleanup();

    this.cache.set(token, {
      ...data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  maybeCleanup() {
    const now = Date.now();
    if (now - this.lastCleanup < this.cleanupIntervalMs) return;
    this.lastCleanup = now;

    for (const [token, data] of this.cache.entries()) {
      if (data.expiresAt < now) {
        this.cache.delete(token);
      }
    }
  }
}
const paginationCache = new PaginationCache();
export default paginationCache;
