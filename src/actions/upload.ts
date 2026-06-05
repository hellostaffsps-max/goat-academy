"use server";

import { createClient } from "@/utils/supabase/server";

export async function uploadImage(formData: FormData): Promise<string> {
  const supabase = await createClient();

  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "general";

  if (!file || file.size === 0) {
    throw new Error("لم يتم اختيار ملف");
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("نوع الملف غير مدعوم. يُسمح فقط بـ JPEG, PNG, WebP, GIF.");
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.");
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() || "webp";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;

  try {
    const { error } = await supabase.storage
      .from("images")
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(error.message || "فشل رفع الصورة إلى الخادم");
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filename);

    if (!publicUrlData?.publicUrl) {
      throw new Error("تم الرفع لكن لم يتم الحصول على الرابط");
    }

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error("Upload action error:", err);
    throw new Error(err.message || "حدث خطأ غير متوقع أثناء رفع الصورة");
  }
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = await createClient();

  try {
    // Extract path from URL
    const bucketUrl = "/storage/v1/object/public/images/";
    const pathIndex = url.indexOf(bucketUrl);

    if (pathIndex === -1) {
      // Try alternate format
      const altBucketUrl = "images/";
      const altIndex = url.indexOf(altBucketUrl);
      if (altIndex !== -1) {
        const path = url.substring(altIndex + altBucketUrl.length);
        const { error } = await supabase.storage.from("images").remove([path]);
        if (error) throw error;
        return;
      }
      throw new Error("رابط الصورة غير صالح");
    }

    const path = url.substring(pathIndex + bucketUrl.length);

    const { error } = await supabase.storage
      .from("images")
      .remove([path]);

    if (error) throw error;
  } catch (err: any) {
    console.error("Delete image error:", err);
    throw new Error(err.message || "فشل حذف الصورة");
  }
}
