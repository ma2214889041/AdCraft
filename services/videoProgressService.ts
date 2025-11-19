/**
 * Video Generation Progress Service
 * Tracks and reports video generation progress
 */

export interface VideoProgress {
  stage: 'analyzing' | 'preparing' | 'generating' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number; // in seconds
  startTime: number;
  currentTime: number;
}

export type ProgressCallback = (progress: VideoProgress) => void;

const STAGE_WEIGHTS = {
  analyzing: 0.1,    // 10%
  preparing: 0.15,   // 15%
  generating: 0.65,  // 65%
  processing: 0.10,  // 10%
};

const STAGE_MESSAGES = {
  analyzing: '分析产品图片...',
  preparing: '准备视频生成...',
  generating: '使用 Veo AI 生成视频...',
  processing: '处理和优化视频...',
  completed: '视频生成完成！',
  failed: '生成失败',
};

/**
 * Create a progress tracker for video generation
 */
export class VideoProgressTracker {
  private startTime: number;
  private stage: VideoProgress['stage'] = 'analyzing';
  private stageProgress: number = 0;
  private callback?: ProgressCallback;
  private pollInterval?: NodeJS.Timeout;

  constructor(callback?: ProgressCallback) {
    this.startTime = Date.now();
    this.callback = callback;
  }

  /**
   * Update the current stage
   */
  setStage(stage: VideoProgress['stage'], stageProgress: number = 0) {
    this.stage = stage;
    this.stageProgress = stageProgress;
    this.update();
  }

  /**
   * Update progress within current stage
   */
  setStageProgress(progress: number) {
    this.stageProgress = Math.min(100, Math.max(0, progress));
    this.update();
  }

  /**
   * Calculate overall progress
   */
  private calculateOverallProgress(): number {
    const stages: (keyof typeof STAGE_WEIGHTS)[] = ['analyzing', 'preparing', 'generating', 'processing'];
    const currentStageIndex = stages.indexOf(this.stage as any);

    if (currentStageIndex === -1) {
      return this.stage === 'completed' ? 100 : 0;
    }

    // Sum up completed stages
    let progress = 0;
    for (let i = 0; i < currentStageIndex; i++) {
      progress += STAGE_WEIGHTS[stages[i]] * 100;
    }

    // Add current stage progress
    progress += (this.stageProgress / 100) * STAGE_WEIGHTS[stages[currentStageIndex]] * 100;

    return Math.round(progress);
  }

  /**
   * Estimate time remaining based on current progress
   */
  private estimateTimeRemaining(): number {
    const elapsed = (Date.now() - this.startTime) / 1000; // in seconds
    const progress = this.calculateOverallProgress();

    if (progress === 0) return 0;

    const totalEstimated = (elapsed / progress) * 100;
    const remaining = totalEstimated - elapsed;

    return Math.max(0, Math.round(remaining));
  }

  /**
   * Send update to callback
   */
  private update() {
    if (!this.callback) return;

    const progress: VideoProgress = {
      stage: this.stage,
      progress: this.calculateOverallProgress(),
      message: STAGE_MESSAGES[this.stage],
      estimatedTimeRemaining: this.estimateTimeRemaining(),
      startTime: this.startTime,
      currentTime: Date.now(),
    };

    this.callback(progress);
  }

  /**
   * Start auto-polling for Veo generation
   * Simulates progress while waiting for API
   */
  startPolling(pollIntervalMs: number = 2000) {
    this.setStage('generating', 0);

    let fakeProgress = 0;

    this.pollInterval = setInterval(() => {
      // Simulate progress (slower as it approaches 100%)
      const increment = fakeProgress < 50 ? 5 : fakeProgress < 80 ? 2 : 1;
      fakeProgress = Math.min(95, fakeProgress + increment);

      this.setStageProgress(fakeProgress);
    }, pollIntervalMs);
  }

  /**
   * Stop polling (call when actual generation completes)
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }
  }

  /**
   * Mark as completed
   */
  complete() {
    this.stopPolling();
    this.setStage('completed', 100);
  }

  /**
   * Mark as failed
   */
  fail(message?: string) {
    this.stopPolling();
    this.stage = 'failed';
    this.update();
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopPolling();
    this.callback = undefined;
  }
}

/**
 * Format time remaining for display
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) {
    return `约 ${seconds} 秒`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `约 ${minutes} 分 ${remainingSeconds} 秒`
      : `约 ${minutes} 分钟`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `约 ${hours} 小时 ${remainingMinutes} 分钟`;
};

/**
 * Get progress color based on stage
 */
export const getProgressColor = (stage: VideoProgress['stage']): string => {
  switch (stage) {
    case 'analyzing':
      return 'from-blue-500 to-cyan-500';
    case 'preparing':
      return 'from-cyan-500 to-purple-500';
    case 'generating':
      return 'from-purple-500 to-pink-500';
    case 'processing':
      return 'from-pink-500 to-red-500';
    case 'completed':
      return 'from-green-500 to-emerald-500';
    case 'failed':
      return 'from-red-500 to-red-600';
    default:
      return 'from-brand-purple to-pink-500';
  }
};

export default {
  VideoProgressTracker,
  formatTimeRemaining,
  getProgressColor,
};
