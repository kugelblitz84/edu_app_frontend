'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, FileText, Video, AlertCircle, RefreshCw } from 'lucide-react';
import { directStorageUpload } from '@/lib/api/upload-service';

interface ResourceUploadDropzoneProps {
  acceptType: 'PDF' | 'VIDEO';
  onUploadSuccess: (fileId: string, fileName: string, fileSize: number) => void;
}

export function ResourceUploadDropzone({
  acceptType,
  onUploadSuccess
}: ResourceUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedMime =
    acceptType === 'PDF' ? 'application/pdf' : 'video/mp4,video/webm,video/quicktime';

  const handleFile = async (file: File) => {
    setError(null);
    setProgress(0);

    try {
      const res = await directStorageUpload({
        file,
        purpose: 'CONTENT',
        onProgress: (p) => setProgress(p)
      });
      setUploadedFileName(file.name);
      onUploadSuccess(res.fileId, file.name, file.size);
    } catch {
      setError('Direct storage upload failed. Please try again.');
      setProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const resetUpload = () => {
    setProgress(null);
    setUploadedFileName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {uploadedFileName ? (
        <div className="border border-emerald-200 bg-emerald-50/60 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 truncate max-w-xs sm:max-w-md">
                {uploadedFileName}
              </p>
              <p className="text-[11px] text-emerald-700">
                Binary payload verified &amp; uploaded to cloud storage
              </p>
            </div>
          </div>
          <button
            onClick={resetUpload}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-emerald-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replace</span>
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#6219BD] bg-purple-50/80 scale-[1.01]'
              : 'border-zinc-300 hover:border-[#6219BD]/60 bg-zinc-50/50 hover:bg-purple-50/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept={acceptedMime}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="max-w-sm mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6219BD] mx-auto flex items-center justify-center">
              {acceptType === 'PDF' ? (
                <FileText className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </div>

            <h4 className="text-sm font-bold text-zinc-800">
              {isDragging ? 'Drop file to upload' : `Select or drop your ${acceptType} file`}
            </h4>
            <p className="text-xs text-zinc-500">
              Direct-to-storage presigned upload. Max file size: {acceptType === 'PDF' ? '50MB' : '500MB'}.
            </p>

            <button
              type="button"
              className="mt-2 text-xs font-semibold px-4 py-2 bg-white border border-purple-200 hover:border-purple-300 rounded-xl text-[#6219BD] shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Browse Computer</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar during upload */}
      {progress !== null && !uploadedFileName && (
        <div className="space-y-1.5 bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex justify-between text-xs text-zinc-600 font-medium">
            <span>Direct storage uploading...</span>
            <span className="font-mono text-purple-700">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6219BD] rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

