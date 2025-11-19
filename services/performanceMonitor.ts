/**
 * Performance Monitoring Service
 * Tracks and analyzes application performance metrics
 */

import localforage from 'localforage';

// Configure metrics storage
const metricsDB = localforage.createInstance({
  name: 'adcraft',
  storeName: 'performance_metrics',
});

// Metric types
export type MetricType =
  | 'image_optimization'
  | 'image_analysis'
  | 'video_generation'
  | 'cache_hit'
  | 'cache_miss'
  | 'ai_scene_generation'
  | 'tts_generation'
  | 'batch_generation'
  | 'user_action';

export interface PerformanceMetric {
  id: string;
  type: MetricType;
  timestamp: number;
  userId?: string;
  duration?: number; // milliseconds
  success: boolean;
  data: any;
}

export interface ImageOptimizationMetric {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  format: string;
  processingTime: number;
}

export interface APICallMetric {
  endpoint: string;
  duration: number;
  status: 'success' | 'error';
  cacheHit: boolean;
  cost?: number;
  errorMessage?: string;
}

export interface PerformanceStats {
  totalMetrics: number;
  imageOptimizations: {
    count: number;
    totalOriginalSize: number;
    totalOptimizedSize: number;
    averageCompressionRatio: number;
    averageProcessingTime: number;
    totalSavings: number;
  };
  apiCalls: {
    total: number;
    successful: number;
    failed: number;
    averageDuration: number;
    totalCost: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    costSaved: number;
  };
  videoGeneration: {
    count: number;
    successRate: number;
    averageDuration: number;
  };
  userEngagement: {
    totalActions: number;
    averageSessionDuration: number;
  };
}

/**
 * Track a performance metric
 */
export const trackMetric = async (
  type: MetricType,
  data: any,
  duration?: number,
  success: boolean = true
): Promise<void> => {
  const metric: PerformanceMetric = {
    id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: Date.now(),
    duration,
    success,
    data,
  };

  try {
    await metricsDB.setItem(metric.id, metric);
    console.log(`📊 Metric tracked: ${type}`, data);
  } catch (error) {
    console.error('Failed to track metric:', error);
  }
};

/**
 * Track image optimization
 */
export const trackImageOptimization = async (data: ImageOptimizationMetric): Promise<void> => {
  await trackMetric('image_optimization', data, data.processingTime, true);
};

/**
 * Track API call
 */
export const trackAPICall = async (data: APICallMetric): Promise<void> => {
  await trackMetric(
    data.cacheHit ? 'cache_hit' : 'cache_miss',
    data,
    data.duration,
    data.status === 'success'
  );
};

/**
 * Track video generation
 */
export const trackVideoGeneration = async (
  duration: number,
  success: boolean,
  errorMessage?: string
): Promise<void> => {
  await trackMetric('video_generation', { errorMessage }, duration, success);
};

/**
 * Track user action
 */
export const trackUserAction = async (action: string, data?: any): Promise<void> => {
  await trackMetric('user_action', { action, ...data });
};

/**
 * Get all metrics
 */
const getAllMetrics = async (): Promise<PerformanceMetric[]> => {
  const metrics: PerformanceMetric[] = [];
  await metricsDB.iterate<PerformanceMetric, void>((metric) => {
    metrics.push(metric);
  });
  return metrics.sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Get metrics by type
 */
export const getMetricsByType = async (type: MetricType): Promise<PerformanceMetric[]> => {
  const all = await getAllMetrics();
  return all.filter(m => m.type === type);
};

/**
 * Get metrics in time range
 */
export const getMetricsInRange = async (
  startTime: number,
  endTime: number
): Promise<PerformanceMetric[]> => {
  const all = await getAllMetrics();
  return all.filter(m => m.timestamp >= startTime && m.timestamp <= endTime);
};

/**
 * Calculate performance statistics
 */
export const getPerformanceStats = async (
  timeRangeHours: number = 24
): Promise<PerformanceStats> => {
  const now = Date.now();
  const startTime = now - (timeRangeHours * 60 * 60 * 1000);
  const metrics = await getMetricsInRange(startTime, now);

  // Image optimization stats
  const imageOptMetrics = metrics.filter(m => m.type === 'image_optimization');
  const imageOptData = imageOptMetrics.map(m => m.data as ImageOptimizationMetric);

  const totalOriginalSize = imageOptData.reduce((sum, d) => sum + d.originalSize, 0);
  const totalOptimizedSize = imageOptData.reduce((sum, d) => sum + d.optimizedSize, 0);
  const avgCompression = imageOptData.length > 0
    ? imageOptData.reduce((sum, d) => sum + d.compressionRatio, 0) / imageOptData.length
    : 0;
  const avgProcessingTime = imageOptData.length > 0
    ? imageOptData.reduce((sum, d) => sum + d.processingTime, 0) / imageOptData.length
    : 0;

  // API call stats
  const cacheHits = metrics.filter(m => m.type === 'cache_hit');
  const cacheMisses = metrics.filter(m => m.type === 'cache_miss');
  const allAPICalls = [...cacheHits, ...cacheMisses];
  const successfulCalls = allAPICalls.filter(m => m.success);
  const avgDuration = allAPICalls.length > 0
    ? allAPICalls.reduce((sum, m) => sum + (m.duration || 0), 0) / allAPICalls.length
    : 0;

  // Cache stats
  const hitRate = allAPICalls.length > 0
    ? (cacheHits.length / allAPICalls.length) * 100
    : 0;

  // Estimate cost savings (assume $0.003 per API call)
  const costPerCall = 0.003;
  const totalCost = cacheMisses.length * costPerCall;
  const costSaved = cacheHits.length * costPerCall;

  // Video generation stats
  const videoMetrics = metrics.filter(m => m.type === 'video_generation');
  const successfulVideos = videoMetrics.filter(m => m.success);
  const videoSuccessRate = videoMetrics.length > 0
    ? (successfulVideos.length / videoMetrics.length) * 100
    : 0;
  const avgVideoDuration = videoMetrics.length > 0
    ? videoMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / videoMetrics.length
    : 0;

  // User engagement
  const userActions = metrics.filter(m => m.type === 'user_action');

  return {
    totalMetrics: metrics.length,
    imageOptimizations: {
      count: imageOptMetrics.length,
      totalOriginalSize,
      totalOptimizedSize,
      averageCompressionRatio: avgCompression,
      averageProcessingTime: avgProcessingTime,
      totalSavings: totalOriginalSize - totalOptimizedSize,
    },
    apiCalls: {
      total: allAPICalls.length,
      successful: successfulCalls.length,
      failed: allAPICalls.length - successfulCalls.length,
      averageDuration: avgDuration,
      totalCost,
    },
    cache: {
      hits: cacheHits.length,
      misses: cacheMisses.length,
      hitRate,
      costSaved,
    },
    videoGeneration: {
      count: videoMetrics.length,
      successRate: videoSuccessRate,
      averageDuration: avgVideoDuration / 1000, // Convert to seconds
    },
    userEngagement: {
      totalActions: userActions.length,
      averageSessionDuration: 0, // TODO: Implement session tracking
    },
  };
};

/**
 * Get performance trend data for charts
 */
export const getPerformanceTrend = async (
  days: number = 7
): Promise<{
  date: string;
  optimizations: number;
  apiCalls: number;
  cacheHitRate: number;
  videos: number;
}[]> => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const trend: any[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i * dayMs);
    const dayEnd = dayStart + dayMs;
    const dayMetrics = await getMetricsInRange(dayStart, dayEnd);

    const date = new Date(dayStart).toISOString().split('T')[0];
    const optimizations = dayMetrics.filter(m => m.type === 'image_optimization').length;
    const cacheHits = dayMetrics.filter(m => m.type === 'cache_hit').length;
    const cacheMisses = dayMetrics.filter(m => m.type === 'cache_miss').length;
    const totalCalls = cacheHits + cacheMisses;
    const cacheHitRate = totalCalls > 0 ? (cacheHits / totalCalls) * 100 : 0;
    const videos = dayMetrics.filter(m => m.type === 'video_generation').length;

    trend.push({
      date,
      optimizations,
      apiCalls: totalCalls,
      cacheHitRate,
      videos,
    });
  }

  return trend;
};

/**
 * Clear old metrics (keep last 30 days)
 */
export const cleanupOldMetrics = async (): Promise<number> => {
  console.log('🧹 Cleaning up old metrics...');

  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const keys = await metricsDB.keys();
  let removedCount = 0;

  for (const key of keys) {
    const metric = await metricsDB.getItem<PerformanceMetric>(key);
    if (metric && metric.timestamp < thirtyDaysAgo) {
      await metricsDB.removeItem(key);
      removedCount++;
    }
  }

  console.log(`✅ Removed ${removedCount} old metrics`);
  return removedCount;
};

/**
 * Export metrics to JSON
 */
export const exportMetrics = async (): Promise<string> => {
  const metrics = await getAllMetrics();
  return JSON.stringify(metrics, null, 2);
};

/**
 * Clear all metrics
 */
export const clearAllMetrics = async (): Promise<void> => {
  console.log('🗑️ Clearing all metrics...');
  await metricsDB.clear();
  console.log('✅ All metrics cleared');
};

// Auto cleanup old metrics on init
if (typeof window !== 'undefined') {
  // Cleanup on load
  cleanupOldMetrics();

  // Schedule daily cleanup
  setInterval(() => {
    cleanupOldMetrics();
  }, 24 * 60 * 60 * 1000); // Once per day
}

export default {
  trackMetric,
  trackImageOptimization,
  trackAPICall,
  trackVideoGeneration,
  trackUserAction,
  getMetricsByType,
  getMetricsInRange,
  getPerformanceStats,
  getPerformanceTrend,
  exportMetrics,
  clearAllMetrics,
};
