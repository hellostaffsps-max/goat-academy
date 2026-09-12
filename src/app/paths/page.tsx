import PageClient from "./PageClient";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { getPublicLessons, getPublicPaths } from "@/lib/public-content";
export default async function Page() {
  const [lessons, paths] = await Promise.all([
    getPublicLessons(),
    getPublicPaths(),
  ]);
  return (
    <PublicContentProvider
      data={{ lessons: lessons.map((l) => ({ ...l, content: "" })), paths }}
    >
      <PageClient />
    </PublicContentProvider>
  );
}
