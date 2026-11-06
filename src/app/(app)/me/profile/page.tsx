'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { directStorageUpload } from '@/lib/api/upload-service';
import {
  Camera,
  CheckCircle2,
  Save
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatting';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [institutionName, setInstitutionName] = useState(user?.institutionName || 'Void Pavilion');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState<number | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setAvatarProgress(0);

    try {
      const { fileUrl } = await directStorageUpload({
        file,
        purpose: 'AVATAR',
        onProgress: (p) => setAvatarProgress(p)
      });
      updateProfile({ avatarUrl: fileUrl });
      setUploadingAvatar(false);
      setAvatarProgress(null);
    } catch {
      alert('Avatar upload failed. Please try again.');
      setUploadingAvatar(false);
      setAvatarProgress(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      bio,
      institutionName
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Student Profile</h1>
        <p className="text-xs text-zinc-500">
          Manage your personal details, academic campus association, and avatar picture.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-5 text-center flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-[#6219BD] to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                fullName ? fullName[0] : 'U'
              )}
            </div>

            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#181722] hover:bg-[#282736] text-white shadow-md border-2 border-white cursor-pointer transition-all"
              title="Change avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>

          {avatarProgress !== null && (
            <div className="w-full space-y-1">
              <span className="text-[10px] text-purple-700 font-semibold">
                Uploading to S3 direct storage... {avatarProgress}%
              </span>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6219BD] rounded-full transition-all duration-200"
                  style={{ width: `${avatarProgress}%` }}
                />
              </div>
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-zinc-900">{fullName || user?.username}</h3>
            <p className="text-xs text-zinc-500">@{user?.username}</p>
          </div>

          <div className="w-full pt-4 border-t border-zinc-100 space-y-2 text-left text-xs">
            <div className="flex items-center justify-between text-zinc-600">
              <span className="text-zinc-400">Account Role</span>
              <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span className="text-zinc-400">Campus</span>
              <span className="font-medium text-zinc-800">{institutionName}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span className="text-zinc-400">Member Since</span>
              <span className="text-zinc-700">{formatDate(user?.createdAt || new Date().toISOString())}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Details Form */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-zinc-900">Personal Information</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 text-xs bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Associated University / Institution
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. Void Pavilion"
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Learner Bio &amp; Research Focus
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell other students and faculty about your interests..."
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
