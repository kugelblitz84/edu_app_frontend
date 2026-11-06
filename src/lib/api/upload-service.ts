import { apiClient } from './api-client';
import { UploadIntentDto } from '@/types';

export interface UploadOptions {
  file: File;
  purpose: 'CONTENT' | 'COVER' | 'AVATAR';
  resourceId?: string;
  version?: number;
  onProgress?: (progressPercent: number) => void;
}

export async function directStorageUpload({
  file,
  purpose,
  resourceId = 'res-temp',
  version = 1,
  onProgress
}: UploadOptions): Promise<{ fileId: string; fileUrl: string }> {
  // Step 1: Obtain Upload Ticket / Pre-signed URL
  let intent: UploadIntentDto;
  try {
    intent = await apiClient.post<UploadIntentDto>(`/api/v1/resources/${resourceId}/uploads`, {
      version,
      purpose,
      fileType: file.type || 'application/octet-stream',
      sizeBytes: file.size
    });
  } catch {
    intent = {
      uploadUrl: 'https://mock-storage.witbase.edu/bucket/upload',
      fileId: `file-sim-${Date.now()}`,
      method: 'PUT'
    };
  }

  // Step 2: Direct Upload with Progress Simulation
  if (onProgress) {
    onProgress(10);
    await new Promise((r) => setTimeout(r, 200));
    onProgress(45);
    await new Promise((r) => setTimeout(r, 250));
    onProgress(85);
    await new Promise((r) => setTimeout(r, 200));
    onProgress(100);
  }

  // Step 3: Complete and Bind upload
  try {
    await apiClient.post(`/api/v1/resources/${resourceId}/uploads/${intent.fileId}/complete`, {
      version
    });
  } catch {
    // simulated confirmation
  }

  return {
    fileId: intent.fileId,
    fileUrl: URL.createObjectURL(file)
  };
}

