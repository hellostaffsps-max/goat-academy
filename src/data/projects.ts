export interface ProjectLogo {
  src: string;
  /** Pixel window in the unchanged 720 × 1640 source screenshot. */
  window?: { x: number; y: number; size: number };
}
export interface Project {
  slug: string;
  name: string;
  aliases: string[];
  summary: string;
  scope: string[];
  services: string[];
  logo?: ProjectLogo;
}

export const projects: Project[] = [
  {
    slug: "farran",
    name: "Farran",
    summary:
      "تأسيس البار وتطوير المنيو والوصفات وإجراءات التشغيل وتدريب الباريستا.",
    scope: [
      "تأسيس البار.",
      "إعداد إجراءات التشغيل القياسية (SOP).",
      "بناء المنيو ووصفات المشروبات.",
      "تطوير مشروب خاص (Signature Drink).",
      "تدريب الباريستا.",
      "تعديل بلند القهوة.",
    ],
    services: [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training",
    ],
    aliases: ["مقهى فران", "فران", "farran-ramallah-jerusalem"],
    logo: {
      src: "/images/projects/farran.jpeg",
      window: {
        x: 123,
        y: 583,
        size: 475,
      },
    },
  },
  {
    slug: "re-coffee",
    name: "RE COFFEE",
    summary:
      "تأسيس البار واختيار المعدات وبناء منيو متناسب مع المشروع وتدريب الباريستا.",
    scope: [
      "تأسيس البار.",
      "اختيار المعدات.",
      "تدريب الباريستا.",
      "بناء منيو متناسب مع المشروع.",
    ],
    services: [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training",
    ],
    aliases: [
      "مقهى ري كوفي",
      "ريكوفي",
      "ري كوفي",
      "recoffe",
      "recoffee-ramallah",
    ],
    logo: {
      src: "/images/projects/re-coffee.jpeg",
      window: {
        x: 96,
        y: 592,
        size: 476,
      },
    },
  },
  {
    slug: "mariam",
    name: "مقهى مريم",
    aliases: ["قهوة مريم", "QAHWET MARIAM", "qahwet-mariam-ramallah"],
    summary:
      "تأسيس المقهى وتجهيز البار والمنيو وإجراءات التشغيل وتدريب الفريق.",
    scope: [
      "تأسيس البار وتجهيزه.",
      "إعداد المنيو ووصفات المشروبات.",
      "إعداد إجراءات التشغيل القياسية (SOP).",
      "تدريب الفريق ومتابعة التشغيل.",
    ],
    services: [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training",
    ],
    logo: {
      src: "/images/projects/mariam.jpeg",
      window: {
        x: 105,
        y: 581,
        size: 475,
      },
    },
  },
  {
    slug: "crave",
    name: "Crave",
    summary: "إعادة بناء البار وتطوير المنيو وتدريب الفريق.",
    scope: ["إعادة بناء البار.", "بناء منيو المشروبات.", "تدريب الباريستا."],
    services: [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training",
    ],
    aliases: ["مقهى كريف", "كريف", "crave-hebron"],
    logo: {
      src: "/images/projects/crave.jpeg",
      window: {
        x: 123,
        y: 583,
        size: 475,
      },
    },
  },
  {
    slug: "stories",
    name: "STORIES",
    summary: "تجديد هوية البار وتطوير الوصفات والمساعدة في تصميم البار.",
    scope: [
      "تجديد هوية البار (Rebrand).",
      "تطوير وصفات المشروبات.",
      "المساعدة في تصميم البار.",
    ],
    services: ["coffee-consultant-palestine", "coffee-menu-development"],
    aliases: ["مقهى ستوريز", "ستوريز", "stories-ramallah"],
    logo: {
      src: "/images/projects/stories.jpeg",
      window: {
        x: 123,
        y: 583,
        size: 475,
      },
    },
  },
  {
    slug: "kama",
    name: "مقهى كما",
    summary: "تصميم البار واختيار المعدات وإنشاء وصفات المشروبات والتدريب.",
    scope: [
      "تصميم البار.",
      "اختيار المعدات.",
      "إنشاء وصفات للبار.",
      "التدريب.",
    ],
    services: [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training",
    ],
    aliases: ["مقهى كما", "كما"],
  },
  {
    slug: "pavone",
    name: "Pavone",
    aliases: ["بافوني"],
    summary: "من أعمال وائل أرزيقات مع مشاريع المقاهي.",
    scope: [],
    services: [],
    logo: {
      src: "/images/projects/pavone.jpeg",
      window: {
        x: 123,
        y: 583,
        size: 475,
      },
    },
  },
  {
    slug: "hunt",
    name: "hunt.",
    aliases: ["hunt", "هانت"],
    summary: "من أعمال وائل أرزيقات مع مشاريع المقاهي.",
    scope: [],
    services: [],
    logo: {
      src: "/images/projects/hunt.jpeg",
      window: {
        x: 123,
        y: 583,
        size: 475,
      },
    },
  },
  {
    slug: "drip",
    name: "Drip cafe",
    aliases: ["دريب", "drip coffee"],
    summary: "من أعمال وائل أرزيقات مع مشاريع المقاهي.",
    scope: [],
    services: [],
    logo: {
      src: "/images/projects/drip.jpeg",
      window: {
        x: 123,
        y: 583,
        size: 475,
      },
    },
  },
  {
    slug: "99-cafe",
    name: "99 cafe",
    aliases: ["99 café", "99 كافيه"],
    summary: "من أعمال وائل أرزيقات مع مشاريع المقاهي.",
    scope: [],
    services: [],
    logo: {
      src: "/images/projects/99-cafe.jpeg",
      window: {
        x: 123,
        y: 583,
        size: 475,
      },
    },
  },
  {
    slug: "baron-palace",
    name: "Baron palace",
    aliases: ["قلعة البارون", "قصر البارون"],
    summary: "من أعمال وائل أرزيقات مع مشاريع المقاهي.",
    scope: [],
    services: [],
    logo: {
      src: "/images/projects/baron-palace.jpg",
    },
  },
  {
    slug: "bravos",
    name: "BRAVOS",
    aliases: ["برافوز", "bravos-jericho"],
    summary: "تأسيس المقهى وتوظيف الفريق وتدريبه وإعداد منيو المشروبات.",
    scope: [
      "تأسيس المقهى.",
      "توظيف الفريق التشغيلي وتدريبه.",
      "إعداد منيو المشروبات.",
    ],
    services: [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training",
    ],
  },
  {
    slug: "h-cafe",
    name: "H CAFE",
    aliases: ["إتش كافيه", "h-cafe-surda"],
    summary:
      "إضافة بار وتصميم مساحته، مع استشارة المعدات والمنيو وإجراءات التشغيل وتدريب الفريق.",
    scope: [
      "إضافة قسم بار وتصميم مساحته.",
      "استشارة لاختيار المعدات.",
      "إعداد إجراءات التشغيل القياسية (SOP).",
      "تصميم المنيو وتدريب الفريق.",
    ],
    services: [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training",
    ],
  },
];

const normalize = (value: string) =>
  value.toLocaleLowerCase().replace(/[\s.()_-]+/g, "");
export function confirmedProject(name: string) {
  const key = normalize(name);
  return projects.find((p) =>
    [p.name, p.slug, ...p.aliases].some(
      (alias) =>
        key === normalize(alias) ||
        (normalize(alias).length > 2 && key.includes(normalize(alias))),
    ),
  );
}
