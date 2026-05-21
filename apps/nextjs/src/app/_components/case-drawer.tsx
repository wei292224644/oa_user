"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@acme/ui/sheet";
import { Badge } from "@acme/ui/badge";
import { Separator } from "@acme/ui/separator";
import { ScrollArea } from "@acme/ui/scroll-area";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

interface CaseDrawerProps {
  caseId: string | null;
  onClose: () => void;
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

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";
  return (
    <Badge variant="default" className={style}>
      {status}
    </Badge>
  );
}

export function CaseDrawer({ caseId, onClose }: CaseDrawerProps) {
  const trpc = useTRPC();
  const { data: caseData } = useQuery(
    trpc.case.byId.queryOptions(
      { id: caseId! },
      { enabled: !!caseId },
    ),
  );

  const open = !!caseId;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="sm:max-w-lg">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 pr-4">
            {caseData ? (
              <>
                {/* Header */}
                <SheetHeader>
                  <div className="flex items-center gap-2">
                    <SheetTitle>{caseData.caseName}</SheetTitle>
                    <StatusBadge status={caseData.caseStatus} />
                  </div>
                  <div className="font-mono text-sm text-primary">
                    {caseData.id}
                  </div>
                </SheetHeader>

                {/* Info Grid */}
                <SheetDescription asChild>
                  <div className="grid grid-cols-2 gap-4 text-foreground">
                    <InfoItem label="委托人" value={caseData.clientName} />
                    <InfoItem label="相对方" value={caseData.oppositeName} />
                    <InfoItem label="第三方" value={caseData.thirdName} />
                    <InfoItem label="承办人" value={caseData.takerName} />
                    <InfoItem label="案件类型" value={caseData.caseTypeStr} />
                    <InfoItem label="诉讼类型" value={caseData.lawsuitType} />
                    <InfoItem
                      label="收案日期"
                      value={
                        caseData.caseDate
                          ? new Date(caseData.caseDate).toLocaleDateString("zh-CN")
                          : null
                      }
                    />
                    <InfoItem
                      label="保证金"
                      value={
                        caseData.marginAmount
                          ? `¥${caseData.marginAmount}`
                          : null
                      }
                    />
                  </div>
                </SheetDescription>

                <Separator />

                {/* Archive Files */}
                <section>
                  <h3 className="mb-3 text-sm font-semibold">档案文件</h3>
                  {Array.isArray(caseData.archive) && caseData.archive.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {caseData.archive.map((file: unknown, idx: number) => {
                        const fileName =
                          typeof file === "string"
                            ? file
                            : typeof file === "object" && file !== null
                              ? (file as { name?: string }).name ?? String(file)
                              : String(file);
                        return (
                          <li key={idx}>
                            <a
                              href="#"
                              className="text-sm text-primary underline-offset-4 hover:underline"
                              onClick={(e) => e.preventDefault()}
                            >
                              {fileName}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无档案文件</p>
                  )}
                </section>

                <Separator />

                {/* Approval Timeline */}
                <section>
                  <h3 className="mb-3 text-sm font-semibold">审批记录</h3>
                  {caseData.approvals && caseData.approvals.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {caseData.approvals.map((approval, idx) => (
                        <div key={approval.id} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {approval.approverName ?? "系统"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {approval.createdAt
                                ? new Date(approval.createdAt).toLocaleDateString("zh-CN")
                                : "-"}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {approval.type === 1
                              ? "审批通过"
                              : approval.type === 2
                                ? "审批驳回"
                                : "审批操作"}
                            {approval.remark ? ` · ${approval.remark}` : ""}
                          </span>
                          {idx < caseData.approvals.length - 1 && (
                            <Separator className="mt-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无审批记录</p>
                  )}
                </section>
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                加载中...
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function InfoItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "-"}</span>
    </div>
  );
}
