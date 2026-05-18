require('dotenv').config();
const { createClient } = require('redis');

const ONE_HOUR_IN_SECONDS = 60 * 60;

class CacheService {
  constructor() {
    this.client = null;
    this.memory = new Map();
    this.redisReady = false;
    this.connecting = null;
    this.disabledUntil = 0;
  }

  getRedisUrl() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = process.env.REDIS_PORT || 6379;
    return `redis://${host}:${port}`;
  }

  async connect() {
    if (this.redisReady) return this.client;
    if (Date.now() < this.disabledUntil) return null;
    if (this.connecting) return this.connecting;

    this.client = createClient({
      url: this.getRedisUrl(),
      socket: {
        connectTimeout: 1000,
        reconnectStrategy: false,
      },
    });
    this.client.on('error', () => {
      this.redisReady = false;
    });

    this.connecting = this.client.connect()
      .then(() => {
        this.redisReady = true;
        return this.client;
      })
      .catch(() => {
        this.redisReady = false;
        this.disabledUntil = Date.now() + 30 * 1000;
        return null;
      })
      .finally(() => {
        this.connecting = null;
      });

    return this.connecting;
  }

  getMemory(key) {
    const entry = this.memory.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.memory.delete(key);
      return null;
    }
    return entry.value;
  }

  setMemory(key, value, ttl = ONE_HOUR_IN_SECONDS) {
    this.memory.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  async get(key) {
    const client = await this.connect();
    if (client && this.redisReady) {
      const value = await client.get(key);
      if (value) return JSON.parse(value);
      return null;
    }

    return this.getMemory(key);
  }

  async set(key, value, ttl = ONE_HOUR_IN_SECONDS) {
    const client = await this.connect();
    if (client && this.redisReady) {
      await client.set(key, JSON.stringify(value), { EX: ttl });
      return;
    }

    this.setMemory(key, value, ttl);
  }

  async delete(...keys) {
    const filteredKeys = keys.filter(Boolean);
    if (filteredKeys.length === 0) return;

    const client = await this.connect();
    if (client && this.redisReady) {
      await client.del(filteredKeys);
    }

    filteredKeys.forEach((key) => this.memory.delete(key));
  }

  keys = {
    company: (id) => `companies:${id}`,
    user: (id) => `users:${id}`,
    application: (id) => `applications:${id}`,
    applicationsByUser: (userId) => `applications:user:${userId}`,
    applicationsByJob: (jobId) => `applications:job:${jobId}`,
    bookmarksByUser: (userId) => `bookmarks:user:${userId}`,
  };
}

module.exports = new CacheService();
