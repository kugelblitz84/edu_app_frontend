'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ResourceUploadDropzone } from '@/components/materials';
import {
  FileText,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Check,
  Tag
} from 'lucide-react';

export default function NewResourceStudioPage() {
  const [step, setStep] = useState(1);

  // Step 1: Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PDF' | 'VIDEO'>('VIDEO');
  const [category, setCategory] = useState('Computer Science');

  // Step 2: Access Policy
  const [accessPolicy, setAccessPolicy] = useState<'FREE' | 'PURCHASE' | 'ENROLLED'>('FREE');
  const [priceBDT, setPriceBDT] = useState('500');
  const [pin, setPin] = useState('1234');

  // Step 3: Upload
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Step 4: Tags
  const [tagsInput, setTagsInput] = useState('architecture, nestjs, algorithms');

  // Step 5: Publishing
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsPublishing(false);
    setIsPublished(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Creator Studio: New Study Material
        </h1>
        <p className="text-xs text-zinc-500">
          Publish standalone video masterclasses or verified university lecture notes with direct cloud storage.
        </p>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs flex items-center justify-between">
        {[
          { num: 1, label: 'Metadata' },
          { num: 2, label: 'Access Policy' },
          { num: 3, label: 'Cloud Upload' },
          { num: 4, label: 'Tags & Review' },
          { num: 5, label: 'Publish' }
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                step > s.num
                  ? 'bg-emerald-500 text-white'
                  : step === s.num
                  ? 'bg-[#6219BD] text-white shadow-md'
                  : 'bg-zinc-100 text-zinc-400'
              }`}
            >
              {step > s.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
            </div>
            <span
              className={`hidden sm:inline text-xs font-medium ${
                step === s.num ? 'text-zinc-900 font-semibold' : 'text-zinc-400'
              }`}
            >
              {s.label}
            </span>
            {idx < 4 && <div className="hidden md:block w-8 h-0.5 bg-zinc-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Wizard Step Panels */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="text-base font-bold text-zinc-900">Step 1: Material Information</h3>

            {/* Format toggle */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">
                Resource Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('VIDEO')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    type === 'VIDEO'
                      ? 'border-[#6219BD] bg-purple-50 text-[#6219BD] ring-2 ring-[#6219BD]/20'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-xs font-bold">Video Lecture</p>
                    <p className="text-[11px] text-zinc-500">MP4 / HLS Streaming Media</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('PDF')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    type === 'PDF'
                      ? 'border-[#6219BD] bg-purple-50 text-[#6219BD] ring-2 ring-[#6219BD]/20'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-xs font-bold">PDF Notes &amp; Handbook</p>
                    <p className="text-[11px] text-zinc-500">Document Canvas &amp; Slides</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Database Transactions & 2PC Protocol"
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Academic Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
              >
                <option value="Computer Science">Computer Science &amp; Engineering</option>
                <option value="Physics">Physics &amp; Mechanics</option>
                <option value="Mathematics">Discrete Mathematics</option>
                <option value="UI/UX Design">UI/UX Design Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Description &amp; Syllabus
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize key topics, prerequisites, and learning outcomes..."
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-[#6219BD] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <span>Continue to Access Policy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="text-base font-bold text-zinc-900">Step 2: Access &amp; Monetization Policy</h3>

            <div className="space-y-3">
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  accessPolicy === 'FREE'
                    ? 'border-[#6219BD] bg-purple-50 ring-2 ring-[#6219BD]/20'
                    : 'border-zinc-200'
                }`}
              >
                <input
                  type="radio"
                  name="access"
                  checked={accessPolicy === 'FREE'}
                  onChange={() => setAccessPolicy('FREE')}
                  className="mt-0.5 accent-[#6219BD]"
                />
                <div>
                  <p className="text-xs font-bold text-zinc-900">FREE (Open Community Access)</p>
                  <p className="text-[11px] text-zinc-500">
                    Accessible immediately to any visitor or student without PIN or fees.
                  </p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  accessPolicy === 'PURCHASE'
                    ? 'border-[#6219BD] bg-purple-50 ring-2 ring-[#6219BD]/20'
                    : 'border-zinc-200'
                }`}
              >
                <input
                  type="radio"
                  name="access"
                  checked={accessPolicy === 'PURCHASE'}
                  onChange={() => setAccessPolicy('PURCHASE')}
                  className="mt-0.5 accent-[#6219BD]"
                />
                <div className="flex-1">
                  <p className="text-xs font-bold text-zinc-900">PURCHASE (Secured with PIN Unlock)</p>
                  <p className="text-[11px] text-zinc-500">
                    Buyers receive a 4-digit PIN to decrypt streaming or PDF viewing.
                  </p>

                  {accessPolicy === 'PURCHASE' && (
                    <div className="grid grid-cols-2 gap-3 pt-3 mt-2 border-t border-purple-200/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                          Price in BDT (৳)
                        </span>
                        <input
                          type="number"
                          value={priceBDT}
                          onChange={(e) => setPriceBDT(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                          4-Digit Security PIN
                        </span>
                        <input
                          type="text"
                          maxLength={6}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg font-mono tracking-widest text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  accessPolicy === 'ENROLLED'
                    ? 'border-[#6219BD] bg-purple-50 ring-2 ring-[#6219BD]/20'
                    : 'border-zinc-200'
                }`}
              >
                <input
                  type="radio"
                  name="access"
                  checked={accessPolicy === 'ENROLLED'}
                  onChange={() => setAccessPolicy('ENROLLED')}
                  className="mt-0.5 accent-[#6219BD]"
                />
                <div>
                  <p className="text-xs font-bold text-zinc-900">ENROLLED (Campus Members Only)</p>
                  <p className="text-[11px] text-zinc-500">
                    Restricted exclusively to students enrolled in your associated institution.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-zinc-200 text-xs text-zinc-700 rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-[#6219BD] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Cloud Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="text-base font-bold text-zinc-900">
              Step 3: Direct-to-Storage Cloud Upload
            </h3>
            <p className="text-xs text-zinc-500">
              Files are streamed directly to cloud storage buckets (S3 / GCS) using secure presigned tickets. The backend server never buffers heavy binaries.
            </p>

            <ResourceUploadDropzone
              acceptType={type}
              onUploadSuccess={(fileId, name) => {
                setUploadedFileId(fileId);
                setUploadedFileName(name);
              }}
            />

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-zinc-200 text-xs text-zinc-700 rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 bg-[#6219BD] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>{uploadedFileId ? 'Continue to Review' : 'Skip Upload for Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="text-base font-bold text-zinc-900">Step 4: Tagging &amp; Summary</h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Comma-separated Tags
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. distributed-systems, rust, algorithms"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Title:</span>
                <span className="font-bold text-zinc-900">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Type:</span>
                <span className="font-semibold">{type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Access Policy:</span>
                <span className="font-semibold text-purple-700">{accessPolicy}</span>
              </div>
              {accessPolicy === 'PURCHASE' && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Price &amp; PIN:</span>
                  <span className="font-mono text-zinc-800">৳{priceBDT} (PIN: {pin})</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Uploaded Payload:</span>
                <span className="font-mono text-emerald-700">
                  {uploadedFileName || 'Simulated file attached'}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-zinc-200 text-xs text-zinc-700 rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-5 py-2.5 bg-[#6219BD] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Publish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            {isPublished ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Material Successfully Published!
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Your resource is now live in the WitBase catalog. Optimistic version locked at <strong>v1</strong>.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/me/library"
                    className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
                  >
                    View in Library
                  </Link>
                  <Link
                    href="/resources"
                    className="px-5 py-2.5 rounded-xl bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    Public Resources Catalog
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-zinc-900">Step 5: Final Confirmation</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Clicking &ldquo;Publish Now&rdquo; sends <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">POST /resources/:id/publish</code> with version lock. The study item will be immediately discoverable by students.
                </p>

                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#6219BD] shrink-0" />
                  <p className="text-xs text-purple-950 font-medium">
                    Ready to distribute <strong>{title || 'Untitled Resource'}</strong>.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-4 py-2 border border-zinc-200 text-xs text-zinc-700 rounded-xl flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    disabled={isPublishing}
                    onClick={handlePublish}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#6219BD] to-[#673DE6] hover:from-[#5214A0] hover:to-[#5B21B6] text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isPublishing ? 'Publishing to Network...' : 'Publish Now (Lock v1)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
