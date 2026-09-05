export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zrevrange(key: string, start: number, stop: number, withScores?: boolean): Promise<Array<{ member: string; score: number }>>;
}

class InMemoryRedis implements IRedisClient {
  private store: Map<string, { value: string; expiry?: number }> = new Map();
  private sortedSets: Map<string, Map<string, number>> = new Map();

  async get(key: string): Promise<string | null> {
    const data = this.store.get(key);
    if (!data) return null;
    if (data.expiry && Date.now() > data.expiry) {
      this.store.delete(key);
      return null;
    }
    return data.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
    this.sortedSets.delete(key);
  }

  async zadd(key: string, score: number, member: string): Promise<void> {
    if (!this.sortedSets.has(key)) {
      this.sortedSets.set(key, new Map());
    }
    const set = this.sortedSets.get(key)!;
    set.set(member, score);
  }

  async zrevrange(key: string, start: number, stop: number, withScores = true): Promise<Array<{ member: string; score: number }>> {
    const set = this.sortedSets.get(key);
    if (!set) return [];
    const entries = Array.from(set.entries()).map(([member, score]) => ({ member, score }));
    entries.sort((a, b) => b.score - a.score);
    const endIdx = stop === -1 ? entries.length : stop + 1;
    return entries.slice(start, endIdx);
  }
}

export const redisClient: IRedisClient = new InMemoryRedis();
