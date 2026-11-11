"use client";

import { MapPin } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { PathCard } from "@/components/cards/PathCard";

const defaultPaths = [
  {
    icon: "Coffee",
    title: "الباريستا المحترف",
    description:
      "تعلم تحضير القهوة من الأساسيات حتى الاحتراف: إسبريسو، تبخير الحليب، تقطير",
    href: "/paths?path=barista",
  },
  {
    icon: "Store",
    title: "تأسيس مقهى جديد",
    description:
      "دليلك العملي لفتح مقهى ناجح: تكاليف، معدات، دراسة جدوى، تشغيل",
    href: "/paths?path=owner",
  },
  {
    icon: "TrendingUp",
    title: "تطوير مقهى قائم",
    description: "حلول لتحسين الأداء: زيادة مبيعات، تدريب فريق، تحسين جودة",
    href: "/paths?path=manager",
  },
];

const defaultContent = {
  badge: "المسارات",
  heading: "اختر مسارك في عالم القهوة",
  description: "حدد هدفك ونحن نرشدك للمحتوى المناسب",
  paths: defaultPaths,
};

export function PathsSection() {
  const { content } = useSiteContent("paths_section", defaultContent);
  const paths = content.paths || defaultPaths;

  return (
    <section id="paths" className="section-padding gradient-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-right max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
            <MapPin className="w-3.5 h-3.5" />
            {content.badge}
          </div>
          <h2 className="heading-lg mb-3">{content.heading}</h2>
          <p className="body-base text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paths.map((path, i) => (
            <PathCard
              key={path.title}
              icon={path.icon}
              title={path.title}
              description={path.description.replace("ميلك رور", "تبخير الحليب")}
              href={path.href
                .replace("/courses?track=barista", "/paths?path=barista")
                .replace("/courses?track=startup", "/paths?path=owner")
                .replace("/courses?track=growth", "/paths?path=manager")}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
