import { notFound } from "next/navigation";
import { downloadResources } from "@/data/downloadResources";
import { pageMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/StructuredData";
import ResourceClient from "./ResourceClient";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return Object.keys(downloadResources).map((slug) => ({ slug }));
}
function getResource(slug: string) {
  return Object.hasOwn(downloadResources, slug)
    ? downloadResources[slug]
    : undefined;
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) notFound();
  return pageMetadata(r.title, r.description, `/downloads/${slug}`);
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) notFound();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "الرئيسية", item: "/" },
          { name: "المصادر", item: "/downloads" },
          { name: r.title },
        ]}
      />
      <ResourceClient resource={r} />
    </>
  );
}
