"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

interface CaseTableProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CASE_TYPE_STYLES: Record<string, string> = {
  刑事诉讼: "bg-red-500/10 text-red-500",
  民事诉讼: "bg-blue-500/10 text-blue-500",
  法律顾问: "bg-emerald-500/10 text-emerald-500",
};

const STATUS_STYLES: Record<string, string> = {
  申请中: "bg-blue-500/10 text-blue-500",
  已审批: "bg-emerald-500/10 text-emerald-500",
};

function CaseTypeBadge({ type }: { type: string | null }) {
  if (!type) return null;
  const style = CASE_TYPE_STYLES[type] ?? "bg-muted text-muted-foreground";
  return (
    <Badge variant="default" className={style}>
      {type}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";
  return (
    <Badge variant="default" className={style}>
      {status}
    </Badge>
  );
}

export function CaseTable({ selectedId, onSelect }: CaseTableProps) {
  const trpc = useTRPC();
  const [offset, setOffset] = useState(0);
  const limit = 25;

  const { data, isLoading } = useQuery(
    trpc.case.list.queryOptions({ limit, offset }),
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const handlePrev = () => setOffset((o) => Math.max(0, o - limit));
  const handleNext = () =>
    setOffset((o) => (o + limit < total ? o + limit : o));

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>案件编号</TableHead>
              <TableHead>案件名称</TableHead>
              <TableHead>案件类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>委托人</TableHead>
              <TableHead>承办人</TableHead>
              <TableHead>收案日期</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                data-state={selectedId === item.id ? "selected" : undefined}
                className={selectedId === item.id ? "bg-muted" : undefined}
                onClick={() => onSelect(item.id)}
              >
                <TableCell>
                  <span className="font-mono text-primary">{item.id}</span>
                </TableCell>
                <TableCell className="font-medium">{item.caseName}</TableCell>
                <TableCell>
                  <CaseTypeBadge type={item.caseTypeStr} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.caseStatus} />
                </TableCell>
                <TableCell>{item.clientName}</TableCell>
                <TableCell>{item.takerName}</TableCell>
                <TableCell>
                  {item.caseDate
                    ? new Date(item.caseDate).toLocaleDateString("zh-CN")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          共 {total} 条记录
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={offset === 0}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            第 {Math.floor(offset / limit) + 1} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={offset + limit >= total}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}
