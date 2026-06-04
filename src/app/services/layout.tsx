import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خدماتنا | تدريب الباريستا وتطوير المقاهي",
  description:
    "خدمات احترافية في صناعة القهوة — تدريب الباريستا، تطوير المقاهي، استشارات تشغيلية، وتدريب الشركات.",
  keywords: ["خدمات قهوة", "تدريب باريستا فلسطين", "تطوير مقاهي"],
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "خدماتنا | تدريب الباريستا وتطوير المقاهي",
    description:
      "خدمات احترافية في صناعة القهوة — تدريب الباريستا، تطوير المقاهي، استشارات تشغيلية، وتدريب الشركات.",
    url: "https://www.goatjourney.online/services",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
