import Image from "next/image";
export function ContentImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const host = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const local = src.startsWith("/") && !src.startsWith("//");
  let optimized = local;
  try {
    const u = new URL(src);
    if (u.protocol !== "https:") return null;
    optimized =
      !!host &&
      u.origin === new URL(host).origin &&
      u.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    if (!local) return null;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized={!optimized}
    />
  );
}
