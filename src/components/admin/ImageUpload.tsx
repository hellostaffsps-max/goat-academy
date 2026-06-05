"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon, AlertCircle } from "lucide-react";
import { uploadImage, deleteImage } from "@/actions/upload";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
}

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function ImageUpload({ value, onChange, folder = "general", label = "صورة" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "نوع الملف غير مدعوم. يُسمح فقط بـ JPEG, PNG, WebP, GIF.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `حجم الملف كبير جداً. الحد الأقصى ${MAX_SIZE_MB} ميجابايت.`;
    }
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Delete old image if exists (non-blocking)
      if (value) {
        try {
          await deleteImage(value);
        } catch {
          // Ignore delete errors
        }
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const url = await uploadImage(formData);
      onChange(url);
    } catch (err: any) {
      console.error("ImageUpload error:", err);
      setError(err.message || "فشل رفع الصورة. حاول مرة أخرى.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        await deleteImage(value);
      } catch {
        // Ignore
      }
    }
    onChange(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-muted-foreground">{label}</label>
      
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-border"
            onError={() => {
              setError("تعذر تحميل معاينة الصورة");
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 left-2 p-1.5 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent/40 hover:bg-accent/5 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">اضغط لرفع صورة</span>
              <span className="text-[10px] text-muted-foreground">JPEG, PNG, WebP (max 5MB)</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/5 px-3 py-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
