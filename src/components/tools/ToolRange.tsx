"use client";

import { useId } from "react";

/** Keep the range mounted while its value changes so keyboard focus stays put. */
export default function ToolRange({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = String,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <output
          htmlFor={id}
          dir="ltr"
          className="text-sm font-bold tabular-nums text-foreground"
        >
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        className="block h-11 w-full cursor-pointer accent-accent"
      />
    </div>
  );
}
