"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

const COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

export function TypeBarChart() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.case.stats.queryOptions());

  const typeCounts = data?.typeCounts ?? [];
  const maxCount = Math.max(1, ...typeCounts.map((t) => t.count));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>案件类型分布</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {typeCounts.length === 0 && (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        )}
        {typeCounts.map((item, index) => {
          const pct = (item.count / maxCount) * 100;
          const color = COLORS[index % COLORS.length];
          return (
            <div key={item.type} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.type}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
