"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

// Mock monthly data
const MONTHLY_DATA = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];
const LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function Sparkline({ data }: { data: number[] }) {
  const width = 320;
  const height = 120;
  const padding = 8;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      {/* Area fill */}
      <path
        d={`${pathD} L ${width - padding},${height} L ${padding},${height} Z`}
        className="fill-primary/10"
      />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        className="stroke-primary"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots */}
      {data.map((value, index) => {
        const x = padding + (index / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={3}
            className="fill-primary"
          />
        );
      })}
    </svg>
  );
}

export function TrendChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>月度案件趋势</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Sparkline data={MONTHLY_DATA} />
        <div className="flex justify-between text-xs text-muted-foreground">
          {LABELS.filter((_, i) => i % 2 === 0).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
