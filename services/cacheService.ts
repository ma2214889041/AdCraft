/**
 * Cache Service
 * Caches API results to avoid redundant calls and save costs
 */

import localforage from 'localforage';

// Configure cache stores
const imageAnalysisCache = localforage.createInstance({
  name: 'adcraft',
  storeName: 'image_analysis_cache',
});

const videoCache = localforage.createInstance({
  name: 'adcraft',
  storeName: 'video_cache',
});

const generationCache = localforage.createInstance({
  name: 'adcraft',
  storeName: 'generation_cache',
});

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 24 hours)
  forceRefresh?: boolean;
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate cache key from data
 */
const generateCacheKey = (prefix: string, data: any): string => {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `${prefix}_${Math.abs(hash).toString(36)}`;
};

/**
 * Get from cache
 */
const getFromCache = async <T>(
  store: LocalForage,
  key: string
): Promise<T | null> => {
  try {
    const entry = await store.getItem<CacheEntry<T>>(key);

    if (!entry) {
      console.log(`🔍 Cache miss: ${key}`);
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      console.log(`⏰ Cache expired: ${key}`);
      await store.removeItem(key);
      return null;
    }

    console.log(`✅ Cache hit: ${key}`);
    return entry.data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

/**
 * Set to cache
 */
const setToCache = async <T>(
  store: LocalForage,
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL
): Promise<void> => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      key,
    };

    await store.setItem(key, entry);
    console.log(`💾 Cached: ${key} (TTL: ${(ttl / 1000 / 60).toFixed(0)}m)`);
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

/**
 * Cache image analysis result
 */
export const cacheImageAnalysis = async (
  imageHash: string,
  result: any,
  options: CacheOptions = {}
): Promise<void> => {
  const key = generateCacheKey('img_analysis', imageHash);
  await setToCache(imageAnalysisCache, key, result, options.ttl);
};

/**
 * Get cached image analysis
 */
export const getCachedImageAnalysis = async (
  imageHash: string,
  options: CacheOptions = {}
): Promise<any | null> => {
  if (options.forceRefresh) return null;

  const key = generateCacheKey('img_analysis', imageHash);
  return getFromCache(imageAnalysisCache, key);
};

/**
 * Cache video generation result
 */
export const cacheVideo = async (
  videoKey: string,
  videoUrl: string,
  options: CacheOptions = {}
): Promise<void> => {
  const key = generateCacheKey('video', videoKey);
  await setToCache(videoCache, key, videoUrl, options.ttl);
};

/**
 * Get cached video
 */
export const getCachedVideo = async (
  videoKey: string,
  options: CacheOptions = {}
): Promise<string | null> => {
  if (options.forceRefresh) return null;

  const key = generateCacheKey('video', videoKey);
  return getFromCache(videoCache, key);
};

/**
 * Cache generic generation result
 */
export const cacheGenerationResult = async <T>(
  resultKey: string,
  result: T,
  options: CacheOptions = {}
): Promise<void> => {
  const key = generateCacheKey('gen', resultKey);
  await setToCache(generationCache, key, result, options.ttl);
};

/**
 * Get cached generation result
 */
export const getCachedGenerationResult = async <T>(
  resultKey: string,
  options: CacheOptions = {}
): Promise<T | null> => {
  if (options.forceRefresh) return null;

  const key = generateCacheKey('gen', resultKey);
  return getFromCache<T>(generationCache, key);
};

/**
 * Generate hash from file
 */
export const generateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Clear all caches
 */
export const clearAllCaches = async (): Promise<void> => {
  console.log('🗑️ Clearing all caches...');
  await Promise.all([
    imageAnalysisCache.clear(),
    videoCache.clear(),
    generationCache.clear(),
  ]);
  console.log('✅ All caches cleared');
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (): Promise<{
  imageAnalysis: number;
  videos: number;
  generations: number;
  total: number;
}> => {
  const [imageCount, videoCount, genCount] = await Promise.all([
    imageAnalysisCache.length(),
    videoCache.length(),
    generationCache.length(),
  ]);

  return {
    imageAnalysis: imageCount,
    videos: videoCount,
    generations: genCount,
    total: imageCount + videoCount + genCount,
  };
};

/**
 * Remove expired entries from all caches
 */
export const cleanupExpiredCache = async (): Promise<number> => {
  console.log('🧹 Cleaning up expired cache entries...');

  let removedCount = 0;
  const stores = [imageAnalysisCache, videoCache, generationCache];

  for (const store of stores) {
    const keys = await store.keys();

    for (const key of keys) {
      const entry = await store.getItem<CacheEntry<any>>(key);

      if (entry && Date.now() > entry.expiresAt) {
        await store.removeItem(key);
        removedCount++;
      }
    }
  }

  console.log(`✅ Removed ${removedCount} expired entries`);
  return removedCount;
};

// Auto cleanup expired cache every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    cleanupExpiredCache();
  }, 60 * 60 * 1000); // 1 hour
}

export default {
  cacheImageAnalysis,
  getCachedImageAnalysis,
  cacheVideo,
  getCachedVideo,
  cacheGenerationResult,
  getCachedGenerationResult,
  generateFileHash,
  clearAllCaches,
  getCacheStats,
  cleanupExpiredCache,
};
