import Link from "next/link";
import { absoluteUrl, site, personId, organizationId } from "@/lib/site";
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; item?: string }[];
}) {
  return (
    <>
      <nav
        aria-label="مسار التنقل"
        className="text-xs text-muted-foreground mb-6"
      >
        <ol className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li key={index}>
              {index > 0 && (
                <span aria-hidden="true" className="mx-2">
                  /
                </span>
              )}
              {item.item ? (
                <Link href={item.item} className="hover:text-accent">
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            ...(item.item ? { item: absoluteUrl(item.item) } : {}),
          })),
        }}
      />
    </>
  );
}
export function StructuredData() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": personId,
            name: site.personEn,
            alternateName: site.person,
            url: absoluteUrl("/about"),
            image: absoluteUrl("/images/founder.webp"),
            jobTitle: "مدرب واستشاري قهوة مختصة",
            worksFor: { "@id": organizationId },
          },
          {
            "@type": "EducationalOrganization",
            "@id": organizationId,
            name: site.name,
            alternateName: site.alternateName,
            url: site.url,
            logo: absoluteUrl("/brand-logo.png"),
            description: site.description,
            founder: { "@id": personId },
            sameAs: site.social,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: site.phone,
              email: site.email,
              contactType: "customer service",
              availableLanguage: ["ar", "en"],
              areaServed: "PS",
            },
          },
          {
            "@type": "WebSite",
            "@id": `${site.url}/#website`,
            url: site.url,
            name: site.name,
            inLanguage: "ar",
            publisher: { "@id": organizationId },
          },
        ],
      }}
    />
  );
}
