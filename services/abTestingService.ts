/**
 * A/B Testing Service
 * Manages A/B test experiments and tracks results
 */

import localforage from 'localforage';
import { trackUserAction } from './performanceMonitor';

// Configure A/B test storage
const abTestDB = localforage.createInstance({
  name: 'adcraft',
  storeName: 'ab_tests',
});

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  config: any; // Variant-specific configuration
  weight: number; // Traffic allocation (0-100)
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ABTestVariant[];
  startDate?: number;
  endDate?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: number;
  metrics: {
    viewed: boolean;
    clicked: boolean;
    converted: boolean;
    engagementTime?: number;
    customMetrics?: Record<string, any>;
  };
}

export interface ABTestStats {
  variant: ABTestVariant;
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  clickRate: number; // CTR
  conversionRate: number; // CVR
  averageEngagementTime: number;
  confidence: number; // Statistical confidence level
}

/**
 * Create a new A/B test
 */
export const createABTest = async (test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ABTest> => {
  const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();

  const newTest: ABTest = {
    ...test,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await abTestDB.setItem(id, newTest);
  console.log(`✅ A/B test created: ${test.name}`);

  return newTest;
};

/**
 * Get all A/B tests
 */
export const getAllABTests = async (): Promise<ABTest[]> => {
  const tests: ABTest[] = [];
  await abTestDB.iterate<ABTest, void>((test) => {
    tests.push(test);
  });
  return tests.sort((a, b) => b.createdAt - a.createdAt);
};

/**
 * Get A/B test by ID
 */
export const getABTest = async (id: string): Promise<ABTest | null> => {
  return await abTestDB.getItem<ABTest>(id);
};

/**
 * Update A/B test
 */
export const updateABTest = async (id: string, updates: Partial<ABTest>): Promise<ABTest | null> => {
  const test = await getABTest(id);
  if (!test) return null;

  const updated: ABTest = {
    ...test,
    ...updates,
    id: test.id,
    createdAt: test.createdAt,
    updatedAt: Date.now(),
  };

  await abTestDB.setItem(id, updated);
  return updated;
};

/**
 * Delete A/B test
 */
export const deleteABTest = async (id: string): Promise<void> => {
  await abTestDB.removeItem(id);
  // Also delete results
  const resultsKey = `results_${id}`;
  await abTestDB.removeItem(resultsKey);
};

/**
 * Start A/B test
 */
export const startABTest = async (id: string): Promise<ABTest | null> => {
  return updateABTest(id, {
    status: 'running',
    startDate: Date.now(),
  });
};

/**
 * Pause A/B test
 */
export const pauseABTest = async (id: string): Promise<ABTest | null> => {
  return updateABTest(id, { status: 'paused' });
};

/**
 * Complete A/B test
 */
export const completeABTest = async (id: string): Promise<ABTest | null> => {
  return updateABTest(id, {
    status: 'completed',
    endDate: Date.now(),
  });
};

/**
 * Assign user to a variant (traffic splitting)
 */
export const assignVariant = (test: ABTest, userId: string): ABTestVariant => {
  // Use consistent hashing for stable assignment
  const hash = userId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  const normalizedHash = Math.abs(hash % 100);

  // Assign based on variant weights
  let cumulative = 0;
  for (const variant of test.variants) {
    cumulative += variant.weight;
    if (normalizedHash < cumulative) {
      return variant;
    }
  }

  // Fallback to first variant
  return test.variants[0];
};

/**
 * Track A/B test result
 */
export const trackABTestResult = async (result: ABTestResult): Promise<void> => {
  const resultsKey = `results_${result.testId}`;
  const existingResults = (await abTestDB.getItem<ABTestResult[]>(resultsKey)) || [];

  existingResults.push(result);
  await abTestDB.setItem(resultsKey, existingResults);

  // Track in performance monitor
  await trackUserAction('ab_test_interaction', {
    testId: result.testId,
    variantId: result.variantId,
    ...result.metrics,
  });

  console.log(`📊 A/B test result tracked: ${result.testId} - ${result.variantId}`);
};

/**
 * Track view event
 */
export const trackView = async (testId: string, variantId: string, userId: string): Promise<void> => {
  await trackABTestResult({
    testId,
    variantId,
    userId,
    timestamp: Date.now(),
    metrics: {
      viewed: true,
      clicked: false,
      converted: false,
    },
  });
};

/**
 * Track click event
 */
export const trackClick = async (testId: string, variantId: string, userId: string): Promise<void> => {
  await trackABTestResult({
    testId,
    variantId,
    userId,
    timestamp: Date.now(),
    metrics: {
      viewed: true,
      clicked: true,
      converted: false,
    },
  });
};

/**
 * Track conversion event
 */
export const trackConversion = async (testId: string, variantId: string, userId: string): Promise<void> => {
  await trackABTestResult({
    testId,
    variantId,
    userId,
    timestamp: Date.now(),
    metrics: {
      viewed: true,
      clicked: true,
      converted: true,
    },
  });
};

/**
 * Get A/B test results
 */
export const getABTestResults = async (testId: string): Promise<ABTestResult[]> => {
  const resultsKey = `results_${testId}`;
  return (await abTestDB.getItem<ABTestResult[]>(resultsKey)) || [];
};

/**
 * Calculate A/B test statistics
 */
export const calculateABTestStats = async (testId: string): Promise<ABTestStats[]> => {
  const test = await getABTest(testId);
  if (!test) return [];

  const results = await getABTestResults(testId);

  return test.variants.map(variant => {
    const variantResults = results.filter(r => r.variantId === variant.id);

    const totalViews = variantResults.filter(r => r.metrics.viewed).length;
    const totalClicks = variantResults.filter(r => r.metrics.clicked).length;
    const totalConversions = variantResults.filter(r => r.metrics.converted).length;

    const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
    const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

    const engagementTimes = variantResults
      .map(r => r.metrics.engagementTime)
      .filter(t => t !== undefined) as number[];

    const averageEngagementTime = engagementTimes.length > 0
      ? engagementTimes.reduce((sum, t) => sum + t, 0) / engagementTimes.length
      : 0;

    // Simple confidence calculation (for demonstration)
    // In production, use proper statistical tests (Chi-square, T-test, etc.)
    const confidence = Math.min(95, (totalViews / 100) * 95);

    return {
      variant,
      totalViews,
      totalClicks,
      totalConversions,
      clickRate,
      conversionRate,
      averageEngagementTime,
      confidence,
    };
  });
};

/**
 * Get winning variant
 */
export const getWinningVariant = async (testId: string): Promise<{
  winner: ABTestStats;
  stats: ABTestStats[];
} | null> => {
  const stats = await calculateABTestStats(testId);

  if (stats.length === 0) return null;

  // Find winner by conversion rate
  const winner = stats.reduce((best, current) => {
    return current.conversionRate > best.conversionRate ? current : best;
  });

  return { winner, stats };
};

/**
 * Export test results to CSV
 */
export const exportTestResultsCSV = async (testId: string): Promise<string> => {
  const results = await getABTestResults(testId);

  const headers = ['Test ID', 'Variant ID', 'User ID', 'Timestamp', 'Viewed', 'Clicked', 'Converted', 'Engagement Time'];
  const rows = results.map(r => [
    r.testId,
    r.variantId,
    r.userId,
    new Date(r.timestamp).toISOString(),
    r.metrics.viewed,
    r.metrics.clicked,
    r.metrics.converted,
    r.metrics.engagementTime || 0,
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
};

/**
 * Create quick A/B test for ad variants
 */
export const createAdVariantTest = async (
  name: string,
  variantA: any,
  variantB: any,
  userId: string
): Promise<ABTest> => {
  return createABTest({
    name,
    description: `A/B test for ${name}`,
    status: 'draft',
    variants: [
      {
        id: 'variant_a',
        name: 'Variant A (Control)',
        description: 'Original version',
        config: variantA,
        weight: 50,
      },
      {
        id: 'variant_b',
        name: 'Variant B',
        description: 'Test version',
        config: variantB,
        weight: 50,
      },
    ],
    createdBy: userId,
  });
};

export default {
  createABTest,
  getAllABTests,
  getABTest,
  updateABTest,
  deleteABTest,
  startABTest,
  pauseABTest,
  completeABTest,
  assignVariant,
  trackView,
  trackClick,
  trackConversion,
  getABTestResults,
  calculateABTestStats,
  getWinningVariant,
  exportTestResultsCSV,
  createAdVariantTest,
};
