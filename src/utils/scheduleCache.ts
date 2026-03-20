interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ScheduleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly ttlMs: number;

  constructor(ttlMinutes = 5) {
    this.ttlMs = ttlMinutes * 60 * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, expiresAt: Date.now() + this.ttlMs });
  }

  // Invalida todas las entradas cuya clave comience con el prefijo dado
  invalidate(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) this.cache.delete(key);
    }
  }
}

export const scheduleCache = new ScheduleCache(5);
