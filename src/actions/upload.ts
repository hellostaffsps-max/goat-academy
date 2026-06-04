"use server";

import { createClient } from "@/utils/supabase/server";

export async function uploadImage(formData: FormData): Promise<string> {
  const supabase = await createClient();
  
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "general";
  
  if (!file || file.size === 0) {
    throw new Error("No file provided");
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WebP, GIF are allowed.");
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() || "webp";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = await createClient();
  
  // Extract path from URL
  const bucketUrl = "/storage/v1/object/public/images/";
  const pathIndex = url.indexOf(bucketUrl);
  
  if (pathIndex === -1) {
    throw new Error("Invalid image URL");
  }
  
  const path = url.substring(pathIndex + bucketUrl.length);
  
  const { error } = await supabase.storage
    .from("images")
    .remove([path]);

  if (error) throw error;
}
