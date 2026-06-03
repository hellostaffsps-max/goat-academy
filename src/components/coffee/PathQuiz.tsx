"use client";

import React, { useState, useRef } from "react";
import { Trophy, Award, CheckCircle, XCircle, ArrowLeft, Download, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: Record<string, { pathTitle: string; questions: Question[] }> = {
  "homebrew-path": {
    pathTitle: "هاوي القهوة",
    questions: [
      {
        question: "ما هي النسبة الذهبية (Ratio) الافتراضية الأكثر شيوعاً لتحضير القهوة المقطرة V60؟",
        options: ["1:8", "1:15", "1:25", "1:5"],
        correctAnswer: 1,
        explanation: "النسبة 1:15 (أي جرام قهوة لكل 15 مل ماء) هي الأكثر شعبية لاستخلاص متوازن ونظيف."
      },
      {
        question: "ما فائدة مرحلة ترطيب البن (Bloom) في بداية تحضير القهوة المقطرة؟",
        options: ["تبريد الماء الساخن بسرعة", "تلوين الفلتر الورقي فقط", "طرد غاز ثاني أكسيد الكربون لمنع الاستخلاص الناقص والتكتل", "زيادة مرارة القهوة"],
        correctAnswer: 2,
        explanation: "ترطيب البن يطلق غاز ثاني أكسيد الكربون المحتبس من التحميص، مما يسهل على الماء استخلاص النكهات العطرية لاحقاً."
      },
      {
        question: "أي من أدوات تحضير القهوة التالية تعتمد بالكامل على النقع والكبس اليدوي المكبوس بالهواء؟",
        options: ["فرنش بريس", "إيروبريس (Aeropress)", "كيمكس", "إسبريسو"],
        correctAnswer: 1,
        explanation: "الإيروبريس تعتمد على مكبس يدوياً يدفع الهواء والماء عبر فنجان القهوة المغلق بفلتر ورقي."
      },
      {
        question: "ما هي درجة حرارة الماء المثالية الموصى بها لتحضير القهوة المختصة؟",
        options: ["100 درجة مئوية (غليان كامل)", "70-75 درجة مئوية", "90-94 درجة مئوية", "50 درجة مئوية"],
        correctAnswer: 2,
        explanation: "درجات الحرارة بين 90-94 مئوية هي الأنسب لاستخلاص المركبات المرغوبة دون حرق حبوب القهوة."
      },
      {
        question: "تتميز القهوة المحضرة بأداة الكيمكس بقوامها النظيف جداً، والسبب في ذلك هو:",
        options: ["شكل الإناء الزجاجي", "سمك وجودة الفلاتر الورقية الخاصة بها", "سرعة صب الماء العالية", "نوع حبوب البن المستخدمة فقط"],
        correctAnswer: 1,
        explanation: "فلاتر كيمكس السميكة تحجز الزيوت والرواسب الدقيقة بشكل فعال، مما يعطي كوباً نقياً جداً ونظيفاً."
      }
    ]
  },
  "barista-path": {
    pathTitle: "الباريستا المحترف",
    questions: [
      {
        question: "أي من المشروبات التالية يحتوي على كمية حليب أقل ورغوة حليب أكثر كثافة ووضوحاً؟",
        options: ["لاتيه (Latte)", "فلات وايت (Flat White)", "كابتشينو (Cappuccino)", "أمريكانو (Americano)"],
        correctAnswer: 2,
        explanation: "الكابتشينو التقليدي يتألف من أجزاء متساوية من الإسبريسو، الحليب المبخر، ورغوة الحليب الكثيفة."
      },
      {
        question: "ما هو مشروب الـ Ristretto مقارنة بالإسبريسو العادي؟",
        options: ["كوب إسبريسو مضاف إليه ماء ساخن", "إسبريسو مستخلص بنصف كمية الماء تقريباً ووقت أقصر يعطي تركيزاً وحلاوة أعلى", "إسبريسو مع رغوة حليب خفيفة", "إسبريسو مثلج ومخفوق"],
        correctAnswer: 1,
        explanation: "الريستريتو هو إسبريسو مركز يتم قطعه مبكراً لتقليل استخلاص المواد المرة الثقيلة التي تظهر في نهاية الكوب."
      },
      {
        question: "ما هي درجة الحرارة المثالية لتبخير الحليب في المقاهي دون حرق السكريات الطبيعية؟",
        options: ["40-45 درجة مئوية", "60-65 درجة مئوية", "80-85 درجة مئوية", "95-100 درجة مئوية"],
        correctAnswer: 1,
        explanation: "التبخير بين 60-65 مئوية يمنح الحليب قواماً مخملياً كريمياً وحلاوة طبيعية، بينما تجاوزه لـ 70 درجة يكسر البروتينات ويحرقه."
      },
      {
        question: "ما هو الترتيب الصحيح والشكل المميز لتحضير مشروب الفلات وايت؟",
        options: ["حليب مبخر أولاً ثم يصب الإسبريسو فوقه", "إسبريسو دبل شوت يصب فوقه حليب برغوة ناعمة ورقيقة جداً (ميكروفوم)", "إسبريسو شوت واحد مع ثلج وحليب بارد", "ماء ساخن ثم إسبريسو"],
        correctAnswer: 1,
        explanation: "يحضر الفلات وايت بصب حليب مبخر برغوة ناعمة ورقيقة جداً فوق جرعة إسبريسو ثنائية."
      },
      {
        question: "الاستخلاص الزائد (Over-extraction) للإسبريسو ينتج عنه طعم:",
        options: ["حامض جداً ومالح وقوام مائي خفيف", "حلو متوازن وقوام كريمي ثقيل", "مر وحاد جداً مع جفاف شديد في الفم واللسان", "بدون نكهة واضحة ومخفف بالكامل"],
        correctAnswer: 2,
        explanation: "استمرار الاستخلاص لفترة طويلة يذيب المواد الخشبية الثقيلة والمركبات المرة التي تفسد نكهة الكوب."
      }
    ]
  },
  "owner-path": {
    pathTitle: "مالك المقهى",
    questions: [
      {
        question: "عند حساب تكلفة كوب القهوة للمقاهي، ما هي العناصر المضمنة في التكلفة المباشرة (COGS)؟",
        options: ["إيجار المحل ورواتب الموظفين الشهرية والتأمينات", "تكلفة البن، الحليب، الأكواب، الأغطية، والملحقات المستخدمة مباشرة في تحضير الكوب", "سعر ماكينة الإسبريسو وتكلفة الديكور العام", "رسوم التراخيص والتسجيل الحكومية السنوية"],
        correctAnswer: 1,
        explanation: "التكلفة المباشرة (COGS) تشمل فقط تكلفة المواد الخام المباشرة المستهلكة في الكوب الواحد."
      },
      {
        question: "لماذا يعتبر استئجار موقع للمقهى بسعر رخيص جداً ولكنه في مكان معزول قراراً خطيراً؟",
        options: ["لأن التراخيص في هذه المناطق صعبة", "لأن الموقع المعزول يقلل حركة المرور اليومية الطبيعية ويتطلب تكاليف تسويق هائلة لجلب الزبائن", "لأن سعر البن سيكون أغلى للوصول للمكان", "لأن الديكورات تكون أصعب في الأماكن البعيدة"],
        correctAnswer: 1,
        explanation: "الموقع الاستراتيجي يضمن مرور الزبائن الطبيعي. التوفير في الإيجار لمكان معزول قد يؤدي لفشل المقهى بسبب عدم وجود زوار."
      },
      {
        question: "ما هو المصطلح المالي المخصص لحساب المدة اللازمة لاسترداد كامل رأس المال المستثمر في التأسيس؟",
        options: ["هامش الربح الإجمالي للكوب", "نقطة التعادل (Break-even Point)", "فترة استرداد الاستثمار (Payback Period)", "التدفق النقدي التشغيلي (Cash Flow)"],
        correctAnswer: 2,
        explanation: "فترة الاسترداد هي المدة الزمنية المطلوبة لتغطية قيمة الاستثمار التأسيسي الأولي بالكامل من صافي أرباح المشروع."
      },
      {
        question: "أي من الخدمات التالية تعتبر الأكثر أهمية لضمان ثبات جودة الكوب وولاء الزبائن للمقهى بانتظام؟",
        options: ["تغيير الديكور وألوان الجدران شهرياً", "شراء أكواب ملونة مختلفة كل أسبوع", "التدريب والتعليم المستمر لطاقم الباريستا والموظفين", "تقديم منيو طعام ضخم جداً ومتنوع"],
        correctAnswer: 2,
        explanation: "مهارة الباريستا المدرب هي الأساس في ثبات جودة المشروبات وتقديم خدمة عملاء ممتازة تضمن ولاء الزبون."
      },
      {
        question: "في المقاهي المختصة، يُنصح بالبدء بقائمة مشروبات (Menu) مركزة ومحددة بدلاً من منيو ضخم، والسبب هو:",
        options: ["تقليل سرعة تحضير وتقديم المشروب للزبون", "تقليل الهدر وتسهيل ضبط الجودة والتحكم الدقيق في مخزون البن والمكونات", "لأن الزبائن في فلسطين لا يفضلون الخيارات", "لأن طباعة القوائم الكبيرة مكلفة جداً"],
        correctAnswer: 1,
        explanation: "المنيو المحدد يسهل ضبط الجودة وسرعة الخدمة ويقلل الهدر وتلف المواد الخام مثل الحليب والنكهات."
      }
    ]
  }
};

interface PathQuizProps {
  pathId: string;
  onClose: () => void;
}

export function PathQuiz({ pathId, onClose }: PathQuizProps) {
  const data = quizQuestions[pathId];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [userName, setUserName] = useState<string>("");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  if (!data) return null;

  const currentQuestion = data.questions[currentIdx];

  const handleOptionClick = (optIdx: number) => {
    if (showAnswer) return;
    setSelectedOpt(optIdx);
  };

  const handleNext = () => {
    // Check answer
    const isCorrect = selectedOpt === currentQuestion.correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);

    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setSelectedOpt(null);
    if (currentIdx < data.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const isPassed = score >= 4; // 80% to pass

  // Download certificate using client-side HTML5 Canvas drawing (no external libs)
  const drawAndDownloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nameToUse = userName.trim() || "طالب الأكاديمية";

    const drawContent = (logoImg?: HTMLImageElement) => {
      // 1. Background Gradient (Professional cream look)
      const grad = ctx.createRadialGradient(600, 420, 100, 600, 420, 700);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, "#f7f4eb");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 840);

      // 2. Multi-layer Gold & Dark Border
      // Outer gold border
      ctx.strokeStyle = "#c5a85c"; // Warm Gold
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 40, 1120, 760);

      // Inner dark border
      ctx.strokeStyle = "#382f2c"; // Dark Brown
      ctx.lineWidth = 1;
      ctx.strokeRect(52, 52, 1096, 736);

      // Corner flourishes
      ctx.strokeStyle = "#c5a85c";
      ctx.lineWidth = 2.5;
      
      // Top-Left corner flourish
      ctx.beginPath();
      ctx.moveTo(35, 75);
      ctx.lineTo(75, 75);
      ctx.lineTo(75, 35);
      ctx.stroke();

      // Top-Right corner flourish
      ctx.beginPath();
      ctx.moveTo(1165, 75);
      ctx.lineTo(1125, 75);
      ctx.lineTo(1125, 35);
      ctx.stroke();

      // Bottom-Left corner flourish
      ctx.beginPath();
      ctx.moveTo(35, 765);
      ctx.lineTo(75, 765);
      ctx.lineTo(75, 805);
      ctx.stroke();

      // Bottom-Right corner flourish
      ctx.beginPath();
      ctx.moveTo(1165, 765);
      ctx.lineTo(1125, 765);
      ctx.lineTo(1125, 805);
      ctx.stroke();

      // Mini gold diamonds in the corners
      const drawDiamond = (cx: number, cy: number, size: number) => {
        ctx.fillStyle = "#c5a85c";
        ctx.beginPath();
        ctx.moveTo(cx, cy - size);
        ctx.lineTo(cx + size, cy);
        ctx.lineTo(cx, cy + size);
        ctx.lineTo(cx - size, cy);
        ctx.closePath();
        ctx.fill();
      };
      drawDiamond(75, 75, 6);
      drawDiamond(1125, 75, 6);
      drawDiamond(75, 765, 6);
      drawDiamond(1125, 765, 6);

      // 3. Logo Drawing (Academy Logo)
      if (logoImg) {
        // Center of horizontal logo is at x = 600, draw width = 140, height = 56
        ctx.drawImage(logoImg, 530, 75, 140, 56);
      }

      // 4. Content alignment (RTL rendering)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Header Title
      ctx.font = "bold 24px Arial, sans-serif";
      ctx.fillStyle = "#382f2c";
      ctx.fillText("أكاديمية GoatJourney للقهوة المختصة", 600, 165);

      // Subtitle
      ctx.font = "italic 16px Georgia, serif";
      ctx.fillStyle = "#888888";
      ctx.fillText("GoatJourney Coffee Academy — Palestine", 600, 195);

      // Separator line
      ctx.strokeStyle = "#c5a85c";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(480, 220);
      ctx.lineTo(720, 220);
      ctx.stroke();

      // Certificate Type
      ctx.font = "bold 32px Arial, sans-serif";
      ctx.fillStyle = "#382f2c";
      ctx.fillText("شـهادة إكـمـال مـسـار تـعـلـيـمـي", 600, 270);

      // Text: Certifies that
      ctx.font = "18px Arial, sans-serif";
      ctx.fillStyle = "#555555";
      ctx.fillText("تمنح الأكاديمية هذه الشهادة فخراً واعتزازاً للطالب:", 600, 335);

      // User Name (Styled elegant)
      ctx.font = "bold 44px Georgia, Arial, sans-serif";
      ctx.fillStyle = "#382f2c";
      ctx.fillText(nameToUse, 600, 410);

      // Underline for name
      ctx.strokeStyle = "#c5a85c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(350, 450);
      ctx.lineTo(850, 450);
      ctx.stroke();

      // Text: Description
      ctx.font = "18px Arial, sans-serif";
      ctx.fillStyle = "#555555";
      ctx.fillText("بعد اجتيازه بنجاح الاختبار التقييمي الشامل للمسار المعتمد:", 600, 500);

      // Learning Path Title Badge
      // Draw rounded rect for path title
      const rx = 380;
      const ry = 535;
      const rw = 440;
      const rh = 46;
      const radius = 8;
      ctx.fillStyle = "#382f2c";
      ctx.beginPath();
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + rw - radius, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
      ctx.lineTo(rx + rw, ry + rh - radius);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
      ctx.lineTo(rx + radius, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
      ctx.closePath();
      ctx.fill();

      ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillStyle = "#faf9f6";
      ctx.fillText(`مسار: ${data.pathTitle}`, 600, 558);

      // Date & Signature block
      const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
      
      // Left: Date
      ctx.fillStyle = "#555555";
      ctx.font = "15px Arial, sans-serif";
      ctx.fillText(`تاريخ الإصدار: ${today}`, 280, 715);
      
      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(180, 685);
      ctx.lineTo(380, 685);
      ctx.stroke();

      // Right: Handwritten Signature
      ctx.strokeStyle = "#1a365d"; // Elegant dark blue ink
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      
      // Wael cursive signature draw paths:
      ctx.moveTo(850, 670);
      ctx.bezierCurveTo(855, 630, 865, 625, 870, 665); // W loop
      ctx.bezierCurveTo(875, 675, 880, 630, 885, 660); // a
      ctx.bezierCurveTo(890, 670, 895, 665, 898, 668); // e
      ctx.bezierCurveTo(895, 660, 902, 660, 905, 670); // l
      ctx.bezierCurveTo(908, 665, 912, 662, 915, 670); // I
      ctx.bezierCurveTo(920, 645, 925, 640, 922, 672); // r
      
      // Loop connection
      ctx.bezierCurveTo(928, 665, 932, 665, 935, 670); // z
      ctx.bezierCurveTo(940, 675, 942, 680, 938, 685); // descend loop
      ctx.bezierCurveTo(932, 690, 945, 670, 948, 668); // e
      ctx.bezierCurveTo(952, 665, 955, 665, 958, 670); // q
      ctx.bezierCurveTo(962, 665, 966, 665, 968, 670); // a
      ctx.bezierCurveTo(972, 668, 975, 668, 978, 670); // t
      
      // Underline slash flourish
      ctx.moveTo(840, 680);
      ctx.bezierCurveTo(910, 685, 980, 680, 1025, 660);
      ctx.stroke();

      // Right: Label
      ctx.fillStyle = "#555555";
      ctx.font = "15px Arial, sans-serif";
      ctx.fillText("توقيع الأكاديمية: وائل زريقات", 925, 715);
      
      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(825, 685);
      ctx.lineTo(1025, 685);
      ctx.stroke();

      // Center Golden Badge Seal
      ctx.strokeStyle = "#c5a85c";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(600, 705, 42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#c5a85c";
      ctx.beginPath();
      ctx.arc(600, 705, 36, 0, Math.PI * 2);
      ctx.fill();

      // Star inside badge
      ctx.fillStyle = "#382f2c";
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("★", 600, 705);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `GoatJourney_Certificate_${nameToUse.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    };

    // Load the logo image
    const logoImg = new Image();
    logoImg.src = "/brand-logo.png";
    logoImg.onload = () => {
      drawContent(logoImg);
    };
    logoImg.onerror = () => {
      // Draw content without logo as fallback
      drawContent();
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Quiz Card */}
      <div className="w-full max-w-lg bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden animate-slide-up text-right flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-secondary/40 px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">اختبار مسار: {data.pathTitle}</span>
            <Trophy className="w-4.5 h-4.5 text-accent" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {!quizFinished ? (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                <span>النتيجة الحالية: {score}</span>
                <span>سؤال {currentIdx + 1} من {data.questions.length}</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / data.questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <h3 className="text-sm font-bold text-foreground leading-relaxed pt-2">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  
                  return (
                    <button
                      key={oIdx}
                      disabled={showAnswer}
                      onClick={() => handleOptionClick(oIdx)}
                      className={cn(
                        "w-full p-3.5 rounded-xl border text-xs text-right transition-all flex items-center justify-between gap-3 font-medium",
                        showAnswer
                          ? oIdx === currentQuestion.correctAnswer
                            ? "bg-emerald-100/30 border-emerald-500/50 text-emerald-700"
                            : isSelected
                              ? "bg-red-100/30 border-red-500/50 text-red-700"
                              : "bg-secondary/10 border-border/50 text-muted-foreground opacity-60"
                          : isSelected
                            ? "border-accent bg-accent/10 text-foreground font-semibold"
                            : "border-border bg-secondary/15 text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {showAnswer && oIdx === currentQuestion.correctAnswer && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        {showAnswer && isSelected && oIdx !== currentQuestion.correctAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                      </div>
                      <span className="flex-1 text-right leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Correct/Incorrect Explanation Panel */}
              {showAnswer && (
                <div className="bg-secondary/30 rounded-xl border border-border/40 p-4 space-y-2 animate-fade-in text-xs text-muted-foreground leading-relaxed">
                  <div className="font-semibold text-foreground flex items-center gap-1.5 justify-end">
                    <span>الشرح العلمي:</span>
                    <Award className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            /* Finished screen */
            <div className="space-y-6 text-center py-6">
              {isPassed ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mx-auto shadow-sm">
                    <Trophy className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">مبارك نجاحك في الاختبار!</h3>
                    <p className="text-xs text-muted-foreground">لقد حصلت على {score} من أصل 5 إجابات صحيحة ({score * 20}%).</p>
                  </div>

                  {/* Certificate form */}
                  <div className="card-premium p-5 space-y-3.5 text-right bg-secondary/10 border border-border/60">
                    <label className="text-[11px] font-semibold text-muted-foreground block">
                      اكتب اسمك الكامل بالأسفل لإصدار شهادتك الرقمية فوراً:
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="الاسم الثلاثي أو الكامل"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent text-right"
                    />
                    <button
                      onClick={drawAndDownloadCertificate}
                      className="w-full bg-accent text-accent-foreground text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      تنزيل شهادة الإنجاز (PNG)
                    </button>
                    
                    {/* Hidden canvas for drawing */}
                    <canvas
                      ref={canvasRef}
                      width={1200}
                      height={840}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto">
                    <XCircle className="w-9 h-9 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">لم تتجاوز الاختبار هذه المرة</h3>
                    <p className="text-xs text-muted-foreground">لقد حصلت على {score} من أصل 5. يتطلب النجاح الحصول على 4 إجابات صحيحة (80%).</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    لا تقلق! يمكنك دائماً مراجعة دروس المسار وإعادة المحاولة في أي وقت تريد.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentIdx(0);
                      setScore(0);
                      setSelectedOpt(null);
                      setShowAnswer(false);
                      setQuizFinished(false);
                    }}
                    className="bg-primary text-primary-foreground text-xs font-semibold px-6 py-2.5 rounded-xl hover:opacity-95 transition-opacity inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    إعادة المحاولة
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions for ongoing quiz */}
        {!quizFinished && (
          <div className="bg-secondary/20 px-6 py-3.5 border-t border-border/50 flex justify-start">
            {!showAnswer ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleNext}
                className="bg-primary text-primary-foreground text-xs font-bold py-2.5 px-6 rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-accent text-accent-foreground text-xs font-bold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                {currentIdx === data.questions.length - 1 ? "عرض النتيجة" : "السؤال التالي"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
