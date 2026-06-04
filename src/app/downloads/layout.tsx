import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تحميلات مجانية | مصادر ودلائل تأسيس المقاهي",
  description:
    "احصل على مصادر قيمة مجاناً — دليل تأسيس المقهى، قائمة أسعار المعدات، ونماذج خطط عمل.",
  keywords: ["تحميلات مجانية", "دليل مقهى", "خطة عمل مقهى"],
  alternates: {
    canonical: "/downloads",
  },
  openGraph: {
    title: "تحميلات مجانية | مصادر ودلائل تأسيس المقاهي",
    description: "احصل على مصادر قيمة مجاناً — دليل تأسيس المقهى، قائمة أسعار المعدات، ونماذج خطط عمل.",
    url: "https://www.goatjourney.online/downloads",
    type: "website",
  },
};

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
