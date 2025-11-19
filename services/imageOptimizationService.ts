/**
 * Image Optimization Service
 * Handles image compression, resizing, and format conversion
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'jpeg' | 'png' | 'webp';
  maxSizeKB?: number; // Maximum file size in KB
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  format: string;
  blob: Blob;
  dataUrl: string;
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.85,
  format: 'jpeg',
  maxSizeKB: 2048, // 2MB max
};

/**
 * Compress and optimize an image file
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizationResult> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log(`🖼️ Optimizing image: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          const aspectRatio = width / height;

          if (width > opts.maxWidth! || height > opts.maxHeight!) {
            if (width > height) {
              width = opts.maxWidth!;
              height = width / aspectRatio;
            } else {
              height = opts.maxHeight!;
              width = height * aspectRatio;
            }
          }

          // Create canvas for compression
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;

          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Determine MIME type
          const mimeType = opts.format === 'png'
            ? 'image/png'
            : opts.format === 'webp'
            ? 'image/webp'
            : 'image/jpeg';

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              // Check if we need to compress more
              const sizeKB = blob.size / 1024;

              if (sizeKB > opts.maxSizeKB! && opts.quality! > 0.1) {
                // Recursively compress with lower quality
                const newQuality = Math.max(0.1, opts.quality! - 0.1);
                console.log(`📉 Image still too large (${sizeKB.toFixed(2)} KB), reducing quality to ${(newQuality * 100).toFixed(0)}%`);

                canvas.toBlob(
                  (secondBlob) => {
                    if (!secondBlob) {
                      reject(new Error('Failed to create blob on second attempt'));
                      return;
                    }

                    const dataUrl = URL.createObjectURL(secondBlob);
                    const compressionRatio = ((1 - secondBlob.size / file.size) * 100);

                    console.log(`✅ Image optimized: ${(file.size / 1024).toFixed(2)} KB → ${(secondBlob.size / 1024).toFixed(2)} KB (${compressionRatio.toFixed(1)}% reduction)`);

                    resolve({
                      originalSize: file.size,
                      optimizedSize: secondBlob.size,
                      compressionRatio,
                      width: Math.round(width),
                      height: Math.round(height),
                      format: opts.format!,
                      blob: secondBlob,
                      dataUrl,
                    });
                  },
                  mimeType,
                  newQuality
                );
              } else {
                const dataUrl = URL.createObjectURL(blob);
                const compressionRatio = ((1 - blob.size / file.size) * 100);

                console.log(`✅ Image optimized: ${(file.size / 1024).toFixed(2)} KB → ${(blob.size / 1024).toFixed(2)} KB (${compressionRatio.toFixed(1)}% reduction)`);

                resolve({
                  originalSize: file.size,
                  optimizedSize: blob.size,
                  compressionRatio,
                  width: Math.round(width),
                  height: Math.round(height),
                  format: opts.format!,
                  blob,
                  dataUrl,
                });
              }
            },
            mimeType,
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Batch optimize multiple images
 */
export const optimizeImages = async (
  files: File[],
  options: ImageOptimizationOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<OptimizationResult[]> => {
  console.log(`🎨 Batch optimizing ${files.length} images...`);

  const results: OptimizationResult[] = [];

  for (let i = 0; i < files.length; i++) {
    if (onProgress) {
      onProgress(i, files.length);
    }

    try {
      const result = await optimizeImage(files[i], options);
      results.push(result);
    } catch (error) {
      console.error(`❌ Failed to optimize ${files[i].name}:`, error);
      // Continue with other images
    }
  }

  if (onProgress) {
    onProgress(files.length, files.length);
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSaved = ((1 - totalOptimized / totalOriginal) * 100);

  console.log(`✅ Batch optimization complete: ${(totalOriginal / 1024).toFixed(2)} KB → ${(totalOptimized / 1024).toFixed(2)} KB (${totalSaved.toFixed(1)}% total reduction)`);

  return results;
};

/**
 * Convert File to base64 with optimization
 */
export const fileToBase64Optimized = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> => {
  const result = await optimizeImage(file, options);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Failed to convert to base64'));
    };

    reader.readAsDataURL(result.blob);
  });
};

/**
 * Get image dimensions without loading the full image
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Check if image needs optimization
 */
export const needsOptimization = async (
  file: File,
  maxSizeKB: number = 2048
): Promise<boolean> => {
  const sizeKB = file.size / 1024;

  if (sizeKB <= maxSizeKB) {
    const dimensions = await getImageDimensions(file);
    return dimensions.width > 2048 || dimensions.height > 2048;
  }

  return true;
};

export default {
  optimizeImage,
  optimizeImages,
  fileToBase64Optimized,
  getImageDimensions,
  needsOptimization,
};
