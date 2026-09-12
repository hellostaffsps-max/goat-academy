import { notFound, permanentRedirect } from "next/navigation";
import { getPublicArticle, getPublicArticles } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, organizationId, personId, site } from "@/lib/site";
import { JsonLd, BreadcrumbSchema } from "@/components/StructuredData";
import ArticleClient from "./ArticleClient";
type Props = { params: Promise<{ id: string }> };
export const revalidate = 300;
export async function generateStaticParams() {
  return (await getPublicArticles()).map((a) => ({ id: a.slug }));
}
export async function generateMetadata({ params }: Props) {
  const a = await getPublicArticle((await params).id);
  if (!a) notFound();
  return pageMetadata(a.title, a.description, `/blog/${a.slug}`, "article");
}
export default async function Page({ params }: Props) {
  const { id } = await params;
  const a = await getPublicArticle(id);
  if (!a) notFound();
  if (id !== a.slug) permanentRedirect(`/blog/${a.slug}`);
  const author =
    a.author === site.person || a.author === site.personEn
      ? { "@id": personId }
      : a.author === "فريق GoatJourney"
        ? { "@id": organizationId }
        : { "@type": "Person", name: a.author };
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: a.title,
          description: a.description,
          url: absoluteUrl(`/blog/${a.slug}`),
          mainEntityOfPage: absoluteUrl(`/blog/${a.slug}`),
          datePublished: a.date || a.created_at,
          dateModified: a.updated_at || a.date,
          inLanguage: "ar",
          author,
          publisher: { "@id": organizationId },
          image: absoluteUrl("/og/default.png"),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "الرئيسية", item: "/" },
          { name: "المدونة", item: "/blog" },
          { name: a.title },
        ]}
      />
      <ArticleClient article={a} />
    </>
  );
}
