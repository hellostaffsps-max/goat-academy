"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  X,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { loadCertificateFonts } from "@/lib/certificate-fonts";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useStore } from "@/store/useStore";

import { pathQuizzes } from "@/data/pathQuizzes";

interface PathQuizProps {
  pathId: string;
  onClose: () => void;
}

export function PathQuiz({ pathId, onClose }: PathQuizProps) {
  const aliases: Record<string, string> = {
    "homebrew-path": "amateur",
    "barista-path": "barista",
    "owner-path": "owner",
  };
  const resolvedPathId = aliases[pathId] || pathId;
  const data = pathQuizzes[resolvedPathId];
  const markQuizPassed = useStore((state) => state.markQuizPassed);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(
    typeof document === "undefined"
      ? null
      : (document.activeElement as HTMLElement),
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const certificateUrlRef = useRef<string | null>(null);
  const [certificateBusy, setCertificateBusy] = useState(false);
  const [certificateError, setCertificateError] = useState("");
  const [certificateFile, setCertificateFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  useEffect(
    () => () => {
      if (certificateUrlRef.current)
        URL.revokeObjectURL(certificateUrlRef.current);
    },
    [],
  );

  const [userName, setUserName] = useState<string>("");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const totalQuestions = data?.questions.length || 0;
  const requiredScore = Math.ceil(totalQuestions * 0.8);
  const isPassed = totalQuestions > 0 && score >= requiredScore;

  useEffect(() => {
    if (quizFinished && isPassed) markQuizPassed(resolvedPathId);
  }, [quizFinished, isPassed, resolvedPathId, markQuizPassed]);

  useEffect(() => {
    questionRef.current?.focus();
  }, [currentIdx, quizFinished]);

  if (!data) return null;

  const currentQuestion = data.questions[currentIdx];

  const handleOptionClick = (optIdx: number) => {
    if (showAnswer) return;
    setSelectedOpt(optIdx);
  };

  const handleNext = () => {
    if (selectedOpt === null || showAnswer) return;
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

  // Download certificate using client-side HTML5 Canvas drawing (no external libs)
  const drawAndDownloadCertificate = async () => {
    if (certificateBusy || !userName.trim()) return;
    setCertificateBusy(true);
    setCertificateError("");
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Certificate canvas is unavailable");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas drawing is unavailable");
      const styles = getComputedStyle(document.documentElement);
      const { arabic: arabicFont, latin: latinFont } =
        await loadCertificateFonts(
          document.fonts,
          styles.getPropertyValue("--font-arabic").trim(),
          styles.getPropertyValue("--font-latin").trim(),
        );

      const nameToUse = userName.trim() || "طالب الأكاديمية";

      const drawContent = (logoImg?: HTMLImageElement) => {
        // 1. Warm off-white background
        const grad = ctx.createRadialGradient(600, 420, 100, 600, 420, 700);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#F5F2E9");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 840);

        // 2. Yellow and charcoal frame
        // Outer yellow border
        ctx.strokeStyle = "#F5DB30"; // Brand yellow
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 40, 1120, 760);

        // Inner dark border
        ctx.strokeStyle = "#2F2F2F"; // Brand charcoal
        ctx.lineWidth = 1;
        ctx.strokeRect(52, 52, 1096, 736);

        // Corner flourishes
        ctx.strokeStyle = "#F5DB30";
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

        // Small yellow corner markers
        const drawDiamond = (cx: number, cy: number, size: number) => {
          ctx.fillStyle = "#F5DB30";
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
          // Preserve the original horizontal logo proportions.
          ctx.drawImage(logoImg, 510, 75, 180, 62);
        }

        // 4. Content alignment (RTL rendering)
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Header Title
        ctx.font = `bold 24px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillStyle = "#2F2F2F";
        ctx.fillText("أكاديمية GoatJourney للقهوة المختصة", 600, 165);

        // Subtitle
        ctx.font = `500 16px ${latinFont}, sans-serif`;
        ctx.fillStyle = "#2F2F2F";
        ctx.fillText("GoatJourney Coffee Academy — Palestine", 600, 195);

        // Separator line
        ctx.strokeStyle = "#F5DB30";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(480, 220);
        ctx.lineTo(720, 220);
        ctx.stroke();

        // Certificate Type
        ctx.font = `bold 32px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillStyle = "#2F2F2F";
        ctx.fillText("شـهادة إكـمـال مـسـار تـعـلـيـمـي", 600, 270);

        // Text: Certifies that
        ctx.font = `18px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillStyle = "#555555";
        ctx.fillText(
          "تمنح الأكاديمية هذه الشهادة فخراً واعتزازاً للطالب:",
          600,
          335,
        );

        // User Name (Styled elegant)
        ctx.font = `bold 44px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillStyle = "#2F2F2F";
        let nameFontSize = 44;
        while (ctx.measureText(nameToUse).width > 950 && nameFontSize > 24) {
          nameFontSize -= 2;
          ctx.font = `bold ${nameFontSize}px ${arabicFont}, ${latinFont}, sans-serif`;
        }
        ctx.fillText(nameToUse, 600, 410, 950);

        // Underline for name
        ctx.strokeStyle = "#F5DB30";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(350, 450);
        ctx.lineTo(850, 450);
        ctx.stroke();

        // Text: Description
        ctx.font = `18px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillStyle = "#555555";
        ctx.fillText(
          "بعد اجتيازه بنجاح الاختبار المعرفي للمسار التعليمي:",
          600,
          500,
        );

        // Learning Path Title Badge
        // Draw rounded rect for path title
        const rx = 380;
        const ry = 535;
        const rw = 440;
        const rh = 46;
        const radius = 8;
        ctx.fillStyle = "#2F2F2F";
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

        ctx.font = `bold 22px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillStyle = "#F5F2E9";
        ctx.fillText(`مسار: ${data.pathTitle}`, 600, 558);

        // Date & Signature block
        const today = new Date().toLocaleDateString("ar-EG-u-nu-latn", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Left: Date
        ctx.fillStyle = "#555555";
        ctx.font = `15px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillText(`تاريخ الإصدار: ${today}`, 280, 715);

        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(180, 685);
        ctx.lineTo(380, 685);
        ctx.stroke();

        // Printed founder name; do not generate or imply an authenticated signature.
        ctx.fillStyle = "#2F2F2F";
        ctx.font = `600 22px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillText("وائل أرزيقات", 925, 660);

        // Right: Label
        ctx.fillStyle = "#555555";
        ctx.font = `15px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillText("مؤسس Goat Journey", 925, 715);

        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(825, 685);
        ctx.lineTo(1025, 685);
        ctx.stroke();

        // Center brand badge
        ctx.strokeStyle = "#F5DB30";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(600, 705, 42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#F5DB30";
        ctx.beginPath();
        ctx.arc(600, 705, 36, 0, Math.PI * 2);
        ctx.fill();

        // Star inside badge
        ctx.fillStyle = "#2F2F2F";
        ctx.font = `24px ${arabicFont}, ${latinFont}, sans-serif`;
        ctx.fillText("★", 600, 705);
      };

      // Install handlers before assigning src, including for cached images.
      const logoImg = await new Promise<HTMLImageElement | undefined>(
        (resolve) => {
          const image = new Image();
          let settled = false;
          const finish = (loaded: boolean) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            image.onload = null;
            image.onerror = null;
            resolve(loaded ? image : undefined);
          };
          const timer = setTimeout(() => finish(false), 4000);
          image.onload = () => finish(true);
          image.onerror = () => finish(false);
          image.src = "/brand-logo.svg";
        },
      );
      drawContent(logoImg);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) =>
            value
              ? resolve(value)
              : reject(new Error("Certificate export failed")),
          "image/png",
        );
      });
      const url = URL.createObjectURL(blob);
      if (certificateUrlRef.current)
        URL.revokeObjectURL(certificateUrlRef.current);
      certificateUrlRef.current = url;
      const fileName = `GoatJourney_Certificate_${nameToUse.replace(/[^\p{L}\p{N}_-]+/gu, "_")}.png`;
      setCertificateFile({ url, name: fileName });
      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setCertificateError(
        "تعذر إنشاء الشهادة الآن. أعد المحاولة، أو جرّب متصفحاً آخر إذا استمرت المشكلة.",
      );
    } finally {
      setCertificateBusy(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        dir="rtl"
        className="w-[calc(100%-2rem)] max-w-xl sm:max-w-xl bg-card border-border/80 rounded-2xl shadow-xl overflow-hidden text-right flex flex-col gap-0 p-0 max-h-[calc(100dvh-2rem)]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          questionRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <DialogDescription className="sr-only">
          اختبار معرفي من {totalQuestions} أسئلة. اختر إجابة واحدة لكل سؤال.
          النجاح من 80 بالمئة. يمكن إغلاق الاختبار بمفتاح Escape.
        </DialogDescription>
        {/* Header */}
        <div className="bg-secondary/40 px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <DialogClose
            aria-label="إغلاق الاختبار"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            <X aria-hidden="true" className="size-5" />
          </DialogClose>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base leading-7 font-bold text-foreground">
              اختبار مسار: {data.pathTitle}
            </DialogTitle>
            <Trophy className="w-4.5 h-4.5 text-accent" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {!quizFinished ? (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm text-muted-foreground">
                <span>النتيجة الحالية: {score}</span>
                <span>
                  سؤال {currentIdx + 1} من {data.questions.length}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="تقدم الاختبار"
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
                aria-valuenow={currentIdx + 1}
                className="h-1.5 bg-secondary rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / data.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question */}
              <h3
                ref={questionRef}
                tabIndex={-1}
                className="text-lg font-bold text-foreground leading-8 pt-2"
              >
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={showAnswer}
                      aria-pressed={isSelected}
                      onClick={() => handleOptionClick(oIdx)}
                      className={cn(
                        "w-full min-h-12 p-3.5 rounded-xl border text-sm text-right transition-all flex items-center justify-between gap-3 font-medium",
                        showAnswer
                          ? oIdx === currentQuestion.correctAnswer
                            ? "bg-emerald-100/30 border-emerald-500/50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                            : isSelected
                              ? "bg-red-100/30 border-red-500/50 text-red-800 dark:bg-red-950/40 dark:text-red-200"
                              : "bg-secondary/10 border-border/50 text-muted-foreground opacity-60"
                          : isSelected
                            ? "border-accent bg-accent/10 text-foreground font-semibold"
                            : "border-border bg-secondary/15 text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
                      )}
                    >
                      <div className="flex-shrink-0">
                        {showAnswer &&
                          oIdx === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        {showAnswer &&
                          isSelected &&
                          oIdx !== currentQuestion.correctAnswer && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                      </div>
                      <span className="flex-1 text-right leading-relaxed">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Correct/Incorrect Explanation Panel */}
              {showAnswer && (
                <div
                  role="status"
                  aria-live="polite"
                  className="bg-secondary/30 rounded-xl border border-border/40 p-4 space-y-2 animate-fade-in text-sm text-muted-foreground leading-7"
                >
                  <div className="font-semibold text-foreground flex items-center gap-1.5 justify-end">
                    <span>
                      {selectedOpt === currentQuestion.correctAnswer
                        ? "إجابة صحيحة"
                        : "راجع الإجابة الصحيحة"}
                    </span>
                    <Award className="w-3.5 h-3.5 text-accent" />
                  </div>
                  {selectedOpt !== currentQuestion.correctAnswer && (
                    <p className="font-medium text-foreground">
                      الإجابة الصحيحة:{" "}
                      {currentQuestion.options[currentQuestion.correctAnswer]}
                    </p>
                  )}
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
                    <h3
                      ref={questionRef}
                      tabIndex={-1}
                      className="text-xl font-bold text-foreground"
                    >
                      مبارك نجاحك في الاختبار!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      لقد حصلت على {score} من أصل {totalQuestions} إجابات صحيحة
                      ({Math.round((score / totalQuestions) * 100)}
                      %).
                    </p>
                  </div>

                  {/* Certificate form */}
                  <div className="card-premium p-5 space-y-3.5 text-right bg-secondary/10 border border-border/60">
                    <label
                      htmlFor="certificate-name"
                      className="text-sm font-semibold text-foreground block"
                    >
                      اكتب اسمك الكامل بالأسفل لإصدار شهادتك الرقمية فوراً:
                    </label>
                    <input
                      id="certificate-name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      value={userName}
                      disabled={certificateBusy}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        setCertificateError("");
                        setCertificateFile(null);
                        if (certificateUrlRef.current) {
                          URL.revokeObjectURL(certificateUrlRef.current);
                          certificateUrlRef.current = null;
                        }
                      }}
                      placeholder="الاسم الثلاثي أو الكامل"
                      className="w-full min-h-12 bg-background border border-border rounded-lg px-3 py-2 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring text-right"
                    />
                    <button
                      type="button"
                      disabled={!userName.trim() || certificateBusy}
                      aria-busy={certificateBusy}
                      onClick={drawAndDownloadCertificate}
                      className="w-full min-h-12 bg-accent text-accent-foreground text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      {certificateBusy
                        ? "جارٍ تجهيز الشهادة…"
                        : "تنزيل شهادة الإنجاز (PNG)"}
                    </button>

                    {certificateError && (
                      <p
                        role="alert"
                        className="text-sm leading-7 text-destructive"
                      >
                        {certificateError}
                      </p>
                    )}
                    {certificateFile && (
                      <div
                        role="status"
                        className="text-sm leading-7 space-y-1"
                      >
                        <p>شهادتك جاهزة. إذا لم يبدأ التنزيل تلقائياً:</p>
                        <a
                          href={certificateFile.url}
                          download={certificateFile.name}
                          className="inline-flex min-h-11 items-center font-semibold text-foreground underline underline-offset-4"
                        >
                          اضغط هنا لتنزيل الشهادة
                        </a>
                      </div>
                    )}

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
                    <h3
                      ref={questionRef}
                      tabIndex={-1}
                      className="text-xl font-bold text-foreground"
                    >
                      لم تتجاوز الاختبار هذه المرة
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      لقد حصلت على {score} من أصل {totalQuestions}. يتطلب النجاح
                      الحصول على {requiredScore}
                      إجابات صحيحة (80%).
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    لا تقلق! يمكنك دائماً مراجعة دروس المسار وإعادة المحاولة في
                    أي وقت تريد.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentIdx(0);
                      setScore(0);
                      setSelectedOpt(null);
                      setShowAnswer(false);
                      setQuizFinished(false);
                    }}
                    className="bg-primary text-primary-foreground text-sm font-semibold min-h-11 px-6 py-2.5 rounded-xl hover:opacity-95 transition-opacity inline-flex items-center gap-1.5"
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
                className="bg-primary text-primary-foreground text-sm font-bold min-h-11 py-2.5 px-6 rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-accent text-accent-foreground text-sm font-bold min-h-11 py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                {currentIdx === data.questions.length - 1
                  ? "عرض النتيجة"
                  : "السؤال التالي"}
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
