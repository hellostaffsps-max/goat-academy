import PageClient from "./PageClient";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { getPublicStories } from "@/lib/public-content";
export default async function Page() {
  const [stories] = await Promise.all([getPublicStories()]);
  return (
    <PublicContentProvider data={{ stories }}>
      <PageClient />
    </PublicContentProvider>
  );
}
