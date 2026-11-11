import PageClient from "./PageClient";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { getPublicLessons, getPublicPaths } from "@/lib/public-content";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const initial = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (typeof value === "string") initial.set(key, value);
  const [lessons, paths] = await Promise.all([
    getPublicLessons(),
    getPublicPaths(),
  ]);
  return (
    <PublicContentProvider
      data={{
        lessons: lessons.map((lesson) => ({ ...lesson, content: "" })),
        paths,
      }}
    >
      <PageClient initialSearch={initial.toString() ? `?${initial}` : ""} />
    </PublicContentProvider>
  );
}
