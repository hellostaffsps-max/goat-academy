import PageClient from "./PageClient";
import { PublicContentProvider } from "@/components/PublicContentProvider";
import { getPublicArticles } from "@/lib/public-content";
export default async function Page() {
  const [articles] = await Promise.all([getPublicArticles()]);
  return (
    <PublicContentProvider
      data={{ articles: articles.map((a) => ({ ...a, content: "" })) }}
    >
      <PageClient />
    </PublicContentProvider>
  );
}
