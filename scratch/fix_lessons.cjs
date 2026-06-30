const fs = require('fs');

const path = 'c:/Users/hello/OneDrive/Desktop/academy/app/src/data/coffeeData.ts';
let data = fs.readFileSync(path, 'utf8');

// 1. Text Fixes (Regex)
// Fix spaces before punctuation
data = data.replace(/\s+([،.؛:?؟])/g, '$1');
// Ensure space after punctuation (if followed by a letter)
data = data.replace(/([،؛:?؟])([^\s\d\)\(])/g, '$1 $2');
// Ensure space after period only if it's Arabic/English letters next, not numbers or file extensions
data = data.replace(/(\.)([\u0600-\u06FFa-zA-Z])/g, '$1 $2');
// Remove multiple spaces
data = data.replace(/ {2,}/g, ' ');

// 2. We need to restructure learningPaths.
// I will just replace the 'learningPaths' block completely using regex.
const newPaths = `export const learningPaths: LearningPath[] = [
  {
    id: "amateur",
    title: "مسار هاوي القهوة",
    lessonCount: 46,
    description: "تعلم المشروبات، طرق التحضير المنزلية، وفهم النكهات بدون تعقيد.",
    icon: "Coffee",
    color: "from-sky-500 to-blue-600",
    lessons: [
      // Terms & Beans (Basics)
      "arabica", "robusta", "liberica", "excelsa",
      // Equipment & Roasting
      "coffee-processing", "roast-levels", "grind-size", "coffee-freshness", "single-origin", "espresso-blend",
      // Home Brewing
      "filter-coffee", "v60", "chemex", "french-press", "aeropress", "moka-pot", "turkish-coffee", "clever-dripper", "iced-filter",
      // Concepts
      "bloom", "extraction", "brew-ratio", "cupping", "acidity", "bitterness", "sweetness", "aftertaste", "origin", "degassing", "yield",
      // Accessories
      "coffee-scale", "gooseneck-kettle", "bean-sprayer",
      // Drinks
      "espresso", "americano", "cappuccino", "latte", "cortado", "macchiato", "mocha", "cold-brew", "iced-latte", "affogato",
      "crema", "body", "microfoam"
    ]
  },
  {
    id: "barista",
    title: "مسار الباريستا",
    lessonCount: 60,
    description: "ركز على الاستخلاص، الطحن، التبخير، المصطلحات، وثبات الوصفة.",
    icon: "GraduationCap",
    color: "from-amber-500 to-orange-600",
    lessons: [
      // Terms & Concepts
      "acidity", "bitterness", "sweetness", "body", "aftertaste", "crema", "microfoam",
      "extraction", "brew-ratio", "yield", "bloom", "degassing",
      // Coffee types & processing
      "arabica", "robusta", "coffee-processing", "roast-levels", "grind-size", "single-origin", "espresso-blend",
      // Equipment
      "commercial-espresso-machine", "commercial-grinder", "tamper", "distributor", "puck-screen", "wdt-tool", "knock-box", "tamping-mat", "milk-pitcher", "cleaning-brush",
      "coffee-scale", "bottomless-portafilter",
      // Core Barista Drinks
      "espresso", "ristretto", "lungo", "doppio", "americano", "long-black",
      "macchiato", "cortado", "piccolo", "flat-white", "cappuccino", "latte", "mocha",
      "iced-americano", "iced-latte", "cold-brew", "spanish-latte", "caramel-macchiato",
      // Cafe prep & Workflow
      "barista-workflow", "dialing-in", "milk-steaming", "latte-art-basics", "machine-maintenance", "grinder-calibration", "order-management", "customer-service"
    ]
  },
  {
    id: "manager",
    title: "مسار إدارة المقاهي",
    lessonCount: 40,
    description: "كل ما تحتاجه لفهم دراسة التكاليف، دورة التشغيل، والمعدات التجارية.",
    icon: "Briefcase",
    color: "from-emerald-500 to-teal-600",
    lessons: [
      // Concept & Planning
      "cafe-concept", "location-selection", "menu-design", "pricing-strategy", "cost-of-goods-sold", "break-even-point",
      // Equipment & Sourcing
      "commercial-espresso-machine", "commercial-grinder", "water-filtration", "batch-brewer", "ice-machine", "pos-system",
      "supplier-relations", "inventory-management",
      // Operations & Staffing
      "hiring-baristas", "staff-training", "standard-operating-procedures", "quality-control",
      "barista-workflow", "machine-maintenance",
      // Marketing & Growth
      "customer-experience", "loyalty-programs", "social-media-marketing", "local-seo",
      // Costing
      "costing-espresso", "costing-milk-drinks", "costing-filter", "costing-syrups", "costing-pastries", "wastage-management"
    ]
  },
  {
    id: "costing",
    title: "دراسة التكاليف المتقدمة",
    lessonCount: 15,
    description: "تعمق في هندسة المنيو، تسعير المشروبات، وتقليل الهدر لزيادة الأرباح.",
    icon: "Calculator",
    color: "from-rose-500 to-pink-600",
    lessons: [
      "cost-of-goods-sold",
      "pricing-strategy",
      "break-even-point",
      "menu-engineering",
      "costing-espresso",
      "costing-milk-drinks",
      "costing-filter",
      "costing-syrups",
      "costing-pastries",
      "wastage-management",
      "labor-cost-analysis",
      "overhead-costs",
      "profit-margin-optimization",
      "inventory-valuation",
      "vendor-negotiation"
    ]
  }
];`;

const oldPathsRegex = /export const learningPaths:\s*LearningPath\[\]\s*=\s*\[[\s\S]*?\];/;
data = data.replace(oldPathsRegex, newPaths);

fs.writeFileSync(path, data, 'utf8');
console.log("Lessons content cleaned and learning paths logically reordered!");
