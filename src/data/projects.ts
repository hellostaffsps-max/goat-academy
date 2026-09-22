export const projects = [
  {
    "slug": "farran",
    "name": "مقهى فران",
    "summary": "تأسيس البار وتطوير المنيو والوصفات وإجراءات التشغيل وتدريب الباريستا.",
    "scope": [
      "تأسيس البار.",
      "إعداد إجراءات التشغيل القياسية (SOP).",
      "بناء المنيو ووصفات المشروبات.",
      "تطوير مشروب خاص (Signature Drink).",
      "تدريب الباريستا.",
      "تعديل بلند القهوة."
    ],
    "services": [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training"
    ]
  },
  {
    "slug": "re-coffee",
    "name": "مقهى ري كوفي",
    "summary": "تأسيس البار واختيار المعدات وبناء منيو متناسب مع المشروع وتدريب الباريستا.",
    "scope": [
      "تأسيس البار.",
      "اختيار المعدات.",
      "تدريب الباريستا.",
      "بناء منيو متناسب مع المشروع."
    ],
    "services": [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training"
    ]
  },
  {
    "slug": "crave",
    "name": "مقهى كريف",
    "summary": "إعادة بناء البار وتطوير المنيو وتدريب الفريق.",
    "scope": [
      "إعادة بناء البار.",
      "بناء منيو المشروبات.",
      "تدريب الباريستا."
    ],
    "services": [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training"
    ]
  },
  {
    "slug": "stories",
    "name": "مقهى ستوريز",
    "summary": "تجديد هوية البار وتطوير الوصفات والمساعدة في تصميم البار.",
    "scope": [
      "تجديد هوية البار (Rebrand).",
      "تطوير وصفات المشروبات.",
      "المساعدة في تصميم البار."
    ],
    "services": [
      "coffee-consultant-palestine",
      "coffee-menu-development"
    ]
  },
  {
    "slug": "kama",
    "name": "مقهى كما",
    "summary": "تصميم البار واختيار المعدات وإنشاء وصفات المشروبات والتدريب.",
    "scope": [
      "تصميم البار.",
      "اختيار المعدات.",
      "إنشاء وصفات للبار.",
      "التدريب."
    ],
    "services": [
      "coffee-consultant-palestine",
      "coffee-menu-development",
      "cafe-staff-training"
    ]
  }
];

export function confirmedProject(name: string) {
  const aliases = ["فران", "ريكوفي", "كريف", "ستوريز", "كما"];
  return projects.find((p, i) => name.includes(p.name) || name.includes(aliases[i]));
}
