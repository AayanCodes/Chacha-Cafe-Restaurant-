import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { dbService } from '../../services/dbService';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder = 'offers',
  label = 'Offer Image',
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPG, PNG or WEBP image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    try {
      setUploading(true);
      setProgress(30);

      const url = await dbService.uploadImage(file, folder);
      
      setProgress(100);
      setTimeout(() => {
        onChange(url);
        setUploading(false);
        setProgress(0);
      }, 300);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2 font-sans">
      <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] tracking-wider">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-red-500/30 bg-[#121215] group">
          <img
            src={value}
            alt="Uploaded Preview"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition-transform hover:scale-105">
              Change Image
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 rounded-lg text-[10px] font-mono text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Image Selected
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-red-500/30 hover:border-red-500/70 rounded-2xl p-6 text-center bg-[#121215] transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-xs font-mono text-[#CBD5E1]">Uploading to Supabase Storage...</p>
                <div className="w-48 bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-red-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-red-950/50 rounded-2xl border border-red-500/20 text-red-500">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-[#F8F5EE]">Click or Drag & Drop image</p>
                  <p className="text-[10px] text-[#CBD5E1]/60 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 font-mono flex items-center gap-1 mt-1">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
};
