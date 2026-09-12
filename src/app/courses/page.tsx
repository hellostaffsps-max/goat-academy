import PageClient from "./PageClient";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { getPublicLessons } from "@/lib/public-content";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const initialTrack = ["barista", "startup", "growth"].includes(track || "")
    ? (track as "barista" | "startup" | "growth")
    : "all";
  const [lessons] = await Promise.all([getPublicLessons()]);
  return (
    <PublicContentProvider
      data={{ lessons: lessons.map((l) => ({ ...l, content: "" })) }}
    >
      <PageClient key={initialTrack} initialTrack={initialTrack} />
    </PublicContentProvider>
  );
}
