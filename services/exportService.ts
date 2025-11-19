import { ExportConfig, PlatformSpec } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Platform specifications
export const PLATFORM_SPECS: Record<string, PlatformSpec> = {
  tiktok: {
    name: 'TikTok',
    aspectRatio: '9:16',
    minDuration: 5,
    maxDuration: 60,
    maxFileSize: 287 * 1024 * 1024, // 287MB
    format: 'mp4'
  },
  facebook: {
    name: 'Facebook',
    aspectRatio: '1:1',
    minDuration: 1,
    maxDuration: 240,
    maxFileSize: 4 * 1024 * 1024 * 1024, // 4GB
    format: 'mp4'
  },
  instagram: {
    name: 'Instagram',
    aspectRatio: '9:16',
    minDuration: 3,
    maxDuration: 90,
    maxFileSize: 650 * 1024 * 1024, // 650MB
    format: 'mp4'
  },
  youtube: {
    name: 'YouTube',
    aspectRatio: '16:9',
    minDuration: 1,
    maxDuration: 900,
    maxFileSize: 256 * 1024 * 1024 * 1024, // 256GB
    format: 'mp4'
  },
  snapchat: {
    name: 'Snapchat',
    aspectRatio: '9:16',
    minDuration: 3,
    maxDuration: 180,
    maxFileSize: 1024 * 1024 * 1024, // 1GB
    format: 'mp4'
  }
};

export const exportVideo = async (
  videoUrl: string,
  config: ExportConfig
): Promise<void> => {
  const spec = PLATFORM_SPECS[config.platform];

  console.log(`Exporting video for ${spec.name}...`);
  console.log(`Aspect Ratio: ${spec.aspectRatio}`);
  console.log(`Quality: ${config.quality}`);

  // In production, this would:
  // 1. Fetch the video
  // 2. Re-encode to match platform specs
  // 3. Apply quality settings
  // 4. Download the result

  // For now, simulate download
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    saveAs(blob, `${spec.name.toLowerCase()}_export.${spec.format}`);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export video');
  }
};

export const exportBatch = async (
  videoUrls: string[],
  config: ExportConfig
): Promise<void> => {
  const zip = new JSZip();
  const spec = PLATFORM_SPECS[config.platform];

  console.log(`Batch exporting ${videoUrls.length} videos for ${spec.name}...`);

  // Add each video to zip
  for (let i = 0; i < videoUrls.length; i++) {
    try {
      const response = await fetch(videoUrls[i]);
      const blob = await response.blob();
      zip.file(`video_${i + 1}.${spec.format}`, blob);
    } catch (error) {
      console.error(`Failed to add video ${i + 1} to zip:`, error);
    }
  }

  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${spec.name.toLowerCase()}_batch_export.zip`);
};

export const exportMultiPlatform = async (
  videoUrl: string,
  platforms: ExportConfig['platform'][]
): Promise<void> => {
  const zip = new JSZip();

  console.log(`Multi-platform export for ${platforms.length} platforms...`);

  for (const platform of platforms) {
    const spec = PLATFORM_SPECS[platform];

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // In production, would re-encode for each platform
      zip.file(`${spec.name.toLowerCase()}.${spec.format}`, blob);
    } catch (error) {
      console.error(`Failed to export for ${spec.name}:`, error);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'multi_platform_export.zip');
};

export const validateVideoForPlatform = (
  duration: number,
  fileSize: number,
  platform: ExportConfig['platform']
): { valid: boolean; errors: string[] } => {
  const spec = PLATFORM_SPECS[platform];
  const errors: string[] = [];

  if (duration < spec.minDuration) {
    errors.push(`Video too short. Minimum: ${spec.minDuration}s`);
  }

  if (duration > spec.maxDuration) {
    errors.push(`Video too long. Maximum: ${spec.maxDuration}s`);
  }

  if (fileSize > spec.maxFileSize) {
    errors.push(`File too large. Maximum: ${(spec.maxFileSize / (1024 * 1024)).toFixed(0)}MB`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
