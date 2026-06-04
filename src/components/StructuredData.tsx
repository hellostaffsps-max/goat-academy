"use client";

import { usePathname } from "next/navigation";

const BASE_URL = "https://www.goatjourney.online";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GoatJourney Academy",
    alternateName: "أكاديمية القهوة المختصة",
    url: BASE_URL,
    logo: `${BASE_URL}/brand-logo.png`,
    description:
      "أول أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي بالعربية",
    founder: {
      "@type": "Person",
      name: "يوسف خليل",
      jobTitle: "مؤسس أكاديمية القهوة المختصة",
      alumniOf: {
        "@type": "Organization",
        name: "Coffee Quality Institute",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+970-594-136-723",
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
      areaServed: "PS",
    },
    sameAs: [
      "https://www.instagram.com/goatjourney",
      "https://www.facebook.com/goatjourney",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "GoatJourney Academy",
    image: `${BASE_URL}/brand-logo.png`,
    "@id": BASE_URL,
    url: BASE_URL,
    telephone: "+970594136723",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PS",
      addressRegion: "فلسطين",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.95,
      longitude: 35.2,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "17:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GoatJourney Academy",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/explore?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; item?: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item ? `${BASE_URL}${item.item}` : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function StructuredData() {
  const pathname = usePathname();

  // Generate breadcrumb based on pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems: { name: string; item?: string }[] = [{ name: "الرئيسية", item: "/" }];

  const breadcrumbMap: Record<string, string> = {
    courses: "الدورات",
    blog: "المدونة",
    tools: "الأدوات",
    about: "من نحن",
    consultant: "استشارة",
    services: "الخدمات",
    downloads: "تحميلات",
    "success-stories": "قصص النجاح",
    explore: "استكشف",
    paths: "مسارات",
    lesson: "درس",
    settings: "الإعدادات",
    favorites: "المفضلة",
    admin: "لوحة التحكم",
  };

  segments.forEach((segment, i) => {
    const label = breadcrumbMap[segment] || segment;
    const path = "/" + segments.slice(0, i + 1).join("/");
    breadcrumbItems.push({
      name: label,
      item: i < segments.length - 1 ? path : undefined,
    });
  });

  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebsiteSchema />
      <BreadcrumbSchema items={breadcrumbItems} />
    </>
  );
}
