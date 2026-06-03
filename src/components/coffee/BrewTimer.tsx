"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

/* Extend window for older Safari AudioContext */
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
import { Play, Pause, RotateCcw, Coffee, Bell, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrewTimerProps {
  defaultCoffeeWeight?: number;
  methodName?: string;
  ratio?: number;
}

export function BrewTimer({ defaultCoffeeWeight = 15, methodName = "V60", ratio = 15 }: BrewTimerProps) {
  const [coffeeWeight, setCoffeeWeight] = useState<number>(defaultCoffeeWeight);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStepRef = useRef<number>(0);

  // Audio Beep generator using Web Audio API
  const triggerAudioBeep = (freq = 800, duration = 0.2) => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext block:", e);
    }
  };

  const steps = useMemo(() => {
    const totalWater = Math.round(coffeeWeight * ratio);
    const bloomWater = Math.round(coffeeWeight * 3);
    const remainingWater = totalWater - bloomWater;
    const firstPour = Math.round(remainingWater * 0.6);
    const secondPour = totalWater - bloomWater - firstPour;

    return [
      {
        id: 0,
        title: "مرحلة الترطيب (Bloom)",
        instruction: `صب ${bloomWater} جرام من الماء الساخن برفق لترطيب البن بالكامل.`,
        duration: 30,
        targetWater: bloomWater,
      },
      {
        id: 1,
        title: "الصبة الأولى (دائرية)",
        instruction: `صب ${firstPour} جرام إضافية بحركات دائرية بطيئة (الوزن الكلي: ${bloomWater + firstPour}g).`,
        duration: 40,
        targetWater: bloomWater + firstPour,
      },
      {
        id: 2,
        title: "الصبة الثانية (النهائية)",
        instruction: `صب المتبقي وهو ${secondPour} جرام برفق في المنتصف (الوزن الكلي: ${totalWater}g).`,
        duration: 40,
        targetWater: totalWater,
      },
      {
        id: 3,
        title: "اكتمال الاستخلاص والترشيح",
        instruction: "انتظر حتى يترشح كامل الماء في الإبريق. قهوتك جاهزة الآن!",
        duration: 50,
        targetWater: totalWater,
      }
    ];
  }, [coffeeWeight, ratio]);

  // Total timer duration
  const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);

  // Compute active step from elapsed time (derived state)
  const activeStep = useMemo(() => {
    let accSeconds = 0;
    for (let i = 0; i < steps.length; i++) {
      accSeconds += steps[i].duration;
      if (elapsed < accSeconds) {
        return i;
      }
    }
    return steps.length - 1;
  }, [elapsed, steps]);

  // Trigger audio beep on step transition
  useEffect(() => {
    if (activeStep !== prevStepRef.current && isRunning) {
      triggerAudioBeep(900, 0.15);
      setTimeout(() => triggerAudioBeep(1100, 0.25), 180);
    }
    prevStepRef.current = activeStep;
  }, [activeStep, isRunning]);

  // Timer interval control
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= totalDuration - 1) {
            // Completed!
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Long success chime
            triggerAudioBeep(1000, 0.4);
            setTimeout(() => triggerAudioBeep(1250, 0.6), 250);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalDuration]);

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    prevStepRef.current = 0;
    triggerAudioBeep(600, 0.15);
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
    triggerAudioBeep(isRunning ? 700 : 900, 0.15);
  };

  // Helper formatting mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Current step details
  const currentStep = steps[activeStep] || steps[steps.length - 1];
  
  // Calculate progress percent for visual rendering
  let currentStepElapsed = elapsed;
  const activeStepDuration = currentStep.duration;
  let accumulatedBefore = 0;
  for (let i = 0; i < activeStep; i++) {
    accumulatedBefore += steps[i].duration;
  }
  currentStepElapsed = elapsed - accumulatedBefore;
  const progressPercent = Math.min((currentStepElapsed / activeStepDuration) * 100, 100);

  return (
    <div className="card-premium p-6 text-right border border-border/80 bg-card/60 backdrop-blur-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>تنبيهات صوتية مفعّلة</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">مساعد التحضير التفاعلي ({methodName})</span>
          <Coffee className="w-4 h-4 text-accent" />
        </div>
      </div>

      {/* Controller Area */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
        {/* Clock & Action Buttons */}
        <div className="sm:col-span-2 flex flex-col items-center justify-center space-y-4 py-2 border-l border-border/40 pl-2">
          {/* Big Circular Clock Representation */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle backdrop */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-secondary fill-none"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-accent fill-none transition-all duration-1000 ease-linear"
                strokeWidth="4.5"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * elapsed) / totalDuration}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-mono text-foreground tracking-wider select-none">{formatTime(elapsed)}</span>
              <span className="text-[9px] text-muted-foreground font-mono mt-0.5">من {formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="w-9 h-9 rounded-xl border border-border bg-secondary/15 hover:bg-secondary/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              title="إعادة تعيين"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggle}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95",
                isRunning ? "bg-amber-600 text-white" : "bg-primary text-primary-foreground"
              )}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          </div>
        </div>

        {/* Current Stage Instruction Box */}
        <div className="sm:col-span-3 space-y-4">
          {/* Coffee Weight Config */}
          <div className="flex items-center justify-end gap-2 bg-secondary/25 border border-border/40 p-2.5 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-mono">1 : {ratio} (نسبة الماء)</span>
            <div className="w-px h-3 bg-border/60" />
            <input
              type="number"
              min="8"
              max="60"
              value={coffeeWeight}
              disabled={isRunning || elapsed > 0}
              onChange={(e) => setCoffeeWeight(parseFloat(e.target.value) || 15)}
              className="w-10 bg-transparent text-center border-b border-border/60 text-xs font-bold font-mono focus:outline-none focus:border-accent text-foreground disabled:opacity-75"
            />
            <label className="text-[10px] font-semibold text-muted-foreground">تعديل وزن البن (جرام):</label>
          </div>

          {/* Current Step Title & Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-bold text-accent">{currentStep.title}</span>
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold font-mono">
                <Sparkles className="w-2.5 h-2.5" />
                <span>الخطوة {activeStep + 1} / {steps.length}</span>
              </div>
            </div>

            <div className="bg-secondary/15 rounded-xl border border-border/50 p-4 space-y-3 min-h-[90px] flex flex-col justify-center">
              <p className="text-xs text-foreground font-medium leading-relaxed">
                {currentStep.instruction}
              </p>
              
              {/* Step Mini progress bar */}
              <div className="space-y-1">
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                  <span>{formatTime(activeStepDuration - Math.round(currentStepElapsed))} متبقي</span>
                  <span>الوزن المستهدف: {currentStep.targetWater} جرام</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
