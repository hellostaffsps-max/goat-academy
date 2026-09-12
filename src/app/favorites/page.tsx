import PageClient from "./PageClient";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { getPublicLessons } from "@/lib/public-content";
export default async function Page() {
  const [lessons] = await Promise.all([getPublicLessons()]);
  return (
    <PublicContentProvider
      data={{ lessons: lessons.map((l) => ({ ...l, content: "" })) }}
    >
      <PageClient />
    </PublicContentProvider>
  );
}
