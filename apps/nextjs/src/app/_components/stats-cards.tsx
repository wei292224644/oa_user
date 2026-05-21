"use client";

import { Card, CardContent } from "@acme/ui/card";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

interface StatItemProps {
  label: string;
  value: number;
  delta: string;
  deltaPositive: boolean;
}

function StatItem({ label, value, delta, deltaPositive }: StatItemProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-3xl font-bold">{value}</span>
        <span className={deltaPositive ? "text-sm text-emerald-500" : "text-sm text-red-500"}>
          {delta}
        </span>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.case.stats.queryOptions());

  const total = data?.total ?? 0;

  // Derive pending from statusCounts if available
  const pendingCount =
    data?.statusCounts?.find((s) => s.status === "PENDING")?.count ?? 0;
  const settledCount =
    data?.statusCounts?.find((s) => s.status === "SETTLED")?.count ?? 0;

  // Mock delta values (static for now)
  const stats = [
    { label: "案件总数", value: total, delta: "+12% 较上月", deltaPositive: true },
    { label: "本月新增", value: Math.max(0, Math.floor(total * 0.15)), delta: "+5% 较上月", deltaPositive: true },
    { label: "待审批", value: pendingCount, delta: "-2% 较上月", deltaPositive: false },
    { label: "已结案", value: settledCount, delta: "+8% 较上月", deltaPositive: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}
